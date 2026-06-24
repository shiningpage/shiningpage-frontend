import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import { setSubject, setAddress, setPageTitle, setPage, setToggleNotificationList, setSubChatInfo, setToggleChat, setVideoInfo, setToggleShowVideo } from '../dataStore/actions';
import siteView from '../modules/siteView';
import userN from '../assets/images/other/user1.png';
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';
import More from '../components/More';
import { MdOndemandVideo, MdMessage } from 'react-icons/md';
import { IoMdHeart } from 'react-icons/io';
import { FaLinkedin, FaYoutube, FaFacebook, FaGlobe, FaInstagram, FaTelegram, FaRegEye } from 'react-icons/fa';
import { BsChatDots, BsChat } from 'react-icons/bs';
import { HiOutlineCursorClick } from 'react-icons/hi';
import { AdsHorizontal } from '../components/GoogleAds'
import { countryName, difDate, exist, xNote, checkSeen } from '../helper';
import { serverURL, s, listRefreshQty, googleAds } from '../srcSet';

class NotificationPage extends Component{

    state = {
        w: document.body.clientWidth,
        pageName: this.props.setLT.notificationsList,
        subAdsInfo:[],
        NData: [],
        searchNotification: [],
		notificationMap: [],
        nNotification:1,
		itemLoaded: false,
        notificationN:'-',
        seenNotifications: [],
        unseenNotifications: [],
    }

    componentDidMount = async () => {
        window.scrollTo(0, 0)
        window.addEventListener("resize", this.onResize)
		await this.props.dispatch(setPageTitle(`${this.state.pageName} | ShiningPage`))
        await this.props.dispatch(setPage('notification'))
        await this.props.dispatch(setSubject('notification'))
        await this.props.dispatch(setAddress({ content:[], fix:this.state.pageName }))
        // if(this.props.auth && this.props.mainUser.ruby) checkSeen('notification', this.props.seenStatus, this.props.dispatch)
        siteView(this.props)
        this.getNotification()
    }

    getNotification = async () => {
        const {lang, setLT, mainUser} = this.props
        this.setState({
            loadingNotification:true
        })

        var data = {
            visitee: mainUser._id,
            n:this.state.nNotification,
            q:listRefreshQty
        }
        // console.log(data)
        await axios.post(`${serverURL}/notification/get`, data).then(async res => {

            var x2 = res.data
            // console.log(11111111)

            const getVisitorDetails = (visitor, unknownDetails, knownDetails) => {
                return visitor === 'unknown' ? unknownDetails : knownDetails;
            };

            const setStateAsync = (stateUpdate) => {
                return new Promise((resolve) => {
                    this.setState(stateUpdate, resolve);
                });
            };

            for(const notification of x2) {
                const username = getVisitorDetails(notification.visitor, setLT.unknown, notification.username);
                const countryCode = getVisitorDetails(notification.visitor, notification.countryCodeZ, notification.countryCode);
                const country = getVisitorDetails(notification.visitor, notification.countryZ, notification.country);

                Object.assign(notification, {
                    visitorName: username,
                    visiteeName: mainUser.username,
                    countryCode: countryCode,
                    country: country,
                    xNote: await xNote(username, lang, notification.subject, notification.type),
                });

                if (['ad', 'adPage'].includes(notification.subject)) {
                    const adsInfo = await this.getAdsInfo(notification.subId);
                    const subAdsInfo = adsInfo.data
                    Object.assign(notification, {
                        adsPictures: subAdsInfo.pictures,
                        subTitle: subAdsInfo.adsTitle,
                        slug: subAdsInfo.slug,
                    });
                }

                if (notification.subject === 'video') {
                    const videoInfo = await this.getVideoInfo(notification.subId);
                    const subVideoInfo = videoInfo.data
                    Object.assign(notification, {
                        subTitle: subVideoInfo.title,
                        aparat: subVideoInfo.aparat,
                        youtube: subVideoInfo.youtube,
                        vCode: subVideoInfo.vCode,
                        vType: subVideoInfo.vType,
                    });
                }

                await setStateAsync((prevState) => ({
                    searchNotification: [...prevState.searchNotification, notification]
                }));

                const NData = this.state.searchNotification
                const unseenNotifications = NData.filter(item => !item.seen)
                const seenNotifications = NData.filter(item => item.seen)
                this.setState({ NData })

                await this.mapAllNotifications(unseenNotifications, 'unseenNotifications')
                await this.mapAllNotifications(seenNotifications, 'seenNotifications')
            }

            if(!this.props.fullAccess || this.props.mainUser.username==='operator') this.updateSeen(mainUser._id)
            // console.log(x2)
            this.setState({
                nNotification: this.state.nNotification + 1,
                loadingNotification:false,
                finishDataNotification: (res.data.length<listRefreshQty || res.data.length===this.state.notificationN) ? true : false,
				itemLoaded: true,
            })

        })

    }

    mapAllNotifications = async (notifications, name) => {
        var countryCode, userCountry, userImage, tableInfo, NTFIcon, netStyle, textStyle,
        website, instagram, telegram, facebook, youtube, linkedin,
        eye, heart, comment, message, click, hr,
        profile, bizPage, adImage, adPage, video, chatPage, actionIcon
        const {w, } = this.state
        const {rtl, lang, setLT, mainUser} = this.props
        var dataRv = notifications.map (
            (item, i) => (
                // console.log(111, item),
                netStyle = {width:w<s ? w-160 : '100%', overflow:'hidden', fontSize:'12px', fontWeight:350, color:'grey', textAlign:rtl ? 'right' : 'left', direction:'ltr', whiteSpace:'nowrap'},
                textStyle = {overflow:'hidden', fontSize:'12px', fontWeight:350, color:'grey', textAlign:rtl ? 'right' : 'left', direction:'ltr'},
                countryCode = item.countryCode ? item.countryCode.toLowerCase() : '',
                userImage = (
                    <div className='d-flex' onClick={() => item.visitor!=='unknown' ? this.onBizPage(item) : ''}
                        style={{flexDirection:'column', justifyContent:'flex-start', marginTop:'-15px'}}
                    >
                        <span className={`flag-icon flag-icon-${countryCode} sticky-top`} style={{right: !rtl ? 5 : '', left: rtl ? 5 : '', top:9}}></span>
                        <img
                            className={`C${item.fc} btnShadowX waves-effect waves-light btn-large`}
                            style={{objectFit: 'contain', width:"50px", height:"50px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px'}}
                            src={item.visitor==='unknown'
                                ? userN
                                :(
                                    exist(item.profileIndex)
                                    ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item.visitor}-${item.profileIndex}.jpeg`
                                    : item.genderValue===0 ? female : male
                                )
                            }
                            alt="user"
                        />
                        {!item.username && <span style={{maxWidth:'50px', fontSize:'9px', margin:'0px 0px -10px', textAlign:'center'}}>{countryName(item.countryCode, item.country)}</span>}
                    </div>
                ),
                profile = (
                    <div className='d-flex' onClick={() => this.onBizPageNTF(item)}
                    style={{direction:rtl ? 'rtl' : 'ltr', alignItems:'flex-end', cursor:'pointer'}}>
                        <img
                            className={`C${mainUser.fc} btnShadow waves-effect waves-light btn-large`}
                            style={{objectFit: 'contain', width:"30px", height:"30px", borderRadius:mainUser.businessType>0 ? '3px' : '100px', margin:'0px', border:'1px solid #ffffff40', padding:'1px'}}
                            src={ exist(mainUser.profileIndex)
                                ? `https://www.pix.shiningpage.com/whoraly/profile/small/${mainUser._id}-${mainUser.profileIndex}.jpeg`
                                : mainUser.genderValue===0 ? female : male
                            }
                            alt="main user"
                        />&nbsp;
                        <span style={textStyle}>{mainUser.username}</span>
                    </div>
                ),
                chatPage = (
                    <div className='d-flex' onClick={() => this.onToggleChat(item)}
                    style={{direction:rtl ? 'rtl' : 'ltr', alignItems:'flex-end', cursor:'pointer'}}>
                        <div style={{}}>
                            <img
                                className={`C${item.fc} btnShadowX waves-effect waves-light btn-large`}
                                style={{objectFit: 'contain', width:"30px", height:"30px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px'}}
                                src={ 
                                    exist(item.profileIndex)
                                    ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item.visitor}-${item.profileIndex}.jpeg`
                                    : item.genderValue===0 ? female : male
                                }
                                alt="user"
                            />
                            <BsChatDots className='sticky-top' style={{fontSize:'15px', padding:'1px', margin:rtl ? '-20px -35px 0px 24px' : '-20px 24px 0px -35px', color:'#ffffff', backgroundColor:'#3585F7', borderRadius:'100px'}}/>
                        </div>&nbsp;
                        <span style={textStyle}>Chat Box</span>
                    </div>
                ),
                bizPage = (
                    <div className='d-flex' onClick={() => this.onBizPageNTF(item)}
                    style={{direction:rtl ? 'rtl' : 'ltr', alignItems:'flex-end', cursor:'pointer'}}>
                        <div>
                            <img
                                className={`C${mainUser.fc} btnShadow waves-effect waves-light btn-large`}
                                style={{objectFit: 'contain', width:"30px", height:"30px", borderRadius:mainUser.businessType>0 ? '3px' : '100px', margin:'0px', border:'1px solid #ffffff40', padding:'1px'}}
                                src={ exist(mainUser.profileIndex)
                                    ? `https://www.pix.shiningpage.com/whoraly/profile/small/${mainUser._id}-${mainUser.profileIndex}.jpeg`
                                    : mainUser.genderValue===0 ? female : male
                                }
                                alt="business page"
                            />
                            <FaGlobe className='sticky-top' style={{fontSize:'15px', margin:rtl ? '-20px -35px 0px 24px' : '-20px 24px 0px -35px', color:'brown', backgroundColor:'#ffffff', borderRadius:'100px'}}/>
                        </div>
                        <span style={textStyle}>{mainUser.username}</span>
                    </div>
                ),
                // console.log(500, `${item}`),
                // console.log(500, `${item.subId}-${item.pictures ? item.pictures[0] : ''}`),
                adImage = (
                    <div className='d-flex' onClick={() => this.onOpenAdPage(item)}
                    style={{direction:rtl ? 'rtl' : 'ltr', alignItems:'flex-end', cursor:'pointer'}}>
                        <img
                            className={`btnShadow waves-effect waves-light btn-large`}
                            style={{objectFit: 'contain', width:"30px", height:"30px", borderRadius:'0px', margin:'0px', border:'1px solid #ffffff40', padding:'1px'}}
                            src={ `https://www.pix.shiningpage.com/whoraly/ads/small/${item.subId}-${item.adsPictures ? item.adsPictures[0] : ''}.jpeg` }
                            alt="ad image"
                        />&nbsp;
                        <span style={textStyle}>{item.subTitle ? item.subTitle : ''}</span>
                    </div>
                ),
                adPage = (
                    <div className='d-flex' onClick={() => this.onOpenAdPage(item)}
                    style={{direction:rtl ? 'rtl' : 'ltr', alignItems:'flex-end', cursor:'pointer'}}>
                        <div>
                            <img
                                className={`btnShadow waves-effect waves-light btn-large`}
                                style={{objectFit: 'contain', width:"30px", height:"30px", borderRadius:'0px', margin:'0px', border:'1px solid #ffffff40', padding:'1px'}}
                                src={ `https://www.pix.shiningpage.com/whoraly/ads/big/${item.subId}-${item.adsPictures ? item.adsPictures[0] : ''}.jpeg`}
                                alt="ad page"
                            />
                            <FaGlobe className='sticky-top' style={{fontSize:'15px', margin:rtl ? '-20px -35px 0px 24px' : '-20px 24px 0px -35px', color:'brown', backgroundColor:'#ffffff', borderRadius:'100px'}}/>
                        </div>
                        <span style={textStyle}>{item.subTitle ? item.subTitle : ''}</span>
                    </div>
                ),
                video = (
                    <div className='d-flex' onClick={() => this.onToggleShowVideoNTF(item)}
                        style={{direction:rtl ? 'rtl' : 'ltr', alignItems:'flex-end', cursor:'pointer'}}>
                        <MdOndemandVideo className='btnShadow' style={{fontSize:'27px', margin:'0px', color:'#031d8b'}}/>&nbsp;
                        <span style={textStyle}>{item.subTitle ? item.subTitle : ''}</span>
                    </div>
                ),
                website = (
                    <a className='d-flex' href={`http://${mainUser.website}`} target="_blank" rel="noopener noreferrer"
                        style={{textDecoration:'none', direction:rtl ? 'rtl' : 'ltr', alignItems:'flex-end'}}>
                        <FaGlobe className='' style={{fontSize:'25px', margin:'0px', color:'brown', minWidth:'20px', minHeight:'20px'}}/>&nbsp;
                        <span style={netStyle}>{mainUser.website}</span>
                    </a>
                ),
                instagram = (
                    <a className='d-flex' href={`https://instagram.com/${mainUser.instagram}`} target="_blank" rel="noopener noreferrer"
                        style={{textDecoration:'none', direction:rtl ? 'rtl' : 'ltr', alignItems:'flex-end'}}>
                        <FaInstagram className='' style={{fontSize:'25px', width:'25px', height:'25px', borderRadius:'6px', color:'#ffffff', backgroundImage: 'linear-gradient(to right top, #fcac0f, #fd9522, #fa7f30, #f36a3c, #e85647, #e44751, #dd395b, #d42d65, #d12174, #ca1b85, #be1e96, #ae27a8)'}}/>&nbsp;
                        {/* <span style={netStyle}>{mainUser.instagram}</span> */}
                    </a>
                ),
                telegram = (
                    <a className='d-flex' href={`https://t.me/${mainUser.telegram}`} target="_blank" rel="noopener noreferrer"
                        style={{textDecoration:'none', direction:rtl ? 'rtl' : 'ltr', alignItems:'flex-end'}}>
                        <FaTelegram className='' style={{fontSize:'25px', margin:'0px', color:'#56BFE1'}}/>&nbsp;
                        <span style={netStyle}>{mainUser.telegram}</span>
                    </a>
                ),
                facebook = (
                    <a className='d-flex' href={`http://${mainUser.facebook}`} target="_blank" rel="noopener noreferrer"
                        style={{textDecoration:'none', direction:rtl ? 'rtl' : 'ltr', alignItems:'flex-end'}}>
                        <FaFacebook className='' style={{fontSize:'25px', margin:'0px', color:'#3b5998'}}/>&nbsp;
                        <span style={netStyle}>{mainUser.facebook}</span>
                    </a>
                ),
                youtube = (
                    <a className='d-flex' href={`http://${mainUser.youtube}`} target="_blank" rel="noopener noreferrer"
                        style={{textDecoration:'none', direction:rtl ? 'rtl' : 'ltr', alignItems:'flex-end'}}>
                        <FaYoutube className='' style={{fontSize:'25px', margin:'0px', color:'#c4302b'}}/>&nbsp;
                        <div style={netStyle}>{mainUser.youtube}</div>
                    </a>
                ),
                linkedin = (
                    <a className='d-flex' href={`http://${mainUser.linkedin}`} target="_blank" rel="noopener noreferrer"
                        style={{textDecoration:'none', direction:rtl ? 'rtl' : 'ltr', alignItems:'flex-end'}}>
                        <FaLinkedin className='' style={{fontSize:'25px', margin:'0px', color:'#0e76a8'}}/>&nbsp;
                        <span style={netStyle}>{mainUser.linkedin}</span>
                    </a>
                ),
                NTFIcon = (
                    <div style={{width:''}}>
                        {item.subject==='website' && website}
                        {item.subject==='instagram' && instagram}
                        {item.subject==='telegram' && telegram}
                        {item.subject==='facebook' && facebook}
                        {item.subject==='youtube' && youtube}
                        {item.subject==='linkedin' && linkedin}
                        {item.subject==='profile' && profile}
                        {item.subject==='bizPage' && bizPage}
                        {item.subject==='ad' && adImage}
                        {item.subject==='adPage' && adPage}
                        {item.subject==='video' && video}
                        {item.subject==='chat' && chatPage}
                    </div>
                ),
                eye = <FaRegEye style={{width:'18px', fontSize:'20px', color:'black', margin:'0px'}}/>,
                heart = <IoMdHeart style={{width:'20px', fontSize:'20px', color:'red'}}/>,
                comment = <BsChat style={{width:'18px', fontSize:'20px', color:'black', margin:'0px'}}/>,
                message = <MdMessage style={{width:'20px', fontSize:'20px', color:'black', margin:'0px'}}/>,
                click = <HiOutlineCursorClick style={{width:'18px', fontSize:'20px', color:'black', margin:'0px'}}/>,
                actionIcon = (
                    <div>
                        {item.type==='view' && eye}
                        {item.type==='like' && heart}
                        {item.type==='comment' && comment}
                        {item.type==='message' && message}
                        {item.type==='click' && click}
                    </div>
                ),
                tableInfo = (
                    <div className='d-flex' style={{padding:'10px 0px', width:'100%', fontSize:'14px', justifyContent: 'space-between', alignItems:''}}>
                        {userImage}&nbsp;&nbsp;&nbsp;
                        <div className='d-flex' style={{width:'100%', flexDirection:'column'}}>
                            <div className='d-flex' style={{width:'100%', justifyContent: 'space-between', alignItems:'flex-start'}}>
                                <div style={{textAlign: rtl ? 'right' : 'left'}}>{item.xNote}</div>&nbsp;
                                <div style={{direction:'ltr', fontSize:'11px'}}>{difDate(new Date(), item.createdAt)}</div>
                            </div>
                            <div className='d-flex' style={{width:'', justifyContent: 'space-between', alignItems:'center'}}>
                                {NTFIcon}&nbsp;&nbsp;&nbsp;
                                {actionIcon}
                            </div>
                        </div>
                    </div>
                ),
                <div key={i} className='center'>
                    <div className={`center animated fadeInUpX C${mainUser.fc===11 ? '7' : mainUser.fc}`} style={{flexDirection:'column', width:'100%', padding:item.seen ? '1px' : '5px', margin:'2px', borderRadius:'5px'}}>
                        <div
                            className={`center animated fadeInUpX`}
                            style={{backgroundColor:'#ffffff', width: '100%', padding:'0px 10px', borderRadius:'5px', border:'0px solid'}}
                        >
                            {tableInfo}
                        </div>
                    </div>
                </div>
            )
        )//backgroundColor:item.seen ? '#ffffff99' : '#7b5cff99', 
        this.setState({
            [name]: dataRv,
            // nNotification: this.state.nNotification + 1,
            // loadingNotification:false,
        })
    }

    getAdsInfo = async (adsId) => {
        return await axios.get(`${serverURL}/ads/getAdsInfo/` + adsId)
    }

    updateSeen = async (userId) => {
        await axios.post(`${serverURL}/notification/updateSeen`, {userId})
    }

    onToggleNotificationList = () => {
        this.props.dispatch(setToggleNotificationList(!this.props.toggleNotificationList))
    }

    onBizPage = (item) => {
        const root = item.businessType>0 ? 'publisher' : 'user'
        window.open(`https://shiningpage.com/${root}/${item.visitorName}`);
    }

    onBizPageNTF = (item) => {
        // console.log(item)
        const root = item.businessType>0 ? 'publisher' : 'user'
        window.open(`https://shiningpage.com/${root}/${item.visiteeName}`);
    }

    onToggleChat = async (ID, e) => {
        const index = e?.target?.id==='chatDelete' ? false : true
        if(index) {
            this.setState({loading:true})
            if(ID.receiverId!=='unknown') {
                var user = await axios.post(`${serverURL}/user/getUserInfo`, { _id: ID })
                // console.log('nnn', user.data)
                var item = user.data
                delete item.password
                if(item) this.props.dispatch(setSubChatInfo(item))
            } else {
                ID._id='unknown'
                this.props.dispatch(setSubChatInfo(ID))
            }
            this.props.dispatch(setToggleChat(true))
            this.setState({loading:false})
        }
    }

    onOpenAdPage = (item) => {
        // console.log(item)
        const root = item.businessType>0 ? 'publisher' : 'user'
        window.open(item.slug ? `/publisher/${item.visiteeName}/${item.slug}` : `/ps/${item.subId}`)
    }

    onToggleShowVideoNTF = async (item) => {
        // console.log(11, item)
        const videoInfoX = await this.getVideoInfo(item.subId);
        const subVideoInfoX = videoInfoX.data

        item._id = item.subId
        item.userId = item.visitee
        item.username = item.visiteeName
        item.title = item.subTitle
        item.vCode = subVideoInfoX.vCode
        item.vType = subVideoInfoX.vType
        await this.props.dispatch(setVideoInfo(item))
        this.props.dispatch(setToggleShowVideo(!this.props.toggleShowVideo))
    }

    getVideoInfo = async (videoId) => {
        return await axios.get(`${serverURL}/video/getVideoInfo/` + videoId)
    }

    onResize = async () => {
        this.setState({ 
            w: document.body.clientWidth
        })
    }

  render () {
        const {w, itemLoaded, NData, unseenNotifications, seenNotifications, notificationMap, finishDataNotification, loadingNotification} = this.state
        const {rtl, setLT, mainUser, toggleNotification} = this.props
        const loader13 = <div className='loader-13' style={{margin: '70px 0px', color:'#ffffff', transform: rtl ? 'rotate(180deg)' : ''}}></div>
        const moreNotification = <div style={{margin:'50px 0px'}} onClick={() => this.getNotification()}><More fc={mainUser.fc}/></div>

		const NA = (
			<div className='center'>
				<div style={{width:'200px', textAlign:'center', color:'#ffffff', padding:'10px 15px', borderRadius:'100px', border:'1px solid #ffffff'}}>
					{setLT.noNotifications}
				</div>
			</div>
		)

        const notificationSub = (
            <div>
				<div className='center' style={{marginBottom:NData.length>0 ? '50px' : ''}}>
                    {itemLoaded && 
                        ( NData.length>0
                            ? 
                                <div style={{ width: w<s ? '100%' : '800px' }}>
                                    { unseenNotifications.length>0 &&
                                        <div key="new-header" style={{padding: '10px', fontWeight: 'bold', fontSize: '16px', color:'#ffffff'}}>
                                            🔔 New
                                        </div>
                                    }
                                    {unseenNotifications}
                                    { seenNotifications.length>0 &&
                                        <hr key="seen-separator" style={{margin: '20px 10px', color:'#ffffff'}} />
                                    }
                                    {seenNotifications}
                                </div>
                            : NA
                        )
                    }
                </div>
                <div className='center' style={{width:'100%', height: !finishDataNotification ? '0px' : '0px', alignItems:'center', marginBottom:'60px'}}>
                    {(loadingNotification && !finishDataNotification) && loader13}
                    {(!loadingNotification && !finishDataNotification) && moreNotification}
                </div>
            </div>
        )

		const header = (
			<div className='center' style={{alignItems:'center', flexDirection:'column', padding: '0px 10px'}}>
				<div className='d-flex' style={{justifyContent:rtl ? 'space-between' : 'flex-end', alignItems:'center', width:'100%', direction:'rtl'}}>
					<h1 className='animated fadeInLeft tx' style={{animationDelay:'.5s', color:'#ffffff', fontWeight:'bold', fontSize: w<s ? '30px' : '', textAlign:'center', margin:'30px 10px 30px'}}>{setLT.notificationsList}</h1>
				</div>
			</div>
		)

        const adsBox1 = <div className='adsbox'><AdsHorizontal id='adsH1' /></div>
        const adsBox2 = <div className='adsbox'><AdsHorizontal id='adsH2' /></div>
        
        return (
            <div>
            	{/* {googleAds && adsBox1} */}
                <Container>
                    <div className='center' style={{flexDirection:'column', alignItems:'center'}}>
                      	{header}
                    </div>
					{notificationSub}
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
        userInfo: state.subUserInfo,
        userId: state.subUserInfo._id,
        auth: state.auth,
        rtl: state.rtl,
        lang: state.lang,
        geo: state.geo,
        page: state.page,
        subject: state.subject,
        setLT: state.setLT,
        fullAccess: state.fullAccess,
        toggleNotificationList: state.toggleNotificationList,
        seenStatus: state.seenStatus,
    }
}

export default connect (mapStateToProps)(NotificationPage);
