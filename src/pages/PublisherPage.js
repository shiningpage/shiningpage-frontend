import React, { Component, createRef } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../assets/css/webPage.css';
import aboutUsImg from '../assets/images/other/aboutUs.jpeg';
import userN from '../assets/images/other/user1.png';
import rubyS from '../assets/images/other/rubyS.png';
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';
import { setUserInfo, setSubUserInfo, setSubChatInfo, setToggleChat, setSubject, setPageTitle, setPage,
    setSendMessage, setPageYOffset } from '../dataStore/actions';
import {MdAttachFile, MdPhoneInTalk, MdPhonelinkRing } from 'react-icons/md';
import { IoLogoWhatsapp } from 'react-icons/io';
import { FaUsers, FaLinkedin, FaYoutube, FaFacebook, FaWhatsapp,
    FaBars, FaInstagram, FaTelegram } from 'react-icons/fa';
import { BsChat } from 'react-icons/bs';
import { GiGlobe } from 'react-icons/gi';
import { AiFillProduct, AiFillHome } from 'react-icons/ai';
import { TbBrandBooking } from "react-icons/tb";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import siteView from '../modules/siteView';

import pixSave from '../modules/pixSave';
import pixDelete from '../modules/pixDelete';
import pixHandler from '../modules/pixHandler';
import pixResizer from '../modules/pixResizer';

import QRCodeX from '../components/QRCodeX';
import StatisticsSub from '../components/web/StatisticsSub';
import SocialMedia from '../components/SocialMedia';
import ContactSub from '../components/web/ContactSub';
import AttachmentSub from '../components/web/AttachmentSub';
import FeaturesSub from '../components/web/FeaturesSub';
import NavbarSub from '../components/web/NavbarSub';
import PsSub from '../components/web/psSub/PsSub';
import SharePage from '../components/SharePage';
import WebCarousel from '../components/WebCarousel';
import EditBtn from '../components/EditBtn';
import RubyCollector from '../components/RubyCollector';
import AdsBoxSub from '../components/AdsBoxSub';

import ModalZoomProfileImage from '../components/modals/ModalZoomProfileImage';
import ModalBasicInformation from '../components/modals/ModalBasicInformation';
import ModalAboutInfo from '../components/modals/ModalAboutInfo';
import ModalActivitySummary from '../components/modals/ModalActivitySummary';
import ModalTeam from '../components/modals/ModalTeam';

import UpdateVersion from '../components/UpdateVersion';
import ModalSidebarWeb from '../components/modals/ModalSidebarWeb';
import RenderContent from '../components/RenderContent';

import { AdsHorizontal } from '../components/GoogleAds';
import { exist, mapTeam, addNotification, totalFileSize, scrollTo, countAllAds, countAllVideo, countAllInsta, checkSeen } from '../helper';
import { totalPrice, updateCategoryItems } from '../components/web/psSub/psHelper';
import { serverURL, s, NavH, colors, mapColors, lightColors, designedByColors, googleAds } from '../srcSet';

class PublisherPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            w: document.body.clientWidth,
            h: document.body.clientHeight,
            userWebPage: false,
            searchData: [],
            searchItems:'',
            showPSPos: {},
            headerTop:0,

            nAds: 1,
            nVideo: 1,
            nInsta: 1,
            nAdsSub: 1,
            nVideoSub: 1,
            nInstaSub: 1,
            nAdsSearch: 1,
            nVideoSearch: 1,
            nInstaSearch: 1,

            allAds:[],
            allVideo:[],
            allInsta:[],
            searchAds:[],
            searchVideo:[],
            searchInsta:[],
            userCategoryId: 'All',
            lang: this.props.lang,
            toggleZoomProfileImage: false,
            toggleBasicInformation: false,
            toggleAboutInfo: false,
            toggleActivitySummary: false,
            toggleTeam: false,
            username: '',
            email: this.props.email,

            isSidebarOpen: false,
            notFound: false,
            team: [],
            teamMembers: [],

        };

        this.sidebarRef = createRef(); // مرجع برای سایدبار
    }

    async componentDidMount() {
        window.scrollTo(0, 0)
        // this.props.dispatch(setPageYOffset(0))
        const userInfo = this.getUsername()

        const userName = userInfo.p1
        const root = userInfo.p2

        // const notFoundArr = ['undefined', 'marisa']
        // if (notFoundArr.includes(userName)) {
        //     this.NotFound()
        //     return;
        // }
        setTimeout(async() => { // setTimeout برای اجرای کامل scrollToTop است
            document.addEventListener('mousedown', this.handleClickOutside); // ثبت event listener
            window.addEventListener("resize", this.onResize)
            window.addEventListener('scroll', this.handleScroll)
            await this.props.dispatch(setPage('publisher'))
            await this.props.dispatch(setSubUserInfo([]))
            await this.getProfile(userName, root)
            await this.props.dispatch(setSubject(`${this.props.page}-${this.state.username}`))
            siteView(this.props)
        }, 500);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
        document.removeEventListener('mousedown', this.handleClickOutside); // حذف event listener
    }

    componentDidUpdate = async (prevProps) => {
        const { subUserInfo, objects, id, userServiceSelected } = this.props;
        if (subUserInfo !== prevProps.subUserInfo) {
            const { fc, jobSummary, biography, phone, celphone, instagram, telegram,
                facebook, youtube, linkedin,
            } = subUserInfo;
    
            this.setState({ fc, jobSummary, biography, phone, celphone, instagram,
                telegram, facebook, youtube, linkedin, });
        }
    };

    handleClickOutside = (event) => {
        if (
            this.sidebarRef.current && // اگر مرجع وجود دارد
            !this.sidebarRef.current.contains(event.target) // و کلیک خارج از سایدبار است
        ) {
            this.setState({ isSidebarOpen: false }); // بستن سایدبار
        }
    };

    handleScroll = async () => {
        const w = window.innerWidth
        const h = window.innerHeight
        const scrollDirection = this.props.scrollDirection
        const header = document.getElementById("header");
        const headerTop = header.getBoundingClientRect().top;
        this.setState({ headerTop })
        const categoryTape = document.getElementById("categoryTape");
        const categoryTapeTop = categoryTape.getBoundingClientRect().top;

        const menuBtn = document.getElementById('menuBtn')
        const psSub = document.getElementById('psSub');
        const psSubTop = psSub.getBoundingClientRect().top;
        const attachmentsSub = document.getElementById('attachmentsSub');
        const attachmentsSubTop = attachmentsSub ? attachmentsSub.getBoundingClientRect().top : 0;
        const statisticsSub = document.getElementById('statisticsSub');
        const statisticsSubTop = statisticsSub ? statisticsSub.getBoundingClientRect().top : 0;
        const { categoryItems, psSubActive, statisticsSubActive, attachmentItems, attachmentsSubActive } = this.state
        if(psSubTop < h - 100 && categoryItems && (this.state.adsN!==undefined && this.state.videoN!==undefined && this.state.instaN!==undefined) && !psSubActive) {
            this.setState({ psSubActive: true })
        }
        if(attachmentsSubTop < h - 100 && attachmentItems && !attachmentsSubActive) {
            this.setState({ attachmentsSubActive: true })
        }
        if(statisticsSubTop < h - 100 && !statisticsSubActive) {
            this.setState({ statisticsSubActive: true })
        }

        if(headerTop<-100) {
            menuBtn.classList.add('animated');
            menuBtn.classList.add('fadeInDown');
            menuBtn.classList.add('btnShadow');
            menuBtn.style.width = '50px'
            menuBtn.style.zIndex = '1000'
            menuBtn.style.margin = `${w<s ? (scrollDirection==='up' ? 57 - 46 : 57) : NavH + 10}px ${w<s ? 10 : 0}px 0px`
            // if(categoryTapeTop < 100 && categoryTapeTop > -100) {
            //     menuBtn.style.margin = '3px'
            // }
        } else {
            menuBtn.classList.remove('animated');
            menuBtn.classList.remove('fadeInDown');
            menuBtn.classList.remove('btnShadow');
            menuBtn.style.margin = '0px'
            menuBtn.style.zIndex = ''
        }

    }

    getUsername = () => {
        var pth = window.location.href;//.replace('#/', '')
        var parts = pth.split('/');
        // var username = pth.substring(pth.lastIndexOf('/') + 1);
        var p1 = parts.slice(-1).shift()
        var p2 = parts.slice(-2).shift()
        var p3 = parts.slice(-3).shift()
        // console.log('p1: ', p1)
        // console.log('p2: ', p2)
        // console.log('p3: ', p3)
        return {p1, p2}
    }

    getProfile = async (userName, root) => {
        if(userName.trim()!=="") {
            await this.getUsernameInfo(userName, root)
        }
    }

    NotFound = async () => {
        this.setState({ notFound: true }) // نمایش صفحه خطا
        await axios.post(`${serverURL}/err404`) // ارسال گزارش خطا
    }

    getTeam = async (teamArr=[]) => {
        const { mainUser, subUserInfo } = this.props
        const me = mainUser._id && subUserInfo._id && mainUser._id===subUserInfo._id ? true : false
		// console.log('mainUser._id: ', mainUser._id)
		// console.log('subUserInfo._id: ', subUserInfo._id)
		// console.log('me: ', me)

        var team=[]
        for(var a=0; a<teamArr.length; a++) {
		  var _id = teamArr[a]
		  await axios.post(`${serverURL}/user/getUserInfo`, {_id}).then( async res => {
			delete res.data.password
			team.push(res.data)
		  })
		}
        this.setState({ team })
        const teamMembers = mapTeam(team, this.state.w, s, this.onDeleteTeam, me)
        this.setState({ teamMembers })
    }

    getUsernameInfo = async (p1, root) => {
        // console.log('p1: ', p1)
        window.scrollTo(0, 0);
        if (!p1) {
            this.NotFound()
            return;
            // console.error('p1 is undefined or empty');
            // window.location.href = `/404`;
        }
        try {
            const res = await axios.get(`${serverURL}/user/getUsernameInfo/` + p1);
            if (res.data === 'User not found') {
                this.NotFound()
                return;
                // window.location.href = `/404`;
                // return;

                // console.log(2)
                // this.props.dispatch(setPage404(true))
                // const pth = window.location.href;
                // axios.post(`${serverURL}/err404`)
                // .then(async res => {
                //     console.log('err404 is done')
                // })

                // setTimeout(async () => {
                //     window.location.href=`/404`
                //     // window.history.pushState({}, null, pth);
                // }, 3000);
            }

            delete res.data.password
            // console.log('nnn', res.data.businessType)
            if (res.data.businessType === 0 && root!=='user') {
                window.location.href = `/user/${res.data.username}`;
            }
            if (root==='user') {
                this.props.dispatch(setPage('user'))
            }
            res.data.attachmentsTotalSize = totalFileSize(res.data.attachmentItems)

            const categoryArray = await axios.get(`${serverURL}/user/getCategoryQty/` + res.data._id);
            // console.log('category: ', categoryArray.data)
            // res.data.categoryItems = categoryArray.data.items ?? [];
            res.data.categoryItems = updateCategoryItems(categoryArray.data.items ?? [], this.props.userServiceSelected)
            res.data.totalAds = categoryArray.data.totalAds
            res.data.totalVideo = categoryArray.data.totalVideo
            res.data.totalInstagram = categoryArray.data.totalInstagram
            res.data.totalContents = categoryArray.data.totalQty
            // console.log('categoryItems: ', res.data)
            // console.log('userServiceSelected: ', this.props.userServiceSelected)
            await this.props.dispatch(setSubUserInfo(res.data))
            // res.data.fc = fcIndex
            const txBlack = lightColors.includes(res.data.fc) ? true : false
            // console.log('mainUserId',this.props.mainUserId)
            // console.log('subUserId',this.props.userId)
            // console.log('auth',this.props.auth)
    
            // بعلت امنیت در دسترسیی به ویرایش اطلاعات ، این بخش غیر فعال شد.
            // if(this.props.mainUserId===this.props.userId) {
            //     await this.props.dispatch(setUserInfo(res.data))
            //     const countryInfo = {
            //         countryCode: res.data.countryCode,
            //         country: res.data.country,
            //         continent: res.data.continent
            //     }
            //     this.props.dispatch(setCountry(countryInfo))
            //     this.setState({
            //         userWebPage: true
            //     })
            // }
            if(res.data.businessType>0) this.getTeam(res.data.team)


            const {_id, username, bizName, businessType, application, fc, genderValue,
                email, phone, celphone, whatsapp, website, telegram, instagram, facebook,
                youtube, linkedin, jobSummary, biography, continent, country, countryCode,
                city, address, categoryItems, attachmentItems, siteLink, } = res.data

            if(this.props.auth && this.props.mainUser.ruby) checkSeen(`${username}`, this.props.seenStatus, this.props.dispatch)
            const setStateAsync = (stateUpdate) => {
                return new Promise((resolve) => {
                    this.setState(stateUpdate, resolve);
                });
            };
            await setStateAsync(() => ({
                txBlack,
                username, bizName, fc, genderValue, email, phone, celphone, whatsapp,
                website, telegram, instagram, facebook, youtube, linkedin, jobSummary,
                biography, continent, country, countryCode, city, address, categoryItems,
                attachmentItems, siteLink, application,
                userId: _id,
                businessTypeBiz: businessType,
                appN: application ? application.length : 0,
                profileData: true,
            }));

            this.props.dispatch(setPageTitle(`${this.state.bizName ? this.state.bizName : this.state.username} | ${this.state.jobSummary ? this.state.jobSummary : 'JobSummary ...'}`))
            await this.updatePsCount()
            this.countViewers()
            await this.addViewProfile()
            const { fullAccess, mainUser, userId, geo } = this.props
            addNotification('bizPage', 'view', fullAccess, mainUser, userId, geo)
        } catch (error) {
            console.error('Error fetching user info:', error);
            this.NotFound()
            // console.error('Error fetching user info:', error);
            // window.location.href = `/404`;
        }
    }

    updatePsCount = async() => {
        const countAllAdsData = await countAllAds(this.props.userId)
        this.setState({
            adsN: countAllAdsData,
            adsNCat: countAllAdsData
        })
        const countAllVideoData = await countAllVideo(this.props.userId)
        this.setState({
            videoN: countAllVideoData,
            videoNCat: countAllVideoData
        })
        const countAllInstaData = await countAllInsta(this.props.userId)
        this.setState({
            instaN: countAllInstaData,
            instaNCat: countAllInstaData
        })
    }
    countViewers = async () => {
        axios.post(`${serverURL}/view/countProfileViewers`, {userId:this.props.userId}).then(res => {
            this.setState({
                viewN: res.data.map(n => n.view).reduce((a, b) => a + b, 0),
                gettingView: false,
            })
        })
    }

    addViewProfile = async () => {
        if(!this.props.fullAccess){
            var data = {
                viewer: this.props.mainUserId!==undefined ? this.props.mainUserId : 'unknown',
                viewee: this.props.userId,
            }
            if(this.props.mainUserId===undefined) {
                data.countryCodeZ = this.props.geo.countryCode ? this.props.geo.countryCode : this.props.subUserInfo.countryCode
                data.countryZ = this.props.geo.country ? this.props.geo.country : this.props.subUserInfo.country
            }
            if(data.viewer!==data.viewee) axios.post(`${serverURL}/view/addViewProfile`, data).then(res => {})
        }
    }

    onToggleChat = async () => {
        if(!this.props.auth) {
            this.props.dispatch(setSendMessage(true))
        } else {
            this.props.dispatch(setSubChatInfo(this.props.subUserInfo))
            this.props.dispatch(setToggleChat(true))
        }
    }

    onToggleWhatsApp = async () => {
        var phoneNumber = this.state.whatsapp;
        if(phoneNumber) {
            phoneNumber = phoneNumber.trim()
            .replace(/\s/g, '')
            .replace(/^0+/, '')
            .replace(/^00+/, '')
            .replace(/^\+/, '')

            var whatsappUrl = `https://wa.me/${phoneNumber}`;
            window.open(whatsappUrl, '_blank');
        }
    }

    onToggleCall = async (nx) => {
        var phoneNumber = nx;
        if(phoneNumber) {
            phoneNumber = phoneNumber.trim()
            .replace(/\s/g, '')

            window.location.href = `tel:${phoneNumber}`;
        }
    }

    onSetSidebarOpen = async (section, sidebarOff) => {
        if(!sidebarOff) this.onMenu()
        setTimeout(async () => {
            scrollTo(section)
        }, 300);
    }

    onMenu = async () => {
        this.setState((prevState) => ({ isSidebarOpen: !prevState.isSidebarOpen }));
    }

    toggleZoomProfileImage = () => {
        this.setState({
            toggleZoomProfileImage: !this.state.toggleZoomProfileImage,
            profileImageArray: [],
        });
    }

    toggleBasicInformation = () => {
        this.setState({
            toggleBasicInformation: !this.state.toggleBasicInformation,
        });
    }

    onToggleAboutInfo = () => {
        this.setState({
            toggleAboutInfo: !this.state.toggleAboutInfo,
        });
    }

    onToggleActivitySummary = () => {
        this.setState({
            toggleActivitySummary: !this.state.toggleActivitySummary,
        });
    }

    onToggleTeam = () => {
        this.setState({
            toggleTeam: !this.state.toggleTeam,
        });
    }

    onDeleteTeam = (i) => {
        this.setState({ teamDeleting: true })
        const { mainUser } = this.props
        var teamIds = mainUser.team
        var target = teamIds.splice(i, 1)

        const user = {
            userId: mainUser._id,
            team: teamIds
        }

        axios.post(`${serverURL}/userPanel/update`, user)
        .then((res) => {
            delete res.data.password
            this.props.dispatch(setUserInfo(res.data))
            this.props.dispatch(setSubUserInfo(res.data))
            this.getTeam(res.data.team)
            this.setState({ teamDeleting: false })
        })
    }

    onResize = async () => {
        this.setState({ w: document.body.clientWidth })
    }

    render() {
        const {w, h, fc, visible, notFound, isSidebarOpen, gettingView, userWebPage, headerTop, statisticsSubActive, psSubActive,
            attachmentsSubActive, siteLink, profileData, txBlack, adsN, videoN, instaN, viewN, businessTypeBiz,
            countryCode, country, jobSummary, biography, phone, celphone, whatsapp,toggleZoomProfileImage,
            toggleBasicInformation, toggleAboutInfo, toggleActivitySummary, toggleTeam, instagram, telegram,
            facebook, youtube, linkedin, team, teamMembers, 
        } = this.state;
        const {rtl, lang, setLT, pageYOffset, fullAccess, geo, userId, mainUser, mainUserId, subUserInfo, auth,
            userServiceSelected, 
         } = this.props;
        // var fc = 16
        // console.log(fc)

        const me = mainUser._id && subUserInfo._id && mainUser._id===subUserInfo._id ? true : false
        // console.log(mainUser._id, subUserInfo._id)
        // console.log(me)
        const titleStyle = {fontSize:'30px', fontWeight:450, margin:'0px 0px 15px', textAlign: rtl ? 'right' : 'left', alignItems:'center', whiteSpace:'', color:'', width:'100%'}
        const mainGenderX = mainUser.genderValue!==undefined ? (mainUser.genderValue===0 ? female : male) : userN
        const subGenderX = subUserInfo.genderValue!==undefined ? (subUserInfo.genderValue===0 ? female : male) : userN
        const alertWhite = <div className={`loader-07`} style={{margin: '', width:'100px', height:'100px', position:'absolute', marginTop:'0px', color:'white'}}></div>

        const hr = <div className={`C${fc===11 ? 7 : fc}`} style={{width:'100%', minWidth:'250px', height:'2px', margin:'5px 0px'}}></div>
        const updateVersion = (
            <div className='' style={{padding:'0px 15px', marginBottom:'30px'}}>
                <UpdateVersion/>
            </div>
        )

        const logoBox = (
            <div className='center C11'
                style={{minWidth:'45px', maxWidth:'45px', minHeight:'45px', maxHeight:'45px', borderRadius:'6px', alignItems:'center', padding:'2px'}}>
                <img
                    style={{width:'100%', height:'100%', marginTop:'0px'}}
                    src='https://www.pix.shiningpage.com/whoraly/site/logo.png'
                    alt="ShiningPage Logo"
                />
            </div>
        )
        const logoSide = (
            <Link to='/' className='d-flex' style={{color:'#916307', alignItems:'center'}}>
                {logoBox}
                <div className='center' style={{ fontSize:'14px', fontWeight:450, alignItems:'center', flexDirection:'column' }}>
                    <span style={{fontSize:'18px', marginBottom:'-2px'}}>ShiningPage</span>
                    <div className='C14' style={{maxWidth:'100px', minWidth:'100px', height:'3px'}}></div>
                    <span style={{marginTop:'2px'}}>Version {process.env.REACT_APP_VERSION}</span>
                </div>
            </Link>
        )

        const usernameX = subUserInfo.bizName ? subUserInfo.bizName : subUserInfo.username
        const userX = (
            <div className={`tx f${fc===11 ? 7 : fc}`} style={{fontSize:'20px', fontWeight:'bold', margin:'', color:''}}>
                {profileData && usernameX ? usernameX.toUpperCase() : ''}
            </div>
        )

        const aboutImgSrc = profileData
            ?
                subUserInfo.aboutIndex
                ? `https://www.pix.shiningpage.com/whoraly/about/big/${subUserInfo._id}-${subUserInfo.aboutIndex}.jpeg`
                : subUserInfo.profileIndex
                    ? `https://www.pix.shiningpage.com/whoraly/profile/big/${subUserInfo._id}-${subUserInfo.profileIndex}.jpeg`
                    : aboutUsImg
            : ''

        // var nx = Number(adsN) +  Number(videoN) +  Number(instaN)

        const srcMainUser = exist(mainUser.profileIndex)
                            ? `https://www.pix.shiningpage.com/whoraly/profile/big/${mainUser._id}-${mainUser.profileIndex}.jpeg`
                            : mainGenderX

        const srcSubUser = exist(subUserInfo.profileIndex)
                            ? `https://www.pix.shiningpage.com/whoraly/profile/big/${subUserInfo._id}-${subUserInfo.profileIndex}.jpeg`
                            : subGenderX
    
        const UserProfileImage = (
            <div style={{position:'relative', cursor:'pointer'}}>
                {me && !isSidebarOpen && <EditBtn rtl={rtl} size={20} fontSize='10px' top={0} right={0} onClick={() => !isSidebarOpen ? this.toggleZoomProfileImage() : null}/>}
                <img
                    className = ''
                    style={{objectFit: 'cover', maxWidth:'50px', minWidth:'50px', maxHeight:'50px', minHeight:'50px', borderRadius:businessTypeBiz>0 ? '3px' : '100px', border:`1px solid #99999930`, margin:'0px'}}
                    src={this.props.mainUserId===this.props.userId
                        ? srcMainUser
                        : srcSubUser
                    }
                    alt={`${subUserInfo.username} image`}
                    onClick={() => this.toggleZoomProfileImage()}
                />
            </div>
        )

        const countryConst = (
            <div className='d-flex ' style={{alignItems:'flex-end', height:'', justifyContent:'flex-start', margin:'0px 0px 3px', whiteSpace:'nowrap'}}>
                <div className={`flag-icon flag-icon-${countryCode ? countryCode.toLowerCase() : ''} ${subUserInfo._id ? '' : ''}`} style={{width:'', border:'1px solid #99999950', fontSize:'17px'}}></div>&nbsp;
                {w>300 && <div style={{fontSize:'12px', color: ''}}>{country ? country.toUpperCase() : ''}</div>}
            </div>
        )
        const usernameConst = (
            <div className='' style={{width:w<s ? '' : '', fontSize:'18px', fontWeight:400, margin:'0px', color:'', whiteSpace:'nowrap', overflow:'scroll'}}>
                {usernameX}
            </div>
        )

        const menu = (
            <div id='menuBtn' className={`center web-menu fontColor h${fc===11 ? 0 : fc}`}
                style={{ width:'50px', height:'50px', margin:'0px', position: headerTop<-100 ? 'fixed' : ''}}
                onClick={() => this.onMenu()}>
                <FaBars style={{width:'20px', height:'20px', }}/>
                <span style={{fontSize:'10px', fontWeight:10}}>MENU</span>
            </div>
        )

        const phoneHead = (
            <div className='d-flex' onClick = {() => this.onToggleCall(phone)}
                style = {{fontSize:w<s ? '15px' : '15px', fontWeight:'bold', padding:'0px 10px', alignItems:'center', direction: rtl ? 'ltr' : 'ltr'}}>
                <MdPhoneInTalk className='' style={{ fontSize:'20px', margin:'0px', transform: 'rotate(10deg)' }}/>
                <span className='underline' style={{margin:'0px 10px', whiteSpace:'nowrap'}}>{phone}</span>
            </div>
        )

        const celphoneHead = (
            <div className='d-flex'  onClick = {() => this.onToggleCall(celphone)}
                style = {{fontSize:w<s ? '15px' : '15px', fontWeight:'bold', padding:'0px 10px', alignItems:'center', direction: rtl ? 'ltr' : 'ltr'}}>
                <MdPhonelinkRing className='' style={{ fontSize:'20px', margin:'0px', transform: 'rotate(10deg)' }}/>
                <span className='underline' style={{margin:'0px 10px', whiteSpace:'nowrap'}}>{celphone}</span>

            </div>
        )

        const contactUs = (
            <div className={w>s ? 'underline' : ''} style={{padding:'0px 10px', textDecoration:w<s ? 'underline' : ''}}
                onClick={() => this.onSetSidebarOpen('contactSub', true)}>
                {setLT.contact}
            </div>
        )

        const phoneX = phone
        ? phoneHead
        : celphone
            ? celphoneHead
            : null

        const xStyle = {margin:'10px', alignItems:'center', color:'black'}
        const instagramIconX = (
            <a className='d-flex' href={`https://instagram.com/${instagram}`} target="_blank" style={xStyle}
                onClick={() => addNotification('instagram', 'click', fullAccess, mainUser, userId, geo)}>
                <FaInstagram className='' style={{fontSize:'25px', margin:'0px 5px', borderRadius:'8px', color:'#ffffff', backgroundImage: 'linear-gradient(to right top, #fcac0f, #fd9522, #fa7f30, #f36a3c, #e85647, #e44751, #dd395b, #d42d65, #d12174, #ca1b85, #be1e96, #ae27a8)'}}/>
            </a>
        )
        const telegramIconX = (
            <a className='d-flex' href={`https://t.me/${telegram}`} target="_blank" style={xStyle}
                onClick={() => addNotification('telegram', 'click', fullAccess, mainUser, userId, geo)}>
                <FaTelegram style={{ fontSize:'25px', color:'#24A1DE' }}/>
            </a>
        )
        const facebookIconX = (
            <a className='d-flex' href={`https://${facebook}`} target="_blank" style={xStyle}
                onClick={() => addNotification('facebook', 'click', fullAccess, mainUser, userId, geo)}>
                <FaFacebook style={{ fontSize:'25px', color:'#3b5998' }}/>
            </a>
        )
        const youtubeIconX = (
            <a className='d-flex' href={`https://${youtube}`} target="_blank" style={xStyle}
                onClick={() => addNotification('youtube', 'click', fullAccess, mainUser, userId, geo)}>
                <FaYoutube style={{ fontSize:'25px', color:'#c4302b' }}/>
            </a>
        )
        const linkedinIconX = (
            <a className='d-flex' href={`https://${linkedin}`} target="_blank" style={xStyle}
                onClick={() => addNotification('linkedin', 'click', fullAccess, mainUser, userId, geo)}>
                <FaLinkedin style={{ fontSize:'25px', color:'#0077B5' }}/>
            </a>
        )
        const contactHead = (
            <div className='center' style={{width:'100%', backgroundColor:'#ffffff99', justifyContent: w<s ? (phoneX===null ? 'flex-end' : 'space-between') : 'flex-end'}}>
                { w>s && 
                    <div className='d-flex'>
                        {instagram && instagramIconX}
                        {telegram && telegramIconX}
                        {facebook && facebookIconX}
                        {youtube && youtubeIconX}
                        {linkedin && linkedinIconX}
                    </div>
                }
                <div style={{margin: w>s ? '0px 20px' : ''}}>{phoneX}</div>
                {subUserInfo.type!=='content' &&  contactUs}
                {/* w<s && alertWhite */}
            </div>
        )

        const Chat = (
            <div className='d-flex' onClick = {() => this.onToggleChat()}
                style={{margin:rtl ? '0px' : '2px 0px 0px'}}>
                <div className='d-flex' style={{margin: '0px', alignItems:'center', direction:'ltr'}}>
                    Chat Online
                    <IoChatbubbleEllipsesOutline style={{fontSize:'20px', margin:'-2px 5px 0px'}}/>
                </div>
            </div>
        )

        // , position:'fixed', bottom: whatsapp ? 140 : (w<s ? 50 : 80), right:w<s ? 5 : 10,
        const chatConst = (
            <div className={`center C${fc} btnShadow underline`}
                style={{width: '125px', height: '30px', marginTop:'10px',
                        textAlign:'center', fontWeight:400,
                        border: `3px solid ${[11].includes(fc) ? '#00000050' : '#ffffff80'}`,
                        padding: '0px 2px 0px 10px',
                        color: `${lightColors.includes(fc) ? '#000000' : '#ffffff'}`,
                        borderRadius: '100px 100px 0px 100px', zIndex:'1050'}}
                >
                {Chat}
                {!whatsapp && pageYOffset>200 && alertWhite}
            </div>
        )

        const whatsappx = (
            <div className='d-flex' onClick = {() => this.onToggleWhatsApp()}
                style={{textDecoration:'none', cursor:'pointer', margin:rtl ? '0px' : '2px 0px 0px'}}>
                <div className='d-flex' style={{margin: '0px', direction:'ltr'}}>
                    WhatsApp
                    <FaWhatsapp style={{width:'19px', fontSize:'20px', margin:'0px 5px 0px'}}/>
                </div>
            </div>
        )

        const whatsappPopup = (
                <div className={`center C${fc} ${whatsapp ? 'btnShadow underline' : ''}`}
                    style={{width:'120px', height: '30px', marginTop: '10px',
                            textAlign:'center', fontWeight:400,
                            border: `3px solid ${whatsapp ? '#2aff00' : '#e0e6ed'}`,
                            padding: '0px 2px 0px 10px',
                            color: `${lightColors.includes(fc) ? '#000000' : '#ffffff'}`,
                            borderRadius: '100px 100px 0px 100px', zIndex:'1050'}}
                    >
                    {whatsappx}
                    {whatsapp && pageYOffset>200 && !subUserInfo?.access?.includes("BookingSystem") && alertWhite}
                </div>
        )

        const serviceCounter = (
            <Link to={`/booking/${subUserInfo.username}`} className='center link-underline-white' style={{fontWeight:100, height:'23px', background:'red', borderRadius:'100px 20px 20px 100px', marginRight: userServiceSelected.length>0 ? '' : '-90px', opacity: userServiceSelected.length>0 ? 1 : 0, transition:'.5s', padding:'0px 8px', color:'#ffffff', zIndex: 1}}>
                {userServiceSelected.length}&nbsp;
                {`Service${userServiceSelected.length>1 ? 's' : ''}`}&nbsp;
                <span style={{fontSize:'13px', fontWeight:450}}>£{totalPrice(userServiceSelected)}</span>
                {/* alertWhite */}
            </Link>
        )

        const bookOnline = (
            <div className='center link-underline-black' style={{zIndex: 2}}
                onClick={() => this.onSetSidebarOpen('psSub', true)}>
                <span style={{margin:'3px 0px 0px 10px'}}>Book Online</span>
                <TbBrandBooking style={{fontSize:'22px', marginRight:'5px'}}/>
            </div>
        )

        // position:'fixed', bottom:100, right:w<s ? 5 : 10,
        const bookingPopup = (
            <div className={`center C${fc} btnShadow`}
                style={{width: '', height: '30px', direction:'ltr',
                        textDecoration:'none', textAlign:'center', marginTop:'10px',
                        border: `3px solid ${[11].includes(fc) ? '#00000050' : '#ffffff80'}`,
                        color: `${lightColors.includes(fc) ? '#000000' : '#ffffff'}`,
                        borderRadius: '100px 100px 0px 100px', zIndex:'1050'}}
                >
                {serviceCounter}
                {bookOnline}
                {/* whatsapp && pageYOffset>200 && alertWhite */}
            </div>
        )

        var bizLink = `https://shiningpage.com/${subUserInfo.businessType>0 ? 'publisher' : 'user'}/${subUserInfo.username}`

        const backG = (
            <div>
                <img
                    style={{position:'fixed', filter:'blur(50px)', zIndex:'-1'}}
                    height='100%'
                    width={w<s ? '300%' : '100%'}
                    src={aboutImgSrc}
                    alt="world background"
                />
            </div>
        )

        const aboutInfo = (
            <div id='aboutInfo' style={{padding:'70px 0px', fontSize:w<s ? '16px' : '18px', fontWeight:100, backgroundColor:`${colors[`C${fc===11 ? 0 : fc}`]}00`}}>
                <Container className='center' style={{alignItems:'center', flexDirection:'column'}}>
                    <div className='d-flex'>
                        {userX}
                        {me && <EditBtn size={35} position='' margin='-5px 0px 0px 10px' padding='4px' onClick={() => this.onToggleActivitySummary()}/>}
                    </div>
                    <div style={{position:'relative'}}>
                        <div className={`C${fc===11 ? 7 : fc}`} style={{width:'200px', height:'2px', margin:'10px 0px 30px'}}></div>
                        {/* {me && <EditBtn size={35} top={-7} right={-40} padding='4px' onClick={() => this.onToggleActivitySummary()}/>} */}
                    </div>
                    <div className='d-flex'>
                        {jobSummary &&
                            <div style={{whiteSpace:'pre-wrap', textAlign:'center', lineHeight:'30px', marginBottom:w<s ? '50px' : '70px'}}>
                                <strong style={{fontSize:'20px', fontWeight:'bold'}}>{jobSummary}</strong>
                            </div>
                        }
                        {me && !jobSummary && <div style={{fontSize:'14px', fontWeight:400, margin:'-10px 0px 70px'}}>Add your business activity in one line.</div>}
                        {/* {me && !jobSummary && <EditBtn size={35} text='Activity Summary' fontSize='12px' fontWeight={450} margin='-10px 0px 65px 5px' padding='4px' position='' onClick={() => this.onToggleActivitySummary()}/>} */}
                    </div>
                    <div className='d-flex' style={{flexDirection:w<s ? 'column' : ''}}>
                        <div style={{minWidth: w<s ? '100%' : '300px', marginRight: w<s ? 0 : '70px'}}>
                            { profileData &&
                                <img
                                    className={w<s ? '' : 'sticky-top'}
                                    style={{top: w<s ? '' : NavH + 10, zIndex:1, objectFit:'cover', height:'300px', width:'100%', borderRadius:'0px 100px', marginBottom:w<s ? '50px' : 0, border:'1px solid #99999930'}}
                                    src={aboutImgSrc}
                                    alt={`${subUserInfo.username} about`}
                                />
                            }
                        </div>
                        <div>
                            <div style={{ fontWeight:400, marginBottom:'50px' }}>
                                <div className='d-flex'>
                                    About
                                    {me && <EditBtn size={35} position='' margin='-10px 0px 0px 10px' padding='4px' onClick={() => this.onToggleAboutInfo()}/>}
                                </div>
                                <div style={{marginBottom:'40px'}}>{userX}</div>
                                {me && (biography==='' || biography==='<br>') && <div style={{fontSize:'14px', fontWeight:400, margin:'-30px 0px 70px'}}>Share the mission, vision, and values of your business to introduce your company to visitors.</div>}
                                <div style={{whiteSpace:'pre-wrap'}}>
                                    {RenderContent(biography)}
                                </div>
                            </div>
                            { subUserInfo.businessType > 0 && (me || teamMembers.length > 0) &&
                                <div style={{ fontWeight:400, marginBottom:'0px' }}>
                                    <div className='d-flex'>
                                        <div className={`tx f${fc===11 ? 7 : fc}`} style={{fontSize:'20px', fontWeight:'bold', margin:'', color:''}}>Our Team</div>
                                        {me && <EditBtn size={35} type='add' position='' margin='-5px 0px 0px 10px' padding='4px' onClick={() => this.onToggleTeam()}/>}
                                    </div>
                                    <div className={`C${fc===11 ? 7 : fc}`} style={{width:'130px', height:'2px', margin:'10px 0px 30px'}}></div>
                                    {me && teamMembers.length===0 && <div style={{fontSize:'14px', fontWeight:400, margin:'-10px 0px 70px'}}>Highlight your team members, their roles, and key contributions to your business.</div>}
                                    {teamMembers.length>0 && 
                                        <div className={w<s ? 'center' : 'd-flex'} style={{ width:w<s ? w-20 : '', flexWrap:'wrap'}}>
                                            {teamMembers}
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </Container>
            </div>
        )

        const dot = (
            <div style={{fontWeight:'', width:'130px', textAlign:'right', color: lightColors.includes(fc) ? '#000000' : '#ffffff'}}>
                <span style={{fontSize:w<s ? '13px' : '', fontWeight:450}}><span style={{fontSize:'18px'}}></span>{process.env.REACT_APP_VERSION}</span>
            </div>
        )

        const shiningPage = (
            <div>
                <span style={{fontWeight:450, color: designedByColors.includes(fc) ? '#cc2864' : '#ffd400'}}>
                    Designed by : 
                </span>&nbsp;
                <Link to='/'
                    style={{fontWeight:'bold', margin:'0px', color: designedByColors.includes(fc) ? '#0029ce' : '#00CCFF'}}>
                    ShiningPage
                </Link>
            </div>
        )

        const copyright = (
            <div style={{color: lightColors.includes(fc) ? '#000000' : '#ffffff'}}>
                <span style={{fontSize:w<s ? '13px' : '', fontWeight:450}}><span style={{fontSize:'18px'}}></span>All Rights Reserved</span>
            </div>
        )

        const footer = (
            <div className={`C${fc} cardShadow`} style={{width:'100%', height:w<s ? '60px' : '50px', borderTop:`5px solid #ffffff40`}}>
                <Container className={`center tx`} style={{fontSize:'14px', alignItems:'center', width:'100%', height:'100%', padding:'0px 10px', justifyContent:w>s ? 'space-between' : '', flexDirection:w<s ? 'column' : '', direction:'ltr'}}>
                    {w>=s && shiningPage}
                    {w<s && shiningPage}
                    {copyright}
                    {/* dot */}
                </Container>
            </div>
        )

        const shareSub = (
            <div className='' style={{ width:'100%', padding:'0px', backgroundColor:`${colors[`C${fc}`]}00` }}>
                <Container>
                    <SharePage url={ exist(siteLink) ? siteLink : bizLink } mainTitle={usernameX} subTitle={subUserInfo.jobSummary}/>
                </Container>
            </div>
        )

        const QRCode = <QRCodeX size="180px" url={`https://shiningpage.com/${subUserInfo.businessType>0 ? 'publisher' : 'user'}/${subUserInfo.username}`}/>

        const navItemsStyle = {color:'#000000', alignItems:'center', height:'40px'}
        const sidebarItemsStyle = {margin:rtl ? '10px' : '13px 10px 10px', fontSize:'16px', fontWeight:400}
        const homeBtn = (
            <div className={`d-flex underline`} style={navItemsStyle} onClick={() => this.onSetSidebarOpen()}>
                <AiFillHome style={{width:'23px', margin:'10px 16px', fontSize:'23px'}}/>
                <div style={sidebarItemsStyle}>{setLT.home}</div>
            </div>
        )

        const aboutBtn = (
            <div className={`d-flex underline`} style={navItemsStyle} onClick={() => this.onSetSidebarOpen('about')}>
                <FaUsers style={{width:'23px', margin:'10px 16px', fontSize:'23px'}}/>
                <div style={sidebarItemsStyle}>{setLT.about}</div>
            </div>
        )

        const psBtn = (
            <div className={`d-flex underline`} style={navItemsStyle} onClick={() => this.onSetSidebarOpen('psSub')}>
                <AiFillProduct style={{width:'23px', margin:'10px 16px', fontSize:'23px'}}/>
                <div style={sidebarItemsStyle}>{setLT.ProductsServices}</div>
            </div>
        )

        const attachmentsBtn = (
            <div className={`d-flex underline`} style={navItemsStyle} onClick={() => this.onSetSidebarOpen('attachmentsSub')}>
                <MdAttachFile style={{width:'23px', margin:'10px 16px', fontSize:'23px'}}/>
                <div style={sidebarItemsStyle}>{setLT.attachments}</div>
            </div>
        )

        const statisticsBtn = (
            <div className={`d-flex underline`} style={navItemsStyle} onClick={() => this.onSetSidebarOpen('statisticsSub')}>
                <GiGlobe style={{width:'23px', margin:'10px 16px', fontSize:'23px'}}/>
                <div style={sidebarItemsStyle}>{setLT.statistics}</div>
            </div>
        )

        const contactBtn = (
            <div className={`d-flex underline`} style={navItemsStyle} onClick={() => this.onSetSidebarOpen('contactSub')}>
                <MdPhoneInTalk style={{width:'22px', margin:'10px 16px', fontSize:'23px'}}/>
                <div style={sidebarItemsStyle}>{setLT.contact}</div>
            </div>
        )

        const sections = (
            <div style={{backgroundColor: '#ffffff99'}}>
            <div style={{padding:'20px 0px', backgroundColor: '#ffffff99'}}>
                {homeBtn}
                {aboutBtn}
                {psBtn}
                {attachmentsBtn}
                {statisticsBtn}
                {contactBtn}
            </div>
            </div>
        )

        const profileBox = (
            <div className='d-flex' style={{position:'relative'}}>
                {UserProfileImage}
                <div style={{margin:'0px 10px'}}>
                    {countryConst}
                    {usernameConst}
                </div>
                {me && !isSidebarOpen && <EditBtn rtl={rtl} size={35} top={0} right={-40} onClick={() => this.toggleBasicInformation()}/>}
            </div>
        )

        const modalSidebarWeb = (
            <ModalSidebarWeb
                ref={this.sidebarRef}
                mobile={w<s ? true : false}
                rtl={rtl}
                headerTop={headerTop}
                fc={fc}
                aboutImgSrc={aboutImgSrc}
                logoSide={logoSide}
                profileBox={profileBox}
                sections={sections}
                shareSub={shareSub}
                QRCode={QRCode}
                version={process.env.REACT_APP_VERSION}
                updateVersion={updateVersion}
                isOpen={isSidebarOpen}
                toggleSidebar={this.onMenu}
            />
        )

        const userHeader = (
            <div id='header' className='center' style={{width:'100%', height:'70px', justifyContent:'space-between', alignItems:'center', padding:w<s ? '10px 0px' : '10px', zIndex:'2'}}>
                <div className='d-flex'>
                    {menu}&nbsp;&nbsp;
                    {profileBox}
                </div>
                {w>s && contactHead}
                {/*  userWebPage &&
                    <div className='d-flex' style={{margin:'0px 10px'}}>
                        <UserSettings /> 
                        <LangBox />
                    </div>
                 */}
            </div>
        )

        const modalZoomProfileImage = (
            <ModalZoomProfileImage
                me={me}
                pixDelete={pixDelete}
                pixSave={pixSave}
                pixHandler={pixHandler}
                pixResizer={pixResizer}
                EditBtn={EditBtn}
                exist={exist}
                userN={userN}
                serverURL={serverURL}
                subGenderX={subGenderX}
                toggleZoomProfileImage={toggleZoomProfileImage}
                onToggle={this.toggleZoomProfileImage}
                dispatch={this.props.dispatch}
                mapStateToProps={this.props}
            />
        )

        const modalBasicInformation = (
            <ModalBasicInformation
                dispatch={this.props.dispatch}
                EditBtn={EditBtn}
                toggleBasicInformation={toggleBasicInformation}
                onToggle={this.toggleBasicInformation}
                mapStateToProps={this.props}
            />
        )

        const modalAboutInfo = (
            <ModalAboutInfo
                dispatch={this.props.dispatch}
                EditBtn={EditBtn}
                toggleAboutInfo={toggleAboutInfo}
                onToggle={this.onToggleAboutInfo}
                mapStateToProps={this.props}
            />
        )

        const modalActivitySummary = (
            <ModalActivitySummary
                dispatch={this.props.dispatch}
                EditBtn={EditBtn}
                toggleActivitySummary={toggleActivitySummary}
                onToggle={this.onToggleActivitySummary}
                mapStateToProps={this.props}
            />
        )

        const modalTeam = (
            <ModalTeam
                dispatch={this.props.dispatch}
                EditBtn={EditBtn}
                toggleTeam={toggleTeam}
                team={team}
                onToggle={this.onToggleTeam}
                onGetTeam={this.getTeam}
                mapStateToProps={this.props}
            />
        )

        const adsBox1 = <div className='adsbox'><AdsHorizontal id='adsH1' /></div>
        const adsBox2 = <div className='adsbox'><AdsHorizontal id='adsH2' /></div>
        const adsBox3 = <div className='adsbox'><AdsHorizontal id='adsH3' /></div>
        const adsBox4 = <div className='adsbox'><AdsHorizontal id='adsH4' /></div>
        const adsBox5 = <div className='adsbox'><AdsHorizontal id='adsH5' /></div>

        const backNotFound = (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: w<s ? '300%' : '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center', // قرار دادن در وسط افقی
                    alignItems: 'center', // قرار دادن در وسط عمودی
                    filter: 'blur(50px)',
                    zIndex: '-1',
                    backgroundImage: `url(${require("../assets/images/other/international.jpg")})`, backgroundSize: 'cover', backgroundPosition: 'right center'
                }}
            >
            </div>
        )

        if (notFound) {
            return (
                <div>
                    {backNotFound}
                    <Container style={{color:'#ffffff'}}>
                        <h1 className="animated fadeInDown" style={{ animationDelay: '1s', margin: '30px 10px' }}>
                            Page Not Found
                        </h1>
                        <p className="animated fadeInDown" style={{ animationDelay: '1.5s', margin: '30px 10px' }}>
                            Sorry, the page you are looking for does not exist.
                        </p>
                    </Container>
                </div>
            );
        }

        const about = (
            <div id="about" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Background Layer */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${aboutImgSrc})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(10px)', transform: 'scale(1.1)', zIndex: 0 }}/>
                {/* Overlay */}
                <div style={{ position: 'absolute', inset: 0, backgroundColor: '#ffffff99', zIndex: 1 }}/>
                {/* Content */}
                <div style={{ position: 'relative', zIndex: 2 }}>{aboutInfo}</div>
                //  {/* <RubyCollector id='adsH2' bottom={30} left={30}/> */}
            </div>
        );

        const popups = (
            <div className='' style={{ position:'fixed', bottom:60, right:w<s ? 5 : 10, direction:'rtl', zIndex:'1000'}}>
                {!me && !userWebPage && chatConst}
                {!userWebPage && whatsapp && whatsappPopup}
                {subUserInfo?.access?.includes("BookingSystem") && bookingPopup}
            </div>
        )

        // console.log('googleAds: ', googleAds)
        // console.log('subUserInfo.ads: ', subUserInfo.ads)
        return (
            <div>
                <div style={{top:'50px', zIndex:'0', color:'', }}>
                    {profileData && backG}
                    <div style={{height:'70px', transition:'.5s', marginBottom:'0px', top: 0, zIndex:'3', backgroundColor:'#ffffff'}}>
                        {userHeader}
                    </div>
                    {w<s && contactHead}
                    {w>s && <NavbarSub fc={fc} txBlack={txBlack} mapStateToProps={this.props} />}
                    {profileData && <WebCarousel dataX={subUserInfo} fc={fc}/>}
                    {me && googleAds && subUserInfo.ads && adsBox1}
                    <FeaturesSub fc={fc} nx={subUserInfo.totalContents} me={me} mapStateToProps={this.props} viewN={viewN} dispatch={this.props.dispatch}/>                    
                    {about}
                    {me && googleAds && subUserInfo.ads && adsBox2}
                    <PsSub fc={fc} me={me} nx={subUserInfo.totalContents} txBlack={txBlack} titleStyle={titleStyle} index={psSubActive} adsN={adsN} videoN={videoN} instaN={instaN} updatePsCount={this.updatePsCount} EditBtn={EditBtn} mapStateToProps={this.props} dispatch={this.props.dispatch}/>
                    <AttachmentSub fc={fc} titleStyle={titleStyle} index={attachmentsSubActive} me={me} mapStateToProps={this.props} dispatch={this.props.dispatch}/>
                    {me && googleAds && subUserInfo.ads && adsBox3}
                    <StatisticsSub fc={fc} titleStyle={titleStyle} index={statisticsSubActive} viewN={viewN} gettingView={gettingView}/>
                    {me && mainUser.access.includes('socialMedia') && <SocialMedia /> }
                    {me && googleAds && subUserInfo.ads && adsBox4}
                    <div style={{backgroundColor:'#ffffff'}}>
                        {subUserInfo.type!=='content' && <ContactSub fc={fc} me={me} hr={hr} titleStyle={titleStyle} phone={phone}/>}
                        {modalZoomProfileImage}
                        {modalBasicInformation}
                        {modalAboutInfo}
                        {modalActivitySummary}
                        {modalTeam}
                        {modalSidebarWeb}
                    </div>
                    {/* me && googleAds && w<s && adsBox5 */}
                    {footer}
                    {/* me && subUserInfo.ads && <AdsBoxSub mapStateToProps={this.props}/> */}
                </div>
                {subUserInfo.type!=='content' && popups}
            </div>
        )

    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo._id,
        mainUser: state.userInfo,
        userId: state.subUserInfo._id,
        subUserInfo: state.subUserInfo,
        fc: state.subUserInfo.fc,
        username: state.subUserInfo.username,
        businessType: state.subUserInfo.businessType,
        email: state.subUserInfo.email,
        genderValue: state.subUserInfo.genderValue,
        jobSummary: state.subUserInfo.jobSummary,
        biography: state.subUserInfo.biography,
        lat: state.subUserInfo.lat,
        lon: state.subUserInfo.lon,
        rtl: state.rtl, 
        lang: state.lang,
        geo: state.geo,
        auth: state.auth,
        country: state.country,
        page: state.page,
        subject: state.subject,
        pageTitle: state.pageTitle,
        membership: state.membership,
        setLT: state.setLT,
        pageName: state.pageName,
        pageYOffset: state.pageYOffset,
        fullAccess: state.fullAccess,
        scrollDirection: state.scrollDirection,
        adsInfo: state.adsInfo,
        objects: state.objects,
        seenStatus: state.seenStatus,
        userServiceSelected: state.userServiceSelected,
    }
  }
  export default connect (mapStateToProps)(PublisherPage);
