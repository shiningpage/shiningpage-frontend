import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setSubject, setAddress, setPageTitle, setPage } from '../dataStore/actions';
import siteView from '../modules/siteView';
import { AdsHorizontal } from '../components/GoogleAds';
import { checkSeen } from '../helper';
import { s, googleAds } from '../srcSet';

class ToSPage extends Component {
    
  state = {
    w: window.innerWidth,
    h: window.innerHeight,
    pageName: this.props.setLT.tos,
}

  componentDidMount = async () => {
    window.scrollTo(0, 0)
    window.addEventListener("resize", this.onResize)
    await this.props.dispatch(setPageTitle(`${this.state.pageName} | ShiningPage`))
    await this.props.dispatch(setPage('tos'))
    await this.props.dispatch(setSubject('ToS'))
    await this.props.dispatch(setAddress({ content:[], fix:this.state.pageName }))
    // if(this.props.auth && this.props.mainUser.ruby) checkSeen('ToS', this.props.seenStatus, this.props.dispatch)
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
          <h1 className='animated fadeInLeft tx' style={{animationDelay:'.5s', color:'#ffffff', fontWeight:'bold', fontSize: w<s ? '30px' : '', textAlign:'center', margin:'30px 10px 30px'}}>{setLT.tos}</h1>
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
              <h4>{setLT.termsOfServiceTitle}</h4>
              <p>
                <strong>{setLT.effectiveDateTitle}</strong>: {setLT.effectiveDate}
              </p>
              <p>{setLT.termsOfServiceIntro}</p>
            
              <h5>{setLT.acceptanceOfTermsTitle}</h5>
              <p>{setLT.acceptanceOfTermsContent}</p>
            
              <h5>{setLT.descriptionOfServicesTitle}</h5>
              <p>{setLT.descriptionOfServicesContent}</p>
            
              <h5>{setLT.accountResponsibilitiesTitle}</h5>
              <p>{setLT.accountResponsibilitiesContent}</p>
            
              <h5>{setLT.prohibitedActivitiesTitle}</h5>
              <ul>
                {setLT.prohibitedActivities?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            
              <h5>{setLT.terminationTitle}</h5>
              <p>{setLT.terminationContent}</p>
            
              <h5>{setLT.limitationOfLiabilityTitle}</h5>
              <p>{setLT.limitationOfLiabilityContent}</p>
            
              <h5>{setLT.governingLawTitle}</h5>
              <p>{setLT.governingLawContent}</p>
            
              <p style={{ marginTop: '20px' }}>
                {setLT.contactInfoTitle}: <a href={`mailto:hello@shiningpage.com`}>hello@shiningpage.com</a>
              </p>
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

export default connect (mapStateToProps)(ToSPage);
