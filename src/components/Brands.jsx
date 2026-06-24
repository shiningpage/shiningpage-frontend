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
        const { rtl, lang } = this.props
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
                    <div style={{width:"20vw", height:"calc(6vh + 7vw)", minWidth:'220px', minHeight:'140px', borderRadius:'10px', border:'1px solid #99999930', overflow:'hidden'}}>
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
                const root = item.businessType>0 ? 'publisher' : 'user'

                return (
                    <Link to={`/${root}/${item.username}`} key={i} className='zoom'
                        style={{textDecoration:'none', color:'#000000', position:'relative', padding:'10px', height:'300px', cursor:'pointer'}}
                        // onClick={() => this.onToggleWebPage(item)}
                    >
                        {aboutImg}
                        {jobSummary}
                        <div className='d-flex' style={{position:'absolute', bottom:0, margin:'0px'}}>
                            {userImg}&nbsp;&nbsp;
                            <div>
                                {country}
                                {username}
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
        const {starredCompany, rtl, setLT} = this.props
        const loaderZ = <div className='loader-13' style={{margin: '0px', color:'#d1a44a', transform: rtl ? 'rotate(180deg)' : ''}}></div>

        const ColorLoadingCenter = (
            <div className='center' style={{width:'100%', direction:rtl ? 'rtl' : 'ltr'}}>{loaderZ}</div>
        )

        const allCompanyList = (
            <div className={'d-flex'} style={{width:'100%', height:'100%', alignItems:'flex-start', zIndex:'0'}}>
                {(loadingData && starredCompany.length===0) ? ColorLoadingCenter : allCompany}
            </div>
        )
    
        return (
            <div className='d-flex animated fadeIn' style={{animationDelay:'1s', width: '100%', padding:w<s ? '10px 0px 30px' : '30px 10px 50px', flexDirection:'column'}}>
                <h4 style={{ fontWeight:'bold', margin:'10px' }}>Sample ShiningPages</h4>
                <div className='' style={{top:0, width:'100%', height:'', padding:'0px', flexDirection:'', direction:rtl ? 'rtl' : 'ltr', overflow:'scroll'}}>
                    {allCompanyList}
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
        page: state.page,
        setLT: state.setLT,
        starredCompany: state.starredCompany,
    }
}

export default connect (mapStateToProps)(Brands);
