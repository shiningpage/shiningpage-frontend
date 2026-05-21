import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { setStarredAds } from '../dataStore/actions';
import { serverURL, s } from '../srcSet';

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
            // console.log(4455, x2)
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
        const {w, } = this.state
        const {rtl, lang, setLT} = this.props
          var root, countryCode, address, ads, adsComment, special, specialSystem, adsTitleStyle, adsCommentStyle, adsTime, starIcon, star, starSystem, img, TLen, CLen, adsTitle
          var allAds = ads.map(
            (item, i) => (
            // console.log(12, item),
            root = item.businessType>0 ? 'publisher' : 'user',
            adsTime = <span style={{margin:'-5px 0px 0px', fontSize:'13px'}}>{/* this.duration(item.updatedAt) */}ShiningPage</span>,
              starIcon = (
                <img
                    className=''
                    style={{height:'20px', width:'20px'}}
                    src={require('../assets/images/other/starX.png')}
                    alt='star'
                />
              ),
              star = (
                <div className='d-flex' style={{height:'10px', float:'right', direction:'ltr', color:'#d1a44a', fontWeight:'450'}}>
                    { item &&
                        <div>
                            {item.star > 1 && item.star}
                            {starIcon}
                        </div>
                    }
                </div>
              ),
              starSystem = (
                <div style={{ visibility: item ? (item.status===1 ? 'visible' : 'hidden') : 'hidden'}}>
                    <div className='d-flex' style={{margin:'-5px 0px 15px', direction:'ltr'}}>
                        {star}
                    </div>
                </div>
              ),
              img = (
                <div>
                    {starSystem}
                    <img  key={i}
                        className=''
                        style={{objectFit: 'cover', width:'150px', minWidth:'150px', height:'150px', minHeight:'150px', borderRadius:'5px', opacity: item.status===1 ? 1 : .3}}
                        src={`https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictures ? item.pictures[0] : ''}.jpeg`}
                        alt={item.adsTitle}
                    />
                </div>
            ),

            TLen = item.adsTitle ? item.adsTitle.length : 0,
            adsTitleStyle = {width:'100%', padding:'3px', fontSize:'12px', fontWeight:'', marginBottom:'5px', overflow: 'hidden', textAlign: rtl ? 'right' : 'left'},
            adsTitle = <div className='d-flex ' style={adsTitleStyle}>{TLen>30 ? item.adsTitle.substr(0, 25) + ' ...' : item.adsTitle}</div>,

            CLen = item.adsComment ? item.adsComment.length : 0,
            adsCommentStyle = {width:'100%', padding:'3px', fontSize:'12px', marginBottom:'0px', overflow: 'hidden', textAlign: rtl ? 'right' : 'left'},
            adsComment = <div className='d-flex ' style={adsCommentStyle}>{CLen>60 ? item.adsComment.substr(0, 55) + ' ...' : item.adsComment}</div>,
              special = (
                <div style={{backgroundColor:'red', fontWeight:'bold', color:'#ffffff', border:'2px solid #d40000', width:'130px', textAlign:'center'}}>
                    {setLT.special}
                </div>
            ),
              specialSystem = (
                <div style={{position:'', visibility:item.status===1 ? 'visible' : 'hidden', transform: 'rotate(45deg)', margin:'-25px -100px 0px 0px' }}>
                    <div className='d-flex' style={{marginBottom:'10px', justifyContent:'space-between'}}>
                        {special}
                    </div>
                </div>
              ), 
              countryCode = item.countryCode ? item.countryCode.toLowerCase() : '',
              address = (
                <div className='d-flex' style={{margin: '5px 0px -8px', direction:'ltr', alignItems:'flex-start'}}>
                    <span className={`flag-icon flag-icon-${countryCode} cardShadow`}></span> &nbsp;
                    <div style={{margin: '0px', fontSize:'12px', textAlign:'center'}}>{item.country}</div>
                </div>
              ),
            ads = (
                <div className='d-flex ' style={{height:'', width:'100%', padding:'10px', margin:'0px'}}>
                    <div className='center btnShadowX' // onClick={() => this.onTogglePSPage(item)}
                        style={{width:'100%', height:'240px', padding:'5px', overflow:'hidden', flexDirection:'column', alignItems:'center', backgroundColor:'#ffffff', borderRadius:'5px', margin:'0px'}}>
                        {specialSystem}
                        <div className='center' style={{width:'100%', margin:'-40px 0px 0px'}}>{img}</div>
                        <div style={{width:'100%', height:'30px', maxHeight:'30px', direction: rtl ? 'rtl' : 'ltr'}}>
                            {address}
                            {adsTitle}
                        </div>
                    </div>
                </div>
            ),
                <Link to={item.slug ? `/publisher/${item.username}/${item.slug}` : `/ps/${item._id}`} key={i}
                    className={`d-flex`}
                    style={{animationDelay:'', textDecoration:'none', transition:'0s', width:'100%', margin: '0px', padding: item.status===1 ? (w<s ? '0px' : '0px') : '0px', flexDirection:'column', alignItems:'', borderRadius:'', color:'black', cursor:'default'}}
                >
                    {ads}
                </Link>
                )
          )
        this.setState({
            allAds,
            loadingData:false,
        })
    }

	render () {
        const {w, allAds, loadingData} = this.state
        const {rtl, setLT, starredAds} = this.props
        const loaderZ = <div className='loader-13' style={{margin: '0px', color:'#d1a44a', transform: rtl ? 'rotate(180deg)' : ''}}></div>

        const ColorLoadingCenter = (
            <div className='center' style={{width:'100%', direction:rtl ? 'rtl' : 'ltr'}}>{loaderZ}</div>
        )
        const allAdsList = (
            <div className={'d-flex'} style={{width:'100%', height:'100%', alignItems:'center', padding:w<s ? '0px' : '0px', zIndex:'0', backgroundColor:''}}>
                {(loadingData  && starredAds.length===0) ? ColorLoadingCenter : allAds}
            </div>
        )

        return (
            <div className='d-flex animated fadeIn' style={{animationDelay:'1.5s', width: '100%', padding:w<s ? '10px 0px 30px' : '30px 10px 30px', flexDirection:'column'}}>
                <h4 style={{ fontWeight:'bold', margin:'10px 10px 0px' }}>{setLT.specialPS}</h4>
                <div className='' style={{width:'100%', height:'280px', direction:rtl ? 'rtl' : 'ltr', overflow:'scroll'}}>
                    {allAdsList}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        rtl: state.rtl,
        lang: state.lang,
        auth: state.auth, 
        page: state.page,
        setLT: state.setLT,
        starredAds: state.starredAds,
    }
}

export default connect (mapStateToProps)(StarredAds);
