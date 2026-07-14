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
        const { w } = this.state
        const { mainUser } = this.props
        var dataRv = notifications.map (
            (item, i) => {
                const netClass = `${w < s ? 'w-40' : 'w-full'} overflow-hidden text-[12px] font-[350] whitespace-nowrap ltr`
                const textClass = "overflow-hidden text-[12px] font-[350] text-[#1897F8]"
                const countryCode = item.countryCode ? item.countryCode.toLowerCase() : ''
                const userImage = (
                    <div className='relative flex flex-col justify-start' onClick={() => item.visitor!=='unknown' ? this.onBizPage(item) : ''}>
                        <img className={`C${item.fc} btnShadowX object-contain w-[50px] h-[50px] ${item.businessType > 0 ? 'rounded-[3px]' : 'rounded-full'} m-0 border-2 border-[#ffffff40] p-[2px]`}
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
                        <span className={`!absolute flag-icon flag-icon-${countryCode}`}></span>
                        {/* <span className="max-w-[50px] text-[9px] mx-0 text-center">{countryName(item.countryCode, item.country)}</span> */}
                    </div>
                )
                const profile = (
                    <div className='flex items-end cursor-pointer' onClick={() => this.onBizPageNTF(item)}>
                        <img
                            className={`C${mainUser.fc} btnShadow object-contain w-[30px] h-[30px] ${mainUser.businessType > 0 ? 'rounded-[3px]' : 'rounded-full'} m-0 border border-[#ffffff40] p-[1px]`}
                            src={ exist(mainUser.profileIndex)
                                ? `https://www.pix.shiningpage.com/whoraly/profile/small/${mainUser._id}-${mainUser.profileIndex}.jpeg`
                                : mainUser.genderValue===0 ? female : male
                            }
                            alt="main user"
                        />&nbsp;
                        <span className={textClass}>{mainUser.username}</span>
                    </div>
                )
                const chatPage = (
                    <div className='flex items-end cursor-pointer' onClick={() => this.onToggleChat(item)}>
                        <div className='relative'>
                            <img
                                className={`C${item.fc} btnShadowX object-contain w-[30px] h-[30px] ${item.businessType > 0 ? 'rounded-[3px]' : 'rounded-full'} m-0 border-2 border-[#ffffff40] p-[2px]`}
                                src={ 
                                    exist(item.profileIndex)
                                    ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item.visitor}-${item.profileIndex}.jpeg`
                                    : item.genderValue===0 ? female : male
                                }
                                alt="user"
                            />
                            <BsChatDots className='absolute -left-[4px] -top-[4px] text-[15px] p-[1px] text-white bg-[#3585F7] rounded-full'/>
                        </div>&nbsp;
                        <span className={textClass}>Chat Box</span>
                    </div>
                )
                const bizPage = (
                    <div className='flex items-end cursor-pointer gap-1' onClick={() => this.onBizPageNTF(item)}>
                        <div className='relative'>
                            <img
                                className={`C${mainUser.fc} btnShadow object-contain w-[30px] h-[30px] ${mainUser.businessType > 0 ? 'rounded-[3px]' : 'rounded-full'} m-0 border border-[#ffffff40] p-[1px]`}
                                src={ exist(mainUser.profileIndex)
                                    ? `https://www.pix.shiningpage.com/whoraly/profile/small/${mainUser._id}-${mainUser.profileIndex}.jpeg`
                                    : mainUser.genderValue===0 ? female : male
                                }
                                alt="business page"
                            />
                            <FaGlobe className='absolute -left-[4px] -top-[4px] text-[15px] text-[#A52A2A] bg-white rounded-full'/>
                        </div>
                        <span className={textClass}>{mainUser.username}</span>
                    </div>
                )
                const adImage = (
                    <div className='flex items-end cursor-pointer' onClick={() => this.onOpenAdPage(item)}>
                        <img
                            className='btnShadow object-contain w-[30px] h-[30px] rounded-none m-0 border border-[#ffffff40] p-[1px]'
                            src={ `https://www.pix.shiningpage.com/whoraly/ads/small/${item.subId}-${item.adsPictures ? item.adsPictures[0] : ''}.jpeg` }
                            alt="ad image"
                        />&nbsp;
                        <span className={textClass}>{item.subTitle ? item.subTitle : ''}</span>
                    </div>
                )
                const adPage = (
                    <div className='flex items-end cursor-pointer' onClick={() => this.onOpenAdPage(item)}>
                        <div>
                            <img
                                className={`btnShadow object-contain w-[30px] h-[30px] rounded-none m-0 border border-[#ffffff40] p-[1px]`}
                                src={ `https://www.pix.shiningpage.com/whoraly/ads/big/${item.subId}-${item.adsPictures ? item.adsPictures[0] : ''}.jpeg`}
                                alt="ad page"
                            />
                            <FaGlobe className='sticky-top text-[15px] m-[-20px_24px_0px_-35px] text-[#A52A2A] bg-white rounded-full'/>
                        </div>
                        <span className={textClass}>{item.subTitle ? item.subTitle : ''}</span>
                    </div>
                )
                const video = (
                    <div className='flex items-end cursor-pointer' onClick={() => this.onToggleShowVideoNTF(item)}>
                        <MdOndemandVideo className='btnShadow text-[27px] m-0 text-[#031d8b]'/>&nbsp;
                        <span className={textClass}>{item.subTitle ? item.subTitle : ''}</span>
                    </div>
                )
                const website = (
                    <a className='flex no-underline items-end' href={`http://${mainUser.website}`} target="_blank" rel="noopener noreferrer">
                        <FaGlobe className="text-[25px] m-0 text-[#A52A2A] min-w-[20px] min-h-[20px]"/>&nbsp;
                        <span className={netClass}>{mainUser.website}</span>
                    </a>
                )
                const instagram = (
                    <a className='flex items-end no-underline' href={`https://instagram.com/${mainUser.instagram}`} target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="text-[25px] w-[25px] h-[25px] rounded-[6px] text-white bg-[linear-gradient(to_right_top,#fcac0f,#fd9522,#fa7f30,#f36a3c,#e85647,#e44751,#dd395b,#d42d65,#d12174,#ca1b85,#be1e96,#ae27a8)]"/>&nbsp;
                    </a>
                )
                const telegram = (
                    <a className='flex items-end no-underline' href={`https://t.me/${mainUser.telegram}`} target="_blank" rel="noopener noreferrer">
                        <FaTelegram className="text-[25px] m-0 text-[#56BFE1]"/>&nbsp;
                        <span className={netClass}>{mainUser.telegram}</span>
                    </a>
                )
                const facebook = (
                    <a className='flex items-end no-underline' href={`http://${mainUser.facebook}`} target="_blank" rel="noopener noreferrer">
                        <FaFacebook className="text-[25px] m-0 text-[#3b5998]"/>&nbsp;
                        <span className={netClass}>{mainUser.facebook}</span>
                    </a>
                )
                const youtube = (
                    <a className='flex items-end no-underline' href={`http://${mainUser.youtube}`} target="_blank" rel="noopener noreferrer">
                        <FaYoutube className="text-[25px] m-0 text-[#c4302b]"/>&nbsp;
                        <div className={netClass}>{mainUser.youtube}</div>
                    </a>
                )
                const linkedin = (
                    <a className='flex items-end no-underline' href={`http://${mainUser.linkedin}`} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className="text-[25px] m-0 text-[#0e76a8]"/>&nbsp;
                        <span className={netClass}>{mainUser.linkedin}</span>
                    </a>
                )
                const NTFIcon = (
                    <div>
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
                )
                const eye = <FaRegEye className="w-[18px] text-[20px] text-black m-0 !text-[#00A3F5]" />
                const heart = <IoMdHeart className="w-[20px] text-[20px] text-red-500" />
                const comment = <BsChat className="w-[18px] text-[20px] text-black m-0 !text-[#00A3F5]" />
                const message = <MdMessage className="w-[20px] text-[20px] text-black m-0 !text-[#00A3F5]" />
                const click = <HiOutlineCursorClick className="w-[18px] text-[20px] text-black m-0 !text-[#00A3F5]" />
                const actionIcon = (
                    <div>
                        {item.type==='view' && eye}
                        {item.type==='like' && heart}
                        {item.type==='comment' && comment}
                        {item.type==='message' && message}
                        {item.type==='click' && click}
                    </div>
                )
                //${item.seen ? 'p-[1px]' : 'p-[5px]'} C${mainUser.fc === 11 ? '7' : mainUser.fc}
                return (
                    <div key={i} className="flex justify-center text-white font-thin mb-2">
                        <div className={`flex flex-col justify-center items-center animated fadeInUpX w-full m-[2px] rounded-[5px] border ${item.seen ? '' : '!border-l-[5px] !border-l-white'} !border-white/50 bg-white/10`}>
                            <div className="flex justify-center items-center animated fadeInUpX w-full px-[10px] py-0 rounded-[5px] border-0">
                                <div className="flex py-[10px] w-full text-[14px] justify-between gap-3">
                                    {userImage}
                                    <div className="flex-1 flex flex-col">
                                        <div className="w-full flex justify-between items-start">
                                            {item.xNote}
                                            <div className="text-[11px]">{difDate(new Date(), item.createdAt)}</div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            {NTFIcon}
                                            {actionIcon}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        )

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
        const {setLT, mainUser, toggleNotification} = this.props
        const loader13 = <div className='loader-13 my-[70px] text-white'></div>
        const moreNotification = <div className="my-[50px]" onClick={() => this.getNotification()}><More fc={mainUser.fc}/></div>

		const NA = (
			<div className='center'>
				<div className="w-[200px] text-center text-white py-[10px] px-[15px] rounded-full border border-white">
					{setLT.noNotifications}
				</div>
			</div>
		)

        const notificationSub = (
            <div>
				<div className={`center ${NData.length > 0 ? 'mb-[50px]' : ''}`}>
                    {itemLoaded && 
                        ( NData.length>0
                            ? 
                                <div className={`${w < s ? 'w-full' : 'w-[800px]'}`}>
                                    { unseenNotifications.length>0 &&
                                        <div key="new-header" className="p-[10px] font-light text-[16px] text-white">
                                            🔔 New
                                        </div>
                                    }
                                    {unseenNotifications}
                                    { seenNotifications.length>0 &&
                                        <hr key="seen-separator" className="my-[20px] mx-[10px] text-white m-5 opacity-100" />
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
          <div className="animated fadeInLeft [animation-delay:.5s] text-4xl font-extrabold tracking-tight my-[30px]">
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
              Notifications List
            </span>
          </div>
        )

        const adsBox1 = <div className='adsbox'><AdsHorizontal id='adsH1' /></div>
        const adsBox2 = <div className='adsbox'><AdsHorizontal id='adsH2' /></div>
        
        return (
            <div>
            	{/* {googleAds && adsBox1} */}
                <Container>
					<div className='center flex-col items-center'>
                      	{header}
                    </div>
					{notificationSub}
				</Container>
				{/* {googleAds && adsBox2} */}
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
