import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setSubject, setAddress, setPageTitle, setPage } from '../dataStore/actions';
import siteView from '../modules/siteView';
import { AdsHorizontal } from '../components/GoogleAds';
import { checkSeen } from '../helper';
import { s, googleAds } from '../srcSet';


class PrivacyPage extends Component {
    
  state = {
    w: window.innerWidth,
    h: window.innerHeight,
    pageName: this.props.setLT.privacyPolicy,
}

  componentDidMount = async () => {
    window.scrollTo(0, 0)
    window.addEventListener("resize", this.onResize)
    await this.props.dispatch(setPageTitle(`${this.state.pageName} | ShiningPage`))
    await this.props.dispatch(setPage('privacy'))
    await this.props.dispatch(setSubject('privacy'))
    await this.props.dispatch(setAddress({ content:[], fix:this.state.pageName }))
    // if(this.props.auth && this.props.mainUser.ruby) checkSeen('privacy', this.props.seenStatus, this.props.dispatch)
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
          <h1 className='animated fadeInLeft tx' style={{animationDelay:'.5s', color:'#ffffff', fontWeight:'bold', fontSize: w<s ? '30px' : '', textAlign:'center', margin:'30px 10px 30px'}}>{setLT.privacyPolicy}</h1>
        </div>
      </div>
    )

    const adsBox1 = <div className='adsbox'><AdsHorizontal id='adsH1' /></div>
    const adsBox2 = <div className='adsbox'><AdsHorizontal id='adsH2' /></div>

    return (
      <div style= {{lineHeight:'25px'}}>
        {googleAds && adsBox1}
        <Container>
          <div className='center' style={{flexDirection:'column', alignItems:'center'}}>
            {header}
          </div>
          <div className='animated fadeInUpX' style={{animationDelay:'.5s', width:'', margin:'0px 5px 30px', padding:'10px', fontFamily:'Vazir', top:'50px', zIndex:'0', backgroundColor:'#ffffff99', borderRadius:'5px'}}>
            <div style={{backgroundColor:'#ffffff99', borderRadius:'5px', padding:w<s ? '10px' : '30px', direction: rtl ? 'rtl' : 'ltr'}}>
              <h4>{setLT.privacyPolicyTitle}</h4>
              <p>
                <strong>{setLT.effectiveDateTitle}</strong>: {setLT.policyEffectiveDate}
              </p>
              <p>{setLT.privacyPolicyIntro}</p>
            
              <h5>{setLT.informationWeCollectTitle}</h5>
              <ul>
                {setLT.informationWeCollect?.map((item, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            
              <h5>{setLT.howWeUseYourInformationTitle}</h5>
              <ul>
                {setLT.howWeUseYourInformationContent?.map((item, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>

              <h5>{setLT.rubiesAndUnits}</h5>
              <p>{setLT.rubiesInfo}</p>
            
              <ul style={{textAlign:rtl ? 'justify' : '', marginBottom:'30px'}}>
                  <li>
                      <strong>{setLT.noMonetaryValue}:</strong> {setLT.noMonetaryValueText}
                  </li>
                  <li>
                      <strong>{setLT.usageLimitation}:</strong> {setLT.usageLimitationText}
                  </li>
                  <li>
                      <strong>{setLT.noCompensation}:</strong> {setLT.rubiesCompensationInfo}
                  </li>
                  <li>
                      <strong>{setLT.noConnectionToAds}:</strong> {setLT.rubiesNotBasedOnAds}
                  </li>
                  <li>
                      <strong>{setLT.activationDisclaimer}:</strong> {setLT.rubiesActivationInfo}
                  </li>
              </ul>
  
              <h5>{setLT.sharingOfInformationTitle}</h5>
              <p>{setLT.sharingOfInformationContent}</p>
            
              <h5>{setLT.dataRetentionTitle}</h5>
              <p>{setLT.dataRetentionContent}</p>
            
              <h5>{setLT.securityTitle}</h5>
              <p>{setLT.securityContent}</p>
            
              <h5>{setLT.yourRightsTitle}</h5>
              <p dangerouslySetInnerHTML={{ __html: setLT.yourRightsContent }}></p>

            </div>
          </div>
        </Container>
        {googleAds && adsBox2}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mainUserId: state.userInfo['_id'],
    mainUser: state.userInfo,
    auth: state.auth,
    rtl: state.rtl,
    lang: state.lang,
    geo: state.geo,
    page: state.page,
    subject: state.subject,
    pageName: state.pageName,
    setLT: state.setLT,
    seenStatus: state.seenStatus,

  }
}

export default connect (mapStateToProps)(PrivacyPage);
