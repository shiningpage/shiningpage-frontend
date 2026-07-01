import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {setStarredCompany } from '../dataStore/actions'; 
import { Link } from "react-router-dom";
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';
import { exist } from '../helper';

import { serverURL, s } from '../srcSet';

class Brands extends Component{

    state = {
        w: window.innerWidth,
        // n: 15,
        // lx:listRefreshQty,
        n: 1,
        lx:30,
    }

    componentDidMount = async () => {
        // console.log(33, Array.isArray(this.props.starredCompany))
        if(Array.isArray(this.props.starredCompany)) await this.mapCompany(this.props.starredCompany)
        await this.getStarredCompany()

        if(this.props.starredCompany.length>0) this.mapCompany(this.props.starredCompany)
        var arr = [...this.props.starredCompany].reverse();
        // setInterval( async () => {
        //     var L = this.props.starredCompany.length
        //     arr.unshift(arr.splice(L-1, L).pop())
        //     this.mapCompany([])
        //     this.mapCompany(arr)
        // }, 5000);
    }

    getStarredCompany = async () => {
        this.setState({
            loadingData:true,
        })

        await axios.post(`${serverURL}/user/starredCompany`).then(async res => {
            // console.log(res.data)
            var brands = res.data
            for(var i=0; i<brands.length; i++) {
                delete brands[i].password
                // console.log(brands[i].password)
                // await axios.post(`${serverURL}/image/getProfileImage`, { xId: brands[i]._id })
                // .then(async res => {
                //     // console.log(i, brands[i]._id)
                //     if(res.data.xImageData) {
                //         brands[i].imageData = res.data.xImageData
                //     }
                // })
        
            }
            
            await this.props.dispatch(setStarredCompany(res.data))
            await this.mapCompany(res.data)
            // console.log(res.data)
            this.setState({
                loading:false,
            })
        })
    }

    mapCompany = async (company) => {
        const {w, } = this.state
        const {} = this.props
          var allCompany = company.map(
            (item, i) => {
                // console.log(12, item)
                const usernameX = item.bizName ? item.bizName : item.username
                const userImg = (
                    <div className={`C${item.fc} w-[45px] h-[45px] ${item.businessType > 0 ? 'rounded-[3px]' : 'rounded-full'} border overflow-hidden`}>
                        <img
                            className='zoomImg object-contain w-full h-full'
                            src={ exist(item.profileIndex)
                                ? `https://www.pix.shiningpage.com/whoraly/profile/big/${item._id}-${item.profileIndex}.jpeg`
                                : item.genderValue===0 ? female : male
                            }
                            alt={usernameX}
                        />
                    </div>
                )
                const aboutImg = (
                    <div className='w-[20vw] h-[calc(6vh+7vw)] min-w-[220px] min-h-[140px] rounded-[10px_10px_0px_0px] overflow-hidden'>
                        <img
                            className='zoomImg object-cover w-full h-full'
                            src={ exist(item.aboutIndex)
                                ? `https://www.pix.shiningpage.com/whoraly/about/big/${item._id}-${item.aboutIndex}.jpeg`
                                : exist(item.profileIndex)
                                    ? `https://www.pix.shiningpage.com/whoraly/profile/big/${item._id}-${item.profileIndex}.jpeg`
                                    : item.genderValue===0 ? female : male
                            }
                            alt={`${usernameX} about`}
                        />
                    </div>
                )
                const country = (
                    <div className='flex items-center justify-start mb-1 whitespace-nowrap gap-2.5'>
                        <div className={`flag-icon flag-icon-${item.countryCode ? item.countryCode.toLowerCase() : ''} border border-[#99999950] text-[17px]`}></div>
                        <div className='text-[12px]'>{item.country ? item.country.toUpperCase() : ''}</div>
                    </div>
                )
                const username = (
                    <div className='text-sm font-normal m-0 whitespace-nowrap overflow-scroll'>
                        {usernameX}
                    </div>
                )
                const jobSummary = <div className='d-flex w-full h-20 p-0 text-[14px] overflow-hidden'>{item.jobSummary}</div>
                const root = item.businessType>0 ? 'publisher' : 'user'

                return (
                    <Link to={`/${root}/${item.username}`} key={i}
                        className='zoom !no-underline !text-[#ffffff] font-thin relative cursor-pointer 
                        bg-[#ffffff10] border !border-white/20 
                        hover:!border-white hover:bg-[#ffffff20] hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)] 
                        transition-all duration-300 rounded-[10px]'>
                        {aboutImg}
                        <div className='p-2.5'>
                            {jobSummary}
                            <div className='flex gap-2.5'>
                                {userImg}
                                <div>
                                    {country}
                                    {username}
                                </div>
                            </div>
                        </div>
                    </Link>
                )
            }
        )

        this.setState({
            allCompany,
            loadingData:false,
        })
    }

	render () {
        const {w, allCompany, loadingData} = this.state
        const {starredCompany} = this.props
        const loaderZ = <div className='loader-13 m-0 text-[#d1a44a]'></div>

        const ColorLoadingCenter = (
            <div className='center w-full'>{loaderZ}</div>
        )

        const allCompanyList = (
            <div className='flex w-full h-full items-start z-0 gap-4' >
                {(loadingData && starredCompany.length===0) ? ColorLoadingCenter : allCompany}
            </div>
        )
    
        return (
            <div className='flex animated fadeIn w-full flex flex-col px-[10px]' style={{animationDelay:'1s'}}>
                <h4 className='text-white font-thin !mt-4'>Top Shining Pages</h4>
                <div className='top-0 w-full overflow-scroll py-4'>
                    {allCompanyList}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        lang: state.lang,
        page: state.page,
        setLT: state.setLT,
        starredCompany: state.starredCompany,
    }
}

export default connect (mapStateToProps)(Brands);
