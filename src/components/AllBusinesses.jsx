import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';
import { exist } from '../helper';
import RubyCollector from './RubyCollector';
import { AdsInArticle, AdsMultiplex, } from './GoogleAds';
import { serverURL, s, googleAds } from '../srcSet';

class AllBusinesses extends Component{

    state = {
        w: window.innerWidth,
        n: 1,
        lx:30,
        allCompany:[],
    }

    componentDidMount = async () => {
        await this.getAllCompany()
    }

    onToggleWebPage = async (item) => {
        const root = item.businessType>0 ? 'publisher' : 'user'
        window.open(`/${root}/${item.username}`);
    }

    getAllCompany = async () => {
        this.setState({
            loadingData:true,
        })

        await axios.get(`${serverURL}/user/allCompany`).then(async res => {
            // console.log(1111, res.data)
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
            
            await this.mapCompany(res.data)
            // console.log(res.data)
            this.setState({
                loading:false,
            })
        })
    }

    mapCompany = async (company) => {
        const {w, } = this.state
        const { rtl } = this.props
          var allCompany = company.map(
            (item, i) => {
                // console.log(12, item)
                const userImg = (
                    <div className={`C${item.fc}`} style={{width:"45px", height:"45px", borderRadius: item.businessType>0 ? '3px' : '100px', border:'1px solid #99999940', padding:'2px', overflow:'hidden'}}>
                        <img
                            className='zoomImg'
                            style={{objectFit: 'contain', width:'100%', height:'100%'}}
                            src={ exist(item.profileIndex)
                                ? `https://www.pix.shiningpage.com/whoraly/profile/big/${item._id}-${item.profileIndex}.jpeg`
                                : item.genderValue===0 ? female : male
                            }
                            alt={item.username}
                        />
                    </div>
                )
                const aboutImg = (
                    <div style={{width:"100%", height:"calc(6vh + 7vw)", minWidth:'220px', minHeight:'140px', overflow:'hidden'}}>
                        <img
                            className='zoomImg'
                            style={{objectFit: 'cover', width:'100%', height:'100%'}}
                            src={ exist(item.aboutIndex)
                                ? `https://www.pix.shiningpage.com/whoraly/about/big/${item._id}-${item.aboutIndex}.jpeg`
                                : exist(item.profileIndex)
                                    ? `https://www.pix.shiningpage.com/whoraly/profile/big/${item._id}-${item.profileIndex}.jpeg`
                                    : item.genderValue===0 ? female : male
                            }
                            alt={`${item.username} about`}
                        />
                    </div>
                )
                const country = (
                    <div className='d-flex' style={{alignItems:'center', height:'', justifyContent:'flex-start', margin:'0px 0px 0px', whiteSpace:'nowrap'}}>
                        <div className={`flag-icon flag-icon-${item.countryCode ? item.countryCode.toLowerCase() : ''}`} style={{border:'1px solid #99999950', fontSize:'17px'}}></div>&nbsp;
                        <div style={{fontSize:'12px', color: ''}}>{item.country ? item.country.toUpperCase() : ''}</div>
                    </div>
                )
                const usernameX = item.bizName ? item.bizName : item.username
                const username = (
                    <div className='' style={{width:w<s ? '' : '', fontSize:'14px', fontWeight:400, margin:'0px', color:'', whiteSpace:'nowrap', overflow:'scroll'}}>
                        {usernameX}
                    </div>
                )
                const jobSummaryStyle = {width:'100%', padding:'0px', fontSize:'16px', fontWeight:450, margin:'8px 0px 4px', overflow: 'hidden', textAlign: rtl ? 'right' : 'left', color:''}
                const jobSummary = <div className='d-flex' style={jobSummaryStyle}>{item.jobSummary}</div>

                if (googleAds && i % 5 === 0 && i !== 0) {
                    return (
                        <div key={`adsPlus-${i}`} style={{width:'100%'}}>
                            <div key={`ads-${i}`}
                                style={{ width:'100%', marginBottom:'30px', borderRadius:'10px', backgroundColor:'#ffffff30'}}
                            >
                                <AdsInArticle />
                            </div>
                            <div key={i} className='zoom'
                                style={{position:'relative', marginBottom:'30px', width:'100%', height:'300px', backgroundColor:'#ffffff', borderRadius:'10px', cursor:'pointer', overflow:'hidden'}}
                                onClick={() => this.onToggleWebPage(item)}>
                                {aboutImg}
                                <div style={{padding:'10px'}}>
                                    {jobSummary}
                                    <div className='d-flex' style={{position:'absolute', bottom:10, margin:'0px'}}>
                                        {userImg}&nbsp;&nbsp;
                                        <div>
                                            {country}
                                            {username}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                
                return (
                    <div key={i} className='zoom'
                        style={{position:'relative', marginBottom:'30px', width:'100%', height:'300px', backgroundColor:'#ffffff', borderRadius:'10px', cursor:'pointer', overflow:'hidden'}}
                        onClick={() => this.onToggleWebPage(item)}>
                        {aboutImg}
                        <div style={{padding:'10px'}}>
                            {jobSummary}
                            <div className='d-flex' style={{position:'absolute', bottom:10, margin:'0px'}}>
                                {userImg}&nbsp;&nbsp;
                                <div>
                                    {country}
                                    {username}
                                </div>
                            </div>
                        </div>
                    </div>
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
        const {rtl, setLT} = this.props
        const loaderZ = <div className='loader-13' style={{margin: '0px', color:'#ffffff', transform: rtl ? 'rotate(180deg)' : ''}}></div>

        const loaderCenter = (
            <div className='center' style={{width:'100%', direction:rtl ? 'rtl' : 'ltr'}}>{loaderZ}</div>
        )

        const allCompanyList = (
            <div className={'d-flex'} style={{width:'100%', height:'100%', alignItems:'flex-start', flexDirection:'column', zIndex:'0'}}>
                {(loadingData && allCompany.length===0) ? loaderCenter : allCompany}
            </div>
        )

        const adsBox = <div className='adsbox'><AdsMultiplex id='adsMulti2' /></div>

        return (
            <div className='d-flex animated fadeIn' style={{animationDelay:'1s', width: '50%', flexDirection:'column'}}>
                <h1 className='animated fadeIn tx' style={{animationDelay:'.5s', color:'#ffffff', fontWeight:'bold', fontSize:'30px', textAlign:'', margin:'43px 10px 30px'}}>Business Members</h1>
                <div className='' style={{top:0, width:'100%', height:'', padding:'0px', flexDirection:'', direction:rtl ? 'rtl' : 'ltr', overflow:'scroll'}}>
                    {allCompanyList}
                </div>
                {googleAds && adsBox}
                {/* <div style={{width:'100%', height:'50px', marginTop:'30px', position:'ralative'}}>
                    <RubyCollector id='adsMulti2' left={30}/>
                </div> */}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        rtl: state.rtl,
        lang: state.lang,
        page: state.page,
        setLT: state.setLT,
    }
}

export default connect (mapStateToProps)(AllBusinesses);
