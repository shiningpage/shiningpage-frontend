import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { setStarredAds } from '../dataStore/actions';
import { serverURL, s } from '../srcSet';
import star from "../assets/images/other/starX.png";

class StarredAds extends Component{

    state = {
        w: window.innerWidth,
        n: 1,
        lx:30,
        searchData:[],
        loadingData: true,
    }

    componentDidMount = async () => {
        if(Array.isArray(this.props.starredAds)) await this.mapAds(this.props.starredAds)
        await this.getStarredAds()
    }

    // onTogglePSPage = async (item) => {
    //     window.open(`/ps/${item._id}`)
    // }

    onMore = async () => {
        const {n, lx} = this.state
        await this.setState({
          loading:true,
          lx: n + this.state.lx
        })
        this.getStarredAds()
    }

    getStarredAds = async () => {
        this.setState({
            loadingData:true,
        })
  
        const {lx} = this.state
        var dx = {lx}
        await axios.post(`${serverURL}/ads/getStarredAds`, dx).then(async res => {
            var x2 = res.data
            var x1 = this.state.searchData
            this.setState({
              searchData : [...x1, ...x2],
            })
            await this.props.dispatch(setStarredAds(this.state.searchData))
            await this.mapAds(x2)
            this.setState({
                loading:false,
                finishData: res.data.length<lx ? true : false
            })
        })
    }

    mapAds = async (ads) => {
        const {} = this.state
        const {} = this.props
        var allAds = ads.map(
            (item, i) => {
                // console.log(12, item)
                const starRate = (
                    <div className='absolute center items-center w-10 text-[#d1a44a] font-[450] bg-[#090728] rounded-2 px-2 py-1 m-1 z-10'>
                        <img className='h-4 w-4' src={star} alt='star'/>
                        <div className='text-[16px] leading-[10px] mt-1'>{item.star > 1 && item.star}</div>
                    </div>
                )

                const SpecialRibbon = (
                    <div className="absolute top-0 right-0 z-20">
                        <div className="w-24 h-24 overflow-hidden absolute top-0 right-0">
                            <div
                                className="absolute top-[13.3px] right-[-38px] rotate-45
                                bg-gradient-to-r from-[#b8860b] via-[#f5d77a] to-[#d4a017]
                                text-[#4a2b00] text-[8px] font-extrabold
                                tracking-[2px]
                                w-32 text-center py-[5px]
                                drop-shadow-[0_2px_2px_rgba(255,255,255,0.5)]
                                shadow-[0_0_10px_rgba(213,173,109,0.8)]
                                border-y-[3px] border-[#8b0000]"
                            >
                                ✦ SPECIAL ✦
                            </div>
                        </div>
                    </div>
                )

                const adsImg = (
                    <div className='relative mb-4'>
                        {starRate}
                        {SpecialRibbon}
                        <div className='w-[170px] min-w-[170px] h-[170px] min-h-[170px] rounded-[10px] overflow-hidden'>
                            <img
                                className={`zoomImg w-full h-full object-cover rounded-[10px] ${
                                    item.status === 1 ? "opacity-100" : "opacity-30"
                                }`}
                                src={`https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictures ? item.pictures[0] : ''}.jpeg`}
                                alt={item.adsTitle}
                            />
                        </div>

                    </div>
                )

                const countryCode = item.countryCode ? item.countryCode.toLowerCase() : ''
                const country = (
                    <div className='flex mb-3 gap-1'>
                        <span className={`flag-icon flag-icon-${countryCode} cardShadow`}></span>
                        <div style={{margin: '0px', fontSize:'12px', textAlign:'center'}}>{item.country}</div>
                    </div>
                )

                const adsTitle = <div className='flex w-full p-[3px] text-[14px] font-[500] mb-[5px] overflow-hidden'>{item.adsTitle}</div>

                const root = item.slug ? `/publisher/${item.username}/${item.slug}` : `/ps/${item._id}`

                return (
                    <div key={i} className='flex w-full px-2.5'>
                        <Link to={root} target="_blank" rel="noopener noreferrer"
                            className='zoom !no-underline !text-[#ffffff] font-thin h-[300px] min-h-[300px] relative cursor-pointer 
                            bg-[#ffffff10] border !border-white/20 p-2.5
                            hover:!border-white hover:bg-[#ffffff20] hover:shadow-[0_10px_30px_#ffffff35]
                            transition-all duration-300 rounded-[15px]'>
                            {adsImg}
                            {country}
                            {adsTitle}
                        </Link>
                    </div>
                )
            }
        )
        this.setState({
            allAds,
            loadingData:false,
        })
    }

	render () {
        const { w, allAds, loadingData } = this.state
        const { starredAds } = this.props
        const loaderZ = <div className='loader-13 m-0 text-[#d1a44a]'></div>

        const ColorLoadingCenter = (
            <div className='center w-full'>{loaderZ}</div>
        )
        const allAdsList = (
            <div className='flex w-full h-full py-[30px] items-center'>
                { (loadingData  && starredAds.length===0) ? ColorLoadingCenter : allAds }
            </div>
        )

        const header = <div className='goldenText animated fadeInLeft [animation-delay:.5s] text-[28px] font-[600] mt-[30px] ml-[10px]'>Top Products & Services</div>

        return (
            <div className={`flex animated fadeIn w-full flex flex-col ${w < s ? "pt-[10px] pb-[30px]" : "py-[30px]"}`} style={{animationDelay:'1.5s'}}>
                {header}
                <div className='w-full overflow-scroll'>
                    {allAdsList}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        auth: state.auth, 
        page: state.page,
        starredAds: state.starredAds,
    }
}

export default connect (mapStateToProps)(StarredAds);
