import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { SiWebpack } from "react-icons/si";
import { IoDocumentAttachSharp } from "react-icons/io5";
import { FaGlobe } from "react-icons/fa";
import { TiAttachmentOutline } from "react-icons/ti";
import { RiGlobalFill } from "react-icons/ri";
import { SlGlobe } from "react-icons/sl";
import { TbGlobeFilled } from "react-icons/tb";
import { s, colors, lightColors } from '../srcSet';

class RoundStatistics extends Component {
 
  state = {
    w: window.innerWidth,
  }

  componentDidMount = async () => {

  }

  render() {
    const { w } = this.state
    const { index, title, Statistsics=0, anim, time, fc } = this.props
    const loader = <div className='loader-13' style={{margin:'0px 20px 0px'}}></div>
    const txBlack = lightColors.includes(fc) ? true : false
    const hr = <div className={`C${txBlack ? 7 : 11}`} style={{width:'70%', height:'2px', margin:'2px -4px'}}></div>
    const bx = `${colors[`C${fc}`]}20`
    const scale = w<s ? .9 : 1
    const size = 160 * scale

    return (
      <div style={{ transform: `scale(${scale})`}}>
        <div className={`center animated ${anim} btnShadowX2 f${txBlack ? 7 : 11}`} style={{animationDelay: time, textDecoration:'none', margin: w<s ? '0px' : '20px', alignItems:'center', width:size, height:size, padding:'0px', fontFamily:'Vazir', top:'50px', zIndex:'0', backgroundColor:bx, borderRadius:'100px'}}>
            <div className='center btnShadowX2' style={{margin:'0px', alignItems:'center', width: '150px', height: '150px', fontSize:'18px', fontWeight:450, backgroundColor:bx, borderRadius:'100px', padding:'0px', textAlign: 'center'}}>
                <div className={`center btnShadowX2 C${fc}`} style={{flexDirection:'column', margin:'0px', alignItems:'center', width: '140px', height: '140px', fontSize:'16px', fontWeight:450, borderRadius:'100px', padding:'0px', textAlign: 'center'}}>
                    <div className='' style={{lineHeight:'25px', marginTop:'10px'}}>{title}</div>
                    {hr}
                    <div className='d-flex' style={{alignItems:'center'}}>
                      {index===1 && <SiWebpack style={{fontSize:'30px', margin:'10px 0px'}}/>}
                      {index===2 && <TiAttachmentOutline style={{fontSize:'30px', margin:'10px 0px'}}/>}
                      {index===3 && <FaGlobe style={{fontSize:'25px', margin:'10px 0px'}}/>}
                      &nbsp;&nbsp;&nbsp;<div className='' style={{lineHeight:'40px', margin:'0px'}}>{Statistsics>=0 ? Statistsics : loader}</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    mainUserId: state.userInfo._id,
    userId: state.userInfo._id,
    username: state.userInfo.username,
    jobSummary: state.userInfo.jobSummary,
    businessType: state.userInfo.businessType,
    rtl: state.rtl,
    lang: state.lang,
    card: state.card,
    auth: state.auth,
    page: state.page,
    adsInfo: state.adsInfo,
    advertiserId: state.adsInfo.advertiserId,
    adsId:state.adsInfo.adsId,
    adsTitle:state.adsInfo.adsTitle,
    adsComment:state.adsInfo.adsComment,
    negotiablePrice:state.adsInfo.negotiablePrice,
    unitPrice:state.adsInfo.unitPrice,
    unitMeasurement:state.adsInfo.unitMeasurement,
    adsImageData:state.adsInfo.adsImageData,
    viewNX:state.adsInfo.viewNX,
    likeNX:state.adsInfo.likeNX,
    toggleLikeX: state.adsInfo.toggleLikeX,
    setLT: state.setLT,
    access: state.userInfo.access,
  }
}

export default connect (mapStateToProps)(RoundStatistics);

