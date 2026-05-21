import React, { Component, createRef } from 'react';
import { Helmet } from "react-helmet";
import axios from 'axios';
import { connect } from 'react-redux';
import { Container, Modal } from 'react-bootstrap';
import { BrowserRouter as Router , Link } from "react-router-dom";
import rubyS from './assets/images/other/rubyS.png';
import userN from './assets/images/other/user1.png';
import male from './assets/images/other/man2.png';
import female from './assets/images/other/woman2.png';
import Routes from "./Routes";
import { setToggleLoading, setCountry, setSetLT, setToggleChat,
        setToggleSidebar, setToggleShowVideo, setPageYOffset,
        setMembership, setGeo, setSendMessage, setToggleViewStatus,
        setLang, setRtl,setUpdateVersionDate, setToggleChatList,
        setScrollDirection, setToggleAds, setAdsInfo, setRuby,
        setToggleVideo, setVideoInfo, setToggleInsta, setInstaInfo,
        setObjects, setRubyInterval, 
    } from './dataStore/actions';
import SubChat from './components/SubChat';
import SendMessage from './components/SendMessage';
import setLangText from './modules/setLangText';
import VideoShow from './components/VideoShow';
import EXV from './components/EXV';
import Addressbar from './components/Addressbar';
import ModalViewStatus from './components/modals/ModalViewStatus';
import ChatList from './components/modals/ModalChatList';
import { FaBell, FaYoutube, FaLinkedin, FaUser, FaBars } from 'react-icons/fa';
import { MdReviews, MdEmail, MdClose } from 'react-icons/md';
import { HiOutlineUsers, HiUsers } from "react-icons/hi2";
import { AiOutlineDashboard, AiFillMessage, AiFillInstagram, AiFillHome, AiOutlineHome } from 'react-icons/ai';
import { BiSupport } from 'react-icons/bi';
import { AiFillDashboard, AiFillProduct, AiOutlineProduct } from "react-icons/ai";
import { PiSquaresFourLight } from "react-icons/pi";
import { BiBookContent, BiSolidBookContent } from "react-icons/bi";
import { IoMailOutline, IoMailSharp } from "react-icons/io5";
import { GrDashboard } from "react-icons/gr";
import { VscDashboard } from "react-icons/vsc";
import UpdateVersion from './components/UpdateVersion';
import LangBox from './components/LangBox';
import UserBox from './components/UserBox';
import Search from './components/Search';
import ModalSidebarShiningpage from './components/modals/ModalSidebarShiningpage';
import { identifyObj, exist, getBalance, scrollStatus, checkRubyInterval, } from './helper';
import { serverURL, s, NavH, langArray, version, countryArr, noIndexPages } from './srcSet';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            w: window.innerWidth,
            h: window.innerHeight,
            dh: document.body.clientHeight,
            modal: false,
            n: 0,
            open: false,
            loginItems: false,
            lastScrollTop: 0,
            notSeenChatQTY: 0,
            notSeenNotificationQTY: 0,
            isSidebarOpen: false,
            notFound: false,
            objects: [],
            seenElements: new Map(), // نگه‌داری المنت‌هایی که یک بار کامل دیده شده‌اند
        };

        this.sidebarRef = createRef(); // مرجع برای سایدبار
    }

    componentDidMount = async () => {
        this.props.dispatch(setPageYOffset(0))
        document.addEventListener('mousedown', this.handleClickOutside); // ثبت event listener
        window.addEventListener("resize", this.onResize)
        window.addEventListener('scroll', this.handleScroll)
        this.props.dispatch(setSetLT(setLangText('en')))
        this.props.dispatch(setLang('en'))
        this.props.dispatch(setRtl(false))

        // await this.language()
        this.setModals()
        this.props.dispatch(setCountry({}))
        if(this.props.auth) {
            checkRubyInterval(this.props.rubyInterval, this.props.dispatch)
            this.getRuby()
            getBalance(this.props.mainUserId, this.props.dispatch)
            this.notSeenChat()
            this.notSeenNotification()
        }

        await this.props.dispatch(setGeo([]))
        identifyObj(this.props.dispatch)
        await this.getGeo()
        this.getVersion()
        // getLocalIPs().then((ips) => console.log("آدرس‌های IP کاربر:", ips));
        // const id = await getFingerprint()
        // const ips = await getLocalIPs()

        // console.log(id)
        // console.log(ips)

        // if(this.props.auth && this.props.page!=='web') {
        //   window.location.href = `/publisher/${this.props.mainUser.username}`
        //   // window.open(`/publisher/${this.props.mainUser.username}`)
        // }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize)
        window.removeEventListener("scroll", this.handleScroll);
        document.removeEventListener('mousedown', this.handleClickOutside); // حذف event listener
    }

    componentDidUpdate = async(prevProps) => {
        const { objects, balance } = this.props
        if (balance !== prevProps.balance) {
            getBalance(this.props.mainUserId, this.props.dispatch)
        }
        if (objects !== prevProps.objects) {
            this.setState({objects})
        }
    }

    handleClickOutside = (event) => {
        if (
            this.sidebarRef.current && // اگر مرجع وجود دارد
            !this.sidebarRef.current.contains(event.target) // و کلیک خارج از سایدبار است
        ) {
            this.props.dispatch(setToggleSidebar(false)); // بستن سایدبار
        }
    };

    handleScroll = async () => {
        this.props.dispatch(setPageYOffset(window.scrollY))
        const { scrollDirection, lastScrollTop } = scrollStatus(this.state.lastScrollTop);
        this.setState({ scrollDirection, lastScrollTop });
        this.props.dispatch(setScrollDirection(scrollDirection))
        // console.log(this.props.pageYOffset)

        const adsToCheck = this.props.objects;
        // console.log('adsToCheck: ', adsToCheck)

        // اجرای تابع checkGoogleAd فقط روی تبلیغاتی که دیده نشده‌اند
        for (const ad of adsToCheck) {
            if(!this.state[ad.id]) {
                await this.checkGoogleAd(ad.id);
            }
        }
    }

    checkGoogleAd = async (id) => {
        // console.log('id: ', id)
        var states = ''
        var { mainUser, objects, reference, subject, lang, geo } = this.props
    
        // console.log(reference.ref)
        // دریافت عنصر تبلیغی با استفاده از id
        const adElement = document.getElementById(id);
    
        // اگر عنصر تبلیغی پیدا شد
        if(adElement) {
            const adStatus = adElement.getAttribute('data-ad-status'); // مقدار ویژگی data-ad-status را از عنصر adElement دریافت می‌کنیم.
            // console.log(adElement)
            // بررسی اینکه آیا تبلیغ پر شده است یا خیر
            if(adStatus === 'filled') {
                states = `${id} در صفحه نمایش داده شده است.`
    
                // بررسی اینکه آیا تبلیغ در نمای کاربر قرار دارد یا خیر
                if(this.isAdVisible(adElement)) {
                    states = `${id} اکنون در دید کاربر قرار دارد!`

                    setTimeout(() => {
                        ////////
                        objects.forEach(obj => {
                            if(id === obj.id) {
                                obj.active = true
                                this.props.dispatch(setObjects(objects))
                            }
                        });
                        ////////
    
                        this.setState({ [id]: true })
                    }, Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000);

                }
            } else if(adStatus === 'unfilled') {
              if(this.isAdVisible(adElement)) {
                states = `${id} در صفحه نمایش داده نشده است.`


                this.setState({ [id]: true })
              }
            } else {
                states = `وضعیت ${id} نامشخص است.`
                // console.log(adElement)
                // this.isAdVisible(adElement, id)
            }
    
        } else {
            states = `عنصر ${id} پیدا نشد.`
        }
        // console.log(states)
    }
    
    isAdVisible = (adElement) => {
        if (!adElement) return false;
    
        const rect = adElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
        // بررسی جداگانه‌ی دیده شدن `top` و `bottom`
        let topSeen = rect.top >= 0 && rect.top < viewportHeight;
        let bottomSeen = rect.bottom > 0 && rect.bottom <= viewportHeight;
    
        // دریافت مقدار قبلی از `state`
        let prevState = this.state.seenElements.get(adElement) || { topSeen: false, bottomSeen: false };
    
        // اگر `top` یا `bottom` دیده شد، وضعیت را در state ذخیره کنیم
        let updatedState = {
          topSeen: prevState.topSeen || topSeen,
          bottomSeen: prevState.bottomSeen || bottomSeen
        };
    
        // اگر هر دو مقدار `true` شدند، عنصر کاملاً دیده شده است
        if (updatedState.topSeen && updatedState.bottomSeen) {
          return true;
        }
    
        // بروزرسانی state به صورت **غیر هم‌زمان** برای دفعات بعدی
        this.setState((prev) => {
          const newMap = new Map(prev.seenElements);
          newMap.set(adElement, updatedState);
          return { seenElements: newMap };
        });
    
        return false;
    };
    
    getRuby = () => {
        axios.post(`${serverURL}/ruby/totalScore` , {userId: this.props.mainUserId}).then(res => {
            // console.log('rubyAmount: ', res.data)
            // this.setState({
            //     rubyAmount: parseFloat(res.data).toFixed(2)
            // })
            this.props.dispatch(setRuby(parseFloat(res.data).toFixed(3)))
        })
    }

    // getBalance(this.props.mainUserId, this.props.dispatch)
    // getBalance = async () => {
    //     const balanceData = await axios.get(`${serverURL}/finance/balance/` + this.props.mainUserId)
    //     var data = balanceData.data

    //     // Ensure the balance is in 2 decimal places
    //     const formattedBalance = parseFloat(data.totalAmount).toFixed(2)

    //     this.props.dispatch(setBalance(dig3(formattedBalance)))
    // }

    notSeenChat = () => {
        axios.post(`${serverURL}/chat/notSeenChat` , {id: this.props.mainUserId}).then(res => {
            this.setState({
                notSeenChatQTY: res.data
            })
        })
    }

    notSeenNotification = () => {
        axios.post(`${serverURL}/notification/notSeen` , {visitee: this.props.mainUserId}).then(res => {
            this.setState({
                notSeenNotificationQTY: res.data
            })
        })
    }

    onUpdateVersion = () => {

        caches.keys().then((keyList) => Promise.all(keyList.map((key) => caches.delete(key))))

        if('caches' in window){
            caches.keys().then((names) => {
                // Delete all the cache files
                names.forEach(name => {
                    caches.delete(name);
                })
            });
            window.location.reload()
        }

    }

    getVersion = () => {
        axios.get(`${serverURL}/user/getVersion/`)
        .then(async(res) => {
            const date = new Date()
            const dateN = date.getTime()
            var updateTime = this.props.updateVersionDate
            const limit = 10 * 60 * 1000 // 10min
            const checkTime = dateN - updateTime > limit ? true : false

            if(version!==res.data.site && checkTime) {
                // console.log(true)
                this.props.dispatch(setUpdateVersionDate(dateN))
                this.onUpdateVersion()
            } else {
                // console.log(false)
            }
        })
    }

    onToggleShowVideo = async () => {
        this.props.dispatch(setToggleShowVideo(!this.props.toggleShowVideo))
    }

    onToggleLoading = async () => {
        this.props.dispatch(setToggleLoading(!this.props.toggleLoading))
    }

    onToggleChat = async () => {
        this.props.dispatch(setToggleChat(false))
        document.querySelector("body").style.overflow = 'visible';
    }

    onToggleSidebar = () => {
        this.props.dispatch(setToggleSidebar(false))
    }

    language = async () => {
        var href = window.location.href;
        var pth = href.replace('?', '');
        var x = pth.split('/')[3];
        // console.log(12, href, pth, x);

        if(x==='') {
            // await this.props.dispatch(setLang(this.props.lang))
            // window.location.href=`/en`
        } else {
            if(langArray.includes(x)) {
                // console.log(1, x)
                await this.props.dispatch(setLang(x))
                if(x==='fa' || x==='ar') {
                    await this.props.dispatch(setRtl(true))
                } else {
                    await this.props.dispatch(setRtl(false))
                }
            } else {
                this.setState({ notFound: true }) // نمایش صفحه خطا
                await axios.post(`${serverURL}/err404`) // ارسال گزارش خطا
                return;
                // window.location.href=`/404`
                // await this.props.dispatch(setLang(x))
                // console.log(2, x, this.props.lang,pth)
                // window.history.pushState('data', 'Title', pth);
                // let newUrlIS =  window.location.origin + pth;
                // await window.history.pushState({}, null, newUrlIS);
                // setTimeout(() => {
                //   window.location.reload();
                
                // }, 2000);
            }
        }
        this.props.dispatch(setSetLT(setLangText('en')))
    }

    setModals = () => {
        this.props.dispatch(setToggleSidebar(false))
        this.props.dispatch(setToggleShowVideo(false))
        this.props.dispatch(setToggleChat(false))
        this.props.dispatch(setToggleLoading(false))
        this.props.dispatch(setMembership(false))
        this.props.dispatch(setSendMessage(false))
        this.props.dispatch(setToggleChatList(false))
        this.props.dispatch(setToggleAds({type:false}))
        this.props.dispatch(setAdsInfo({}))
        this.props.dispatch(setToggleVideo({type:false}))
        this.props.dispatch(setVideoInfo({}))
        this.props.dispatch(setToggleInsta({type:false}))
        this.props.dispatch(setInstaInfo({}))
        this.props.dispatch(setToggleViewStatus({toggle:false, page:false}))
    }

    onToggleViewStatus = () => {
        this.props.dispatch(setToggleViewStatus({toggle:!this.props.toggleViewStatus.toggle, page:false}))
    }

    onToggleChatList = () => {
        this.props.dispatch(setToggleChatList(!this.props.toggleChatList))
        setTimeout(() => {
            this.setState({
                leaveChatList: true
            })
        }, 3000);
    }

    toggleMembership = () => {
        this.props.dispatch(setMembership(!this.props.membership))
    }

    toggleSendMessage = () => {
        this.props.dispatch(setSendMessage(!this.props.sendMessage))
    }

    onSetSidebarOpen = async () => {
        // if(this.state.w<s) {
            this.setState({loginItems: false})
            this.props.dispatch(setToggleSidebar(!this.props.toggleSidebar))
        // }
    }

    onLogin = async () => {
        window.scrollTo(0, 0)
        this.props.dispatch(setToggleSidebar(false))
    }

    getGeo = async () => {

		await axios.get(`${serverURL}/findGeo`).then(async res => {
			// console.log(1111111, res.data)
            await this.props.dispatch(setGeo(res.data))
		})



    //     await axios.get('https://ipinfo.io/json?token=211ae43e1cddf3')
    //     .then(async (res) => {
    //         let data = res.data;
    //         console.log(data)
    //         data.countryCode = data.country

    //         // پیدا کردن کشور از آرایه
    //         const countryObj = countryArr.find(
    //             (item) => item.code === data.countryCode
    //         );
    //         // اگر پیدا شد ست کن
    //         data.country = countryObj ? countryObj.country : null;
    //         await this.props.dispatch(setGeo(data))
    //     })
    }

    onResize = () => {
        this.setState({
            w: document.body.clientWidth,
            h: window.innerHeight,
            dh: document.body.clientHeight
        })
    }

    userImagePanel = () => {
        window.scrollTo(0,0)
        this.onToggle('toggleUserPanel')
        if(this.props.page==='user-panel') window.location.reload()
    }

    changeLanguage = async (x) => {
        setTimeout(async () => {
            this.props.dispatch(setLang(x))
            this.props.dispatch(setSetLT(setLangText(x)))
            // console.log(111, this.props.lang)
            // console.log(x)

            if(x==='fa' || x==='ar') {
                this.props.dispatch(setRtl(true))
            } else {
                this.props.dispatch(setRtl(false))
            }

            var pth = window.location.pathname;
            var firstRout = pth.split('/')[1]
            // console.log(2)
            if(langArray.includes(firstRout)) {
                window.history.pushState('data', 'Title', pth.replace(firstRout, x));
                let newUrlIS =  window.location.origin + pth.replace(firstRout, x);
                await window.history.pushState({}, null, newUrlIS);
            }
            window.location.reload();
        }, 500);
    }

    langText = (x) => {
        var w = this.state.w
        var auth = this.props.auth
        switch (this.props.lang) {
            case 'en': x = 'English'; break;
            case 'fa': x = 'فارسی'; break;
            case 'ar': x = 'العربية'; break;
            case 'ru': x = 'Русский'; break;
            case 'tr': x = 'Türkçe'; break;
            case 'de': x = 'Deutsch'; break;
            case 'fr': x = 'Français'; break;
            case 'es': x = 'Española'; break;
            case 'zh': x = '中文'; break;

            default:   x = 'language';
        }
        return x
    }

    onToggle = (x) => {
        window.scrollTo(0, 0);
        if(x!=='notifications') {
            this.notSeenNotification()
            this.notSeenChat()
        }
    }

    onGoBusiness = (section) => {
        // window.location = `https://panel.Shiningpage.com/${this.props.mainUser.username}#${section}`;
        window.open(`/${this.props.mainUser.username}#${section}`, '_blank');
    }

    render() {
        const { w, h, notFound, scrollDirection, leaveChatList, leaveNotificationList, notSeenNotificationQTY, notSeenChatQTY, loginItems } = this.state
        const { auth, address, fc, setLT, mainUser, toggleSidebar, toggleShowVideo, fullAccess, 
            toggleLoading, membership, sendMessage, toggleChat, username, slug, genderValue, lang, rtl, page,
            businessType, toggleViewStatus, toggleChatList, ruby, rubyInterval, 
        } = this.props
        // var fc = 13
        const rubyDone = rubyInterval.done!==0 && rubyInterval.done >= rubyInterval.ruby ? true : false

        const rubyIndex = auth
                            ? mainUser.access.includes('ruby') ? true : false 
                            : false
        const NavHX = w<s ? 45 : NavH
        const colorX = [0, 4, 11].includes(fc) ? '#00000099' : '#ffffff'
        const hrC14 = <div className='C14' style={{width:'100%', height:'3px'}}></div>

        const loginBox = (
            <Link to={`/login`} className='center C14'
                style={{minWidth:'35px', maxWidth:'35px', minHeight:'35px', maxHeight:'35px', borderRadius:'100px', alignItems:'center', padding:'2px'}}>
                <div className='center C11' style={{width:'100%', height:'100%', borderRadius:'100px', alignItems:'center', padding:'5px'}}>
                    <img
                        style={{width:'100%', height:'100%'}}
                        src='https://www.pix.shiningpage.com/whoraly/site/login.png'
                        alt="login"
                    />
                </div>
            </Link>
        )

        const userProfileImage = (
            <img
                className={`btnShadow C${fc}`}
                style={{objectFit: 'cover', width:'30px', height:'30px', borderRadius:businessType>0 ? '3px' : '100px', border:'2px solid #ffffff40', margin:'0px 10px', padding:'0px'}}
                src={!auth
                    ? userN
                    : exist(mainUser.profileIndex)
                        ? `https://www.pix.shiningpage.com/whoraly/profile/small/${mainUser._id}-${mainUser.profileIndex}.jpeg`
                        : genderValue===0 ? female : male
                }
                alt={`${mainUser.username} profile photo`}
            />
        )

        // const webLinkIcon = (
        //     <div>
        //         { !auth 
        //             ? <Link to={`/login`} >{userProfileImage}</Link>
        //             : page==='web'
        //                 ? <a href={`/publisher/${username}`} >{userProfileImage}</a>
        //                 : <Link to={`/publisher/${username}`} >{userProfileImage}</Link>
        //         }
        //     </div>
        // )

        const unsNotificationQTY = (
            <div className={`${leaveNotificationList ? 'zoomOut' : 'zoomIn'}`} style={{backgroundColor: 'red', color: '#ffffff', fontSize:'11px', fontWeight:450, textAlign:'center', display: notSeenNotificationQTY ? '' : 'none',
                minWidth: '18px', height: '18px', borderRadius: '100px', lineHeight: '20px', position:'absolute', top:-5, right:-5}}>
                <span style={{margin:'0px 4px'}}>{notSeenNotificationQTY}</span>
            </div>
        )

        const notificationIcon = (
            <div className={`center C${auth ? fc : 14}`}
                style={{minWidth:w<s ? '30px' : '25px', width:w<s ? '30px' : '25px', height:w<s ? '30px' : '25px',
                    margin:'0px 10px', color: colorX, borderRadius:'100px', backgroundPosition: 'top right',
                    backgroundSize: '250% 250%', position:'relative'}}
            >
                <FaBell style={{fontSize:'17px'}}/>
                {unsNotificationQTY}
            </div>
        )

        const unsChatQTY = (
            <div className={`${leaveChatList ? 'zoomOut' : 'zoomIn'}`} style={{backgroundColor: 'red', color: '#ffffff', fontSize:'11px', fontWeight:450, textAlign:'center', display: notSeenChatQTY ? '' : 'none',
                minWidth: '18px', height: '18px', borderRadius: '100px', lineHeight: '20px', position:'absolute', top:-5, right:-5}}>
                <span style={{margin:'0px 4px'}}>{notSeenChatQTY}</span>
            </div>
        )

        // console.log('fc', fc)
        const chatIcon = (
            <div className={`center C${auth ? fc : 14}`} 
                style={{minWidth:w<s ? '30px' : '25px', width:w<s ? '30px' : '25px', height:w<s ? '30px' : '25px',
                    margin:'0px 10px', color: colorX, borderRadius:'100px', backgroundPosition: 'top right',
                    backgroundSize: '250% 250%', position:'relative'}}>
                <AiFillMessage style={{fontSize:'18px'}}/>
                {unsChatQTY}
            </div>
        )

        const unsRubyQTY = (
            <div className={`${'zoomIn'}`} style={{backgroundColor: 'red', color: '#ffffff', fontSize:'11px', fontWeight:450, textAlign:'center', display: ruby>0 ? '' : 'none',
                minWidth: '18px', height: '18px', borderRadius: '100px', lineHeight: '20px', position:'absolute', top:-5, right:-5}}>
                <span style={{margin:'0px 4px'}}>{ruby}</span>
            </div>
        )

        const rubyIconNav = (
            <div className={`btnShadow C${auth ? fc : 14} center`}
                style={{minWidth:w<s ? '30px' : '25px', width:w<s ? '30px' : '25px', height:w<s ? '30px' : '25px', borderRadius:'100px', margin:'0px 10px', padding:'2px', position:'relative'}}
            >
                <div className={`C${11} center`}
                    style={{width:'100%', height:'100%', borderRadius:'100px', padding:'3px'}}
                >
                    <img
                        className=''
                        style={{objectFit:'contain', width:'100%', height:'100%'}}
                        src={rubyS}
                        alt="ruby"
                    />
                </div>
                {unsRubyQTY}
            </div>
        )

        const projectsIconNav = (
            <div className={`btnShadow C${auth ? fc : 14} center`}
                style={{minWidth:w<s ? '30px' : '25px', width:w<s ? '30px' : '25px', height:w<s ? '30px' : '25px', borderRadius:'100px', margin:'0px 10px', padding:'2px', position:'relative'}}
            >
                <div className={`C${11} center`}
                    style={{width:'100%', height:'100%', borderRadius:'100px', padding:'3px'}}
                >
                    <div className='backProject' style={{width:"17px", height:"17px", borderRadius:'3px'}}></div>
                </div>
            </div>
        )

        const latestIcon = (
            <Link to={`/latest`} className={`center C${auth ? fc : 14}`}
                style={{minWidth:w<s ? '30px' : '25px', width:w<s ? '30px' : '25px', height:w<s ? '30px' : '25px',
                    margin:'0px 10px', color: colorX, borderRadius:'100px', backgroundPosition: 'top right',
                    backgroundSize: '250% 250%', position:'relative'}}
            >
                <BiSolidBookContent style={{fontSize:'17px'}}/>
            </Link>
        )

        const projectsIcon = (
            <Link to={`/projects/${username}`} className={`center C${auth ? fc : 14}`}
                style={{minWidth:w<s ? '30px' : '25px', width:w<s ? '30px' : '25px', height:w<s ? '30px' : '25px',
                    margin:'0px 10px', color: colorX, borderRadius:'100px', backgroundPosition: 'top right',
                    backgroundSize: '250% 250%', position:'relative'}}
            >
                <div className='backProject' style={{width:"17px", height:"17px", borderRadius:'3px'}}></div>
            </Link>
        )

        const projectsLinkIcon = (
            <div>
                <Link to={`/projects/${username}`} >{projectsIconNav}</Link>
                {/* rubyIconNav */}
            </div>
        )

        const rubyLinkIcon = (
            <div>
                <Link to={`/ruby`} >{rubyIconNav}</Link>
                {/* rubyIconNav */}
            </div>
        )

        const bizLinkNav = (
            <div className='d-flex nav' onClick = {() => this.onGoBusiness('user-panel')}
                style={{position:'relative', width:'85px', height:'45px', alignItems:'flex-end', border: '1px solid #d1a44a', borderRadius: mainUser.businessType===0 ? '10px' : '3px', padding:'3px', margin:'0px 10px'}}>
                {userProfileImage}
                <div style={{fontSize:'12px', marginLeft:'5px'}}>Panel</div>
                <PiSquaresFourLight style={{position:'absolute', top:5, right:5}}/>
            </div>
        )

        const logoBoxSide = (
            <div className='center'
                style={{minWidth:'45px', maxWidth:'45px', minHeight:'45px', maxHeight:'45px', borderRadius:'6px', alignItems:'center', padding:'2px'}}>
                <img
                    style={{width:'100%', height:'100%'}}
                    src='https://www.pix.shiningpage.com/whoraly/site/logo.png'
                    alt="Shiningpage logo"
                />
            </div>
        )

        const logoX = (
            <Link to={`/`} className='d-flex' style={{color:'#ba851b', alignItems:'flex-end', direction:'ltr'}}>
                {logoBoxSide}
                {w>1000 && <span className="goldenText" style={{fontSize:'22px', fontWeight:'bold', margin:'0px 10px'}}>Shiningpage</span>}
            </Link>
        )

        const logoSide = <EXV subTitle='Marketing Platform' width='100%' fc={16}/>

        const sidebarIcon = (
            <div className='sticky-top center' onClick={this.onSetSidebarOpen}
                style={{borderRadius:'6px', alignItems:'center', padding:'2px'}}>
                { w<s
                    ?
                    <img
                        style={{minWidth:'35px', maxWidth:'35px', minHeight:'35px', maxHeight:'35px'}}
                        src='https://www.pix.shiningpage.com/whoraly/site/logo.png'
                        alt="logo"
                    />
                    :
                    <div style={{ margin:'10px' }}>
                        <FaBars className='btnShadow' style={{width:'22px', height:'22px' }}/>
                    </div>
                }
            </div>
        )

        const homeIcon = (
            <Link to={`/`}  className='box-c waves-effect waves-light btn-large' onClick={() => this.onToggle('home')}
                style={{width:'100%', height:'100%'}}>
                <div className='center' style={{flexDirection:'column', alignItems:'center', margin: '10px 0px -5px'}}>
                    {page==='home'
                        ? <AiFillHome style={{color: w<s ? '#ffd400' : '#ffffff', width:'23px', fontSize: '28px', transform: 'scaleX(-1)'}}/>
                        : <AiOutlineHome style={{color: '#ffffff', width:'23px', fontSize: '28px', transform: 'scaleX(-1)'}}/>
                    }
                </div>
                <span className="custom-underline" style={{width:'90%', fontSize:'10px', fontWeight:'', color: page==='home' && w<s ? '#ffd400' : '#ffffff', borderBottom: page==='home' && w>s ? '2px solid #ffffff' : ''}}>{setLT.home}</span>
            </Link>
        )

        const notificationNav = (
            <Link to={`/notification`} className='center nav'
                style={{textDecoration:'none', width:'', height:'100%', marginTop:'5px', textAlign:'center', flexDirection:'column'}}>
                {notificationIcon}
                <span style={{fontSize:'12px', whiteSpace:'nowrap'}}>{setLT.notifications}</span>
            </Link>
        )

        const chatNav = (
            <Link to={`/chat`} className='center nav'
                style={{textDecoration:'none', width:'', height:'100%', marginTop:'5px', padding:'0px 0px', textAlign:'center', flexDirection:'column'}}>
                {chatIcon}
                <span style={{fontSize:'12px', whiteSpace: 'nowrap'}}>{setLT.chatList}</span>
            </Link>
        )

        //  to={`/ruby`}
        const rubyNav = (
            <Link to={`/ruby`} className='center nav'
                style={{textDecoration:'none', width:'50px', height:'100%', marginTop:'5px', padding:'0px 0px', textAlign:'center', flexDirection:'column'}}>
                {rubyIconNav}
                <span style={{fontSize:'12px', whiteSpace: 'nowrap'}}>{setLT.ruby}</span>
            </Link>
        )

        const homeNav = (
            <Link to={`/`} className='box-c waves-effect waves-light btn-large' onClick={() => this.onToggle('home')}
                style={{width:'100%', height:'100%', backgroundColor: page==='home' ? '#ffffff20' : ''}}>
                <div className='center' style={{flexDirection:'column', alignItems:'center', margin: '5px 0px -5px'}}>
                    {page==='home'
                        ? <AiFillHome style={{width:'20px', fontSize: '28px'}}/>
                        : <AiOutlineHome style={{width:'20px', fontSize: '28px'}}/>
                    }
                </div>
                <span className="custom-underline" style={{width:'80%', fontSize:'12px', fontWeight:'', color:'', borderBottom: page==='home' ? '1px solid' : ''}}>{setLT.home}</span>
            </Link>
        )

        const latestNav = (
            <Link to={`/latest`} className='box-c waves-effect waves-light btn-large' onClick={() => this.onToggle('latest')}
                style={{width:'100%', height:'100%', backgroundColor: page==='latest' ? '#ffffff20' : ''}}>
                <div className='center' style={{flexDirection:'column', alignItems:'center', margin: '5px 0px -5px'}}>
                    {page==='latest'
                        ? <BiSolidBookContent style={{width:'20px', fontSize: '28px'}}/>
                        : <BiBookContent style={{width:'20px', fontSize: '28px'}}/>
                    }
                </div>
                <span className="custom-underline" style={{width:'80%', fontSize:'12px', fontWeight:'', color:'', borderBottom: page==='latest' ? '1px solid' : ''}}>Latest</span>
            </Link>
        )

        const projectsNav = (
            <Link to={`/projects/${username}`} className='box-c waves-effect waves-light btn-large' onClick={() => this.onToggle('projects')}
                style={{width:'100%', height:'100%', backgroundColor: page==='projects' ? '#ffffff20' : ''}}>
                <div className='center' style={{flexDirection:'column', alignItems:'center', margin: '5px 0px -5px'}}>
                    {page==='projects'
                        ? <div className='backProject' style={{width:"20px", height:"20px", borderRadius:'3px', margin:'5px'}}></div>
                        : <div className='backProject' style={{width:"20px", height:"20px", borderRadius:'3px', margin:'5px'}}></div>
                    }
                </div>
                <span className="custom-underline" style={{width:'80%', fontSize:'12px', fontWeight:'', color:'', borderBottom: page==='projects' ? '1px solid' : ''}}>Projects</span>
            </Link>
        )

        const aboutNav = (
            <Link to={`/about`} className='box-c waves-effect waves-light btn-large' onClick={() => this.onToggle('about')}
                style={{width:'100%', height:'100%', backgroundColor: page==='about' ? '#ffffff20' : ''}}>
                <div className='center' style={{flexDirection:'column', alignItems:'center', margin: '5px 0px -5px'}}>
                    {page==='about'
                        ? <HiUsers style={{width:'20px', fontSize: '28px'}}/>
                        : <HiOutlineUsers style={{width:'20px', fontSize: '28px'}}/>
                    } 
                </div>
                <span className="custom-underline" style={{width:'80%', fontSize:'12px', borderBottom: page==='about' ? '1px solid' : ''}}>{setLT.about}</span>
            </Link>
        )

        const contactNav = (
            <Link to={`/contact`} className='box-c waves-effect waves-light btn-large' onClick={() => this.onToggle('about')}
                style={{width:'100%', height:'100%', backgroundColor: page==='contact' ? '#ffffff20' : ''}}>
                <div className='center' style={{flexDirection:'column', alignItems:'center', margin: '5px 0px -5px'}}>
                    {page==='contact'
                        ? <IoMailSharp style={{width:'20px', fontSize: '28px'}}/>
                        : <IoMailOutline style={{width:'20px', fontSize: '28px'}}/>
                    }
                </div>
                <span className="custom-underline" style={{width:'80%', fontSize:'12px', borderBottom: page==='contact' ? '1px solid' : ''}}>{setLT.contact}</span>
            </Link>
        )

        const loginNav = (
            <Link to={`/login`} className='nav'
                style={{width:'', height:'100%', padding:'10px 15px' ,textAlign:'center'}}>
                <span style={{fontSize:'14px', marginTop:'10px', margin:'0px', whiteSpace: 'nowrap'}}>{auth ? setLT.exit : setLT.login}</span>
            </Link>
        )

        const headerAuthBox = (
            <div className='d-flex' style={{alignItems:'center', width:'100%', justifyContent:'space-between', direction:'ltr'}}>
                {sidebarIcon}
                <div className='d-flex' style={{alignItems:'center', direction:'ltr'}}>
                    {w>=s && <div style={{marginRight:'30px'}}>{logoX}</div>}
                </div>
                <div className='d-flex' style={{width:'100%', alignItems:'center', }}>
                    <div className="d-flex" style={{width:'100%', alignItems:'center', direction:'rtl', justifyContent:'space-between'}}>
                        <div className="d-flex" style={{width:'100%', alignItems:'center', justifyContent:'flex-end', direction:'ltr'}}>
                            <div className="d-flex" style={{alignItems:'center'}}>
                                <div className='d-flex' style={{width: w<s ? '100%' : (w>1200 ? '300px' : '300px'), padding:'0px 10px', justifyContent:'space-between', alignItems:'center', direction: rtl ? 'rtl' : 'ltr'}}>
                                    {homeNav}
                                    {latestNav}
                                    {projectsNav}
                                    {/* aboutNav */}
                                    {/* contactNav */}
                                </div>
                                {auth && w>1000 && <div style={{width:'30px'}}></div>}
                                <div className='d-flex' style={{width: w<s ? '100%' : w>1200 ? '320px' : '320px', padding:'0px 10px', justifyContent:'space-between', alignItems:'center', direction:'ltr'}}>
                                    {notificationNav}
                                    {chatNav}
                                    {rubyNav}
                                    <UserBox/>
                                </div>
                                {auth && w>1000 && <div style={{width:'30px'}}></div>}
                                {/* !auth && loginNav */}
                                {/* !auth && <div>|</div> */}
                                {/* <LangBox/> */}
                            </div>
                        </div>
                        <Search/>
                    </div>
                </div>
            </div>
        )

        const headerAuthBoxM = (
            <div className='d-flex' style={{alignItems:'center', width:'100%', justifyContent:'space-between', direction:'ltr'}}>
                <div className='d-flex' style={{alignItems:'center'}}>
                    {sidebarIcon}
                    <Search/>
                </div>
                <div className='d-flex' style={{alignItems:'center', gap:'10px'}}>
                    {/* <div style={{margin:'0px 5px'}}><LangBox/></div> */}
                    {auth ? <UserBox/> : loginBox}
                </div>
            </div>
        )

        const header = (
            <div className='sticky-top cardShadow' style={{top:w<s ? (scrollDirection==='up' ? -45 : 0) : 0, transition:'.5s'}}>
                <div className='backBlur' style={{height:NavHX, alignItems:'center', backgroundColor:'#ffffff99', borderBottom:'0px solid #d1a44a',
                    justifyContent:'space-between', transition:'.5s'}}>
                    <div className='d-flex' style={{height:NavHX, alignItems:'center', padding:w<s ? '0px 5px' : '0px'}}>
                        <div className='d-flex' style={{justifyContent:'space-between', alignItems:'center', width:'100%', direction:'rtl'}}>{w<s ? headerAuthBoxM : headerAuthBox}</div>
                    </div>
                </div>
                {hrC14}
                { auth && mainUser.ruby &&
                    <div className='center' style={{ backgroundColor:'red', color:'#ffffff', fontWeight:450, textAlign:'center' }}
                        onClick={() => this.onToggleViewStatus()}
                    >
                        <span className='underline'>
                            {setLT.rubyCollectionList}
                        </span>
                        { !rubyDone &&
                            <div className='d-flex' style={{alignItems:'center'}}>
                                <div style={{width:'20px'}}></div>
                                <div>{rubyInterval.done + '/' + rubyInterval.ruby}</div>&nbsp;
                                <img
                                    className='C11'
                                    style={{objectFit:'contain', width:'15px', height:'15px', borderRadius:'2px'}}
                                    src={rubyS}
                                    alt="ruby"
                                />
                            </div>
                        }
                    </div>
                }
            </div>
        )

        const sidebarHeader = (
            <div className='center sticky-top cardShadow'
                style={{height: '90px', top:'0px', padding:'0px 10px', borderRight:rtl ? '' : '1px solid #ffffff40', borderLeft:rtl ? '1px solid #ffffff40' : '',
                    position:'fixed', top:0, flexDirection:'column', alignItems:'center', width:'100%'}}>
                <MdClose style={{width:'20px', fontSize:'20px', cursor:'pointer', position:'absolute', //display:w<s ? '' : 'none',
                    top:'10px', left:'10px', border:'1px', color:'#ffffff'}}
                    onClick={() => this.onSetSidebarOpen()}
                />
                {logoSide}
            </div>
        )

        const navItemsStyle = {textDecoration: "none", color:'#ffffff', alignItems:'center', height:'40px'}

        const homeBtn = (
            <Link to={`/`} className={`d-flex ${page==='home' ? 'sidebarItemFix' : (w<s ? '' : 'sidebarItem')}`} style={navItemsStyle} onClick={() => this.onSetSidebarOpen()}>
                <AiFillHome style={{width:'23px', margin:'10px 20px', fontSize:'23px'}}/>
                <div style={{margin:rtl ? '10px' : '13px 10px 10px', fontSize:'15px', fontWeight:450}}>{setLT.home}</div>
            </Link>
        )

        const aboutBtn = (
            <Link to={`/about`} className={`d-flex ${page==='about' ? 'sidebarItemFix' : (w<s ? '' : 'sidebarItem')}`} style={navItemsStyle} onClick={() => this.onSetSidebarOpen()}>
                <HiUsers style={{width:'23px', margin:'10px 20px', fontSize:'23px'}}/>
                <div style={{margin:rtl ? '10px' : '13px 10px 10px', fontSize:'15px', fontWeight:450}}>{setLT.about}</div>
            </Link>
        )

        const contactBtn = (
            <Link to={`/contact`} className={`d-flex ${page==='contact' ? 'sidebarItemFix' : (w<s ? '' : 'sidebarItem')}`} style={navItemsStyle} onClick={() => this.onSetSidebarOpen()}>
                <IoMailSharp style={{width:'23px', margin:'10px 20px', fontSize:'23px'}}/>
                <div style={{margin:rtl ? '10px' : '13px 10px 10px', fontSize:'15px', fontWeight:450}}>{setLT.contact}</div>
            </Link>
        )

        const reviewsBtn = (
            <Link to={`/reviews`} className={`d-flex ${(page==='reviews') ? 'sidebarItemFix' : (w<s ? '' : 'sidebarItem')}`} style={navItemsStyle} onClick={() => this.onSetSidebarOpen()}>
                <MdReviews style={{width:'23px', margin:'10px 20px', fontSize:'23px'}}/>
                <div style={{margin:rtl ? '10px' : '13px 10px 10px', fontSize:'15px', fontWeight:450}}>{setLT.memberReviews}</div>
            </Link>
        )

        const dashboardBtn = (
            <Link to={`/dashboard`} className={`d-flex ${(page==='dashboard') ? 'sidebarItemFix' : (w<s ? '' : 'sidebarItem')}`} style={navItemsStyle} onClick={() => this.onSetSidebarOpen()}>
                <AiOutlineDashboard style={{width:'23px', margin:'10px 20px', fontSize:'23px'}}/>
                <div style={{margin:rtl ? '10px' : '13px 10px 10px', fontSize:'15px', fontWeight:450}}>Dashboard</div>
            </Link>
        )

        const signInBtn = (
            <Link to={`/login`} className={`d-flex sidebarItem`} style={navItemsStyle}>{/*  onClick={() => this.setState({loginItems: !this.state.loginItems})} */}
                {/* n1 */}
                <FaUser style={{width:'20px', margin:'10px 18px', fontSize:'18px'}}/>
                <div className='' style={{width:'140px', margin:'10px', fontSize:'13px', border: !loginItems ? '2px solid #00CCFF' : '', backgroundColor:'#00CCFF99', borderRadius:'3px', padding: auth ? '' : '0px 0px', textAlign:!loginItems ? 'center' : ''}} onClick={() => this.onLogin()}>{setLT.signupLogin}{/* &nbsp;openIcon */}</div>
            </Link>
        )

        const currentVersion = (
            <div className='center' style={{paddingTop:'10px'}}>
                Current Version: {version}
            </div>
        )

        const updateVersion = (
            <div className='' style={{alignItems:'center', height:'40px', marginTop:'20px', padding:toggleSidebar ? '0px 20px' : ''}}>
                <UpdateVersion color={toggleSidebar ? '#ffffff' : ''} fontWeight={toggleSidebar ? 450 : ''}/>
            </div>
        )

        const versionSection = (
            <div style={{ color:'#ffffff' }}>
                {/* loginNav */}
                {updateVersion}
                {currentVersion}
            </div>
        )

        const hrS = <hr style={{border:'.5px solid #ffffff', opacity:'1'}}/>

        const sidebarItems = (
            <div style={{padding:'100px 0px 10px', fontWeight:'', height:h, overflow:'scroll'}}>
                {homeBtn}
                {aboutBtn}
                {contactBtn}
                {reviewsBtn}
                {fullAccess && dashboardBtn}
                {hrS}
                {updateVersion}
                {/* signInBtn */}
                {/* signOutBtn */}
            </div>
        )

        // display: pageX ? '' : 'none'
        var pageX = ['base', 'home'].includes(page) ? true : false
        const footerX = (
            <div className='cardShadow backBlur' style={{width:'100%', height:'45px', position:'fixed', bottom:scrollDirection==='down' ? -43 : 0, right:0, left:0, backgroundColor:'#ffffff99', zIndex:'1050', transition:'.5s'}}>
                {hrC14}
                <div className='center'
                    style={{width:'100%', height:'100%', padding: '0px 10px', marginTop:'-2px', alignItems:'center', justifyContent:'space-between', direction:'ltr'}}
                >
                    {/* bizLinkIcon */}
                    {latestIcon}
                    <Link to={`/notification`} >{notificationIcon}</Link>
                    {rubyLinkIcon}
                    <Link to={`/chat`} >{chatIcon}</Link>
                    {projectsLinkIcon}
                    {/* {webLinkIcon} */}
                </div>
            </div>
        )

        const sidebarConst = (
            <div className='sticky-top'
                style={{top:0, left:0, minHeight: window.innerHeight}}>
                <div className='backBlur' style={{backgroundColor:'#C5DAF500' }}>
                    <div style={{minHeight: window.innerHeight}}>
                        {sidebarHeader}
                        {sidebarItems}
                    </div>
                </div>
            </div>
        )

        const modalMembership = (
            <Modal show={membership} onHide={() => this.toggleMembership()}>
                <Modal.Header style={{padding:'10px', backgroundColor:'#ffffff99'}}>
                    <MdClose style={{width:'20px', fontSize:'20px', cursor:'pointer'}} onClick={() => this.toggleMembership()}/>
                </Modal.Header>
                <Modal.Body style={{textAlign: rtl ? 'right' : 'left', backgroundColor:'#ffffff99'}}>
                    <div style={{backgroundColor:'', padding:'10px', borderRadius:'5px', border:'1px solid #999999'}}>
                        <p>{setLT.mustSignUp}</p>
                        <h6>{setLT.freeSignUp}</h6>
                    </div>
                </Modal.Body>
                <Modal.Footer className='center' style={{textAlign: rtl ? 'right' : 'left', backgroundColor:'#ffffff99'}}>
                    <span onClick={() => this.setModals()}>{signInBtn}</span>
                </Modal.Footer>
            </Modal>
        )

        const modalSendMessage = (
            <Modal show={sendMessage} onHide={() =>null}>
                <Modal.Header style={{padding:'10px', backgroundColor:'#ffffff99'}}>
                    <MdClose className='sidebarIcon' style={{width:'20px', fontSize:'20px', cursor:'pointer'}} onClick={() => this.toggleSendMessage()}/>
                </Modal.Header>
                <Modal.Body style={{fontSize:'14px', textAlign: rtl ? 'right' : 'left', backgroundColor:'#ffffff99'}}>
                    <SendMessage/>
                </Modal.Body>
            </Modal>
        )

        const modalChat = (
            <Modal show={toggleChat}
                onHide={() => this.onToggleChat()}
                size="lg"
                dialogClassName="chat-modal"
            >
                <SubChat/>
            </Modal>
        )

        const modalViewStatus = (
            <Modal show={toggleViewStatus.toggle}
                onHide={() => this.onToggleViewStatus()}
            >
                <ModalViewStatus/>
            </Modal>
        )

        const modalChatList = (
            <Modal show={toggleChatList}
                onHide={() => this.onToggleChatList()}
                size="lg"
            >
                <ChatList/>
            </Modal>
        )

        const modalShowVideo = (
            <Modal show={toggleShowVideo}
                onHide={() => this.onToggleShowVideo()}
                size="lg"
            >
                <VideoShow/>
            </Modal>
        )

        const modalLoading = (
            <Modal show={toggleLoading} centered size='lg'
                onHide={() => this.onToggleLoading()}
                className='Cmodal'
            >
                <Modal.Body className='center' style={{height:'200px', backgroundColor:'#ffffff00', direction:'ltr'}}>
                    loading...
                </Modal.Body>
            </Modal>
        )

        const backG = (
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
                    backgroundImage: `url(${require("./assets/images/other/international.jpg")})`, backgroundSize: 'cover', backgroundPosition: 'right center'
                }}
            >
            </div>
        )

        const hrF = <hr className='C7' style={{height:'1px', margin:'0px 0px 15px', opacity:'1'}}/>
        const footerStyle = {padding:'10px', width:'100%'}
        const titleStyle = {fontWeight:'bold'}

        const subStyle = {fontSize:'14px', margin: '0px', alignItems:'center', direction: rtl ? 'ltr' : 'ltr', color:''}

        const supportBtn = (
            <div>
                <div className={`d-flex`} style={{...navItemsStyle, color:''}}>
                    <BiSupport style={{width:'22px', margin:'10px 0px', fontSize:'22px', color:''}}/>
                    <div style={{margin:rtl ? '10px 7px' : '13px 7px 10px', fontSize:'15px', color:''}}>{setLT.supportContacts}</div>
                </div>
                <div style={{margin: rtl ? '' : '5px 0px 20px 8px'}}>
                    {/* <div className='d-flex' style = {subStyle}>
                        <IoLogoWhatsapp className='' style={{fontSize:'23px', margin:'0px', color:'#5ebc43'}}/>
                        <span style={{margin:'5px 10px 0px'}}>+98 913 790 87 97</span>
                    </div> */}
                    {/* <div className='d-flex' style = {subStyle}>
                        <IoLogoWhatsapp className='' style={{fontSize:'23px', margin:'0px', color:'#5ebc43'}}/>
                        <span style={{margin:'5px 10px 0px'}}>+44 7513 340495</span>
                    </div> */}
                    <div className='d-flex' style = {subStyle}>
                        <MdEmail className='' style={{fontSize:'22px', margin:'0px', color:'#D54238'}}/>
                        <span style={{margin:'5px 10px 0px'}}>hello@shiningpage.com</span>
                    </div>
                </div>
            </div>
        )

        const instagramSub = (
            <a className='d-flex' href={`https://www.instagram.com/whoraly_uk`} target="_blank" style={{}}>
                <AiFillInstagram className='' style={{fontSize:'30px', margin:'0px', color:'#D5AD6D', borderRadius:'5px', border:'1px solid #D5AD6D', backgroundColor:'#ffffff99'}}/>
            </a>
        )

        const linkedinSub = (
            <a className='d-flex' href={`https://www.linkedin.com/in/mahmoudsadollahi/`} target="_blank" style={{}}>
                <FaLinkedin className='' style={{fontSize:'30px', margin:'0px', color:'#D5AD6D', borderRadius:'5px', padding:'2px', border:'1px solid #D5AD6D', backgroundColor:'#ffffff99'}}/>
            </a>
        )

    //`https://www.youtube.com/channel/UCd2v5xsfTfhIeSUVWiv3WRA`
        const youtubeSub = (
            <a className='d-flex' href={'https://www.youtube.com/@mahmoudsadollahi3377'} target="_blank" style={{}}>
                <FaYoutube className='' style={{fontSize:'30px', margin:'0px', color:'#D5AD6D', borderRadius:'5px', border:'1px solid #D5AD6D', backgroundColor:'#ffffff99'}}/>
            </a>
        )

        const socialMedia = (
            <div className='d-flex' style={{margin:'30px 0px', alignItems:'center'}}>
                {instagramSub}&nbsp;&nbsp;&nbsp;
                {linkedinSub}&nbsp;&nbsp;&nbsp;
                {youtubeSub}
            </div>
        )

        const shiningpage = (
            <Link to={`/`} className='d-flex sticky-top' style={{textDecoration:'none', alignItems:'flex-start', marginBottom:'-7px', color:'#000000', zIndex:'1'}}>
                <div className='center C7' style={{width:'35px', height:'35px', borderRadius:'6px', alignItems:'center', padding:'2px', margin:'0px 5px -8px -5px'}}>
                    <div className='logo' style={{width:'100%', height:'100%'}}></div>
                </div>
                <div className="nav" style={titleStyle}>
                    SHINING PAGE &nbsp;
                    <span style={{fontSize:'12px'}}>(Version: {version})</span>
                </div>
            </Link>
        )


        const modalSidebar = (
            <ModalSidebarShiningpage
                ref={this.sidebarRef}
                dispatch={this.props.dispatch}
                rtl={rtl}
                fc={fc}
                logoSide={logoSide}
                loginNav={loginNav}
                content={sidebarConst}
                updateVersion={updateVersion}
                isOpen={toggleSidebar}
                toggleSidebar={this.onSetSidebarOpen}
            />
        )

        const footer1 = (
            <div style={footerStyle}>
                {shiningpage}
                {hrF}
                {/* supportBtn */}
                {/* socialMedia */}
                {updateVersion}
            </div>
        )

        const footer2Style = {textDecoration:'none', marginBottom:'10px'}
        const footer2 = (
            <div style={footerStyle}>
                <div style={titleStyle}>SHORTCUTS</div>
                {hrF}
                <Link to={`/`} className='nav' onClick={() => this.onToggle('home')} style={footer2Style}>
                    <span style={{whiteSpace:'nowrap'}}>{setLT.home}</span>
                </Link>
                <Link to={`/latest`} className='nav' onClick={() => this.onToggle('latest')} style={footer2Style}>
                    <span style={{whiteSpace:'nowrap'}}>Latest posts</span>
                </Link>
                <Link to={`/contact`} className='nav' onClick={() => this.onToggle('contactUs')} style={footer2Style}>
                    <span style={{whiteSpace:'nowrap'}}>{setLT.contact}</span>
                </Link>
                <Link to={`/about`} className='nav' style={footer2Style}>
                    <span style={{whiteSpace:'nowrap'}}>{setLT.about}</span>
                </Link>
                <Link to={`/reviews`} className='nav' style={footer2Style}>
                    <span style={{whiteSpace:'nowrap'}}>{setLT.memberReviews}</span>
                </Link>
                {/* <hr style={{width:'150px'}}/>
                <Link to={`/login`} className='nav' style={{...footer2Style, marginBottom:'30px'}}>
                    <span style={{whiteSpace:'nowrap'}}>{setLT.signupLogin}</span>
                </Link> */}
            </div>
        )

        const footer3 = (
            <div style={footerStyle}>
                <div style={titleStyle}>MISSION</div>
                {hrF}
                <div style={{marginBottom:'20px', fontSize:'14px', direction:rtl ? 'rtl' : '', textAlign:rtl ? 'justify' : ''}}>
                    <div style={{fontWeight:450, marginBottom:'10px'}}>{setLT.missionT1}</div>
                    <div style={{lineHeight:'25px'}}>{setLT.missionT2}</div>
                </div>
                {/* <PsychologyBtn/> */}
            </div>
        )

        const copyRight = (
            <div style={{width:'100%', height:'50px', backgroundColor:'#ffffff50', marginBottom:w<s && ['base', 'home'].includes(page) ? '50px' : ''}}>
                <Container className='d-flex' style={{height:'100%', padding:'10px', alignItems:'center'}}>
                    <div style={{textAlign:w<s ? 'center' : 'left', width:'100%', padding:'0px', direction:rtl ? 'rtl' : 'ltr'}}>
                        {setLT.copyRight}
                    </div>
                </Container>
            </div>
        )

        const tosNav = (
            <Link to={`/tos`} className='box-c waves-effect waves-light btn-large'
                style={{width:'200px', height:'100%'}}>
                <span className="custom-underline" style={{width:'80%', fontSize:'12px', fontWeight:450, borderBottom: page==='tos' ? '1px solid #000000' : ''}}>ToS</span>
            </Link>
        )

        const privacyNav = (
            <Link to={`/privacy`} className='box-c waves-effect waves-light btn-large'
                style={{width:'270px', height:'100%'}}>
                <span className="custom-underline" style={{width:'80%', fontSize:'12px', fontWeight:450, borderBottom: page==='privacy' ? '1px solid #000000' : ''}}>Privacy</span>
            </Link>
        )

        const disclaimerNav = (
            <Link to={`/disclaimer`} className='box-c waves-effect waves-light btn-large'
                style={{width:'340px', height:'100%'}}>
                <span className="custom-underline" style={{width:'80%', fontSize:'12px', fontWeight:450, borderBottom: page==='disclaimer' ? '1px solid #000000' : ''}}>Disclaimer</span>
            </Link>
        )

        const sitemapNav = (
            <Link to={`/sitemap`} className='box-c waves-effect waves-light btn-large'
                style={{width:'290px', height:'100%'}}>
                <span className="custom-underline" style={{width:'80%', fontSize:'12px', fontWeight:450, borderBottom: page==='sitemap' ? '1px solid #000000' : ''}}>Sitemap</span>
            </Link>
        )

        const footbar = (
            <div className='C14 d-flex justify-content-center'
                style={{height:w<s ? '30px' : '40px', color:'#000000', alignItems:'center',
                justifyContent:'space-between', padding: '0px', top:'500px', transition:'.5s'}}>
                <div className='d-flex' style={{width: w<s ? '100%' : '350px', padding:'0px', justifyContent:'space-between', alignItems:'center', direction:'ltr'}}>
                    {tosNav}|
                    {privacyNav}|
                    {disclaimerNav}|
                    {sitemapNav}
                </div>
            </div>
        )

        const footer = (
            <div className="backBlur" style={{marginTop: w<s && ['web', 'ps'].includes(page) ? '' : '0px', backgroundColor:'#ffffff99', borderTop:'0px solid #d1a44a', direction:'ltr'}}>
                {hrC14}
                <Container style={{padding:'10px 0px 0px'}}>
                    <div className='d-flex' style={{padding:'0px 10px', flexWrap:w<s ? 'wrap' : ''}}>
                        {footer1}
                        {footer2}
                        {footer3}
                    </div>
                </Container>
            </div>
        )

        const NotFound = (
            <Container>
                <h1 className="animated fadeInDown" style={{ animationDelay: '1s', margin: '30px 10px' }}>
                    Page Not Found
                </h1>
                <p className="animated fadeInDown" style={{ animationDelay: '1.5s', margin: '30px 10px' }}>
                    Sorry, the page you are looking for does not exist.
                </p>
            </Container>
        )

        // console.log('page: ', this.props.page)

        return (
            <Router>
                <div className='' style={{fontSize:'14px', fontFamily:'Vazir', minHeight:h, direction: rtl ? 'rtl' : 'ltr', backgroundColor:''}}>{/* `${colors[`C${subUserInfo.fc}`]}00` */}
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>{this.props.pageTitle}</title>
                        {noIndexPages.includes(page) && (
                            <meta name="robots" content="noindex, follow" />
                        )}
                        {page==='publisher' && username && !noIndexPages.includes(page) && (
                            <link rel="canonical" href={`https://www.shiningpage.com/publisher/${username}`} />
                        )}
                        {page==='content' && username && slug && (
                            <link rel="canonical" href={`https://www.shiningpage.com/publisher/${username}/${slug}`} />
                        )}
                    </Helmet>
                    <div className=''>
                        <div className='d-flex' style={{width:'100%', flexDirection:'column'}}>
                            {!['publisher', 'user', 'content', 'web', 'ps', ''].includes(page) && backG}
                            {header}
                            {/* !['web', 'ps'].includes(page) && header */}
                            {!['publisher', 'user', 'content', 'web', 'ps'].includes(page) && <Addressbar content={[]} fix={address.fix}/>}

                            {/*  page404
                            ?
                            <h1 className='fadeInDown' style={{animationDelay:'1s', margin:'30px 10px', color:'#ffffff'}}>
                                Page Not Found
                            </h1>
                            :
                            <main style={{ marginTop: "0rem" }}><Routes/></main>
                            */}
                            {!notFound ? <main><Routes/></main> : NotFound}

                            {/* (w>s && !['web', 'ps'].includes(page) ) && sidebarConst */}
                            <div>
                                {modalLoading}
                                {modalSidebar}
                                {modalChat}
                                {modalShowVideo}
                                {modalMembership}
                                {modalSendMessage}
                                {modalViewStatus}
                                {modalChatList}
                            </div>
                            {!['publisher', 'user', 'content', 'web', 'ps'].includes(page) && footer}
                            {w<s && footerX}
                            {w<s && hrC14}
                            {footbar}
                        </div>
                    </div>
                </div>
            </Router>
        )

    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        mainUser: state.userInfo,
        userId: state.userInfo['_id'],
        username: state.userInfo['username'],
        slug: state.userInfo['slug'],
        fc: state.userInfo.fc,
        access: state.userInfo.access,
        businessType: state.userInfo.businessType,
        mainName: state.userInfo['mainName'],
        genderValue: state.userInfo['genderValue'],
        userImg: state.userInfo['imageData'],
        lang: state.lang,
        rtl: state.rtl,
        auth: state.auth,
        membership: state.membership,
        sendMessage: state.sendMessage,

        geo: state.geo,
        page: state.page,
        subject: state.subject,
        pageName: state.pageName,
        pageTitle: state.pageTitle,

        subSelected: state.subUserInfo.selected,
        subUserId: state.subUserInfo['_id'],
        subUserType: state.subUserInfo['subUserType'],
        subMainName: state.subUserInfo['mainName'],
        subUsername: state.subUserInfo['username'],
        subBusinessType: state.subUserInfo.businessType,
        subPassword: state.subUserInfo['password'],
        subEmail: state.subUserInfo['email'],
        subGenderValue: state.subUserInfo['genderValue'],
        subBirthDate: state.subUserInfo['birthDate'],
        subMotherName: state.subUserInfo['motherName'],
        subCommonName: state.subUserInfo['commonName'],
        subImageData: state.subUserInfo['imageData'],
        userInfo: state.userInfo,
        subUserInfo: state.subUserInfo,
        notSeenChatQTY: state.notSeenChatQTY,
        toggleShowVideo: state.toggleShowVideo,
        toggleSidebar: state.toggleSidebar,
        toggleChat: state.toggleChat,
        toggleNotificationList: state.toggleNotificationList,
        toggleChatList: state.toggleChatList,
        setLT: state.setLT,
        toggleLoading: state.toggleLoading,
        access: state.userInfo.access,
        fullAccess: state.fullAccess,
        page404: state.page404,
        updateVersionDate: state.updateVersionDate,
        address: state.address,
        pageYOffset: state.pageYOffset,
        ruby: state.ruby,
        objects: state.objects,
        toggleViewStatus: state.toggleViewStatus,
        rubyInterval: state.rubyInterval,
    }
}
export default connect (mapStateToProps)(App);
