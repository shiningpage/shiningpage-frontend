import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { Container } from 'react-bootstrap';
import { setSubject, setAddress, setPageTitle, setPage } from '../dataStore/actions';
import BeforAfter from '../components/BeforAfter';
import More from '../components/More';
import AllBusinesses from '../components/AllBusinesses';
import RubyCollector from '../components/RubyCollector';
import siteView from '../modules/siteView';
import userN from '../assets/images/other/user1.png';
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';
import { FaAngleDown, FaRegPaperPlane, FaRegEye, FaLinkedin, FaYoutube, FaFacebook,
    FaBars, FaGlobe, FaInstagram, FaTelegram } from 'react-icons/fa';
import { AdsHorizontal, AdsMultiplex } from '../components/GoogleAds';
import { dig3, exist, checkSeen, goToWebPage } from '../helper';
import { serverURL, s, googleAds } from '../srcSet';
import aparatImage from "../assets/images/other/aparat.png";

class LatestPage extends Component {

	state = {
		w: window.innerWidth,
		h: window.innerHeight,
		pageName: 'Latest',
		nLatest: 1,
		latestN: 0, 
		allLatest:[],
		searchLatest: [],
		loadingLatest: false,
		listRefreshQty: 30,
	}

	componentDidMount = async () => {
		window.scrollTo(0, 0)
		window.addEventListener("resize", this.onResize)
		await this.props.dispatch(setPageTitle(`${this.state.pageName} | ShiningPage`))
		await this.props.dispatch(setPage('latest'))
		await this.props.dispatch(setSubject('latest'))
		await this.props.dispatch(setAddress({ content:[], fix:this.state.pageName }))
		// if(this.props.auth && this.props.mainUser.ruby) checkSeen('latest', this.props.seenStatus, this.props.dispatch)
		siteView(this.props)
		await this.countAllLatest()
		this.getAllLatest()
	}

	countAllLatest = async () => {
		this.setState({
			loadingLatest:true,
		})
		await axios.get(`${serverURL}/latest/countAllLatest`).then(res => {
			this.setState({
				latestN: res.data
			})
		})
	}

	getAllLatest = async () => {
		const { nLatest, searchLatest, listRefreshQty } = this.state
		var data = {
			n: nLatest,
			q: listRefreshQty,
		}

		const res = await axios.post(`${serverURL}/latest/getAllLatest/`, data);
		const x2 = res.data
		console.log(x2)
		this.setState({
			searchLatest : [...searchLatest, ...x2],
			finishDataLatest: (x2.length<listRefreshQty || x2.length===this.state.latestN) ? true : false,
			nLatest: this.state.nLatest + 1,
		}, () => {
			this.mapAllLatest(this.state.searchLatest)
		})
	}

	mapAllLatest = (latest) => {
		const { w } = this.state
		const { rtl, lang, setLT } = this.props
	
		const allLatest = latest.map((item, i) => {
			const adsBox = <div className='adsbox2' style={{marginTop:'0px'}}><AdsHorizontal id={`adsHi${i}`} /></div>
			const subGenderX = item.genderValue !== undefined ? (item.genderValue === 0 ? female : male) : userN
			const srcSubUser = exist(item.profileIndex)
				? `https://www.pix.shiningpage.com/whoraly/profile/big/${item.userId}-${item.profileIndex}.jpeg`
				: subGenderX
	
			const usernameConst = (
				<div style={{ fontSize: '14px', fontWeight: 450, marginBottom: '-5px', lineHeight: '20px' }}>
					{item.bizName ? item.bizName : item.username}&nbsp;
					<div className={`flag-icon flag-icon-${item.countryCode ? item.countryCode.toLowerCase() : ''}`} style={{ width: '', border: '1px solid #99999950', fontSize: '15px' }}></div>
				</div>
			)
	
			const UserProfileImage = (
				<div className={`C${item.fc}`} style={{ maxWidth: '40px', minWidth: '40px', maxHeight: '40px', minHeight: '40px', borderRadius: item.businessType === 1 ? '3px' : '100px', padding: '1px' }}>
					<img
						style={{
							objectFit: 'cover', width: '100%', height: '100%',
							cursor: 'pointer',
							borderRadius: item.businessType > 0 ? '3px' : '100px',
							border: `1px solid #99999930`, margin: '0px'
						}}
						src={srcSubUser}
						alt={`${item.username} image`}
					/>
				</div>
			)
	
			const profileBox = (
				<div className='d-flex underline' style={{ fontSize: '12px', padding: '10px' }}
					onClick={() => goToWebPage(item)}>
					{UserProfileImage}
					<div style={{ margin: '0px 10px' }}>
						{usernameConst}
						{item.jobSummary}
					</div>
				</div>
			)
	
			let content = null
			if (item.type === 'ads') {
				content = this.getAds(item, i)
			} else if (item.type === 'video') {
				content = this.getVideo(item, i)
			} else if (item.type === 'instagram') {
				content = this.getInstagram(item, i)
			}

			if(item.type === 'ads' && item.pictureType === 2) {
				content = this.getAds(item, i) // برای اطمینان از بارگذذاری کامل عکسهای beforAfter
				content = this.getAds(item, i) // برای اطمینان از بارگذذاری کامل عکسهای beforAfter
			}

			let footer = null
			if (item.type === 'ads') {
				const title = (
					<p className="d-flex" style={{ width: '100%', fontSize: '14px', fontWeight: 450 }}>
						{item.title}
					</p>
				)
				const root = item.businessType>0 ? 'publisher' : 'user'
				const adsPageLink = (
					<Link to={item.slug ? `/publisher/${item.username}/${item.slug}` : `/ps/${item._id}`} target="_blank" className='underline' style={{fontSize:'14px'}}>
						{setLT.showDetails}
					</Link>
				)
				const price = (
					<div>
						{!item.negotiablePrice &&
							<div style={{ width: '100%' }}>
								<span style={{ fontSize: '20px', fontWeight: 450 }}>
									{item.currency}
									{item.unitPrice && dig3(item.unitPrice, 2)}
								</span>
								<div style={{ fontSize: '14px' }}>
									{item.unitMeasurement}
								</div>
							</div>
						}
					</div>
				)
				footer = (
					<div style={{ width: '100%' }}>
						{item.title &&
							<div style={{ padding: '10px' }}>
								{title}
								{adsPageLink}
								{price}
							</div>
						}
					</div>
				)
			} else if (item.type === 'video') {
				const YoutubeIcon = <FaYoutube style={{ fontSize: '30px', margin: '0px', color: '#c4302b' }} />
				const AparatIcon = <img style={{ width: '30px', height: '25px', margin: '0px' }} src={aparatImage} alt="Aparat Icon" />
				const LinkedinIcon = <FaLinkedin className='' style={{ fontSize: '25px', margin: '0px', color: '#0e76a8' }} />
				footer = (
					<div style={{ padding: '10px' }}>
						{item.vType === 'Youtube' && YoutubeIcon}
						{item.vType === 'Aparat' && AparatIcon}
						{item.vType === 'Linkedin' && LinkedinIcon}
						&nbsp;{item.title}
					</div>
				)
			} else if (item.type === 'instagram') {
				footer = (
					<div style={{ padding: '10px' }}>
						<FaInstagram className='' style={{
							fontSize: '25px', width: '30px', height: '30px', margin: '0px',
							borderRadius: '6px', color: '#ffffff',
							backgroundImage: 'linear-gradient(to right top, #fcac0f, #fd9522, #fa7f30, #f36a3c, #e85647, #e44751, #dd395b, #d42d65, #d12174, #ca1b85, #be1e96, #ae27a8)'
						}} />
						&nbsp;{item.title}
					</div>
				)
			}
	
			if (googleAds && i % 5 === 0 && i !== 0) {
				// console.log('i: ', i)
				return (
					<div key={`adsPlus-${i}`} style={{width: w < s ? '100%' : '80%'}}>
						<div key={`ads-${i}`}
							style={{ width: '100%', marginBottom: '10px', borderRadius: '10px', backgroundColor: '#ffffff30' }}
						>
							{adsBox}
						</div>
						<div key={i} className="d-flex animated fadeInUp"
							style={{
								textDecoration: 'none', animationDelay: '.5s', width: '100%',
								marginBottom: '10px', flexDirection: 'column',
								borderRadius: '10px', position: 'relative', backgroundColor: '#ffffff',
								overflow: 'hidden',
							}}
						>
							{profileBox}
							{content}
							{footer}
						</div>
					</div>
				)
			}
	
			return (
				<div key={i} className="d-flex animated fadeInUp"
					style={{
						textDecoration: 'none', animationDelay: '.5s', width: w < s ? '100%' : '80%',
						marginBottom: '10px', flexDirection: 'column',
						borderRadius: '10px', position: 'relative', backgroundColor: '#ffffff',
						overflow: 'hidden',
					}}
				>
					{profileBox}
					{content}
					{footer}
				</div>
			)
		})
	
		this.setState({
			allLatest,
			loadingLatest: false,
		})
	}

	getAds = (item, i) => {
		const imgStyle = {
		  margin: '0px',
		  width: '100%',
		  alignItems: 'center',
		  overflow: 'hidden',
		}
	  
		const imgSrc = `https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictures[0]}.jpeg`
		const imgAfter =
		  item.pictureType === 2
			? `https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictures[1]}.jpeg`
			: ''

		const img = item.pictureType === 2 ? (
			<div style={{ width: '100%', height: '100%' }}>
				<BeforAfter
				id={`ad-${i}`}
				title={`${item.title}`}
				beforUrl={imgSrc}
				afterUrl={imgAfter}
				borderRadius={0}
				width={'100%'}
				height={'100%'}
				/>
			</div>
		) : (
		  <img
			className=""
			style={{ objectFit: 'contain', width: '100%', height: '100%' }}
			src={imgSrc}
			alt={item.title}
		  />
		)
	  
		return <div style={{ width: '100%' }}>{img}</div>
	}

	getVideo = (item, i) => {
		//console.log(item),
		const youtubeVideo = `https://www.youtube.com/embed/${item.code}`
		const aparatVideo = `https://www.aparat.com/video/video/embed/videohash/${item.code}/vt/frame`
		const linkedinVideo = `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${item.code}?compact=1`
		const iframeStyle = {margin:'0px', position:'', top: 0, left: 0, width: '100%', minHeight: '300px', zIndex: '-1', border: 'none'}

		return (
			<div style={{width:'100%', height:''}}>
				{item.vType === 'Youtube' && <iframe src={youtubeVideo} style={iframeStyle} allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"/>}
				{item.vType === 'Aparat' && <iframe src={aparatVideo} style={iframeStyle}/>}
				{item.vType === 'Linkedin' && <iframe src={linkedinVideo} style={iframeStyle}/>}
			</div>
		)
	}

	getInstagram = (item, i) => {
		const instaPost = (
			<iframe scrolling="no" src={`https://www.instagram.com/p/${item.code}/embed`} width='100%' height='500PX' allowtransparency="true"></iframe>
		)
		return instaPost
	}

	onResize = () => {
		this.setState({
			w: window.innerWidth,
			h: window.innerHeight,
		})
	}

	render() {
		const { w, h, allLatest, finishDataLatest, loadingLatest, latestN } = this.state
		const { rtl, lang, setLT } = this.props
		// console.log('latestN', latestN)
		// console.log('loadingLatest', loadingLatest)

		const loader13 = (
			<span
				className='loader-13'
				style={{ fontSize: '15px', margin: rtl ? '20px 10px -20px' : '0px 10px', color: '#ffffff', transform: rtl ? 'rotate(180deg)' : '' }}
			></span>
		);

		const moreLatest = <div onClick={() => this.getAllLatest()}><More fc={14}/></div>

		const adsBox1 = <div className=''><AdsHorizontal id='adsH1' /></div>
		const adsBox2 = <div className='adsbox2'><AdsHorizontal id='adsH2' left={20} /></div>
		const adsBox3 = <div className='adsbox2'><AdsHorizontal id='adsH3' /></div>
		const adsBoxMulti = <div className='adsbox'><AdsMultiplex id='adsMulti1' /></div>

		const allLatestList = (
			<div className={'center'} style={{width:'100%', alignItems:'center', flexDirection:'column'}}>
				{allLatest}
			</div>
		)

		const adsSide = (
			<div className="sticky-top"
				style={{ marginTop:'109px', padding:'10px', width: '50%', maxHeight:'750px', top:'70px',
					borderRadius: '10px', backgroundColor: '#ffffff30', zIndex:'1'
				}}
			>
				<div style={{marginBottom:'10px'}}>
					{googleAds && adsBox1}
				</div>
				{/* <div style={{width:'100%', height:'30px', margin:'15px 0px', position:'ralative'}}>
					<RubyCollector id='adsH2' left={20}/>
				</div> */}
				{/* googleAds && adsBox2 */}
				{/* googleAds && adsBox3 */}
			</div>
		)

		return (
			<div>
				<div  style= {{padding:w<1400 ? '0px 10px' : '0px 50px'}}>
					{/* {googleAds && w<s && adsBox1} */}
					{/* w<s &&
						<div style={{width:'100%', height:'30px', marginTop:'30px', position:'ralative'}}>
							<RubyCollector id='adsH1' left={20}/>
						</div>
					*/}
					<div className='d-flex' style={{marginBottom:'20px'}}>
						{w>s && <AllBusinesses />}
						<div style={{ width: '100%' }}>
							<h1 className='animated fadeInLeft tx' style={{animationDelay:'.5s', color:'#ffffff', fontWeight:'bold', fontSize: w<s ? '30px' : '', textAlign:'center', margin:'30px 10px'}}>Latest Posts</h1>
							{ allLatestList }
							<div className='center' style={{width:'100%', height:!finishDataLatest ? '100px' : '0px', alignItems:'center'}}>
								{(loadingLatest && !finishDataLatest) && loader13}
								{(!loadingLatest && !finishDataLatest && allLatest.length>0) && moreLatest}
							</div>
						</div>
						{w>s && adsSide}
					</div>
					{/* <div style={{width:'100%', height:'50px', marginTop:'30px', position:'ralative'}}>
						<RubyCollector id='adsMulti1' left={20}/>
					</div> */}
				</div>
				{googleAds && adsBoxMulti}
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

export default connect (mapStateToProps)(LatestPage);
