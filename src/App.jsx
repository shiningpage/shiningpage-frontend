import React, { Component, createRef } from 'react';
import { Helmet } from "react-helmet";
import axios from 'axios';
import { connect } from 'react-redux';
import { Container, Modal } from 'react-bootstrap';
import { BrowserRouter as Router , Link, NavLink } from "react-router-dom";
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
    setObjects, setRubyInterval, setSubChatInfo, 
} from './dataStore/actions';
import SubChat from './components/SubChat';
import SendMessage from './components/SendMessage';
import setLangText from './modules/setLangText';
import VideoShow from './components/VideoShow';
import EXV from './components/EXV';
import Addressbar from './components/Addressbar';
import ModalViewStatus from './components/modals/ModalViewStatus';
import ChatList from './components/modals/ModalChatList';
import { FaCrown, FaBell, FaRegBell, FaYoutube, FaLinkedin, FaUser, FaBars, FaRegCopyright, FaRegStar } from 'react-icons/fa';
import { FaAngleRight } from "react-icons/fa6";
import { RiPagesLine, RiLogoutCircleLine, RiLogoutCircleRLine } from "react-icons/ri";
import { IoIosGitNetwork } from "react-icons/io";
import { FiBell } from "react-icons/fi";
import { TbLockPassword } from "react-icons/tb";
import { MdOutlineRateReview, MdReviews, MdEmail, MdOutlineMailOutline, MdClose } from 'react-icons/md';
import { HiOutlineUsers, HiUsers } from "react-icons/hi2";
import { AiOutlineRuby, AiOutlineHome, AiOutlineDashboard, AiFillMessage, AiFillInstagram, AiFillHome } from 'react-icons/ai';
import { BiSupport, BiMessageSquareEdit } from 'react-icons/bi';
import { AiFillDashboard, AiFillProduct, AiOutlineProduct } from "react-icons/ai";
import { PiSquaresFourLight } from "react-icons/pi";
import { CiBellOn } from "react-icons/ci";
import { BiBookContent, BiSolidBookContent } from "react-icons/bi";
import { IoColorPaletteOutline, IoChatbubbleEllipsesOutline, IoMailOutline, IoMailSharp, IoLocationOutline } from "react-icons/io5";
import { GrProjects, GrDashboard } from "react-icons/gr";
import { VscDashboard } from "react-icons/vsc";
import UpdateVersion from './components/UpdateVersion';
import ModalWebPageTheme from './components/modals/ModalWebPageTheme';
import ModalChangePassword from './components/modals/ModalChangePassword';
import LangBox from './components/LangBox';
import UserBox from './components/UserBox';
import Search from './components/Search';
import ModalSidebarShiningpage from './components/modals/ModalSidebarShiningpage';
import { logout, identifyObj, exist, getBalance, scrollStatus, checkRubyInterval, } from './helper';
import { serverURL, s, NavH, langArray, countryArr, noIndexPages } from './srcSet';
import aiImage from "./assets/images/other/ai-background.jpg";

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
            lastScrollTop: 0,
            notSeenChatQTY: 0,
            notSeenNotificationQTY: 0,
            isSidebarOpen: false,
            notFound: false,
            objects: [],
            seenElements: new Map(), // نگه‌داری المنت‌هایی که یک بار کامل دیده شده‌اند
            socialMediaIndex: false,
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
        if(this.props.mainUser?.access?.includes('socialMedia')) {
            this.setState({ socialMediaIndex: true })
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

            if(import.meta.env.VITE_VERSION!==res.data.site && checkTime) {
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
        this.props.dispatch(setToggleSidebar(!this.props.toggleSidebar))
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

    toggleWebPageTheme = () => {
        this.setState({
            toggleWebPageTheme: !this.state.toggleWebPageTheme,
        });
    }

    toggleChangePassword = () => {
        this.setState({
            toggleChangePassword: !this.state.toggleChangePassword,
        });
    }

    onCreateTicket = async (ID, e) => {
        const index = e?.target?.id==='chatDelete' ? false : true
        if(index) {
            this.setState({loadingTicket:true})
            if(ID.receiverId!=='unknown') {
                var user = await axios.post(`${serverURL}/user/getUserInfo`, { _id: ID })
                var item = user.data
                delete item.password
                if(item) this.props.dispatch(setSubChatInfo(item))
            } else {
                ID._id='unknown'
                this.props.dispatch(setSubChatInfo(ID))
            }
            this.props.dispatch(setToggleChat(true))
            this.setState({loadingTicket:false})
        }
    }

    render() {
        const { w, h, loadingTicket, socialMediaIndex, toggleChangePassword, toggleWebPageTheme, notFound, scrollDirection, leaveChatList, leaveNotificationList, notSeenNotificationQTY, notSeenChatQTY } = this.state
        const { auth, address, fc, setLT, mainUser, subUserInfo, toggleSidebar, toggleShowVideo, fullAccess, 
            toggleLoading, membership, sendMessage, toggleChat, username, slug, genderValue, lang, rtl, page,
            businessType, toggleViewStatus, toggleChatList, ruby, rubyInterval, balance, 
        } = this.props
        const loader13 = <div className='loader-13' style={{margin: '0px 20px', color:''}}></div>
        const me = mainUser._id===subUserInfo._id ? true : false

        // var fc = 13
        const rubyDone = rubyInterval.done!==0 && rubyInterval.done >= rubyInterval.ruby ? true : false

        const rubyIndex = auth
                            ? mainUser.access.includes('ruby') ? true : false 
                            : false
        const NavHX = w<s ? 45 : NavH
        const colorX = [0, 4, 11].includes(fc) ? '#00000099' : '#ffffff'
        const hrC14 = <div className='C14' style={{width:'100%', height:'3px'}}></div>
        const hrC14Thin = <div className='C14' style={{width:'100%', height:'1px', opecity:'.1'}}></div>
        const hrC14Short = <div className='C14 w-15 h-[2px] mb-4'></div>

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
            <div className='sticky-top center' onClick={() => this.onToggleSidebar()}
                style={{borderRadius:'6px', alignItems:'center', padding:'2px'}}>
                { w<s
                    ?
                    <img
                        style={{minWidth:'35px', maxWidth:'35px', minHeight:'35px', maxHeight:'35px'}}
                        src='https://www.pix.shiningpage.com/whoraly/site/logo.png'
                        alt="logo"
                    />
                    :
                    <div className='mr-[10px]'>
                        <button className="p-1 rounded-full border-0 !border-[#e5bc7b] transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-110 active:scale-95">
                            <FaBars className="w-6 h-6 text-[#e5bc7b]" />
                        </button>
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
            <Link to={`/notification`} className='center white-nav'
                style={{textDecoration:'none', width:'', height:'100%', marginTop:'5px', textAlign:'center', flexDirection:'column'}}>
                {notificationIcon}
                <span style={{fontSize:'12px', whiteSpace:'nowrap'}}>{setLT.notifications}</span>
            </Link>
        )

        const chatNav = (
            <Link to={`/chat`} className='center white-nav'
                style={{textDecoration:'none', width:'', height:'100%', marginTop:'5px', padding:'0px 0px', textAlign:'center', flexDirection:'column'}}>
                {chatIcon}
                <span style={{fontSize:'12px', whiteSpace: 'nowrap'}}>{setLT.chatList}</span>
            </Link>
        )

        //  to={`/ruby`}
        const rubyNav = (
            <Link to={`/ruby`} className='center white-nav'
                style={{textDecoration:'none', width:'50px', height:'100%', marginTop:'5px', padding:'0px 0px', textAlign:'center', flexDirection:'column'}}>
                {rubyIconNav}
                <span style={{fontSize:'12px', whiteSpace: 'nowrap'}}>{setLT.ruby}</span>
            </Link>
        )

        const homeNav = (
            <Link to={`/`} className=' box-c waves-effect waves-light btn-large' onClick={() => this.onToggle('home')}
                style={{width:'100%', height:'100%', backgroundColor: page==='home' ? '#ffffff20' : ''}}>
                <div className='center' style={{flexDirection:'column', alignItems:'center', margin: '5px 0px -5px'}}>
                    {page==='home'
                        ? <AiFillHome style={{width:'20px', fontSize: '28px'}}/>
                        : <AiOutlineHome style={{width:'20px', fontSize: '28px'}}/>
                    }
                </div>
                <span className="custom-underline" style={{width:'80%', fontSize:'12px', fontWeight:'', color:'#ffffff', borderBottom: page==='home' ? '1px solid' : ''}}>{setLT.home}</span>
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
                <span className="custom-underline" style={{width:'80%', fontSize:'12px', fontWeight:'', color:'#ffffff', borderBottom: page==='latest' ? '1px solid' : ''}}>Latest</span>
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
                <span className="custom-underline" style={{width:'80%', fontSize:'12px', fontWeight:'', color:'#ffffff', borderBottom: page==='projects' ? '1px solid' : ''}}>Projects</span>
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

        const navLinks = [
            { key: "home", to: "/", label: "Home" },
            { key: "latest", to: "/latest", label: "Latest Posts" },
            { key: "about", to: "/about", label: "About" },
            { key: "contact", to: "/contact", label: "Contact" },
            { key: "pricing", to: "/pricing", label: "Pricing" },
        ];

        const navGap = w >= 1600
                        ? 40
                        : Math.max(10, 40 - Math.floor((1600 - w) / 100) * 5);

        const navbar = (
            <div className="flex" style={{ gap: `${navGap}px` }}>
                {navLinks.map(({ key, to, label }) => (
                    <NavLink key={key} to={to}
                        className={`relative !no-underline text-[14px] font-medium transition-all duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-center after:rounded-full after:bg-[#d5ad6d] after:transition-transform after:duration-300 hover:text-[#d5ad6d] hover:after:scale-x-100
                            ${page === key ? "goldenText after:scale-x-100" : "text-white after:scale-x-0"}`
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </div>
        )

        const plan = (
            <Link to={auth ? '/pricing' : '/login'} className={`!no-underline group flex items-center gap-${w<s ? 1 : 3} px-${w<s ? 2 : 3} py-1 rounded-lg ${w<s ? '' : 'border'} border-[#d5ad6d] text-white cursor-pointer select-none transition-all duration-300 ease-out hover:scale-105 hover:bg-[#d5ad6d]/10 hover:shadow-[0_0_18px_rgba(213,173,109,0.55)] active:scale-95 active:bg-[#d5ad6d]/20 active:shadow-[0_0_8px_rgba(213,173,109,0.8)] focus:outline-none focus:ring-${w<s ? 0 : 2} focus:ring-[#d5ad6d]/60`}>
                {w>s && auth && <FaCrown className="goldenText w-6 h-6 -mt-1 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-active:scale-95" />}
                <div>
                    {auth && <div className="text-[12px] -mb-1">Free Plan</div>}
                    <div className="goldenText text-[14px] font-semibold transition-all duration-300 group-hover:tracking-wide group-active:scale-95">
                        {auth ? 'Upgrade' : 'Sign up | Login'}
                    </div>
                </div>
                {w>s && auth && <FaAngleRight className="transition-all duration-300 group-hover:translate-x-1 group-active:translate-x-2" />}
            </Link>
        )

        const headerAuthBox = (
            <div className='flex bg-cover bg-right px-[10px]' style={{alignItems:'center', width:'100%', justifyContent:'space-between', direction:'ltr'}}>
                {w<s && sidebarIcon}
                <div className="relative flex items-center w-full justify-between">
                    <Search />
                    {w>1050 && <div className="absolute left-1/2 -translate-x-1/2">{navbar}</div>}
                    {plan}
                </div>
            </div>
        )

        const userAuthImg = (
            <div className={`p-[1px] bg-gradient-to-r from-yellow-400 via-amber-500 to-purple-600 ${
                    mainUser.businessType > 0 ? "rounded-[4px]" : (!auth ? "" : "rounded-full")
                }`}
                onClick={() => this.onToggleSidebar()}
            >
                <img
                    className={`C${mainUser.fc} block object-cover min-w-[35px] min-h-[35px] max-w-[35px] max-h-[35px] p-[2px] ${
                        mainUser.businessType > 0 ? "rounded-[3px]" : (!auth ? "" : "rounded-full")
                    }`}
                    src={
                        exist(mainUser.profileIndex)
                                ? `https://www.pix.shiningpage.com/whoraly/profile/small/${mainUser._id}-${mainUser.profileIndex}.jpeg`
                                : mainUser.genderValue === 0
                                    ? female
                                    : male
                    }
                    alt="user"
                />
            </div>
        )

        const headerAuthBoxM = (
            <div className='d-flex' style={{alignItems:'center', width:'100%', justifyContent:'space-between', direction:'ltr'}}>
                <div className='d-flex' style={{alignItems:'center'}}>
                    {auth ? userAuthImg : sidebarIcon}
                    <Search/>
                </div>
                <div className='d-flex' style={{alignItems:'center', gap:'10px'}}>
                    {/* <div style={{margin:'0px 5px'}}><LangBox/></div> */}
                    {/* auth ? <UserBox/> : loginBox */}
                    {plan}
                </div>
            </div>
        )

        const header = (
            <div className='sticky-top cardShadow' style={{top:w<s ? (scrollDirection==='up' ? -45 : 0) : 0, transition:'.5s'}}>
                <div className='bg-cover bg-right backBlur' style={{height:NavHX, alignItems:'center', borderBottom:'0px solid #d1a44a',
                    justifyContent:'space-between', transition:'.5s', backgroundImage: `url(${aiImage})`}}>
                    <div className='d-flex' style={{height:NavHX, alignItems:'center', padding:w<s ? '0px 5px' : '0px'}}>
                        <div className='d-flex' style={{justifyContent:'space-between', alignItems:'center', width:'100%', direction:'rtl'}}>{w<s ? headerAuthBoxM : headerAuthBox}</div>
                    </div>
                </div>
                {hrC14}
                { auth && mainUser.ruby &&
                    <div className='center' style={{ backgroundColor:'red', color:'#ffffff', fontWeight:450, textAlign:'center' }}
                        onClick={() => this.onToggleViewStatus()}
                    >
                        <span className='hover:underline'>
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
                style={{height: '90px', top:'0px', padding:'0px 10px', borderRight:'1px solid #ffffff40',
                    position:'fixed', top:0, flexDirection:'column', alignItems:'center', width:'100%'}}>
                <MdClose style={{width:'20px', fontSize:'20px', cursor:'pointer', position:'absolute',
                    top:'10px', left:'10px', border:'1px', color:'#ffffff'}}
                    onClick={() => this.onToggleSidebar()}
                />
                {logoSide}
            </div>
        )

        const sidebarButtons = [
            ...(w < 1050
                ? [
                    { key: "home", to: "/", label: setLT.home, icon: AiOutlineHome },
                    { key: "latest", to: "/latest", label: "Latest Posts", icon: BiSolidBookContent },
                    { key: "about", to: "/about", label: setLT.about, icon: HiOutlineUsers },
                    { key: "contact", to: "/contact", label: setLT.contact, icon: MdOutlineMailOutline },
                ]
                : []),

            { key: "reviews", to: "/reviews", label: "Site Reviews", icon: MdOutlineRateReview },

            ...(fullAccess
                ? [
                    { key: "dashboard", to: "/dashboard", label: "Dashboard", icon: AiOutlineDashboard },
                ]
                : []),
        ];

        const navItemsClass = "!no-underline text-white items-center h-[50px]"


        const signInBtn = (
            <Link to={`/login`} className={`d-flex sidebarItem ${navItemsClass}`}>
                {/* n1 */}
                <FaUser style={{width:'20px', margin:'10px 18px', fontSize:'18px'}}/>
                <div className='' style={{width:'140px', margin:'10px', fontSize:'13px', border:'2px solid #00CCFF', backgroundColor:'#00CCFF99', borderRadius:'3px', padding: auth ? '' : '0px 0px', textAlign:'center'}} onClick={() => this.onLogin()}>{setLT.signupLogin}{/* &nbsp;openIcon */}</div>
            </Link>
        )

        const currentVersion = (
            <div className='center' style={{paddingTop:'10px'}}>
                Current Version: {import.meta.env.VITE_VERSION}
            </div>
        )

        const updateVersion = (
            <div style={{alignItems:'center', height:'40px', marginTop:'20px', padding:toggleSidebar ? '0px 20px' : ''}}>
                <UpdateVersion fontWeight={toggleSidebar ? 450 : ''}/>
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
            <div className="relative z-10 pr-[10px] overflow-scroll">
                {sidebarButtons.map(({ key, to, label, icon: Icon }) => (
                    <Link key={key} to={to} onClick={() => this.onToggleSidebar()}
                        className={`group flex w-full items-center justify-between rounded-[8px] border-2 border-transparent transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:shadow-md !no-underline text-white items-center h-[50px]
                            ${ page === key ? "sidebarSelectedItem" : "" }`}
                        >
                        <div className="center">
                            <Icon className="w-[20px] mx-[20px] my-[10px] text-[23px] transition-transform duration-300 group-hover:scale-110"/>
                            <span className="ml-0 transition-all duration-300 ease-out group-hover:translate-x-2">
                                {label}
                            </span>
                        </div>
                        <FaAngleRight className="text-[14px] m-[10px] transition-transform duration-300 group-hover:translate-x-1"/>
                    </Link>
                    ))
                }
            </div>
        )

        const hasUsername = !!mainUser?.username
        const root = mainUser.businessType>0 ? 'publisher' : 'user'
        const linkTarget = auth && hasUsername
            ? `/${root}/${mainUser.username}`
            : '/login'

        const myPage = (
            <a href={linkTarget}
                onClick={() => (page!=='web' && page!=='publisher')
                    ? null
                    : me
                        ? window.scroll(0, 0)
                        : goToWebPage(mainUser)
                }

                className={`group flex w-full items-center justify-between rounded-[8px] border-2 border-transparent transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:shadow-md !no-underline text-white items-center h-[50px]
                    ${ me && ['publisher', 'user'].includes(page) ? "sidebarSelectedItem" : "" }`}
                >
                <div className="center">
                    <RiPagesLine className="w-[20px] mx-[20px] my-[10px] text-[23px] transition-transform duration-300 group-hover:scale-110"/>
                    <span className="ml-0 transition-all duration-300 ease-out group-hover:translate-x-2">
                        My Page
                    </span>
                </div>
                <FaAngleRight className="text-[14px] m-[10px] transition-transform duration-300 group-hover:translate-x-1"/>
            </a>
        )


        const notifications = (
            <Link to="/notification" onClick={() => this.onToggleSidebar()}
                className={`group flex w-full items-center justify-between rounded-[8px] border-2 border-transparent transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:shadow-md !no-underline text-white items-center h-[50px]
                    ${ page === 'notification' ? "sidebarSelectedItem" : "" }`}
                >
                <div className="center">
                    <FiBell className="w-[20px] mx-[20px] my-[10px] text-[23px] transition-transform duration-300 group-hover:scale-110"/>
                    <span className="ml-0 transition-all duration-300 ease-out group-hover:translate-x-2">
                        {setLT.notifications}
                    </span>
                </div>
                <div className='flex items-center'>
                    <div className={`${leaveNotificationList ? "zoomOut" : "zoomIn"} bg-gradient-to-r from-[#94358e99] to-[#c900bb] text-white text-[11px] font-[450] text-center w-[25px] min-w-[18px] h-[18px] px-[5px] rounded-[4px] leading-[20px] ${notSeenNotificationQTY ? "block" : "hidden"} transition-transform duration-300 group-hover:translate-x-1`}>
                        {notSeenNotificationQTY}
                    </div>
                    <FaAngleRight className="text-[14px] m-[10px] transition-transform duration-300 group-hover:translate-x-1"/>
                </div>
            </Link>
        )

        const messages = (
            <Link to="/chat" onClick={() => this.onToggleSidebar()}
                className={`group flex w-full items-center justify-between rounded-[8px] border-2 border-transparent transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:shadow-md !no-underline text-white items-center h-[50px]
                    ${ page === 'chat' ? "sidebarSelectedItem" : "" }`}
                >
                <div className="center">
                    <IoChatbubbleEllipsesOutline className="w-[20px] mx-[20px] my-[10px] text-[23px] transition-transform duration-300 group-hover:scale-110"/>
                    <span className="ml-0 transition-all duration-300 ease-out group-hover:translate-x-2">
                        Messages
                    </span>
                </div>
                <div className='flex items-center'>
                    <div className={`${leaveChatList ? "zoomOut" : "zoomIn"} bg-gradient-to-r from-[#94358e99] to-[#c900bb] text-white text-[11px] font-[450] text-center w-[25px] min-w-[18px] h-[18px] px-[5px] rounded-[4px] leading-[20px] ${notSeenChatQTY ? "block" : "hidden"} transition-transform duration-300 group-hover:translate-x-1`}>
                        {notSeenChatQTY}
                    </div>
                    <FaAngleRight className="text-[14px] m-[10px] transition-transform duration-300 group-hover:translate-x-1"/>
                </div>
            </Link>
        )

        const rubies = (
            <Link to="/ruby" onClick={() => this.onToggleSidebar()}
                className={`group flex w-full items-center justify-between rounded-[8px] border-2 border-transparent transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:shadow-md !no-underline text-white items-center h-[50px]
                    ${ page === 'ruby' ? "sidebarSelectedItem" : "" }`}
                >
                <div className="center">
                    <AiOutlineRuby className="w-[20px] mx-[20px] my-[10px] text-[23px] transition-transform duration-300 group-hover:scale-110"/>
                    <span className="ml-0 transition-all duration-300 ease-out group-hover:translate-x-2">
                        {setLT.ruby}
                    </span>
                </div>
                <div className='flex items-center'>
                    <div className={`zoomIn bg-gradient-to-r from-[#94358e99] to-[#c900bb] text-white text-[11px] font-[450] text-center min-w-[18px] h-[18px] px-[5px] rounded-[4px] leading-[20px] ${ruby ? "block" : "hidden"} transition-transform duration-300 group-hover:translate-x-1`}>
                        {ruby}
                    </div>
                    <FaAngleRight className="text-[14px] m-[10px] transition-transform duration-300 group-hover:translate-x-1"/>
                </div>
            </Link>
        )

        const socialMedia = (
            <Link to="/social-media" onClick={() => this.onToggleSidebar()}
                className={`group flex w-full items-center justify-between rounded-[8px] border-2 border-transparent transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:shadow-md !no-underline text-white items-center h-[50px]
                    ${ page === 'social-media' ? "sidebarSelectedItem" : "" }`}
                >
                <div className="center">
                    <IoIosGitNetwork className="w-[20px] mx-[20px] my-[10px] text-[23px] transition-transform duration-300 group-hover:scale-110"/>
                    <span className="ml-0 transition-all duration-300 ease-out group-hover:translate-x-2">
                        Social Media
                    </span>
                </div>
                <FaAngleRight className="text-[14px] m-[10px] transition-transform duration-300 group-hover:translate-x-1"/>
            </Link>
        )

        const projects = (
            <Link to={`/projects/${username}`} onClick={() => this.onToggleSidebar()}
                className={`group flex w-full items-center justify-between rounded-[8px] border-2 border-transparent transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:shadow-md !no-underline text-white items-center h-[50px]
                    ${ page === 'projects' ? "sidebarSelectedItem" : "" }`}
                >
                <div className="center">
                    <GrProjects className="w-[20px] mx-[20px] my-[10px] text-[23px] transition-transform duration-300 group-hover:scale-110"/>
                    <span className="ml-0 transition-all duration-300 ease-out group-hover:translate-x-2">
                        Projects
                    </span>
                </div>
                <FaAngleRight className="text-[14px] m-[10px] transition-transform duration-300 group-hover:translate-x-1"/>
            </Link>
        )

        const currentBalance = (
            <div className='!mx-[15px] text-white'>
                <hr className="h-px border-0 bg-white" />
                <span className="w-full flex justify-between ml-0 transition-all duration-300 ease-out group-hover:translate-x-2">
                    <span>{setLT.balance}</span>
                    <span>{'£' + balance}</span>
                </span>
                <hr className="h-px border-0 bg-white" />
            </div>
        )

        const sendTicket = (
            <div onClick={() => this.onCreateTicket("607e9088bede482040af3574")}
                className={`group flex w-full items-center justify-between rounded-[8px] border-2 border-transparent transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:shadow-md !no-underline text-white items-center h-[50px]
                    ${ toggleChat ? "sidebarSelectedItem" : "" } cursor-pointer`}
                >
                <div className="center">
                    <BiMessageSquareEdit className="w-[20px] mx-[20px] my-[10px] text-[23px] transition-transform duration-300 group-hover:scale-110"/>
                    <span className="ml-0 transition-all duration-300 ease-out group-hover:translate-x-2">
                        {loadingTicket ? loader13 : 'Submit a Ticket'}
                    </span>
                </div>
                <FaAngleRight className="text-[14px] m-[10px] transition-transform duration-300 group-hover:translate-x-1"/>
            </div>
        )

        const changeTheme = (
            <div onClick={() => this.toggleWebPageTheme()}
                className={`group flex w-full items-center justify-between rounded-[8px] border-2 border-transparent transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:shadow-md !no-underline text-white items-center h-[50px]
                    ${ toggleWebPageTheme ? "sidebarSelectedItem" : "" } cursor-pointer`}
                >
                <div className="center">
                    <IoColorPaletteOutline className="w-[20px] mx-[20px] my-[10px] text-[23px] transition-transform duration-300 group-hover:scale-110"/>
                    <span className="ml-0 transition-all duration-300 ease-out group-hover:translate-x-2">
                        {setLT.changeTheme}
                    </span>
                </div>
                <FaAngleRight className="text-[14px] m-[10px] transition-transform duration-300 group-hover:translate-x-1"/>
            </div>
        )

        const modalWebPageTheme = (
            <ModalWebPageTheme
                me={me}
                dispatch={this.props.dispatch}
                // EditBtn={EditBtn}
                toggleWebPageTheme={toggleWebPageTheme}
                onToggle={this.toggleWebPageTheme}
                mapStateToProps={this.props}
            />
        )


        const changePassword = (
            <div onClick={() => this.toggleChangePassword()}
                className={`group flex w-full items-center justify-between rounded-[8px] border-2 border-transparent transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:shadow-md !no-underline text-white items-center h-[50px]
                    ${ toggleChangePassword ? "sidebarSelectedItem" : "" } cursor-pointer`}
                >
                <div className="center">
                    <TbLockPassword className="w-[20px] mx-[20px] my-[10px] text-[23px] transition-transform duration-300 group-hover:scale-110"/>
                    <span className="ml-0 transition-all duration-300 ease-out group-hover:translate-x-2">
                        {setLT.changePassword}
                    </span>
                </div>
                <FaAngleRight className="text-[14px] m-[10px] transition-transform duration-300 group-hover:translate-x-1"/>
            </div>
        )

        const modalChangePassword = (
            <ModalChangePassword
                dispatch={this.props.dispatch}
                // EditBtn={EditBtn}
                toggleChangePassword={toggleChangePassword}
                onToggle={this.toggleChangePassword}
                mapStateToProps={this.props}
            />
        )

        const signOut = (
            <div onClick={() => logout(lang, this.props.dispatch)}
                className={`group flex w-full items-center justify-between rounded-[8px] border-2 border-transparent transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:shadow-md !no-underline text-white items-center h-[50px]
                    cursor-pointer`}
                >
                <div className="center">
                    <RiLogoutCircleRLine className="w-[20px] mx-[20px] my-[10px] text-[23px] transition-transform duration-300 group-hover:scale-110"/>
                    <span className="ml-0 transition-all duration-300 ease-out group-hover:translate-x-2">
                        {setLT.exit}
                    </span>
                </div>
                <FaAngleRight className="text-[14px] m-[10px] transition-transform duration-300 group-hover:translate-x-1"/>
            </div>
        )

        const userItems = (
            <div className="relative z-10 p-[10px] overflow-scroll">
                {auth && myPage}
                {notifications}
                {messages}
                {projects}
                {rubies}
                {auth && socialMediaIndex && socialMedia}
                {auth && currentBalance}
                {auth && sendTicket}
                {auth && changeTheme}
                {auth && changePassword}
                {auth && signOut}
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

        const userInfo = (
            <a href={linkTarget} className="!no-underline flex items-start p-[20px] gap-2"
                onClick={() => (page!=='web' && page!=='publisher')
                                    ? null
                                    : me
                                        ? window.scroll(0, 0)
                                        : goToWebPage(mainUser)
                }
            >

                {/* User Image */}
                <div className={`p-[1px] bg-gradient-to-r from-yellow-400 via-amber-500 to-purple-600 ${
                        mainUser.businessType > 0 ? "rounded-[4px]" : (!auth ? "" : "rounded-full")
                    }`}
                >
                    <img
                        className={`C${mainUser.fc} block object-cover min-w-[70px] min-h-[70px] max-w-[70px] max-h-[70px] p-[3px] ${
                            mainUser.businessType > 0 ? "rounded-[3px]" : (!auth ? "" : "rounded-full")
                        }`}
                        src={
                            exist(mainUser.profileIndex)
                                    ? `https://www.pix.shiningpage.com/whoraly/profile/small/${mainUser._id}-${mainUser.profileIndex}.jpeg`
                                    : mainUser.genderValue === 0
                                        ? female
                                        : male
                        }
                        alt="user"
                    />
                </div>

                {/* User Info */}
                <div>
                    <div className="text-[14px] text-white font-[450]">
                        {mainUser.bizName ? mainUser.bizName : mainUser.username}
                    </div>
                    <div className="text-[12px] text-white/60 font-[450]">
                        {mainUser.jobSummary ? mainUser.jobSummary : ""}
                    </div>
                </div>
            </a>
        )

        const inviteToJoin = (
            <div className='text-center text-white px-3 py-4'>
                <span className='mr-2'>Create your free account to get started.</span>
                <Link to='/login' className='goldenText !no-underline hover:!underline' onClick={() => this.onToggleSidebar()}>Sign up | Login</Link>
            </div>
        )

        const userAuth = (
            <div className="gradient-border relative z-10 my-[20px] bg-gradient-to-r from-[#00000010] via-transparent to-[#00000010]">
                {auth ? userInfo : inviteToJoin}
                {userItems}
            </div>
        )

        const shiningpageLogo = (
            <Link to="/" className="flex items-end relative z-10 text-[#ba851b] hover:!text-[#ba851b]"
                onClick={() => this.onToggleSidebar()}>
                {logoBoxSide}
                <span className="goldenText text-[22px] font-bold mx-[10px] underline decoration-[#ba851b]">Shiningpage</span>
            </Link>
        )

        const desktopSidebar = (
            <div className={`relative overflow-hidden w-[280px] shrink-0 border-r-2 border-[#D2B45E] sticky top-0 h-screen p-[10px] z-[100]`}>
                <div className="absolute inset-0 bg-center rotate-90 scale-400 blur-[3px]"
                    style={{ backgroundImage: `url(${aiImage})` }}
                />
                <div className='h-[60px]'>
                    {shiningpageLogo}
                    <div className="golden-divider"></div>
                </div>
                <div className='overflow-y-scroll h-[calc(100vh-60px)]'>
                    {userAuth}
                    <div className="golden-divider"></div>
                    {sidebarItems}
                    <div className="golden-divider"></div>
                    <br/>
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
            <div className="fixed inset-0 overflow-hidden -z-10">
                <div className="absolute -inset-8 bg-cover bg-right blur-sm" style={{ backgroundImage: `url(${aiImage})` }}/>
            </div>
        );

        const hrF = <hr className='C7' style={{height:'1px', margin:'0px 0px 15px', opacity:'1'}}/>
        const footerClass = 'w-full max-w-[400px] mb-4 p-2.5 text-white'

        const subStyle = {fontSize:'14px', margin: '0px', alignItems:'center', direction: rtl ? 'ltr' : 'ltr', color:''}

        const supportBtn = (
            <div>
                <div className={`flex ${navItemsClass}`}>
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
            <a className='d-flex' href={`https://www.instagram.com/whoraly_uk`} target="_blank" rel="noopener noreferrer">
                <AiFillInstagram className='' style={{fontSize:'30px', margin:'0px', color:'#D5AD6D', borderRadius:'5px', border:'1px solid #D5AD6D', backgroundColor:'#ffffff99'}}/>
            </a>
        )

        const linkedinSub = (
            <a className='d-flex' href={`https://www.linkedin.com/in/mahmoudsadollahi/`} target="_blank" rel="noopener noreferrer">
                <FaLinkedin className='' style={{fontSize:'30px', margin:'0px', color:'#D5AD6D', borderRadius:'5px', padding:'2px', border:'1px solid #D5AD6D', backgroundColor:'#ffffff99'}}/>
            </a>
        )

    //`https://www.youtube.com/channel/UCd2v5xsfTfhIeSUVWiv3WRA`
        const youtubeSub = (
            <a className='d-flex' href={'https://www.youtube.com/@mahmoudsadollahi3377'} target="_blank" rel="noopener noreferrer">
                <FaYoutube className='' style={{fontSize:'30px', margin:'0px', color:'#D5AD6D', borderRadius:'5px', border:'1px solid #D5AD6D', backgroundColor:'#ffffff99'}}/>
            </a>
        )

        // const socialMedia = (
        //     <div className='d-flex' style={{margin:'30px 0px', alignItems:'center'}}>
        //         {instagramSub}&nbsp;&nbsp;&nbsp;
        //         {linkedinSub}&nbsp;&nbsp;&nbsp;
        //         {youtubeSub}
        //     </div>
        // )

        const shiningpage = (
            <Link to={`/`} className='d-flex sticky-top' style={{textDecoration:'none', alignItems:'flex-start', marginBottom:'-7px', zIndex:'1'}}>
                <div className='center C7' style={{width:'35px', height:'35px', borderRadius:'6px', alignItems:'center', padding:'2px', margin:'0px 5px -8px -5px'}}>
                    <div className='logo' style={{width:'100%', height:'100%'}}></div>
                </div>
                <div className="white-nav">
                    SHINING PAGE &nbsp;
                    <span style={{fontSize:'12px'}}>(Version: {import.meta.env.VITE_VERSION})</span>
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
                content={desktopSidebar}
                updateVersion={updateVersion}
                isOpen={toggleSidebar}
                toggleSidebar={this.onToggleSidebar}
            />
        )

        const footer1 = (
            <div className={footerClass}>
                <Link to={`/`} className='flex mb-10 text-[#ba851b] items-start !no-underline gap-2'>
                    <img className='w-11 h-11'
                        src='https://www.pix.shiningpage.com/whoraly/site/logo.png'
                        alt="Shiningpage logo"
                    />
                    <div>
                        <div className='goldenText text-[20px] font-bold'>Shiningpage</div>
                        <div className='text-[11px] text-[#ffffff] font-thin'>Shine with us – A digital presence beyond borders</div>
                    </div>
                </Link>
                <p className='font-thin text-[14px] !mb-[30px]'>
                    Our mission is to transform you into a star in the digital space by providing innovative tools and cutting-edge solutions. Whether you are an entrepreneur, an established brand, a social organization, or a talented individual—ShiningPage makes your path to success brighter than ever.
                </p>
                <div className='flex mb-3 items-center gap-2'>
                    <IoLocationOutline className='-mt-1 text-[#F5C73D] text-[20px]'/>
                    <span className='text-[15px]'>UK, London</span>
                </div>
                <div className='flex items-center gap-2'>
                    <IoMailOutline className='-mt-1 text-[#F5C73D] text-[20px]'/>
                    <span className='text-[15px]'>hello@shiningpage.com</span>
                </div>

                {/* supportBtn */}
                {/* socialMedia */}
                {/* updateVersion */}
            </div>
        )

        const footer2Class = 'flex white-nav block !no-underline mb-3 font-thin items-center group'
        const shortcuts = [
            { to: '/', text: setLT.home },
            { to: '/latest', text: 'Latest Posts' },
            { to: '/contact', text: setLT.contact },
            { to: '/about', text: setLT.about },
            { to: '/reviews', text: setLT.memberReviews },
            { to: '/sitemap', text: 'Sitemap' },
        ]

        const footer2 = (
            <div className={footerClass}>
                <div className="text-[16px] font-[500]">Quick Links</div>
                {hrC14Short}
                {shortcuts.map(({ to, text }) => (
                    <Link key={to} to={to} className={footer2Class}>
                        <div className="flex items-center">
                            <FaAngleRight />
                            <span className="ml-2 transition-transform duration-300 ease-out group-hover:translate-x-2">
                                {text}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        )

        const legal = [
            { to: '/tos', text: 'ToS' },
            { to: '/privacy', text: 'Privacy' },
            { to: '/disclaimer', text: 'Disclaimer' },
            { to: '/sitemap', text: 'Sitemap' },
        ]

        const footer3 = (
            <div className={footerClass}>
                <div className="text-[16px] font-[500]">LEGAL</div>
                {hrC14Short}
                {legal.map(({ to, text }) => (
                    <Link key={to} to={to} className={footer2Class}>
                        <div className="flex items-center">
                            <FaAngleRight />
                            <span className="ml-2 transition-transform duration-300 ease-out group-hover:translate-x-2">
                                {text}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        )

        // const footer3 = (
        //     <div className={footerClass}>
        //         <div>MISSION</div>
        //         {hrF}
        //         <div style={{marginBottom:'20px', fontSize:'14px', direction:rtl ? 'rtl' : '', textAlign:rtl ? 'justify' : ''}}>
        //             <div style={{marginBottom:'10px'}}>{setLT.missionT1}</div>
        //             <div className='font-thin' style={{lineHeight:'25px'}}>{setLT.missionT2}</div>
        //         </div>
        //         {/* <PsychologyBtn/> */}
        //     </div>
        // )

        const copyRight = (
            <div className={`flex items-center gap-2 ${w<s ? 'mb-2' : 'm-0'} px-[10px]`}>
                <FaRegCopyright className='-mt-1'/>
                <span>{new Date().getFullYear()}</span>
                <span className='goldenText'>
                    Shiningpage
                </span>
                <span>All rights reserved.</span>
            </div>
        )

        const seperator = <span className='text-[#F5C73D]'>|</span>
        const footbar = (
            <div className={`flex justify-between items-center gap-3 font-thin text-[12px] px-[10px]`}>
                <Link to={`/tos`} className='white-nav !no-underline whitespace-nowrap'>Terms of service</Link>
                {seperator}
                <Link to={`/privacy`} className='white-nav !no-underline whitespace-nowrap'>Privacy Policy</Link>
                {seperator}
                <Link to={`/disclaimer`} className='white-nav !no-underline whitespace-nowrap'>Disclaimer</Link>
            </div>
        )

        const footer = (
            <div className={`mt-[50px] text-white bg-[#01033d20] border-t-0 border-[#d1a44a] bg-cover bg-center`}
                style={{ backgroundImage: `url(${aiImage})` }}>
                {/* hrC14 */}
                {hrC14Thin}
                <div>
                    <div className={`flex ${w < s ? "flex-wrap" : "flex-nowrap"} p-[10px]`}>
                        {footer1}
                        {footer2}
                        {/* footer3 */}
                    </div>
                    <div className="golden-divider"></div>
                    <div className={`${w<s ? 'center' : 'flex'} items-center justify-between flex-wrap ${w<s ? 'my-4' : 'my-5'} px-[10px]`}>
                        {copyRight}
                        {footbar}
                    </div>
                </div>
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

        const helmet = (
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
        )

        const bodyContent = (
            <div className={`flex-1 min-w-0 flex flex-col`}>
                {!['publisher', 'user', 'content', 'web', 'ps', ''].includes(page) && backG}
                {header}
                {/* !['web', 'ps'].includes(page) && header */}
                {!['home', 'publisher', 'user', 'content', 'web', 'ps'].includes(page) && <Addressbar content={[]} fix={address.fix}/>}

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
                    {w<s && modalSidebar}
                    {modalChat}
                    {modalShowVideo}
                    {modalMembership}
                    {modalSendMessage}
                    {modalViewStatus}
                    {modalChatList}
                    {modalWebPageTheme}
                    {modalChangePassword}
                </div>
                {!['publisher', 'user', 'content', 'web', 'ps'].includes(page) && footer}
                {w<s && footerX}
                {w<s && hrC14}
                {/* footbar */}
            </div>
        )
        return (
            <Router>
                <div className='' style={{fontSize:'14px', fontFamily:'Vazir', minHeight:h, backgroundColor:''}}>{/* `${colors[`C${subUserInfo.fc}`]}00` */}
                    {helmet}
                    <div className='flex w-full'>
                        {w>s && desktopSidebar}
                        {bodyContent}
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

        subUserInfo: state.subUserInfo,
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
        balance: state.balance,

    }
}
export default connect (mapStateToProps)(App);
