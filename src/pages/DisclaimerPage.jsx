import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setPageName, setPageTitle } from '../store/slices/pageSlice';
import { setSubject, setAddress } from '../store/slices/appSlice';
import siteView from '../modules/siteView';
import { AdsHorizontal } from '../components/GoogleAds';
import { checkSeen } from '../helper';
import { s, googleAds } from '../srcSet';

class DisclaimerPage extends Component {
    
  state = {
    w: window.innerWidth,
    h: window.innerHeight,
    page: this.props.setLT.disclaimer,
}

  componentDidMount = async () => {
    window.scrollTo(0, 0)
    window.addEventListener("resize", this.onResize)
    await this.props.dispatch(setPageTitle(`${this.state.page} | ShiningPage`))
    await this.props.dispatch(setPageName('disclaimer'))
    await this.props.dispatch(setSubject('disclaimer'))
    await this.props.dispatch(setAddress({ content:[], fix:this.state.page }))
    siteView(this.props)
  }

  onResize = () => {
    this.setState({
      w: window.innerWidth,
      h: window.innerHeight,
    })
  }

  render() {
    const { w, h, } = this.state
    const { rtl, lang, setLT, } = this.props

    const header = (
      <div className='center' style={{alignItems:'center', flexDirection:'column', padding: '0px 10px'}}>
        <div className='d-flex' style={{justifyContent:rtl ? 'space-between' : 'flex-end', alignItems:'center', width:'100%', direction:'rtl'}}>
          <h1 className='animated fadeInLeft tx' style={{animationDelay:'.5s', color:'#ffffff', fontWeight:'bold', fontSize: w<s ? '30px' : '', textAlign:'center', margin:'30px 10px 30px'}}>{setLT.disclaimer}</h1>
        </div>
      </div>
    )

    const adsBox1 = <div className='adsbox'><AdsHorizontal id='adsH1' /></div>
    const adsBox2 = <div className='adsbox'><AdsHorizontal id='adsH2' /></div>

    return (
        <div style={{ lineHeight: '30px' }}>
          {/* {googleAds && adsBox1} */}
          <Container>
            <div className='center'>{header}</div>
            <div className='animated fadeInUpX' style={{ animationDelay: '.5s', width: '', margin: '0px 5px 30px', padding: '10px', fontFamily: 'Vazir', top: '50px', zIndex: '0', backgroundColor: '#ffffff99', borderRadius: '5px' }}>
              <div style={{ backgroundColor: '#ffffff99', borderRadius: '5px', padding: w < s ? '10px' : '30px', direction: rtl ? 'rtl' : 'ltr' }}>
                <h4>{setLT.disclaimerTitle}</h4>
                <p>
                  <strong>{setLT.effectiveDateTitle}</strong>: {setLT.disclaimerEffectiveDate}
                </p>
                <p>{setLT.disclaimerIntro}</p>
              
                <h5>{setLT.generalInformationTitle}</h5>
                <p>{setLT.generalInformationContent}</p>
              
                <h5>{setLT.thirdPartyLinksTitle}</h5>
                <p>{setLT.thirdPartyLinksContent}</p>
              
                <h5>{setLT.noWarrantyTitle}</h5>
                <p>{setLT.noWarrantyContent}</p>
              
                <h5>{setLT.limitationOfLiabilityTitle}</h5>
                <p>{setLT.disclaimerLimitationOfLiabilityContent}</p>
              
                <h5>{setLT.updatesToDisclaimerTitle}</h5>
                <p>{setLT.updatesToDisclaimerContent}</p>
              
                <p style={{ marginTop: '20px' }}>
                  {setLT.contactInfoTitle}: <a href={`mailto:hello@shiningpage.com`}>hello@shiningpage.com</a>
                </p>
              </div>
            </div>
          </Container>
          {/* {googleAds && adsBox2} */}
        </div>
      );
  }
}

const mapStateToProps = (state) => {
  return {
    mainUserId: state.user.userInfo['_id'],
    mainUser: state.user.userInfo,
    rtl: state.app.rtl,
    lang: state.app.lang,
    geo: state.app.geo,
    pageName: state.page.name,
    subject: state.app.subject,
    setLT: state.app.setLT,
    seenStatus: state.app.seenStatus,

  }
}

export default connect (mapStateToProps)(DisclaimerPage);
