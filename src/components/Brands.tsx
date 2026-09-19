import { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setStarredCompany } from '../store/slices/appSlice';
import { Link } from 'react-router-dom';

import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';

import { exist } from '../helper';
import { serverURL, s } from '../srcSet';

import type { RootState, AppDispatch } from '../store/store';

type Company = {
    _id: string;
    username: string;
    bizName?: string;
    fc: number;
    businessType: number;
    genderValue: number;
    profileIndex?: string;
    aboutIndex?: string;
    countryCode?: string;
    country?: string;
    jobSummary?: string;
    [key: string]: unknown;
};

type BrandsState = {
    w: number;
    n: number;
    lx: number;
    loadingData: boolean;
    loading: boolean;
    allCompany: React.ReactNode[];
};

type BrandsProps = {
    starredCompany: Company[];
    dispatch: AppDispatch;
};

class Brands extends Component<BrandsProps, BrandsState> {

    state: BrandsState = {
        w: window.innerWidth,
        n: 1,
        lx: 30,
        loadingData: false,
        loading: false,
        allCompany: [],
    };

    componentDidMount = async () => {
        if (Array.isArray(this.props.starredCompany)) {
            await this.mapCompany(this.props.starredCompany);
        }

        await this.getStarredCompany();

        if (this.props.starredCompany.length > 0) {
            this.mapCompany(this.props.starredCompany);
        }

        const arr = [...this.props.starredCompany].reverse();

        console.log(arr);
    };

    getStarredCompany = async () => {
        this.setState({
            loadingData: true,
        });

        await axios.post<Company[]>(
            `${serverURL}/user/starredCompany`
        ).then(async res => {
            const brands = res.data;

            for (let i = 0; i < brands.length; i++) {
                delete brands[i].password;
            }

            await this.props.dispatch(
                setStarredCompany(res.data)
            );

            await this.mapCompany(res.data);

            this.setState({
                loading: false,
            });
        });
    };

    mapCompany = async (company: Company[]) => {
        const { w } = this.state;

        const allCompany = company.map(
            (item, i) => {
                const usernameX = item.bizName
                    ? item.bizName
                    : item.username;

                const profileImg = (
                    <div
                        className={`C${item.fc} w-[45px] h-[45px] p-[3px] ${
                            item.businessType > 0
                                ? 'rounded-[5px]'
                                : 'rounded-full'
                        } overflow-hidden`}
                    >
                        <img
                            className="zoomImg object-cover w-full h-full rounded-[3px]"
                            src={
                                exist(item.profileIndex)
                                    ? `https://www.pix.shiningpage.com/whoraly/profile/big/${item._id}-${item.profileIndex}.jpeg`
                                    : item.genderValue === 0
                                        ? female
                                        : male
                            }
                            alt={usernameX}
                        />
                    </div>
                );

                const aboutImg = (
                    <div className="w-[17vw] h-[calc(6vh+7vw)] min-w-[220px] min-h-[140px] rounded-[10px_10px_0px_0px] overflow-hidden">
                        <img
                            className="zoomImg object-cover w-full h-full"
                            src={
                                exist(item.aboutIndex)
                                    ? `https://www.pix.shiningpage.com/whoraly/about/big/${item._id}-${item.aboutIndex}.jpeg`
                                    : exist(item.profileIndex)
                                        ? `https://www.pix.shiningpage.com/whoraly/profile/big/${item._id}-${item.profileIndex}.jpeg`
                                        : item.genderValue === 0
                                            ? female
                                            : male
                            }
                            alt={`${usernameX} about`}
                        />
                    </div>
                );

                const country = (
                    <div className="flex items-center justify-start mb-1 whitespace-nowrap gap-2.5">
                        <div
                            className={`flag-icon flag-icon-${
                                item.countryCode
                                    ? item.countryCode.toLowerCase()
                                    : ''
                            } border border-[#99999950] text-[17px]`}
                        ></div>

                        <div className="text-[12px]">
                            {item.country
                                ? item.country.toUpperCase()
                                : ''}
                        </div>
                    </div>
                );

                const username = (
                    <div className="text-sm font-normal m-0 whitespace-nowrap overflow-scroll">
                        {usernameX}
                    </div>
                );

                const jobSummary = (
                    <div className="d-flex w-full h-20 p-0 text-[14px] overflow-hidden">
                        {item.jobSummary as string}
                    </div>
                );

                const root =
                    item.businessType > 0
                        ? 'publisher'
                        : 'user';

                return (
                    <div
                        key={i}
                        className="flex px-2.5"
                    >
                        <Link
                            to={`/${root}/${item.username}`}
                            className="zoom !no-underline !text-[#ffffff] font-thin relative cursor-pointer 
                            bg-[#ffffff10] border !border-white/20 
                            hover:!border-white hover:bg-[#ffffff20] hover:shadow-[0_10px_30px_#ffffff35] 
                            transition-all duration-300 rounded-[10px]"
                        >
                            {aboutImg}

                            <div className="p-2.5">
                                {jobSummary}

                                <div className="flex gap-2.5">
                                    {profileImg}

                                    <div>
                                        {country}
                                        {username}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            }
        );

        this.setState({
            allCompany,
            loadingData: false,
        });
    };

    render() {
        const {
            w,
            allCompany,
            loadingData,
        } = this.state;

        const { starredCompany } = this.props;

        const loaderZ = (
            <div className="loader-13 m-0 text-[#d1a44a]"></div>
        );

        const ColorLoadingCenter = (
            <div className="center w-full">
                {loaderZ}
            </div>
        );

        const allCompanyList = (
            <div
                className={`flex w-full h-full ${
                    w < s
                        ? 'pl-[10px]'
                        : 'pl-[15px]'
                } items-start`}
            >
                {loadingData && starredCompany.length === 0
                    ? ColorLoadingCenter
                    : allCompany}
            </div>
        );

        const header = (
            <div className="goldenText animated fadeInLeft [animation-delay:.5s] text-[25px] font-[600] pt-[25px] pl-[25px]">
                Top Shining Pages
            </div>
        );

        return (
            <div className="flex animated [animation-delay:1s] fadeIn w-full flex-col">
                {header}

                <div className="overflow-scroll py-[30px]">
                    {allCompanyList}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (
    state: RootState
): Pick<BrandsProps, 'starredCompany'> => {
    return {
        starredCompany: state.app.starredCompany as Company[],
    };
};

export default connect(mapStateToProps)(Brands);