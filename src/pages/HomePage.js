import React, { Component, } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import 'chartjs-plugin-annotation';
import { Container } from 'react-bootstrap';
import { setAddress, setSubject, setGeo, setPageName, setPageTitle, setPage, setUserInfo } from '../dataStore/actions';
import siteView from '../modules/siteView';
import { MdPhonelinkRing, MdPhoneInTalk, MdEmail } from 'react-icons/md';
import { GiCheckMark } from "react-icons/gi";
import userN from '../assets/images/other/user1.png';
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';
import faImg from '../assets/images/country/iran.jpg';
import enImg from '../assets/images/country/unitedKingdom.jpg';
import arImg from '../assets/images/country/arab.jpg';
import ruImg from '../assets/images/country/russia.jpg';
import ShiningpageCarousel from '../components/ShiningpageCarousel';
import ScrollAnimation from '../components/ScrollAnimation';
import Brands from '../components/Brands';
import StarredAds from '../components/StarredAds';
import SiteView from '../components/SiteView';
import { AdsHorizontal } from '../components/GoogleAds';
import { exist, checkSeen } from '../helper';
import { serverURL, s, categories, googleAds, countryArr } from '../srcSet';
const hrS = <hr style={{border:'heirline dashed #999999', width:'100%'}}/>

class HomePage extends Component {

  state = {
    w: window.innerWidth,
    h: window.innerHeight,
    viewCountAll: [],
    toggleCountry: false,
    toggleView: false,
    viewFilter: 7
  }

  componentDidMount = async () => {
    window.scrollTo(0, 0)
    window.addEventListener("resize", this.onResize)
    await this.props.dispatch(setPageName('ShiningPage'))
    await this.props.dispatch(setPageTitle(`ShiningPage`))
    await this.props.dispatch(setPage('home'))
    await this.props.dispatch(setSubject('home'))
    await this.props.dispatch(setAddress({ content:[], fix:'' }))

    // if(this.props.auth && this.props.mainUser.ruby) checkSeen('home', this.props.seenStatus, this.props.dispatch)
    this.getGeo()
    siteView(this.props)
    if(this.props.auth) this.getUserInfo(this.props.mainUserId)
    this.mapColors()
    const indexArray = categories.map(category => category.index);
    for (let i = 0; i < indexArray.length; i++) {
      const index = indexArray[i];
      await this.getCategory(index);
    }
  }

  getUserInfo = async (_id) => {
    axios.post(`${serverURL}/user/getUserInfo`, { _id })
    .then(async res => {
      delete res.data.password
      // console.log('nnn', res.data)

      this.props.dispatch(setUserInfo(res.data))
    })
  }

  getGeo = async () => {
      await axios.get('https://ipinfo.io/json?token=211ae43e1cddf3')
      .then(async (res) => {
          let data = res.data;
          // console.log(data)
          data.countryCode = data.country

          // پیدا کردن کشور از آرایه
          const countryObj = countryArr.find(
              (item) => item.code === data.countryCode
          );
          // اگر پیدا شد ست کن
          data.country = countryObj ? countryObj.country : null;
          await this.props.dispatch(setGeo(data))
      })
  }

  onResize = () => {
    this.setState({ 
      w: window.innerWidth,
      h: window.innerHeight,
    })
  }

  changeLanguage = async (x) => {
    window.location.href=`/${x}`
  }

  mapColors = () => {
    const cStyle = { height: '40px', width: '40px', margin: '5px', borderRadius: '5px' };
    const colorArr = [
      11, 4, 9, 3, 6, 8, 
      23, 57, 54, 10, 19, 20,
      12, 1, 15, 55, 5, 21, 
      25, 2, 17, 0, 26, 7, 
      22, 13, 33, 14, 38, 31, 
      32, 27, 30, 45, 41, 47, 
      35, 49, 34, 46, 36, 18, 
      39, 48, 37, 44, 58, 43, 
      28, 50, 16, 29, 42, 40, 
      24, 
    ]
    const colors = [];

    for (let i = 0; i < colorArr.length; i++) {
      colors.push(
        <div
            key={`C${colorArr[i]}`}
            className={`C${colorArr[i]}`}
            style={cStyle}
        ></div>
      );
    }
    this.setState({colors})
  }

  mapCategories = async () => {
    const { w } = this.state
    const { rtl, setLT, lang } = this.props;
    const loader = <div className='loader-13' style={{margin: '0px', color:'', transform: rtl ? 'rotate(180deg)' : ''}}></div>

    // console.log(this.state.cgCompany18)
    const categoriesItem = categories.map((item, i) => (
      <div key={i}>
        <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{setLT[item.title]}</h2>
          <p>{setLT[`${item.title}Desc`]}</p>
        </ScrollAnimation>
        <div className='d-flex' style={{overflow:'scroll'}}>
          {this.state[`cgCompany${item.index}`] ? this.state[`cgCompany${item.index}`] : loader}
        </div>
        {i<categories.length-1 && hrS}
      </div>
    ))

    this.setState({categoriesItem})
  }

  getCategory = async (x) => {
    const data = {
      category: [x]
    }
    await axios.post(`${serverURL}/user/getBusinessCategory`, data).then(async res => {
        var data = res.data
        await this.mapCompany(x, data)
        await this.mapCategories()
    })
  }

  mapCompany = async (x, company) => {
    const {w, } = this.state
    const {lang, rtl, setLT} = this.props
      var allCompany = await company.map(
        (item, i) => {
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
                <div className='d-flex' style={{alignItems:'center', height:'', justifyContent:'flex-start', margin:'0px', whiteSpace:'nowrap'}}>
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
            const jobSummaryStyle = {width:'20vw', minWidth:'220px', padding:'0px', fontSize:'16px', fontWeight:450, margin:'8px 0px 4px', overflow: 'hidden', textAlign: rtl ? 'right' : 'left', color:''}
            const jobSummary = <div className='d-flex' style={jobSummaryStyle}>{item.jobSummary}</div>
            const root = item.businessType>0 ? 'publisher' : 'user'

            return (
                <Link to={`/${root}/${item.username}`} key={i} className='zoom'
                    style={{textDecoration:'none', color:'#000000', position:'relative', padding:'10px', height:'290px', cursor:'pointer'}}
                    // onClick={() => this.onToggleonWebPage(item)}
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
    
    this.state[`cgCompany${x}`] = allCompany
  }

  render() {
    const {w, h, colors, categoriesItem} = this.state
    const {rtl, auth, setLT, lang, access, pageYOffset} = this.props;
    const loaderAlert = <div className='loader-07' style={{marginTop:'10px', color:'#d1a44a', width:'100px', height:'100px', position:'absolute'}}></div>

    // console.log(pageYOffset)
    var Yoffset = Number((-pageYOffset/3).toFixed(0))
    var top = pageYOffset/3
    var t1 = h<500 ? 1-(top/100) : 2.5-(top/100)
    var t2 = h<500 ? 1-(top/100) : 2-(top/100)
    var t3 = h<500 ? 1-(top/100) : 2-(top/100)
    const hrC14 = <div className='C14' style={{width:'100%', height:'10px'}}></div>
    const checkmark = <span style={{color:'green'}}>✓</span>

    const adsBox = <div className='adsbox'><AdsHorizontal id='adsH1' /></div>
    const adsBoxCenter = (
      <div className='d-flex' style={{width:'100%', padding:'0px 100px', justifyContent:'center'}}>
        <div className='adsbox'><AdsHorizontal id='adsH1' /></div>
      </div>
    )

    const welcome = (
      <div>
        {hrC14}
        <div style={{backgroundColor:'#ffffff99', width:'100%', padding:w<s ? '70px 20px' : '70px 20Vw'}}>
          <Container>
            <div style={{backgroundColor:''}}>
              <h1 style={{textAlign:'center', marginBottom:'30px', fontSize: w<s ? '20px' : '25px', fontWeight:'bold'}}>
                <span>{setLT.welcomeToWhoraly}</span>
              </h1>
              <div>
                <p style={{textAlign: 'justify', fontSize:w<s ? '14px' : '16px', lineHeight: '28px'}}>
                  <div dangerouslySetInnerHTML={{ __html: setLT.welcomeIntro }}></div>
                </p>
                <div style={{marginTop: '20px'}}>
                  <h2 style={{fontSize:'18px', fontWeight:450}}>
                    <span style={{fontSize:'20px'}}>{checkmark}</span>&nbsp;
                    {setLT.makeBusinessPage}
                  </h2>
                  <p style={{textAlign: 'justify', fontSize:w<s ? '14px' : '16px', lineHeight: '28px', margin:'0px'}}>
                    {setLT.businessPageDetails}
                  </p>
                </div>
              </div>
            </div>
            {/* <Link to='/product' className='d-flex justify-content-center'>
              <Button variant="dark">محصولات</Button>
            </Link> */}
          </Container>
        </div>
        {hrC14}
      </div>
    )

    const servicesHeader = (
      <div>
        <ScrollAnimation animateOnce={true} delay={0} animateIn='fadeInDown' animateOut='fadeOut'>
          <h1 className='txBlack' style={{color:'gold', textAlign:'center', marginBottom:'10px', fontSize: w<s ? '30px' : '35px', fontWeight:'bold'}}>
          {setLT.ourServices}
          </h1>
        </ScrollAnimation>
        <ScrollAnimation animateOnce={true} delay={0} animateIn='fadeInDown' animateOut='fadeOut'>
          <Container style={{padding:'10px'}}>
            <h2 style={{textAlign:'center', marginBottom:'0px', fontSize: w<s ? '20px' : '25px', fontWeight:'bold', lineHeight:'30px'}}>
            {setLT.ourServicesTagline}
            </h2>
          </Container>
        </ScrollAnimation>
        <ScrollAnimation animateOnce={true} delay={0} animateIn='fadeInUp' animateOut='fadeOut'>
          <Container style={{padding:'10px', lineHeight:'25px', textAlign: rtl ? 'justify' : ''}}>
            <p style={{marginBottom:'30px'}}>
            {setLT.ourServicesText}
            </p>
          </Container>
        </ScrollAnimation>
      </div>
    )

    const invite = <strong style={{fontSize:'16px', fontWeight:450}}><span style={{fontSize:'20px'}}>{checkmark}</span>&nbsp;{setLT.joinWhoralyNow}</strong>
    const service1 = (
      <div className='d-flex' style={{flexWrap:w<s ? 'wrap' : '', lineHeight:'25px', textAlign: rtl ? 'justify' : ''}}>
        <div className={`${w<s ? '' : 'sticky-top'}`} style={{top:70, zIndex:'1', margin:'0px 0px 20px', padding:'10px', width: w<s ? '100%' : '50%' , height: w<s ? '100%' : '50%'}}>
          <img
            style={{margin:'0px 0px 20px', width:'100%' , height:'300px'}}
            src={require('../assets/images/other/ourServices.jpg')}
            alt="box making"
          />
          {w>s && invite}
          {/* googleAds && adsBox */}
          {/* {googleAds && w>s && <div style={{marginTop:'10px'}}>{adsBox}</div>} */}
        </div>
        <div className='d-flex justify-content-center bg3' style={{flexDirection:'column', alignItems:'center', padding:'10px', width: w<s ? '100%' : '50%' }}>
          <div style={{width:'100%', paddingBottom:'30px', lineHeight:'25px'}}>
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h1 style={{textAlign:'', marginBottom:'30px', fontSize:'30px', fontWeight:'bold'}}>{setLT.ourServices}</h1>
            </ScrollAnimation>
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h2 style={{fontSize:'20px', fontWeight:'bold'}}>{setLT.businessPageCreation}</h2>
              <p>{setLT.businessPageCreationDesc}</p>
            </ScrollAnimation>
            {hrS}
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h2 style={{fontSize:'20px', fontWeight:'bold'}}>Search Engine Visibility</h2>
              <p>Your ShiningPage will be indexed by search engines like Google, making it easily discoverable to potential target audience searching for your offerings online.</p>
            </ScrollAnimation>
            {hrS}
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h2 style={{fontSize:'20px', fontWeight:'bold'}}>{setLT.interactiveFeatures}</h2>
              <p>{setLT.interactiveFeaturesDesc}</p>
            </ScrollAnimation>
            {hrS}
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h2 style={{fontSize:'20px', fontWeight:'bold'}}>{setLT.multimediaIntegration}</h2>
              <p>{setLT.multimediaIntegrationDesc}</p>
            </ScrollAnimation>
            {hrS}
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h2 style={{fontSize:'20px', fontWeight:'bold'}}>{setLT.advertisementAndPromotion}</h2>
              <p>{setLT.advertisementAndPromotionDesc}</p>
            </ScrollAnimation>
            {hrS}
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h2 style={{fontSize:'20px', fontWeight:'bold'}}>{setLT.categoryManagement}</h2>
              <p>{setLT.categoryManagementDesc}</p>
            </ScrollAnimation>
            {hrS}
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h2 style={{fontSize:'20px', fontWeight:'bold'}}>{setLT.fileAttachments}</h2>
              <p>{setLT.fileAttachmentsDesc}</p>
            </ScrollAnimation>
            {hrS}
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h2 style={{fontSize:'20px', fontWeight:'bold'}}>{setLT.analyticsAndInsights}</h2>
              <p>{setLT.analyticsAndInsightsDesc}</p>
            </ScrollAnimation>
            {hrS}
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeIn'} animateOut='zoomOut'>
              <h2 style={{fontSize:'20px', fontWeight:'bold'}}>{setLT.customizationOptions}</h2>
              <p>{setLT.customizationOptionsDesc}</p>
              <div style={{fontWeight:'bold', marginBottom:'10px'}}>{setLT.businessColorsTagline}</div>
              <div className='d-flex ' style={{width:'100%', margin: '0px 0px 0px', padding:'0px', borderRadius:'5px', flexWrap:'wrap'}}>
                {colors}
              </div>
            </ScrollAnimation>
          </div>
          {w<s && invite}
        </div>
      </div>
    )

    const services = (
      <div className='allShadow' style={{backgroundImage: `url(${require("../assets/images/other/ourServices.jpg")})`, backgroundSize: 'cover', backgroundPosition: 'right'}}>
          <div style={{width:'100%', height:'100%', padding:'0px 0px', backgroundColor:'#ffffff99'}}>
            <div style={{width:'100%', height:'100%', padding:'70px 0px 40px', backgroundColor:'#ffffff99'}}>
                {servicesHeader}
                {service1}
            </div>
          </div>
      </div>
    )

    const headerPhoto = (
      <div className=''>
        <div className={`sticky-top backBlur animated ${t2<.5 ? 'fadeOut' : 'fadeIn'} ${pageYOffset===0 ? 'shine' : ''}`} style={{width:'100%', margin:'100px 0px 20px', padding:'20px', position:'fixed', zIndex:'0', backgroundColor:'#ffffff90'}}>
          <div style={{textAlign:'left'}}>
            <h1 className={`tx animated ${t2<.5 ? 'fadeOut' : 'zoomIn'}`} style={{fontSize:w<s ? (w<300 ? '28px' : '35px') : '55px', color:'#494949', marginBottom:'15px', fontWeight:'bold'}}>Sino.industrial Ltd.</h1>
            <h4 className={`txWhite animated ${t2<1 ? 'fadeOut' : 'fadeInLeft'}`} style={{fontSize:w<s ? '20px' : '26px', color:'#595858', marginBottom:w<s ? '20px' : '20px', fontWeight:'bold'}}>Leading in Construction and Industry</h4>
            <div className='d-flex' style={{alignItems:'center'}}>
                <MdPhoneInTalk className={`txWhite animated ${t2<1 ? 'fadeOut' : 'fadeIn'}`} style={{animationDelay:'.5s', color:'#595858', fontSize:w<s ? '25px' : '25px', margin:'-10px 0px 0px -5px ', transform: 'rotate(10deg)'}}/>&nbsp;&nbsp;
                {/* <div style={{}}>{loaderAlert}</div> */}
                <h4 className={`txWhite animated ${t2<1 ? 'fadeOut' : 'fadeInLeft'}`} style={{fontSize:w<s ? '20px' : '26px', color:'#303030', margin:'0px', fontWeight:'bold'}}>+44 7311 116623</h4>
            </div>
          </div>
        </div>

        <div style={{width: '100%', height: h+300, position:'fixed', marginTop:-top-h-70, backgroundImage: `url(${require("../assets/images/other/international.jpg")})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex:'-1'}}></div>
      </div>
    )

    const logo = (
      <div className='center'
        style={{margin: '0px 5px 15px', padding:'0px', borderRadius:'12px', alignItems:'center', padding:'5px'}}>
        <img
          style={{width:'70px', height:'70px'}}
          src='https://www.pix.shiningpage.com/whoraly/site/logo.png'
          alt="logo"
        />
      </div>
    )

    const header = (
        <div className={`animated fadeIn`} style={{animationDelay:'.5s', width:'100%', padding:'10px', margin:'0px'}}>
          <h1 className='animated fadeInDown txWhite tx' style={{animationDelay:'0s', fontWeight:450, fontSize: w<s ? '30px' : '40px', textAlign:'center', margin: '70px 0px 50px'}}>{setLT.globalLocalReach}</h1>
        </div>
    )


    const langClass = `nav center btnShadow animated ${rtl ? 'fadeInRight' : 'fadeInLeft'}`
    const flagStyle={objectFit: 'contain', width:'20px', height:'15px'}
    const languages = [
      { code: 'en', name: 'English', imgSrc: enImg, text: 'English' },
      { code: 'fa', name: 'فارسی', imgSrc: faImg, text: 'فارسی' },
      { code: 'ar', name: 'العربية', imgSrc: arImg, text: 'العربية' },
      { code: 'ru', name: 'Русский', imgSrc: ruImg, text: 'Русский' }
    ];
    const languageButtons = languages.map((lng, i) => (
      <div key={i} className={langClass}
        style={{
            width: '100px', height: '30px', alignItems: 'center', margin: '10px 7px', padding: '5px',
            borderRadius: '5px', animationDelay: `${(i+1) * 0.2}s`, border: '0px solid #00000090',
            backgroundColor: lng.code === lang ? '#ffffff' : '#ffffff99',
            color: lng.code === lang ? '#f2ba4b' : ''
        }}
        onClick={() => this.changeLanguage(lng.code)}
      >
        <img src={lng.imgSrc} alt={`${lng.name} flag`} style={flagStyle} />&nbsp;&nbsp;
        <span style={{ marginTop: '3px' }}>{lng.text}</span>
      </div>
    ));

    const langs = (
      <div className='center' style={{height:'', padding:'10px 0px', alignItems:'center', flexWrap:'wrap'}}>
        {languageButtons}
      </div>
    )

    const langBar = (
      <div className='' style={{zIndex:'1'}}>
          <Container className='center'>
              {langs}
          </Container>
      </div>
    )

    const versionConst = (
      <div className='center' style={{color:'#00b3e0', fontWeight:450, fontSize: w<s ? '' : '', margin: '0px 0px 20px', alignItems:'flex-end', whiteSpace:'nowrap', direction:'ltr' }}>
          <span style={{}}>Version-</span>
          <span style={{}}>{process.env.REACT_APP_VERSION}</span>
      </div>
    )

    // const intro = (
    //   <div className='animated fadeIn' style={{animationDelay:'.5s', width:'100%', padding:'10px', margin:'0px', backgroundColor:''}}>
    //     <div className='center ' style={{width:'100%', padding:'0px'}}>
    //       <Link to='/' className='center animated fadeIn btnShadow' style={{textDecoration:'none', animationDelay:'1.5s', width:'', padding:'20px', flexDirection:'column', alignItems:'center', backgroundColor:'#ffffff99', borderRadius:'10px'}}>
    //           {logo}
    //           <h1 className='txWhiteThin tx' style={{color:'#00c1f2', fontWeight:'bold', fontSize: w<s ? '40px' : '', textAlign:'center', margin:'0px'}}>Whoraly</h1>
    //           {versionConst}
    //           <h2 className='goldenText' style={{fontWeight:'bold', fontSize: w<s ? '30px' : '', textAlign:'center', margin: '0px'}}>Marketing Platform</h2>
    //       </Link>
    //     </div>
    //     <h5 className='center animated fadeInUpX' style={{animationDelay:'1s', fontWeight:450, alignItems:'center', margin: '20px 0px'}}>
    //       <GiCheckMark style={{color:'green', marginTop:'-10px', fontSize:'25px'}}/>&nbsp;
    //       <span>Select a language to enter</span>
    //     </h5>
    //     {langBar}
    //   </div>
    // )

    const logoMiddle = (
      <div className='center backBlur' style={{height:'300px', flexDirection:'column', alignItems:'center', margin:'0px', padding:'10px'}}>
          <ScrollAnimation animateOnce={false} delay={0} animateIn={w<s ? 'fadeInRight' : 'fadeInRight'} animateOut='fadeOut'>
            {logo}
          </ScrollAnimation>
          <ScrollAnimation animateOnce={false} delay={0} animateIn={w<s ? 'fadeInRight' : 'fadeInRight'} animateOut='fadeOut'>
            <div className='d-flex'>
              <div className="txWhite" style={{fontSize:w<s ? '30px' : '30px', fontWeight:'bold'}}>SHINING PAGE</div>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animateOnce={false} delay={w<s ? 500 : 0} animateIn={w<s ? 'fadeIn' : 'fadeInRight'} animateOut='fadeOut'>
            <div className='d-flex'>
              <div className="txWhite" style={{fontSize: w<s ? '25px' : '30px', fontWeight:450, textAlign: 'center'}}>{setLT.globalLocalReach}</div>
            </div>
          </ScrollAnimation>
      </div>
    )

    const whyChooseUsHeader = (
      <div style={{lineHeight:'25px', textAlign: rtl ? 'justify' : ''}}>
        <ScrollAnimation animateOnce={true} delay={0} animateIn='fadeInDown' animateOut='fadeOut'>
          <h1 className='txBlack' style={{color:'gold', textAlign:'center', marginBottom:'10px', fontSize: w<s ? '30px' : '35px', fontWeight:'bold'}}>
          {setLT.whyChooseUs}
          </h1>
        </ScrollAnimation>
        <ScrollAnimation animateOnce={true} delay={0} animateIn='fadeInDown' animateOut='fadeOut'>
            <Container style={{padding:'10px'}}>
                <h2 style={{textAlign:'center', marginBottom:'0px', fontSize: w<s ? '20px' : '25px', fontWeight:'bold'}}>
                {setLT.whoralyTagline}
                </h2>
            </Container>
        </ScrollAnimation>
        <ScrollAnimation animateOnce={true} delay={0} animateIn='fadeInUp' animateOut='fadeOut'>
            <Container style={{padding:'10px'}}>
                <p style={{textAlign:'', marginBottom:'30px'}}>
                {setLT.whyChooseUsDesc}
                </p>
            </Container>
        </ScrollAnimation>
      </div>
    )

    const invite2 = <strong style={{fontSize:'16px', fontWeight:450, lineHeight:'25px', textAlign: rtl ? 'justify' : ''}}><span style={{fontSize:'20px'}}>{checkmark}</span>&nbsp;{setLT.chooseWhoraly}</strong>
    const whyChooseUsText = (
      <div className='d-flex' style={{ marginBottom: w<s ? '0px' : '0px', padding:'0px 0px 50px', flexWrap:w<s ? 'wrap' : '', backgroundColor:'', color:''}}>
        <div className={`d-flex ${w<s ? '' : 'sticky-top'}`} style={{top:70, zIndex:'1', margin:'0px 0px 20px', padding:'10px', width: w<s ? '100%' : '50%' , height: w<s ? '100%' : '50%', flexDirection:'column'}}>
          <img
            style={{margin:'0px 0px 20px', width:'100%' , height:'100%'}}
            src={require('../assets/images/other/whyChooseUs.jpg')}
            alt="ShiningPage Why Choose Us"
          />
          {w>s && invite2}
          {/* {googleAds && adsBox} */}
        </div>
        <div className='d-flex justify-content-center bg3' style={{flexDirection:'column', alignItems:'center', padding:'10px', width: w<s ? '100%' : '50%' }}>
          <div style={{width:'100%', lineHeight:'25px', textAlign: rtl ? 'justify' : ''}}>
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h1 style={{textAlign:'', marginBottom:'10px', fontSize:'30px', fontWeight:'bold'}}>{setLT.ourAdvantages}</h1>
            </ScrollAnimation>
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <p style={{marginBottom:'30px'}}>{setLT.ourAdvantagesDesc}</p>
            </ScrollAnimation>
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h2 style={{fontSize:'20px', fontWeight:'bold'}}>✓ {setLT.innovativeSolutions}</h2>
              <p>{setLT.innovativeSolutionsDesc}</p>
            </ScrollAnimation>
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h2 style={{fontSize:'20px', fontWeight:'bold'}}>✓ {setLT.userFriendlyPlatform}</h2>
              <p>{setLT.userFriendlyPlatformDesc}</p>
            </ScrollAnimation>
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h2 style={{fontSize:'20px', fontWeight:'bold'}}>✓ {setLT.enhancedVisibility}</h2>
              <p>{setLT.enhancedVisibilityDesc}</p>
            </ScrollAnimation>
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h2 style={{fontSize:'20px', fontWeight:'bold'}}>✓ {setLT.engagingUserExperience}</h2>
              <p>{setLT.engagingUserExperienceDesc}</p>
            </ScrollAnimation>
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h2 style={{fontSize:'20px', fontWeight:'bold'}}>✓ {setLT.dedicatedSupport}</h2>
              <p>{setLT.dedicatedSupportDesc}</p>
            </ScrollAnimation>
          </div>
          {w<s && invite2}
        </div>
      </div>
    )

    const whyChooseUs = (
      <div className='allShadow' style={{backgroundImage: `url(${require("../assets/images/other/whyChooseUs.jpg")})`, backgroundSize: 'cover', backgroundPosition: 'right'}}>
          <div style={{width:'100%', height:'100%', padding:'0px 0px', backgroundColor:'#ffffff99'}}>
            <div style={{width:'100%', height:'100%', padding:'70px 0px 0px', backgroundColor:'#ffffff99'}}>
                {whyChooseUsHeader}
                {whyChooseUsText}
            </div>
          </div>
      </div>
    )

    const categoriesHeader = (
      <div>
          <ScrollAnimation animateOnce={true} delay={0} animateIn='fadeInDown' animateOut='fadeOut'>
              <h1 className='txBlack' style={{color:'gold', textAlign:'center', marginBottom:'10px', fontSize: w<s ? '30px' : '35px', fontWeight:'bold'}}>
              {setLT.category}
              </h1>
          </ScrollAnimation>
          <ScrollAnimation animateOnce={true} delay={0} animateIn='fadeInDown' animateOut='fadeOut'>
              <Container style={{padding:'10px'}}>
                  <h2 style={{textAlign:'center', marginBottom:'0px', fontSize: w<s ? '20px' : '25px', fontWeight:'bold', lineHeight:'30px'}}>
                  {setLT.whoralyTagline2}
                  </h2>
              </Container>
          </ScrollAnimation>
          <ScrollAnimation animateOnce={true} delay={0} animateIn='fadeInUp' animateOut='fadeOut'>
              <Container style={{padding:'10px', lineHeight:'25px', textAlign: rtl ? 'justify' : ''}}>
                  <p style={{textAlign:'', marginBottom:'30px'}}>
                  {setLT.platformDescription}
                  </p>
              </Container>
          </ScrollAnimation>
      </div>
    )

    const categoriesText = (
      <div className='d-flex' style={{flexWrap:w<s ? 'wrap' : ''}}>
        <div className={`d-flex ${w<s ? '' : 'sticky-top'}`} style={{top:70, zIndex:'1', margin:'0px 0px 20px', padding:'10px', width: w<s ? '100%' : '40%' , height: w<s ? '100%' : '25%', flexDirection:'column'}}>
          <img
            style={{margin:'0px 0px 20px', width:'100%' , height:'300px'}}
            src={require('../assets/images/other/category.jpg')}
            alt="category"
          />
          <strong style={{fontSize:'15px', fontWeight:450, lineHeight:'25px', textAlign: rtl ? 'justify' : ''}}><span style={{fontSize:'20px'}}>{checkmark}</span>&nbsp;{setLT.businessOpportunity}</strong>
          {/* {googleAds && <div style={{marginTop:'10px'}}>{adsBox}</div>} */}
          {/* {googleAds && w>s && <div style={{marginTop:'10px'}}>{adsBox}</div>} */}
        </div>
        <div className='d-flex justify-content-center bg3' style={{flexDirection:'column', alignItems:'center', padding:'10px', width: w<s ? '100%' : '60%' }}>
          <div style={{width:'100%', paddingBottom:'30px'}}>
            <ScrollAnimation animateOnce={true} delay={0} animateIn={w<s ? 'fadeInUp' : 'fadeInDown'} animateOut='zoomOut'>
              <h1 style={{textAlign:'', marginBottom:'30px', fontSize:'30px', fontWeight:'bold'}}>{setLT.categories}</h1>
            </ScrollAnimation>
              {categoriesItem}
            </div>
        </div>
      </div>
    )

    const categoriesSection = (
      <div className='allShadow' style={{backgroundImage: `url(${require("../assets/images/other/category.jpg")})`, backgroundSize: 'cover', backgroundPosition: 'right'}}>
          <div style={{width:'100%', height:'100%', padding:'0px 0px', backgroundColor:'#ffffff99'}}>
            <div style={{width:'100%', height:'100%', padding:'70px 0px 40px', backgroundColor:'#ffffff99'}}>
                {categoriesHeader}
                {categoriesText}
            </div>
          </div>
      </div>
    )

    return (
      <div>
        <ShiningpageCarousel />
        {/* {googleAds && adsBox} */}
        {welcome}
        {/* {googleAds && adsBox} */}
        <Brands/>
        {/* {googleAds && adsBox} */}
        {categoriesSection}
        {/* {googleAds && adsBox} */}
        {services}
        {/* {googleAds && adsBox} */}
        {logoMiddle}
        {whyChooseUs}
        {/* {googleAds && adsBox} */}
        <StarredAds/>
        <SiteView />
        {/* {googleAds && adsBox} */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mainUserId: state.userInfo['_id'],
    mainUser: state.userInfo,
    userInfo: state.userInfo,
    access: state.userInfo.access,
    subUserInfo: state.subUserInfo,
    userId: state.userInfo['_id'],
    businessType: state.userInfo.businessType,
    auth: state.auth,
    rtl: state.rtl,
    lang: state.lang,
    geo: state.geo,
    page: state.page,
    subject: state.subject,
    setLT: state.setLT,
    pageName: state.pageName,
    pageYOffset: state.pageYOffset,
    seenStatus: state.seenStatus,

  }
}

export default connect (mapStateToProps)(HomePage);
