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
    const { setLT } = this.props;
    const loader = <div className='loader-13'></div>

    // console.log(this.state.cgCompany18)
    const categoriesItem = categories.map((item, i) => (
      // console.log(item.index),
      <div key={i} className={`mb-[10px] ${w < s ? 'p-[10px]' : 'py-[10px] px-[20px]'} bg-[#ffffff10] rounded-[15px] border !border-white/20 `}>
        <li className="font-[450] mb-[20px]">{setLT[item.title]}</li>
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
    var allCompany = await company.map(
      (item, i) => {
          const root = item.businessType>0 ? 'publisher' : 'user'
          const usernameX = item.bizName ? item.bizName : item.username
          const userImg = (
              <div className={`C${item.fc} w-[35px] h-[35px] ${item.businessType > 0 ? 'rounded-[3px]' : 'rounded-full'} border border-[#99999940] p-[1px] overflow-hidden`}>
                  <img
                      className="object-contain w-full h-full"
                      src={ exist(item.profileIndex)
                          ? `https://www.pix.shiningpage.com/whoraly/profile/big/${item._id}-${item.profileIndex}.jpeg`
                          : item.genderValue===0 ? female : male
                      }
                      alt={usernameX}
                  />
              </div>
          )
          const country = (
            <div className='flex items-center h-[20px]'>
              <div className={`flag-icon flag-icon-${item.countryCode ? item.countryCode.toLowerCase() : ''} border border-[#99999950] text-[17px]`}></div>&nbsp;
              <div className="text-[12px] mt-[4px] leading-[20px]">{item.country ? item.country.toUpperCase() : ''}</div>
            </div>
          )
          const username = (
            <div className="m-0 leading-[20px]">
              {usernameX}
            </div>
          )

          const jobSummary = (
            <div className="m-0 leading-[20px]">
              {item.jobSummary}
            </div>
          )

          const link = (
            <a className='flex' href={`/${root}/${item.username}`} target="_blank" rel="noopener noreferrer">
              <span>{`https://shiningpage.com/${root}/${item.username}`}</span>
            </a>
          )

          return (
              <div key={i} className="mb-[20px] overflow-hidden">
                  <div className='flex'>
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
    var allPS = data.map(
      (item, i) => {
          const psImg = (
            <img
                className="object-cover w-[35px] h-[35px] rounded-[3px]"
                src={`https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictureType === 1 ? item.pictures[0] : item.pictures[1]}.jpeg`}
                alt={item.adsTitle}
            />
          )
          const title = (
            <div className="mt-[15px] leading-[20px]">
              {item.adsTitle}
            </div>
          )

          const link = (
            <a className='flex' href={item.slug ? `/publisher/${item.username}/${item.slug}` : `/ps/${item._id}`}
              target="_blank"
              rel="noopener noreferrer">
              <span>{item.slug ? `https://shiningpage.com/publisher/${item.username}/${item.slug}` : `https://shiningpage.com/ps/${item._id}`}</span>
            </a>
          )

          return (
              <div key={i} className="mb-[20px] overflow-hidden">
                  <div className='flex'>
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
    const { w, categoriesItem, allPS} = this.state
    const { setLT } = this.props

    const header = (
      <div className="center animated fadeInLeft [animation-delay:.5s] text-4xl font-extrabold tracking-tight my-[30px]">
        <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
          Sitemap
        </span>
      </div>
    )

    const psItems = (
      <div className={`mb-[10px] ${w < s ? 'p-[10px]' : 'py-[10px] px-[20px]'} bg-[#ffffff10] rounded-[15px] border !border-white/20`}>
        {allPS}
      </div>
    )

    const adsBox1 = <div className='adsbox'><AdsHorizontal id='adsH1' /></div>
    const adsBox2 = <div className='adsbox2'><AdsHorizontal id='adsH2' /></div>
    const adsBox3 = <div className='adsbox'><AdsHorizontal id='adsH3' /></div>
    const adsBox4 = <div className='adsbox'><AdsHorizontal id='adsH4' /></div>
    const adsBox5 = <div className='adsbox'><AdsHorizontal id='adsH5' /></div>

    return (
      <div>
        {/* {googleAds && adsBox1} */}
        <Container>
          {header}
          <div className={`animated fadeInUpX animated [animation-delay:.5s] mb-[30px] text-white font-thin bg-[#ffffff10] rounded-[20px] ${w < s ? 'p-[10px]' : 'py-[20px] px-[30px]'} leading-[30px] border !border-white/20`}>
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

            <div className="my-[30px]">
              {/* {googleAds && adsBox2} */}
            </div>

            <li>Contents/Products/Services</li>
            {psItems}

          </div>
        </Container>
        {/* {googleAds && adsBox3} */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mainUserId: state.userInfo['_id'],
    mainUser: state.userInfo,
    auth: state.auth,
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
