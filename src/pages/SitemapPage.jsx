import React, { Component } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { setSubject, setAddress, setPageTitle, setPage } from '../dataStore/actions';
import siteView from '../modules/siteView';
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';
import { exist } from '../helper';
import { AdsHorizontal } from '../components/GoogleAds';
import { checkSeen } from '../helper';
import { serverURL, s, categories, googleAds } from '../srcSet';

class SitemapPage extends Component {
    
  state = {
    w: window.innerWidth,
    h: window.innerHeight,
    pageName: this.props.setLT.sitemap,
  }

  componentDidMount = async () => {
    window.scrollTo(0, 0)
    window.addEventListener("resize", this.onResize)
    await this.props.dispatch(setPageTitle(`${this.state.pageName} | ShiningPage`))
    await this.props.dispatch(setPage('sitemap'))
    await this.props.dispatch(setSubject('sitemap'))
    await this.props.dispatch(setAddress({ content:[], fix:this.state.pageName }))
    // if(this.props.auth && this.props.mainUser.ruby) checkSeen('sitemap', this.props.seenStatus, this.props.dispatch)
    siteView(this.props)
    await this.mapCategories()
    const indexArray = categories.map(category => category.index);
    for (let i = 0; i < indexArray.length; i++) {
      const index = indexArray[i];
      await this.getCategory(index);
    }

    this.getPS()
  }

  linkMaker = (text, link) => {
    return <Link to={link} className='link-underline'>{text}</Link>
  }

  onToggleWebPage = async (user) => {
    const root = user.businessType>0 ? 'publisher' : 'user'
    window.open(`/${root}/${user.username}`);
  }

  mapCategories = async () => {
    const { w } = this.state
    const { rtl, setLT, lang } = this.props;
    const loader = <div className='loader-13' style={{margin: '0px', color:'', transform: rtl ? 'rotate(180deg)' : ''}}></div>

    // console.log(this.state.cgCompany18)
    const categoriesItem = categories.map((item, i) => (
      // console.log(item.index),
      <div key={i} style={{ marginBottom:'10px', padding:w<s ? '10px' : '10px 20px', backgroundColor:'#ffffff99', borderRadius:'5px' }}>
        <li style={{ fontWeight:450, marginBottom:'20px' }}>{setLT[item.title]}</li>
        {this.state[`cgCompany${item.index}`] ? this.state[`cgCompany${item.index}`] : loader}
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
        // console.log(888, x, data)
        // this.setState({
        //   [`cg${x}Data`]: data,
        // //   [`cg${x}`]: true,
        // })
        await this.mapCompany(x, data)
        await this.mapCategories()
    })
  }

  mapCompany = async (x, company) => {
    const {w, } = this.state
    const {lang, rtl, setLT} = this.props
      var allCompany = await company.map(
        (item, i) => {
            const root = item.businessType>0 ? 'publisher' : 'user'
            const usernameX = item.bizName ? item.bizName : item.username
            const userImg = (
                <div className={`C${item.fc}`} style={{width:"35px", height:"35px", borderRadius: item.businessType>0 ? '3px' : '100px', border:'1px solid #99999940', padding:'1px', overflow:'hidden'}}>
                    <img
                        style={{objectFit: 'contain', width:'100%', height:'100%'}}
                        src={ exist(item.profileIndex)
                            ? `https://www.pix.shiningpage.com/whoraly/profile/big/${item._id}-${item.profileIndex}.jpeg`
                            : item.genderValue===0 ? female : male
                        }
                        alt={usernameX}
                    />
                </div>
            )
            const country = (
              <div className='d-flex' style={{alignItems:'center', height:'20px'}}>
                <div className={`flag-icon flag-icon-${item.countryCode ? item.countryCode.toLowerCase() : ''}`} style={{border:'1px solid #99999950', fontSize:'17px'}}></div>&nbsp;
                <div style={{fontSize:'12px', marginTop:'4px', lineHeight:'20px'}}>{item.country ? item.country.toUpperCase() : ''}</div>
              </div>
            )
            const username = (
              <div className='' style={{margin:'0px', lineHeight:'20px'}}>
                {usernameX}
              </div>
            )

            const jobSummary = (
              <div className='' style={{margin:'0px', lineHeight:'20px'}}>
                {item.jobSummary}
              </div>
            )

            const link = (
              <a className='d-flex' href={`/${root}/${item.username}`} target="_blank" rel="noopener noreferrer">
                <span style={{direction:'ltr'}}>{`https://shiningpage.com/${root}/${item.username}`}</span>
              </a>
            )

            return (
                <div key={i} style={{marginBottom:'20px', overflow:'hidden'}}>
                    <div className='d-flex'>
                        {userImg}&nbsp;&nbsp;
                        <div>
                            {country}
                            {username}
                        </div>
                    </div>
                    {jobSummary}
                    {link}
                </div>
            )
        }
    )
    
    this.state[`cgCompany${x}`] = allCompany
  }

  getPS = () => {
    axios.post(`${serverURL}/ads/getAllAds`).then(async res => {
        var data = res.data
        this.mapPS(data)
    })
  }

  mapPS = (data) => {
    const {w, } = this.state
    const {lang, rtl, setLT} = this.props
      var allPS = data.map(
        (item, i) => {
            const psImg = (
              <img
                  style={{objectFit: 'cover', width:'35px', height:'35px', borderRadius:'3px'}}
                  src={`https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictureType === 1 ? item.pictures[0] : item.pictures[1]}.jpeg`}
                  alt={item.adsTitle}
              />
            )
            const title = (
              <div className='' style={{marginTop:'15px', lineHeight:'20px'}}>
                {item.adsTitle}
              </div>
            )

            const link = (
              <a className='d-flex' href={item.slug ? `/publisher/${item.username}/${item.slug}` : `/ps/${item._id}`}
                target="_blank"
                rel="noopener noreferrer">
                <span style={{direction:'ltr'}}>{item.slug ? `https://shiningpage.com/publisher/${item.username}/${item.slug}` : `https://shiningpage.com/ps/${item._id}`}</span>
              </a>
            )

            return (
                <div key={i} style={{marginBottom:'20px', overflow:'hidden'}}>
                    <div className='d-flex'>
                        {psImg}&nbsp;&nbsp;
                        <div>
                            {/* country */}
                            {title}
                        </div>
                    </div>
                    {link}
                </div>
            )
        }
    )

    this.setState({ allPS })
  }


  onResize = () => {
    this.setState({
      w: window.innerWidth,
      h: window.innerHeight,
    })
  }

  render() {
    const { w, h, categoriesItem, allPS} = this.state
    const { rtl, lang, setLT, } = this.props

    const header = (
      <div className='center' style={{alignItems:'center', flexDirection:'column', padding: '0px 10px'}}>
        <div className='d-flex' style={{justifyContent:rtl ? 'space-between' : 'flex-end', alignItems:'center', width:'100%', direction:'rtl'}}>
          <h1 className='animated fadeInLeft tx' style={{animationDelay:'.5s', color:'#ffffff', fontWeight:'bold', fontSize: w<s ? '30px' : '', textAlign:'center', margin:'30px 10px 30px'}}>{setLT.sitemap}</h1>
        </div>
      </div>
    )

    const psItems = (
      <div style={{ marginBottom:'10px', padding:w<s ? '10px' : '10px 20px', backgroundColor:'#ffffff99', borderRadius:'5px' }}>
        {allPS}
      </div>
    )

    const adsBox1 = <div className='adsbox'><AdsHorizontal id='adsH1' /></div>
    const adsBox2 = <div className='adsbox2'><AdsHorizontal id='adsH2' /></div>
    const adsBox3 = <div className='adsbox'><AdsHorizontal id='adsH3' /></div>
    const adsBox4 = <div className='adsbox'><AdsHorizontal id='adsH4' /></div>
    const adsBox5 = <div className='adsbox'><AdsHorizontal id='adsH5' /></div>

    return (
      <div style= {{direction:'ltr'}}>
        {googleAds && adsBox1}
        <Container style={{padding:w<s ? '0px' : ''}}>
          <div className='center' style={{flexDirection:'column', alignItems:'center'}}>
            {header}
          </div>
          <div className='animated fadeInUpX' style={{animationDelay:'.5s', margin:'0px 5px 30px', padding:'10px', fontFamily:'Vazir', top:'50px', zIndex:'0', backgroundColor:'#ffffff99', borderRadius:'5px'}}>
            <div style={{backgroundColor:'#ffffff99', borderRadius:'5px', padding:w<s ? '10px' : '20px 30px', lineHeight:'30px'}}>
              {this.linkMaker(setLT.home, '/')}
              <li>{setLT.publicSection}</li>
              <ul>
                <li>{this.linkMaker('Latest posts', `/latest`)}</li>
                <li>{this.linkMaker(setLT.about, `/about`)}</li>
                <li>{this.linkMaker(setLT.contact, `/contact`)}</li>
                <li>{this.linkMaker(setLT.memberReviews, `/reviews`)}</li>
                <li>{this.linkMaker(setLT.ruby, `/ruby`)}</li>
                <li>{this.linkMaker(setLT.notifications, `/notification`)}</li>
                <li>{this.linkMaker(setLT.chatList, `/chat`)}</li>
                <li>{this.linkMaker(setLT.tos, `/tos`)}</li>
                <li>{this.linkMaker(setLT.privacyPolicy, `/privacy`)}</li>
                <li>{this.linkMaker(setLT.disclaimer, `/disclaimer`)}</li>
                <li>{this.linkMaker(setLT.sitemap, `/sitemap`)}</li>
              </ul>

              <li>Business Members / Owners</li>
              {categoriesItem}

              <div style={{margin:'30px 0px'}}>
                {googleAds && adsBox2}
              </div>

              <li>Contents/Products/Services</li>
              {psItems}

            </div>
          </div>
        </Container>
        {googleAds && adsBox3}
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

export default connect (mapStateToProps)(SitemapPage);
