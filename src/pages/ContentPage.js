import React, { Component } from 'react';
import axios from 'axios';
import { Container, Modal} from "react-bootstrap";
import { Link } from 'react-router-dom';
import aboutUsImg from '../assets/images/other/aboutUs.jpeg';
import userN from '../assets/images/other/user1.png';
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';
import locationImg from '../assets/images/other/location.png';
import { connect } from 'react-redux';
import { setSubject, setPageTitle, setToggleLoading, setToggleSidebar, setAdsInfo,
    setMembership, setSubUserInfo, setPage, setToggleAds, setPageYOffset } from '../dataStore/actions';
import { MdClose } from 'react-icons/md';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { FaAngleRight, FaGlobe, FaRegPaperPlane, FaRegEye, FaAngleLeft } from 'react-icons/fa';
import { AiOutlineCloseCircle, AiOutlineZoomIn } from 'react-icons/ai';
import { BsImages, BsChat } from 'react-icons/bs';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import StarRatingComponent from 'react-star-rating-component';
import date from 'date-and-time';
import toFarsi from '../modules/toFarsi';
import siteView from '../modules/siteView';
import BeforAfter from '../components/BeforAfter';
import LangBox from '../components/LangBox';
import QRCodeX from '../components/QRCodeX';
import SharePage from '../components/SharePage';
import RubyCollector from '../components/RubyCollector';
import PsCarousel from '../components/PsCarousel';
import EditBtn from '../components/EditBtn';
import { AdsHorizontalSmall, AdsHorizontal, AdsMultiplex } from '../components/GoogleAds';
import ModalHandleAds from '../components/modals/ModalHandleAds';
import { exist, dig3, checkSeen, addNotification, goToWebPage } from '../helper';
import { updateCategoryItems } from '../components/web/psSub/psHelper';
import { serverURL, s, NavH, designedByColors, listRefreshQty, listRefreshQtySmall, googleAds } from '../srcSet';
import RenderContent from '../components/RenderContent';

class ContentPage extends Component {

    state = {
        w:window.innerWidth,
        nLiker:1,
        nViewer:1,
        nCommenter:1,
        nAds: 1,
        loadingAds:true,
        loadingLiker:true,
        loadingViewer:true,
        loadingCommenter:true,
        gettingLike: true,
        gettingView:true,
        gettingComment:true,
        searchAds:[],
        searchLiker:[],
        searchViewer:[],
        searchCommenter:[],
        comment: '',
        rating: 0,
        xImage: '',
        adsImageData: '',//this.props.adsInfo.adsImageData,
        adsImageDataX: '',
        locationDataX: '',
        personalInfo: true,
        lang: this.props.lang,
        viewN:'-',
        likeN:'-',
        commentN: 0, 
        toggleZoomProfileImage: false,
        toggleZoomQRCode: false,
        toggleLike: false,
        profileData: null,
        x: true,
        modal: false,
        username: this.props.username,
        email: this.props.email,
        imgArray : [],
        imageArray : [],
        toggleViewBtn: true,
        toggleLikeBtn: false,
        toggleCommentBtn: false,
    }

    async componentDidMount() {
        window.scrollTo(0, 0)
        // this.props.dispatch(setPageYOffset(0))
        const { auth, mainUser, subChatInfo, videoInfo, geo, fullAccess } = this.props
        window.addEventListener("resize", this.onResize)
        await this.props.dispatch(setPage('content'))
        await this.props.dispatch(setAdsInfo([]))
        await this.props.dispatch(setSubUserInfo([]))
        await this.getProductService()
        await this.props.dispatch(setSubject(`content-${this.props.adsInfo.adsTitle}`))
        await this.props.dispatch(setPageTitle(`${this.state.username} | ${this.props.adsInfo.adsTitle} | ShiningPage`))
        siteView(this.props)
        // window.addEventListener('scroll', this.handleScroll);
        // this.countAllAds()
        this.getAllAds()
        addNotification('adPage', 'view', fullAccess, mainUser, this.state.userId, geo, this.state.adsId)
        // this.getViewers()
        // this.getLikers() // تعداد لایک و آخرین لایکرها را بر می گرداند
        // this.getCommenters()
        // this.hashChange()
    }

    toggleZoomQRCode () {
        this.setState({
            toggleZoomQRCode: !this.state.toggleZoomQRCode,
        });
    }

    deleteNotification = async (subject, type) => {
        var data = {
            visitor: this.props.mainUserId!==undefined ? this.props.mainUserId : 'unknown',
            visitee: this.state.userId,
            subId: this.state.adsId,
            subject,//: this.props.subUserInfo.username,
            type,
            // seen: false
        }
        if(this.props.mainUserId===undefined) {
            data.countryCodeZ = this.props.geo.countryCode
            data.countryZ = this.props.geo.country
        }
        // console.log(data)
        if(data.visitor!==data.visitee) await axios.post(`${serverURL}/notification/delete`, data).then(res => {})
    }

    findLikeAds() {
        var data = {
            liker: this.props.mainUserId,
            adsId: this.state.adsId,
        }
        //console.log(data)
        axios.post(`${serverURL}/like/findLikeAds`, data, {
        })
        .then(res => {
            //console.log(444, res.data)
            if(res.data) {
                this.setState({ toggleLike: true });
            } else {
                this.setState({ toggleLike: false });
            }
        })
    }

    countLikers = async () => {
        axios.post(`${serverURL}/like/countAdsLikers`, {adsId: this.state.adsId}).then(async res => {
            await this.findLikeAds() // چک می شود که آیا من لایک کرده ام یا نه؟
            this.setState({
                likeN: res.data,
                gettingLike: false,
            })
        })
    }
  
    countViewers = async () => {
        axios.post(`${serverURL}/view/countAdsViewers`, {adsId: this.state.adsId}).then(res => {
            this.setState({
                viewN: res.data.map(n => n.view).reduce((a, b) => a + b, 0),
                gettingView: false,
            })
        })
    }
  
    countCommenters = async () => {
        axios.post(`${serverURL}/comment/countCommentAds`, {adsId: this.state.adsId}).then(res => {
            // console.log(res.data)
            this.setState({
                commentN: res.data,
                gettingComment: false,
            })
        })
    }
  
    countItems = async () => {
        this.countViewers()
        this.countLikers()
        this.countCommenters()
    }
  
    addViewAds = async () => {
        if(!this.props.fullAccess){
            var data = {
                viewer: this.props.mainUserId!==undefined ? this.props.mainUserId : 'unknown',
                viewee: this.state.userId,
                adsId: this.state.adsId,
            }
            if(this.props.mainUserId===undefined) {
                data.countryCodeZ = this.props.geo.countryCode
                data.countryZ = this.props.geo.country
            }
            // console.log(data)
            if(data.viewer!==data.viewee) await axios.post(`${serverURL}/view/addViewAds`, data).then(res => {})
        }
    }
    
    getLikers = async () => {
        this.setState({
            loadingLiker:true,
        })

        var data = {
            adsId: this.state.adsId,
            n:this.state.nLiker,
            q:listRefreshQtySmall //this.state.w<s ? listRefreshQtySmallSmall : listRefreshQtySmallBig
        }
      
        await axios.post(`${serverURL}/like/getAdsLikers`, data).then(async res => {
            var x1 = this.state.searchLiker
            var x2 = res.data
            // console.log(x2)
            this.setState({
                searchLiker : x1.concat(x2),
                finishDataLiker: (res.data.length<listRefreshQtySmall || res.data.length===this.state.likeN) ? true : false,
            })
            // if(!this.state.likersPreviewSet) this.likerImageMap(this.state.searchLiker)
            await this.mapAllLikers(this.state.searchLiker)
        })
    
    }

    mapAllLikers = async (likers) => {
        var countryCode, userCountry, userImage, tableInfo
        const {w, } = this.state
        const {rtl, setLT} = this.props
        var dataRv = likers.map (
            (item, i) => (
              // console.log(item),
                userImage = (
                    <div className='' style={{}}>
                        <img
                            className={`C${item.fc} btnShadowX2`}
                            style={{objectFit: 'contain', width:"50px", height:"50px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px', cursor:'pointer'}}
                            src={ (item.imageData!=='' && item.imageData!==undefined)
                                ? item.imageData
                                : item.genderValue===0 ? female : male
                            }
                            alt="liker"
                            onClick={() => this.onReactor(item, item.liker)}
                        />
                    </div>
                ),
                countryCode = item.countryCode ? item.countryCode.toLowerCase() : '',
                userCountry = (
                  <div className='d-flex' style={{flexDirection:'column', textAlign:rtl ? 'right' : 'left'}}>
                      <div className='d-flex' style={{margin: '0px 0px 5px', alignItems:'center', direction:rtl ? 'rtl' : 'ltr'}}>
                          <span className={`flag-icon flag-icon-${countryCode} cardShadow`}></span> &nbsp;
                          <div className='d-flex ' style={{fontSize:'12px'}}>{item.country}{item.city && ( ' - ' + item.city)}</div>
                      </div>
                      {item.username
                        ? (
                          <div>
                              <span style={{color:'#bb00f9', fontWeight:'bold'}}>{item.username}</span>&nbsp;
                          </div>
                        )
                        : <span style={{color:'#999999', fontWeight:450}}>{setLT.unknown}</span>
                      }
                  </div>
                ),
                tableInfo = (
                  <div className='d-flex' style={{padding:'10px 0px', width:'100%', fontSize:'14px', justifyContent: 'space-between', alignItems:''}}>
                      {userImage}&nbsp;&nbsp;&nbsp;
                      <div className='' style={{width:'100%'}}>
                          <div className='d-flex' style={{width:'100%', justifyContent: 'space-between', alignItems:'center'}}>
                              {userCountry}
                              {/* viewLike */}
                          </div>
                          {/* jobSummary */}
                      </div>
                  </div>
                ),
                <div className='d-flex' style={{textDecoration:'none', color:'black', width:w<s ? '100%' : '80%', flexDirection:'column'}}>
                    {i > 0 && 
                      <div className='d-flex' style={{width:'100%', justifyContent:'flex-end'}}>
                          <hr className={`C${this.props.fc}`} style={{width: 'calc(100% - 60px)', height:'hairline', margin:'0px 0px'}}/>
                      </div>
                    }
                    <div key={i}
                        className={`d-flex`}
                        style={{textDecoration: "none", width:'100%', padding:'0px', borderRadius:'5px', margin:'0px 0px', border: '0px solid #7b5cff40'}}
                    >
                        {tableInfo}
                    </div>
                    {likers.length === 1 && 
                      <div className='d-flex' style={{width:'100%', justifyContent:'flex-end'}}>
                          <hr className={`C${this.props.fc}`} style={{width: 'calc(100% - 60px)', height:'hairline', margin:'0px 0px'}}/>
                      </div>
                    }
                </div>
            )
        )
        // console.log(dataRv)
        this.setState({
          likerMap: dataRv,
          nLiker: this.state.nLiker + 1,
          loadingLiker:false,
          gettingLike: false,
        })
    }
      
    getViewers = async () => {
        this.setState({
            loadingViewer:true,
        })
    
        var data = {
          adsId: this.state.adsId,
          n:this.state.nViewer,
          q:listRefreshQtySmall //this.state.w<s ? listRefreshQtySmallSmall : listRefreshQtySmallBig
        }
        await axios.post(`${serverURL}/view/getAdsViewers`, data).then(async res => {
            var x1 = this.state.searchViewer
            var x2 = res.data
            // console.log(x2)
            this.setState({
                searchViewer : x1.concat(x2),
                finishDataViewer: (res.data.length<listRefreshQtySmall || res.data.length===this.state.viewN) ? true : false,
            })
            // if(!this.state.viewersPreviewSet) this.viewerImageMap(this.state.searchViewer)
            await this.mapAllViewers(this.state.searchViewer)
        })
    
      }
    
      mapAllViewers = async (viewers) => {
        var unknown, jobSummaryStyle, JLen, countryCode, countryCodeZ, jobSummary, userCountry, userImage, tableInfo, like, view, viewLike, line
        const {w, } = this.state
        const {rtl, setLT} = this.props
        var dataRv = viewers.map (
            (item, i) => (
                // console.log(item),
                unknown = item.viewer==='unknown' ? true : false ,
                userImage = (
                    <div className='' style={{}}>
                        <img
                            className={`C${item.fc} btnShadowX2`}
                            style={{objectFit: 'contain', width:"50px", height:"50px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px', cursor: !unknown ? 'pointer' : ''}}
                            src={unknown
                                ? userN
                                :(
                                    exist(item.imageData)
                                    ? item.imageData
                                    : item.genderValue===0 ? female : male
                                )
                            }
                            alt="viewer"
                            onClick={!unknown ? () => this.onReactor(item, item.viewer) : ''}
                        />
                    </div>
                ),
                countryCode = item.countryCode ? item.countryCode.toLowerCase() : '',
                countryCodeZ = item.countryCodeZ ? item.countryCodeZ.toLowerCase() : '',
                userCountry = (
                  <div className='d-flex' style={{flexDirection:'column', textAlign:rtl ? 'right' : 'left'}}>
                      <div className='d-flex' style={{margin: '0px 0px 5px', alignItems:'center', direction:rtl ? 'rtl' : 'ltr'}}>
                          <span className={`flag-icon flag-icon-${unknown ? countryCodeZ : countryCode} cardShadow`}></span> &nbsp;
                          <div className='d-flex ' style={{fontSize:'12px'}}>{unknown ? item.countryZ : item.country}</div>
                      </div>
                      {item.username
                        ? (
                          <div>
                              <span style={{color:'#bb00f9', fontWeight:'bold'}}>{item.username}</span>&nbsp;
                          </div>
                        )
                        : <span style={{color:'#999999', fontWeight:450}}>{setLT.unknown} ({item.view})</span>
                      }
                  </div>
                ),
                tableInfo = (
                  <div className='d-flex' style={{padding:'10px 0px', width:'100%', fontSize:'14px', justifyContent: 'space-between', alignItems:''}}>
                      {userImage}&nbsp;&nbsp;&nbsp;
                      <div className='' style={{width:'100%'}}>
                          <div className='d-flex' style={{width:'100%', justifyContent: 'space-between', alignItems:'center'}}>
                              {userCountry}
                              {/* viewLike */}
                          </div>
                          {/* jobSummary */}
                      </div>
                  </div>
                ),
                <div className='d-flex' style={{textDecoration:'none', color:'black', width:w<s ? '100%' : '80%', flexDirection:'column'}}>
                    {i > 0 && 
                      <div className='d-flex' style={{width:'100%', justifyContent:'flex-end'}}>
                          <hr className={`C${this.props.fc}`} style={{width: 'calc(100% - 60px)', height:'hairline', margin:'0px 0px'}}/>
                      </div>
                    }
                    <div key={i}
                        className={`d-flex`}
                        style={{textDecoration: "none", width:'100%', padding:'0px', borderRadius:'5px', margin:'0px 0px', border: '0px solid #7b5cff40'}}
                    >
                        {tableInfo}
                    </div>
                    {viewers.length === 1 && 
                      <div className='d-flex' style={{width:'100%', justifyContent:'flex-end'}}>
                          <hr className={`C${this.props.fc}`} style={{width: 'calc(100% - 60px)', height:'hairline', margin:'0px 0px'}}/>
                      </div>
                    }
                </div>
            )
        )
        this.setState({
            viewerMap: dataRv,
            nViewer: this.state.nViewer + 1,
            loadingViewer:false,
      
          })
      }
    
      getCommenters = async () => {
        this.setState({
            loadingCommenter:true,
        })
    
        var data = {
          adsId: this.state.adsId,
          n:this.state.nCommenter,
          q:listRefreshQtySmall //this.state.w<s ? listRefreshQtySmallSmall : listRefreshQtySmallBig
        }
        // console.log(data)
        await axios.post(`${serverURL}/comment/getCommentAds`, data).then(async res => {
            var x1 = this.state.searchCommenter
            var x2 = res.data
            // console.log(x2)
            this.setState({
                searchCommenter : x1.concat(x2),
                finishDataCommenter: (res.data.length<listRefreshQtySmall || res.data.length===this.state.commentN) ? true : false,
            })
            // if(!this.state.viewersPreviewSet) this.viewerImageMap(this.state.searchViewer)
            await this.mapAllCommenters(this.state.searchCommenter)
        })
    
      }
    
      mapAllCommenters = async (commenters) => {
        var star, deleteBtn, countryCode, comment, userCountry, userImage, tableInfo, like, view, viewLike, line
        const {w, } = this.state
        const {rtl, setLT, mainUserId, userId} = this.props
        var dataRv = commenters.map (
            (item, i) => (
                // console.log(item),
                userImage = (
                    <div className='' style={{}}>
                        <img
                            className={`C${item.fc} btnShadowX2`}
                            style={{objectFit: 'contain', width:"50px", height:"50px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px', cursor:'pointer'}}
                            src={ (item.imageData!=='' && item.imageData!==undefined)
                                ? item.imageData
                                : item.genderValue===0 ? female : male
                            }
                            alt="liker"
                            onClick={() => this.onReactor(item, item.commenter)}
                        />
                    </div>
                ),
                countryCode = item.countryCode ? item.countryCode.toLowerCase() : '',
                userCountry = (
                    <div className='d-flex' style={{flexDirection:'column', textAlign:rtl ? 'right' : 'left'}}>
                        <div className='d-flex' style={{margin: '0px 0px 5px', alignItems:'center', direction:rtl ? 'rtl' : 'ltr'}}>
                            <span className={`flag-icon flag-icon-${countryCode} cardShadow`}></span> &nbsp;
                            <div className='d-flex ' style={{fontSize:'12px'}}>{item.country}{item.city && ( ' - ' + item.city)}</div>
                        </div>
                        {item.username
                            ? (
                            <div>
                                <span style={{color:'#bb00f9', fontWeight:'bold'}}>{item.username}</span>&nbsp;
                            </div>
                            )
                            : <span style={{color:'#999999', fontWeight:450}}>{setLT.unknown}</span>
                        }
                    </div>
                ),
                view = (
                  <div className='d-flex justify-content-end'
                      style={{ width:w<s ? '60px' : '100px', height: '25px', borderRadius:'5px', alignItems:'center', padding:'0px', margin:'0px'}}>
                      <span style={{fontWeight:'', marginTop:'5px'}}>{item.viewCount ? item.viewCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0}</span>&nbsp;&nbsp;
                      <FaRegEye style={{width:'15px', color:'black', margin:'0px 1px'}}/>
                  </div>
                ),
                like = (
                  <div className='d-flex justify-content-end'
                      style={{ width:w<s ? '60px' : '100px', height: '25px', borderRadius:'5px', alignItems:'center', padding:'0px', margin:'0px'}}>
                      <span style={{fontWeight:'', marginTop:'5px'}}>{item.likeCount ? item.likeCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0}</span>&nbsp;&nbsp;
                      <IoMdHeart style={{width:'17px', color:'red', fontSize:'17px'}}/>
                  </div>
                ),
                viewLike = (
                  <div className='d-flex justify-content-end' style={{flexDirection: w<s ? 'column' : 'row'}}>
                    {view}
                    {like}
                  </div>
                ),
                comment = (
                    <div className='d-flex' style={{width:'100%', padding:'0px', fontSize:'14px', fontWeight:'', lineHeight:'18px', marginTop:'10px', whiteSpace:'pre-wrap', textAlign: rtl ? 'right' : 'left'}}>
                        {item.comment}
                    </div>
                ),
                star = (
                    <div className='d-flex' style={{height:'20px', justifyContent:'flex-end', paddingTop: '5px'}}>
                        <StarRatingComponent
                            name="rate1"
                            starCount={5}
                            emptyStarColor={'#eaeaea'}
                            value={item.rating}
                        />
                    </div>
                ),
                deleteBtn = (
                    <div className={rtl ? 'dropdown' : 'dropleft'} style={{padding:'0px'}}>
                        <div className='center bin' id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="" aria-expanded="false"
                            style={{width:'40px', height:'40px', alignItems:'center', borderRadius:'100px'}}>
                            <RiDeleteBin6Fill style={{fontSize:'18px'}}/>
                        </div>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton"
                            style={{fontSize:'13px', cursor:'pointer', padding:'0px', backgroundColor:''}}>
                            <div className="dropdown-item" style={{color:''}} onClick={() => this.onDeleteComment(item)}>
                                {setLT.delete}
                            </div>
                        </div>
                    </div>
                ),
                tableInfo = (
                    <div className='d-flex' style={{padding:'10px 0px', width:'100%', fontSize:'14px', justifyContent: 'space-between', alignItems:''}}>
                        {userImage}&nbsp;&nbsp;&nbsp;
                        <div className='' style={{width:'100%'}}>
                            <div className='d-flex' style={{width:'100%', justifyContent: 'space-between', alignItems:'center'}}>
                                {userCountry}
                                {/* viewLike */}
                                {(mainUserId===userId || mainUserId===item.commenter) && deleteBtn}
                            </div>
                            <div className='d-flex' style={{width:'100%', justifyContent: 'space-between', alignItems:'center'}}>
                                {comment}
                            </div>
                            {star}
                        </div>
                    </div>
                ),
                <div className='d-flex' style={{textDecoration:'none', color:'black', width:w<s ? '100%' : '80%', flexDirection:'column'}}>
                    {i > 0 && 
                        <div className='d-flex' style={{width:'100%', justifyContent:'flex-end'}}>
                            <hr className={`C${this.props.fc}`} style={{width: 'calc(100% - 60px)', height:'hairline', margin:'0px 0px'}}/>
                        </div>
                    }
                    <div key={i}
                        className={`d-flex`}
                        style={{textDecoration: "none", width:'100%', padding:'0px', borderRadius:'5px', margin:'0px 0px', border: '0px solid #7b5cff40'}}
                    >
                        {tableInfo}
                    </div>
                    {commenters.length === 1 && 
                        <div className='d-flex' style={{width:'100%', justifyContent:'flex-end'}}>
                            <hr className={`C${this.props.fc}`} style={{width: 'calc(100% - 60px)', height:'hairline', margin:'0px 0px'}}/>
                        </div>
                    }
                </div>
            )
        )
        this.setState({
            commenterMap: dataRv,
            nCommenter: this.state.nCommenter + 1,
            loadingCommenter:false,
            gettingComment: false,
        })
    }

    getProductService = async () => {
        var pth = window.location.href.replace('#!', '');
        var parts = pth.split('/');
        var p1 = parts.slice(-1).shift() // check username root
        var p2 = parts.slice(-2).shift() // check username root
        var p3 = parts.slice(-3).shift() // check username root

        console.log('p1: ', p1)
        console.log('p2: ', p2)
        if(p1.trim()!=="") {
            await this.getAdsInfo(p1, p2)
        } else {
        }
    }

    getAdsInfo = async (p1, p2) => {
        window.scrollTo(0, 0);
        await axios.get(`${serverURL}/ads/getAdsSlugInfo/` + p1)
        .then(async(res) => {
            var data = res.data
            // this.setState({adsImageData: res.data.adsImageData})

            await this.props.dispatch(setAdsInfo(data))
            await axios.post(`${serverURL}/user/getUserInfo`, { _id: data.userId })
            .then(async(res) => {
                if(p2!==res.data.username) {
                    window.location.href=`/404`
                    return
                }
                delete res.data.password
                // console.log(data.userId)
                const categoryArray = await axios.get(`${serverURL}/user/getCategoryQty/` + data.userId);
                res.data.categoryItems = updateCategoryItems(categoryArray.data.items ?? [], this.props.userServiceSelected)
                res.data.totalAds = categoryArray.data.totalAds
                res.data.totalVideo = categoryArray.data.totalVideo
                res.data.totalInstagram = categoryArray.data.totalInstagram
                res.data.totalContents = categoryArray.data.totalQty
                
                // console.log('nnn', res.data)
                await this.props.dispatch(setSubUserInfo(res.data))
                if(res.data!=='user not found'){
                    this.setState({
                        adsId:p1,
                        businessTypeBiz: res.data.businessType,
                        userId: res.data._id,
                        username: res.data.username,
                        fc: res.data.fc,
                        imageData: res.data.imageData,
                        genderValue: res.data.genderValue,
                        email: res.data.email,
                        phone: res.data.phone,
                        celphone: res.data.celphone,
                        whatsapp: res.data.whatsapp,
                        website: res.data.website,
                        telegram: res.data.telegram,
                        instagram: res.data.instagram,
                        facebook: res.data.facebook,
                        youtube: res.data.youtube,
                        linkedin: res.data.linkedin,    
                        jobSummary: res.data.jobSummary,
                        biography: res.data.biography,
                        country: res.data.country,
                        countryCode: res.data.countryCode,
                        city: res.data.city,
                        address: res.data.address,
                        profileData: true,
                    })
                    
                    if(this.props.auth && this.props.mainUser.ruby) checkSeen(`${p1}`, this.props.seenStatus, this.props.dispatch)
                    await this.addViewAds() // یک view اضافه می کند
                    // await this.countItems()
                    // await this.getImgs(p1)
                    // await this.onImg(0)
                
                    // this.getAdsImage(p1)
                } else {
                    window.location.href=`/404`
                }
            })
        })
    
    }

    getImgs = async (adsId) => {
        this.setState({ gettingImgs:true })
        await axios.post(`${serverURL}/image/getImgs`, { adsId })
        .then(async res => {
            console.log(1818, res.data)
            this.setState({
              gettingImgs: false,
              imgArray: res.data
            })
            this.mapImg(res.data, 0)
        })
    }
    
    mapImg = async (x, a) => {
        const {w} = this.state
        // console.log(a)
        var imgList = x.map (
            (item, i) => (
                <img key={i}
                    className={`btnShadowX`}
                    style={{objectFit: 'contain', width: w<500 ? w/7 : '70px', height: w<500 ? w/7 : '70px', borderRadius:'3px', margin:'5px', border:i===a ? '1px solid blue' : '1px solid #ffffff40', padding:'0px'}}//`${50-(3*i)}px`
                    src={ item.img }
                    alt={`img ${i}`}
                    onClick={() => !this.state.gettingImages ? this.onImg(i) : ''}
                />
            )
        )
        this.setState({imgList})
    }
    
    onImg = async (i) => {
        this.setState({
          adsImageData: this.state.imgArray[i]?.img,
        })
        // console.log(i)
        await this.mapImg(this.state.imgArray, i)
        var imgId = this.state.imgArray[i]?._id
        var imageArray = this.state.imageArray
        var mx = imageArray.map(({ imgId }) => imgId)
        if(mx.includes(imgId)) {
            var index = mx.indexOf(imgId);
            this.setState({
              adsImageData: imageArray[index].xImageData,
            })
        } else {
          await this.getImage(i, imgId)
        }
    }
  
    getImage = async (i, imgId) => {
        this.setState({ gettingImages:true })
        await axios.post(`${serverURL}/image/getImage`, { imgId })
        .then(async res => {
            // console.log(1818, res.data)
            this.state.imageArray.push(res.data)
            this.setState({
                adsImageData: res.data.xImageData ? res.data.xImageData : this.state.imgArray[i]?.img,
                gettingImages:false
            })
        })
    }
  
    onTogglePSPage = async (item) => {
        // window.open(`/ps/${item._id}`)
        if(item) {
            await this.props.dispatch(setAdsInfo(item))
            this.setState({
                selectImgEror: null,
                adsFile:null,
            })
        }

    
      }

    countAllAds = () => {
        var data = {
            userId: this.props.userId,
            status: 1,
        }
        axios.post(`${serverURL}/ads/countUserAds`, data).then(res => {
            this.setState({adsCount: res.data})
        })
    }

    getAllAds = async () => {
        this.setState({
          loadingAds:true,
        })

        var data = {
            userId:this.props.subUserInfo._id,
            userCategoryId: 'All',
            // status: 1,
            n: this.state.nAds,
            q:listRefreshQty,
        }

        await axios.post(`${serverURL}/ads/getAds/`, data).then(async res => {
            
            var x1 = this.state.searchAds
            var x2 = res.data
            // console.log(x2, this.props.subUserInfo._id)
            this.setState({
                searchAds : x1.concat(x2),
                finishDataAds: res.data.length<listRefreshQty ? true : false,
            }, () => {
                this.mapAllAds(this.state.searchAds)
            })
        })
    }

    mapAllAds = async (data) => {
        const {w} = this.state
        const {rtl} = this.props
        var allAds = data.map(
            (item, i) => {
                // console.log(item)
                const imgClass = `center ${ item.pictureType===2 ? '' : 'zoom'}`
                const imgStyleContainer = { width: '100%', position: 'relative', overflow: 'hidden' }
                const imgStyleInnerContainer = { paddingTop: '100%', width: '100%', position: 'relative' }
                const imgStyleAbsolute = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }
    
                const imgSrc = `https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictures[0]}.jpeg`
                const img = ( item.pictureType===2
                    ?
                    <div style={imgStyleContainer}>
                        <div style={imgStyleInnerContainer}>
                            <div className={imgClass} style={imgStyleAbsolute}>
                                <BeforAfter
                                    id={`ad-${i}`}
                                    title={`${item.adsTitle}`}
                                    beforUrl={`https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictures[0]}.jpeg`}
                                    afterUrl={`https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictures[1]}.jpeg`}
                                    borderRadius={0}
                                    width={'100%'}
                                    height={'100%'}
                                />
                            </div>
                        </div>
                    </div>
                    :
                    <div style={imgStyleContainer}>
                        <div style={imgStyleInnerContainer}>
                            <div className={imgClass} style={imgStyleAbsolute}>
                                <BsImages style={{color:'#ffffff', fontSize:'20px', margin:'5px', visibility:item.imgQTY>1 ? 'visible' : 'hidden', position:'absolute', opacity: '1'}}/>
                                <img
                                    className='zoomImg'
                                    style={{objectFit: 'cover', width:'100%', height:'100%', borderRadius:'0px', cursor:'pointer', filter:'blur(30px)'}}
                                    src={imgSrc}
                                    alt={`${item.adsTitle} blur`}
                                />
                                <div className='zoom' style={{height:w<s ? '130px' : '350px', width:'100%', position:'absolute', overflow:'hidden'}}>
                                    <img
                                        className='zoomImg'
                                        style={{objectFit: 'contain', width:'100%', height:'100%', borderRadius:'0px', cursor:'pointer'}}
                                        src={imgSrc}
                                        alt={item.adsTitle}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )
                const TLen = item.adsTitle ? item.adsTitle.length : 0
                const adsTitle = (
                    <div className='d-flex' style={{width:'100%', marginBottom:'5px', fontSize:'13px', fontWeight:'', overflow: 'scroll', textAlign:'right', whiteSpace:'nowrap'}}>
                        {item.adsTitle}
                    </div>
                )
                const adsPrice = (
                    <div className='d-flex' style={{width:'100%', padding:'0px', fontSize:'12px', overflow: 'hidden', textAlign:'right'}}>
                        <div className='center' style={{width:'100%', flexDirection:'column', alignItems:'center'}}>
                            <span style={{ fontSize: '20px', fontWeight: 450 }}>
                                {item.currency}
                                {item.unitPrice && dig3(item.unitPrice, 2)}
                            </span>
                            <div style={{ fontSize: '14px' }}>
                                {item.unitMeasurement}
                            </div>
                        </div>
                    </div>
                )
                const zoom = <AiOutlineZoomIn
                    className='bin'
                    style={{
                        fontSize:'25px', cursor:'pointer',
                        position:'absolute', bottom:10, right:rtl ? '' : 10, left:rtl ? 10 : '',
                    }}
                    onClick={() => this.onTogglePS(item)}
                />

                const root = item.businessType>0 ? 'publisher' : 'user'
                const ads = (
                    <Link to={item.slug ? `/publisher/${item.username}/${item.slug}` : `/ps/${item._id}`} target="_blank" className='btnShadow' style={{height:'100%', width:'100%', backgroundColor:'#ffffff', borderRadius:'10px', overflow:'hidden',}}>
                        <div className=''  style={{height:'100%', width:'100%'}}>
                            <div className='center'  style={{flexDirection:'column'}}>
                                <div style={{width:'100%', cursor:'pointer'}}>
                                    {img}
                                </div>
                                { (item.adsTitle || !item.negotiablePrice) &&
                                    <div  style={{ width:'100%', padding:item.adsTitle ? '10px' : '0px' }}>
                                        {adsTitle}
                                        {!item.negotiablePrice && adsPrice}
                                    </div>
                                }
                                {/* item.pictureType===2 && zoom */}
                            </div>
                        </div>
                    </Link>
                )

                return (
                    <div key={i}
                        className={`d-flex zoomIn disable-select`}
                        style={{textDecoration:'none', width: w<s ? '50%' : '30%',
                            padding:'5px', flexDirection:'column', 
                            alignItems:'stretch', color:'black', position:'relative'}}
                    >
                        {ads}
                    </div>
                )
            }
        )

        this.setState({
            allAds,
            nAds: this.state.nAds + 1,
            loadingAds:false,
        })
    }

    onTogglePS = (item) => {
        const root = item.businessType>0 ? 'publisher' : 'user'
        window.location.href = item.slug ? `/publisher/${item.username}/${item.slug}` : `/ps/${item._id}`
    }

    onResize = () => {
        this.setState({ w: window.innerWidth })
        this.mapImg(this.state.imgArray, 0)
    }

    likerImageMap = (x) => {
        var x3 = x.slice(0,3)

        var likersPreview = x3.map (
              (item, i) => (
                <img key={i}
                    className={`C${item.fc ? item.fc : ''} btnShadow`}
                    style={{objectFit: 'contain', width:'30px', height:'30px', borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'1px solid #ffffff40', padding:'2px'}}//`${50-(3*i)}px`
                    src={ (item.imageData!=='' && item.imageData!==undefined)
                        ? item.imageData
                        : item.genderValue===0 ? female : male
                    }
                    alt="likers preview"
                />
            )
        )

        this.setState({likersPreview})
    }

    onToggleLike = async () => {
        const { auth, mainUser, subChatInfo, videoInfo, geo, fullAccess } = this.props
        if(!auth) {
            this.props.dispatch(setMembership(true))
        } else {
            this.setState({
                nLiker: 1,
                searchLiker:[],
                likersPreviewSet: false,
                gettingLike: true
            })
            var data = {
                liker: mainUser._id,
                likee: this.state.userId,
                adsId: this.state.adsId,
            }
            await axios.post(`${serverURL}/like/likeAds`, data).then(async res => {
                if(this.state.toggleLike) {
                    await this.deleteNotification('adPage', 'like')
                } else {
                    await addNotification('adPage', 'like', fullAccess, mainUser, this.state.userId, geo, this.state.adsId)
                }
                await this.getLikers()
                this.setState({
                    toggleLike: !this.state.toggleLike,
                    likeN: this.state.toggleLike ? this.state.likeN-1 : this.state.likeN+1,
                })
                
            })
        }
    }

    findLikeProfile = async () => {
        var data = {
            liker: this.props.mainUserId,
            likee: this.props.userId,
        }
        //console.log(data)
        axios.post(`${serverURL}/like/findLikeProfile`, data, {
        })
        .then(res => {
            //console.log(444, res.data)
            if(res.data) {
                this.setState({ toggleLike: true });
            } else {
                this.setState({ toggleLike: false });
            }
        })
    }

    toggleZoomProfileImage () {
        this.scrollTo('header')
        this.setState({
            toggleZoomProfileImage: !this.state.toggleZoomProfileImage,
        });
    }

    toggleZoomLocationImage () {
        this.scrollTo('header')
        this.setState({
            toggleZoomLocationImage: !this.state.toggleZoomLocationImage,
        });
    }

    scrollTo (name) {
        this._scroller.scrollTo(name);
    }

    checkNull = () => {
        var infoErr = {}
        // console.log(1, this.state.comment)
        if(this.state.comment.trim()==='') infoErr.userCommentErr = this.props.setLT.userCommentErr
        if(this.state.rating===0) infoErr.userRatingErr = this.props.setLT.userRatingErr
        return infoErr
    }

    onSendComment = async() => { 
        const { auth, mainUser, subChatInfo, videoInfo, geo, fullAccess } = this.props
        if(!auth) {
            this.props.dispatch(setMembership(true))
        } else {
            var infoErr = this.checkNull()
            // console.log(1, infoErr)
            if(Object.keys(infoErr).length>0) {
            // console.log(1)

                this.setState({
                    commentErrors: infoErr.userCommentErr,
                    ratingErrors: infoErr.userRatingErr,
                })
            } else {
                this.setState({
                    sendingComment: true,
                    nCommenter:1,
                    loadingCommenter:true,
                    gettingComment:true,
                    searchCommenter:[],
                    // commentN: '-',
                })

                const info = {
                    commenter: mainUser._id,
                    commentee: this.state.userId,
                    adsId: this.state.adsId,
                    comment: this.state.comment,
                    rating: this.state.rating,
                    commentDate: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
                }
                // console.log(info)
                await axios.post(`${serverURL}/comment/addCommentAds`, info).then((res) => {})
                addNotification('adPage', 'comment', fullAccess, mainUser, this.state.userId, geo, this.state.adsId)
                this.countCommenters(this.state.adsId)
                this.getCommenters()
                this.setState({
                    sendingComment: false,
                    commentErrors: '',
                    ratingErrors: '',
                    comment:'',
                    rating: 0
                });

            }

        }
    }

    onDeleteComment = async (item) => {
        this.setState({
            deletingComment: true,
            nCommenter:1,
            loadingCommenter:true,
            gettingComment:true,
            searchCommenter:[],
            // commentN: '-', 
        })
        await axios.post(`${serverURL}/comment/deleteCommentAds`, { commentId: item._id }).then(async res => {})
        
        const info = {
            commenter: this.props.mainUserId,
            adsId: this.props.adsId,
        }
        await axios.post(`${serverURL}/comment/countCommentAdsFalse`, info).then(async res => {
            if(res.data===0) await this.deleteNotification('adPage', 'comment')
        })
        this.countCommenters(this.state.adsId)
        this.getCommenters()
    }

    onReactor = async (item, userId) => {
        if(userId!=='unknown') {
            // window.open(`/business/${item.username}`);

            await this.props.dispatch(setToggleLoading(true))
            // item._id = userId
            item.userId = userId
            // console.log(item)
            await this.props.dispatch(setSubUserInfo(item))
            setTimeout(async () => {
                await this.props.dispatch(setToggleLoading(false))
            }, 1000);
        }
    }
    
    onComment = (e) => {
        var tx = toFarsi(e.target.value)
        this.setState({
            comment: tx
        })
    }

    onStarClick = (nextValue, prevValue, name) => {
        if (this.state.rating === 1 && nextValue === 1){
            this.setState({rating: 0});
        } else {
            this.setState({rating: nextValue});
        }
    }

    onViewBtn = async () => {
        this.setState({
            toggleViewBtn: true,
            toggleLikeBtn: false,
            toggleCommentBtn: false,
        })
    }

    onLikeBtn = async () => {
        this.setState({
            toggleViewBtn: false,
            toggleLikeBtn: true,
            toggleCommentBtn: false,
        })

        if(!this.state.likeBtn) {
            await this.getLikers()
            this.setState({ likeBtn: true })
        }
    }

    onCommentBtn = async () => {
        this.setState({
            toggleViewBtn: false,
            toggleLikeBtn: false,
            toggleCommentBtn: true,
        })

        if(!this.state.commentBtn) {
            await this.getCommenters()
            this.setState({ commentBtn: true })
        }
    }

    onToggleEditAds = () => {
        const adsInfoX = JSON.parse(JSON.stringify(this.props.adsInfo));
        this.props.dispatch(setAdsInfo(adsInfoX))
        this.props.dispatch(setToggleAds({type:'edit'}))
    }

    onToggleAds = (type) => {
        this.props.dispatch(setToggleAds({type}))
    }

    getFirstChars = (html, limit = 100) => {
        if (!html) return '';

        const div = document.createElement('div');
        div.innerHTML = html;

        const text = (div.textContent || div.innerText || '').trim();

        if (text.length <= limit) return text;

        let truncated = text.slice(0, limit);

        // پیدا کردن آخرین فاصله برای جلوگیری از نصف شدن کلمه
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 0) {
            truncated = truncated.slice(0, lastSpace);
        }

        return truncated + ' ...';
    };

    render() {
        const {w, fc, toggleZoomQRCode, toggleViewBtn, toggleLikeBtn, toggleCommentBtn, imgArray, gettingImgs, gettingImages,
            adsImageData, imgList, comment, commentErrors, rating, ratingErrors, sendingComment, commenterMap,
            finishDataCommenter, loadingCommenter, countryCode, gettingView, gettingLike, locationDataX,
            country, jobSummary, loadingAds, finishDataAds, adsCount, pageY, username, allAds,
            bigImage, likeN, viewN, commentN, toggleLike, toggleZoomProfileImage, toggleZoomLocationImage,
            profileData, businessTypeBiz, likerMap, viewerMap, loadingLiker, loadingViewer, finishDataLiker,
            finishDataViewer} = this.state;
        const {rtl, lang, setLT, adsInfo, businessType, auth, mainUser, subUserInfo, userImg, genderValue, userId, mainUserId, userType,
            advertiserId} = this.props

        const titleStyle = {fontSize:'22px', fontWeight:'bold', margin:'10px 0px 15px', alignItems:'center'}
        const subTitleStyle = {fontSize:'18px', fontWeight:'bold', margin:'10px 0px 5px 0px', textAlign: rtl ? 'right' : 'left', alignItems:'center', width:w<s ? '100%' : '80%'}
        const locationStyle = {objectFit: 'contain', height:'150px', width:'150px', borderRadius:'3px', border:'0px solid #999999'}
        const mainGenderX = mainUser.genderValue!==undefined ? (mainUser.genderValue===0 ? female : male) : userN
        const subGenderX = subUserInfo.genderValue!==undefined ? (subUserInfo.genderValue===0 ? female : male) : userN
        const loaderImg = <div className='loader-40' style={{position:'absolute', width:'100px', height:'100px', margin: '0px', color:'#000000', transform: rtl ? 'rotate(180deg)' : '', backgroundColor:'#ffffff50'}}></div>
        const loaderX = <div className='loader-02' style={{margin: rtl ? '0px' : '0px', color:'red', fontSize:'20px'}}></div>
        const loaderX2 = <div className='loader-02' style={{margin: rtl ? '0px' : '0px', color:'red', fontSize:'30px'}}></div>
        const loaderY = <div className='loader-02' style={{margin: rtl ? '0px' : '0px', color:'black'}}></div>
        const loaderZ = <div className='loader-13' style={{margin: rtl ? '35px 20px -25px' : '0px 20px 0px', color:'#000000', transform: rtl ? 'rotate(180deg)' : ''}}></div>
        const loaderAlert = <div className={`loader-07 f${fc}`} style={{margin: '', width:'100px', height:'100px', position:'absolute', margin:'-40px 0px 0px'}}></div>
        const pIndx = adsInfo.pictureType===2 ? 1 : 0

        const me = mainUser._id && subUserInfo._id && mainUser._id===subUserInfo._id ? true : false
        const txWhite = [4, 11].includes(fc) ? false : true
        const aboutImgSrc = adsInfo.pictures ? `https://www.pix.shiningpage.com/whoraly/ads/big/${adsInfo._id}-${adsInfo?.pictures[pIndx]}.jpeg` : ''
        const root = subUserInfo.businessType>0 ? 'publisher' : 'user'

        const moreLiker = (
            <div className='center'>
                <div className={`C${fc} btnShadow`}
                    style={{minWidth: '100px', height: '30px', 
                            textAlign:'center', 
                            margin: '0px 0px 0px',
                            border: `3px solid ${(fc===11 || fc===4 || fc===14 || fc===undefined) ? '#00000020' : '#ffffff99'}`,
                            padding: '0px 10px',
                            color: `${(fc===11 || fc===4 || fc===13 || fc===14 || fc===undefined) ? '#00000090' : '#ffffff'}`,
                            borderRadius: '100px'}}
                    onClick = {() => this.getLikers()}>
                    <span>{setLT.more}</span>
                    <FaAngleLeft style={{fontSize:'20px', margin:'2px 0px 0px 0px', transform:'rotate(-90deg)'}}/>
                </div>
            </div>
        )
    
        const moreViewer = (
            <div className='center'>
                <div className={`C${fc} btnShadow`}
                    style={{minWidth: '100px', height: '30px', 
                            textAlign:'center', 
                            margin: '0px 0px 0px',
                            border: `3px solid ${(fc===11 || fc===4 || fc===14 || fc===undefined) ? '#00000020' : '#ffffff99'}`,
                            padding: '0px 10px',
                            color: `${(fc===11 || fc===4 || fc===13 || fc===14 || fc===undefined) ? '#00000090' : '#ffffff'}`,
                            borderRadius: '100px'}}
                    onClick = {() => this.getViewers()}>
                    <span>{setLT.more}</span>
                    <FaAngleLeft style={{fontSize:'20px', margin:'2px 0px 0px 0px', transform:'rotate(-90deg)'}}/>
                </div>
            </div>
        )
    
        const moreComment = (
            <div className='center'>
                <div className={`C${fc} btnShadow`}
                    style={{minWidth: '100px', height: '30px', 
                            textAlign:'center', 
                            margin: '0px 0px 0px',
                            border: `3px solid ${(fc===11 || fc===4 || fc===14 || fc===undefined) ? '#00000020' : '#ffffff99'}`,
                            padding: '0px 10px',
                            color: `${(fc===11 || fc===4 || fc===13 || fc===14 || fc===undefined) ? '#00000090' : '#ffffff'}`,
                            borderRadius: '100px'}}
                    onClick = {() => this.getCommenters()}>
                    <span>{setLT.more}</span>
                    <FaAngleLeft style={{fontSize:'20px', margin:'2px 0px 0px 0px', transform:'rotate(-90deg)'}}/>
                </div>
            </div>
        )

        const moreAds = (
            <div className='center'>
                <div className={`C${fc} btnShadow`}
                    style={{minWidth: '100px', height: '30px', 
                            textAlign:'center', 
                            margin: '40px 0px 30px',
                            border: `3px solid ${(fc===11 || fc===4 || fc===14 || fc===undefined) ? '#00000020' : '#ffffff99'}`,
                            padding: '0px 10px',
                            color: `${(fc===11 || fc===4 || fc===13 || fc===14 || fc===undefined) ? '#00000090' : '#ffffff'}`,
                            borderRadius: '100px'}}
                    onClick = {() => this.getAllAds()}>
                    <span>{setLT.more}</span>
                    <FaAngleLeft style={{fontSize:'20px', margin:'2px 0px 0px 0px', transform:'rotate(-90deg)'}}/>
                </div>
            </div>
        )

        const allAdsList = (
            <div className={'d-flex center'} style={{alignItems:'stretch', flexWrap: 'wrap', zIndex:'0'}}>
                {allAds}
            </div>
        )

        const profileStyle = {objectFit: 'contain', height:'150px', width:'150px', borderRadius:businessTypeBiz>0 ? '3px' : '100px', border:'1px solid #999999'}
        const genderX = genderValue===0 ? female : male
        const srcSubUser = exist(subUserInfo.profileIndex)
                            ? `https://www.pix.shiningpage.com/whoraly/profile/big/${subUserInfo._id}-${subUserInfo.profileIndex}.jpeg`
                            : subGenderX

        const UserImage = (
            <div className={`C${subUserInfo.fc}`} style={{width:'50px', height:'50px', borderRadius:businessTypeBiz>0 ? '3px' : '100px', padding:'2px'}}>
                <img
                    className = {`btnShadow`}
                    style={{objectFit: 'cover', width:'100%', height:'100%', borderRadius:businessTypeBiz>0 ? '3px' : '100px'}}
                    src={ srcSubUser }
                    alt={`${subUserInfo.username} image`}
                    onClick={() => this.toggleZoomProfileImage()}
                />
            </div>
        )

        const countryConst = (
            <div className='d-flex ' style={{alignItems:'flex-end', height:'', justifyContent:'flex-start', margin:'8px 0px 3px', whiteSpace:'nowrap'}}>
                <div className={`flag-icon flag-icon-${countryCode ? countryCode.toLowerCase() : ''} ${subUserInfo._id ? 'cardShadow' : ''}`}
                    style={{width:'', border:'1px solid #ffffff50', fontSize:'17px'}}></div>&nbsp;
                {w>300 && <div style={{fontSize:'12px'}}>{country ? country.toUpperCase() : ''}</div>}
            </div>
        )

        const usernameConst = (
            <div className='' style={{fontSize:'15px', fontWeight:400, margin:'0px', whiteSpace:'nowrap', overflow:'scroll'}}>
                {subUserInfo.bizName ? subUserInfo.bizName : subUserInfo.username}
            </div>
        )

        const jobSummaryConst = (
            <div className='' style={{fontSize:'17px', fontWeight:450, margin:'0px', whiteSpace:'nowrap', overflow:'scroll'}}>
                {subUserInfo.jobSummary}
            </div>
        )

        const addressbar = (
            <div className='cardShadow'>
                <div style={{padding:'10px', fontWeight:450, color:'#ffffff', backgroundColor:'#ffffff00'}}>
                    <Container>
                        <div className='d-flex'>
                            <div className='d-flex' style={{alignItems:'center'}}>
                                <Link to={`/${root}/${subUserInfo.username}`} className='link-underline'>{subUserInfo.bizName ? subUserInfo.bizName : subUserInfo.username}</Link>
                                <FaAngleRight style={{margin:'0px 5px', transform: rtl ? 'scaleX(-1)' : ''}}/>
                            </div>
                            <span className='underline' onClick={() => window.location.reload()}>{adsInfo.adsTitle}</span>
                        </div>
                    </Container>
                </div>
                <div className='C14' style={{width:'100%', height:'2px'}}></div>
            </div>
        )

        const bizAboutImgSrc = profileData
            ?
                subUserInfo.aboutIndex
                ? `https://www.pix.shiningpage.com/whoraly/about/big/${subUserInfo._id}-${subUserInfo.aboutIndex}.jpeg`
                : subUserInfo.profileIndex
                    ? `https://www.pix.shiningpage.com/whoraly/profile/big/${subUserInfo._id}-${subUserInfo.profileIndex}.jpeg`
                    : aboutUsImg
            : ''

        const userHeader = (
            <div className='f11' style={{padding:'50px 0px 20px', marginBottom:'50px'}}>
                <h1 style={{marginBottom:'20px'}}>Publisher</h1>
                <div className='btnShadow' style={{padding:'10px', borderRadius:'10px', }}
                    onClick = {() => goToWebPage(subUserInfo)}>
                    <div className='d-flex' style={{width:'100%'}}>
                        <div className='d-flex' style={{marginBottom:'10px'}}>
                            {UserImage}&nbsp;&nbsp;
                            <div>
                                {countryConst}
                                {usernameConst}
                            </div>
                        </div>
                    </div>
                    {jobSummaryConst}
                    {this.getFirstChars(subUserInfo.biography, 250)}
                </div>
            </div>
        )

        const userHeaderWithBackgroundImage = (
            <div className='' style={{padding:'50px 0px 20px'}}>
                <h1 style={{marginBottom:'20px'}}>Publisher</h1>
                <div className='btnShadow' style={{padding:'3px', borderRadius:'10px', backgroundImage:`url(${bizAboutImgSrc})`, backgroundSize: 'cover', backgroundPosition: 'right', position:'relative', overflow:'hidden'}}
                    onClick = {() => goToWebPage(subUserInfo)}>
                    <div style={{width:'100%', backgroundColor:'#ffffff99', borderRadius:'7px', overflow:'hidden'}}>
                    <div style={{width:'100%', backgroundColor:'#ffffff00', padding:'10px'}}>
                        <div className='d-flex' style={{width:'100%'}}>
                            <div className='d-flex' style={{marginBottom:'10px'}}>
                                {UserImage}&nbsp;&nbsp;
                                <div>
                                    {countryConst}
                                    {usernameConst}
                                </div>
                            </div>
                        </div>
                        {jobSummaryConst}
                        {this.getFirstChars(subUserInfo.biography, 250)}
                    </div>
                    </div>
                </div>
            </div>
        )

        const spaceDown = 20

        const adsSub = (
            <div style={{marginBottom:spaceDown}}>
                <h2 className='f11' style={{marginBottom:'20px'}}>Contents from this publisher</h2>
                {/* hr */}
                <div style={{margin:w>s && '10px 20px', paddingTop:'5px'}}>{allAdsList}</div>
                <div className='center' style={{width:'100%', height:!finishDataAds ? '100px' : '0px', alignItems:'center'}}>
                    {(loadingAds && !finishDataAds) && 'loading...'}
                    {(!loadingAds && !finishDataAds) && moreAds}
                </div>
                {/* hr */}
            </div>
        )

        const heartClick = (
            <div style={{cursor:(advertiserId!==mainUserId && userType===1) ? 'pointer' : '', position:''}}
                onClick={(userId!==mainUserId && userType===1) ? () => gettingLike ? '' : this.onToggleLike() : ''}>
                {
                    toggleLike
                            ? <IoMdHeart style={{width:'30px', fontSize:'30px', color:'red'}}/>
                            : <IoMdHeartEmpty style={{width:'30px', fontSize:'30px', color:(userId!==mainUserId && userType===1) ? 'red' : 'grey'}}/>
                }
            </div>
        )

        const likersTitleSub = (
            <div className='center' style={{width:'100%'}}>
                <div className={`d-flex f${fc} ${txWhite ? 'txWhite' : 'txBlack'}`} style={subTitleStyle}>
                    {setLT.likers}&nbsp;&nbsp;&nbsp;{gettingLike ? loaderX2 : heartClick}
                </div>
            </div>
        )
    
        const likerConst = (
            <div className="center" style={{flexWrap: 'wrap', width: '100%', padding:'0px 0px 20px'}}>
                {likerMap}
            </div>
        )
    
        const likersSub = (
            <div className='animated fadeIn' style={{animationDelay:'0s', marginBottom:spaceDown, marginTop:'50px', padding:w>s && '0px 10px'}}>
                {likersTitleSub}
                <div style= {{backgroundColor:'', zIndex:'0'}}>
                    {likerConst}
                    <div className='center' style={{width:'100%', height: !finishDataLiker ? '100px' : '0px', alignItems:'center'}}>
                        {(loadingLiker && !finishDataLiker) && 'loading...'}
                        {(!loadingLiker && !finishDataLiker) && moreLiker}
                    </div>
                </div>
                {/* hr */}
            </div>
        )
    
        const viewersTitleSub = (
            <div className='center' style={{width:'100%'}}>
                <div className={`f${fc} ${txWhite ? 'txWhite' : 'txBlack'}`} style={subTitleStyle}>
                    {setLT.viewers}
                </div>
            </div>
        )
    
        const viewerConst = (
            <div className="center" style={{flexWrap: 'wrap', width: '100%', padding:'0px 0px 20px'}}>
                {viewerMap}
            </div>
        )
    
        const viewersSub = (
            <div className='animated fadeIn' style={{animationDelay:'0s', marginBottom:spaceDown, marginTop:'50px', padding:w>s && '0px 10px'}}>
                {viewersTitleSub}
                <div style= {{backgroundColor:'', zIndex:'0'}}>
                    {viewerConst}
                    <div className='center' style={{width:'100%', height: !finishDataLiker ? '100px' : '0px', alignItems:'center'}}>
                        {(loadingViewer && !finishDataViewer) && 'loading...'}
                        {(!loadingViewer && !finishDataViewer) && moreViewer}
                    </div>
                </div>
                {/* hr */}
            </div>
        )
    
        const sendComment = (
            <div className='center' style={{width:'100%', marginTop:'10px'}}>
                <div style={{padding:w<s ? '0px' : '0px', backgroundColor:'', width:w<s ? '100%' : '80%', zIndex:''}}>
                    <div className='' style={{backgroundColor:'#ffffff00', border:'0px solid #999999', borderRadius:'5px'}}>
                        <div className='' style={{padding:'0px'}}>
                            <textarea
                                onChange={this.onComment}
                                value={comment}
                                type="text"
                                id="defaultFormContactMessageEx"
                                className="form-control"
                                placeholder={setLT.commentPlaceHolder}
                                rows="5"
                            />
                            <span className='invalid-feedback'
                                    style={{ margin: '10px 0px 0px 0px', textAlign: rtl ? 'right' : 'left', color:'red', fontSize:'13px',
                                            display : commentErrors ? 'block' : 'none'}}>
                                <ul>{commentErrors}</ul>
                            </span>
                            <div className='text-center' style={{margin:'15px 0px 0px 0px', fontSize:'20px'}}>
                                <StarRatingComponent
                                    name="rate1"
                                    starCount={5}
                                    value={rating}
                                    onStarClick={this.onStarClick}
                                />
                            </div>
                            <span className='invalid-feedback'
                                    style={{ margin: '0px 0px 0px 0px', textAlign: rtl ? 'right' : 'left', color:'red', fontSize:'13px',
                                            display : ratingErrors ? 'block' : 'none'}}>
                                <ul>{ratingErrors}</ul>
                            </span>
    
                            <div className='center'>
                                <div className={`C${fc} btnShadow`}
                                    style={{width: '100px', textAlign:'center', 
                                            height: '30px',
                                            margin: '10px',
                                            border: `3px solid ${(fc===11 || fc===4 || fc===14 || fc===undefined) ? '#00000020' : '#ffffff99'}`,
                                            padding: '2px',
                                            color: `${(fc===11 || fc===4 || fc===13 || fc===14 || fc===undefined) ? '#00000090' : '#ffffff'}`,
                                            borderRadius: '100px'}}
                                    onClick = {() => this.onSendComment()}>
                                    {sendingComment
                                        ? loaderZ
                                        :<div>
                                            <span style={{fontSize:'15px'}}>{setLT.send}</span>
                                            <FaRegPaperPlane style={{fontSize:'15px', margin:'0px 10px'}}/>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    
        const commentTitleSub = (
            <div className='center' style={{width:'100%'}}>
                <div className={`f${fc} ${txWhite ? 'txWhite' : 'txBlack'}`} style={subTitleStyle}>
                    {setLT.memberReviews}
                </div>
            </div>
        )
    
        const commentConst = (
            <div className="center" style={{flexWrap: 'wrap', width: '100%', padding:'0px'}}>
                {commenterMap}
            </div>
        )

        const commentSub = (
            <div className='animated fadeIn' style={{animationDelay:'0s', marginBottom:spaceDown, marginTop:'50px', padding:w>s && '0px 10px'}}>
                {commentTitleSub}
                <div style= {{backgroundColor:'', zIndex:'0'}}>
                    {commentConst}
                    <div className='center' style={{width:'100%', height: !finishDataCommenter ? '100px' : '0px', alignItems:'center'}}>
                        {(loadingCommenter && !finishDataCommenter) && 'loading...'}
                        {(!loadingCommenter && !finishDataCommenter) && moreComment}
                    </div>
                    {sendComment}
                </div>
            </div>
        )

        const personalInfoSub = (
            <div style={{width:'100%', margin:w<s ? '20px 0px 10px' : '20px 0px 10px'}}>
                {adsSub}
            </div>
        )

        const connection = (
            <div className='center'>
                <div className={`center C${fc} btnShadow`}
                    style={{width: '', height: '', fontSize:'13px',
                            textAlign:'center', 
                            margin: w<s ? '-5px 0px 30px' : '-5px 0px 0px',
                            border: `3px solid ${(fc===11 || fc===4 || fc===14 || fc===undefined) ? '#00000020' : '#ffffff99'}`,
                            padding: '5px 10px',
                            color: `${(fc===11 || fc===4 || fc===13 || fc===14 || fc===undefined) ? '#00000090' : '#ffffff'}`,
                            borderRadius: '100px'}}
                    onClick = {() => goToWebPage(subUserInfo)}>
                    {loaderAlert}
                    {setLT.contactInfo}
                </div>
            </div>
        )

        const modalZoomProfileImage = (
            <Modal isOpen={toggleZoomProfileImage}
                    toggle={() => this.toggleZoomProfileImage()}
                    style={{}}
                >
                <div className = {`C${fc}`} style={{padding:'10px'}}>
                    <Modal.Body style={{fontSize:'13px', backgroundColor:'#ffffff00', borderRadius:'3px', padding:'0px'}}>
                        <div className='d-flex' style={{alignItems:'center', color: `${(fc===11 || fc===4 || fc===13 || fc===14 || fc===undefined) ? '#00000090' : '#ffffff'}`}}>
                            <div className={`center C${fc}`} onClick={() => this.toggleZoomProfileImage()}
                                style={{width:'30px', height:'30px', padding:'2px', margin:'0px 0px 5px',borderRadius:'100px',
                                        border: `3px solid ${(fc===11 || fc===4 || fc===14 || fc===undefined) ? '#00000020' : '#ffffff99'}`,
                                }}>
                                <MdClose className='sidebarIcon sticky-top' style={{marginTop:'5px', width:'20px', fontSize:'20px', fontWeight:'bold', cursor:'pointer', position:'absolute', zIndex: '1000'}}/>
                            </div>
                        </div>
                        <img
                            style={{width:'100%'}}
                            src={exist(subUserInfo.profileIndex)
                                ? `https://www.pix.shiningpage.com/whoraly/profile/big/${subUserInfo._id}-${subUserInfo.profileIndex}.jpeg`
                                : subGenderX
                            }
                            alt={`${subUserInfo.username} profile photo`}
                        />
                    </Modal.Body>
                </div>
            </Modal>
        )

        var bizLink = `https://shiningpage.com/${root}/${subUserInfo.username}`
        const bizLinkConst = (
            <div className='d-flex' style={{direction:'ltr', margin:'20px 0px 10px', textAlign:'center'}}>
                <FaGlobe className='' style={{fontSize:'25px', margin:'0px', color:'brown'}}/>&nbsp;&nbsp;
                <a href={bizLink} style={{fontSize:'14px', margin:'5px 0px 0px', overflow:'scroll'}}>
                    <span style={{}}>{bizLink}</span>
                </a>
            </div>
        )

        const modalZoomLocationImage = (
            <Modal isOpen={toggleZoomLocationImage}
                    toggle={() => this.toggleZoomLocationImage()}
                    style={{}}
                >
                <div className = {`C${fc}`} style={{padding:'10px'}}>
                    <Modal.Body style={{fontSize:'13px', backgroundColor:'#ffffff00', borderRadius:'3px', padding:'0px'}}>
                        <div className='d-flex' style={{alignItems:'center', color: `${(fc===11 || fc===4 || fc===13 || fc===14 || fc===undefined) ? '#00000090' : '#ffffff'}`}}>
                            <div className={`center C${fc}`} onClick={() => this.toggleZoomLocationImage()}
                                style={{width:'30px', height:'30px', padding:'2px', margin:'0px 0px 5px',borderRadius:'100px',
                                        border: `3px solid ${(fc===11 || fc===4 || fc===14 || fc===undefined) ? '#00000020' : '#ffffff99'}`,
                                }}>
                                <MdClose className='sidebarIcon sticky-top' style={{marginTop:'5px', width:'20px', fontSize:'20px', fontWeight:'bold', cursor:'pointer', position:'absolute', zIndex: '1000'}}/>
                            </div>
                        </div>
                        <div style={{}}>
                            {locationDataX==='' &&
                                <canvas id="canvas" style={locationStyle}></canvas>
                            }
                            {locationDataX!=='' && 
                                <div className='d-flex' style={{padding:'0px 0px', width:'', fontSize:'25px', marginBottom:'0px', backgroundColor:'#ffffff99', justifyContent:'center', alignItems:'center'}}>
                                    <img
                                        style={{width:'100%'}}
                                        src={locationDataX
                                            ? locationDataX
                                            : locationImg
                                        }
                                        alt={`${subUserInfo.username} location`}
                                    />
                                </div>
                            }
                        </div>
                    </Modal.Body>
                </div>
            </Modal>
        )

        let imgSrc
        const imgStyle = { margin:'0px', width:'100%', height:w<s ? (adsInfo.pictureType===2 ? '350px' : '500px') : '700px', alignItems:'center', overflow:'hidden'}
        if (adsInfo && Array.isArray(adsInfo.pictures) && adsInfo.pictures.length > 0) {
            imgSrc = `https://www.pix.shiningpage.com/whoraly/ads/big/${adsInfo._id}-${adsInfo.pictures[0]}.jpeg`;
        }
        const adsImageX = (
            <div className='center animated fadeInUpX' style={{animationDelay:'.5s', height:'', width:'100%', marginBottom:'20px'}}>
                <div className='center' style={{height:'', width:'100%', flexDirection:'column', alignItems:'center', border:'0px solid #00000030'}}>
                    {adsInfo.pictureType===2
                        ?
                        <div className='center' style={imgStyle}>
                            <BeforAfter
                                id={`ps-image`}
                                title={`${adsInfo.adsTitle}`}
                                beforUrl={`https://www.pix.shiningpage.com/whoraly/ads/big/${adsInfo._id}-${adsInfo.pictures[0]}.jpeg`}
                                afterUrl={`https://www.pix.shiningpage.com/whoraly/ads/big/${adsInfo._id}-${adsInfo.pictures[1]}.jpeg`}
                                borderRadius={0}
                                width={w<s ? '90%' : '100%'}
                                height={w<s ? '90%' : '100%'}
                            />
                        </div>
                        :
                        <div className='center' style={imgStyle} onClick={() => adsInfo.adsLink ? window.open(adsInfo.adsLink) : null}>
                            <BsImages style={{color:'#ffffff', fontSize:'20px', margin:'5px', visibility:adsInfo.imgQTY>1 ? 'visible' : 'hidden', position:'absolute', opacity: '1'}}/>
                            <img
                                className=''
                                style={{objectFit: 'cover', width:'100%', height:'100%', borderRadius:'0px', filter:'blur(50px)'}}
                                src={imgSrc}
                                alt={`${adsInfo.adsTitle} blur`}
                            />
                            <div style={{height:w<s ? '500px' : '700px', width:'100%', position:'absolute', overflow:'hidden'}}>
                                <img
                                    className=''
                                    style={{objectFit: 'contain', width:'100%', height:'100%', borderRadius:'0px'}}
                                    src={imgSrc}
                                    alt={adsInfo.adsTitle}
                                />
                            </div>
                        </div>
                    }
                </div>
            </div>
        )

        const adsText = (
            <div style={{width:'100%' , backgroundColor:'#ffffff99', borderRadius:'5px', padding:'10px'}}>
                <div style={{width:'100%' , backgroundColor:'#ffffff99', borderRadius:'5px'}}>
                    <div style={{padding:'10px', borderRadius:'5px'}}>
{/*                         <div style={{margin:'20px 0px', fontSize:'17px', fontWeight:'bold', textAlign:'center', direction:rtl ? 'rtl' : 'ltr'}}>{adsInfo.adsTitle}</div>
 */}                        <div className={`d-flex ${w<s ? '' : 'typewriter'}`} style={{flexDirection:'column'}}>
                            <div className={w<s ? 'animated fadeIn delay-1s' : ''}
                                style={{fontSize: w<500 ? '14px' : '15px', whiteSpace:'pre-wrap', margin:'0px', lineHeight:'30px', direction:'ltr'}}
                                dangerouslySetInnerHTML={{ __html: adsInfo.adsComment }}/>
                            <hr style={{width:'100%'}}/>
                            { !adsInfo.negotiablePrice &&
                                <div className='' style={{width:'100%', flexDirection:'column', alignItems:'center'}}>
                                    <span style={{ fontSize:'20px', fontWeight:450 }}>
                                        {adsInfo.currency}
                                        {adsInfo.unitPrice && dig3(adsInfo.unitPrice, 2)}
                                    </span>
                                    <div style={{ fontSize: '14px' }}>
                                        {adsInfo.unitMeasurement}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )

        const imgListConst = (
            <div className='center' style={{width:'100%', height: '', margin:'10px 0px', alignItems:'center', flexWrap:'wrap'}}>
                {gettingImgs ? loaderZ : imgList}
            </div>
        )

        const mainAds = (
            <div id='aboutInfo' style={{backgroundImage:`url(${aboutImgSrc})`, backgroundSize: 'cover', backgroundPosition: 'right', position:'relative'}}>
                <div className='sticky-top' style={{top:w<s ? 50 : 70, zIndex:'1'}}>{me && <EditBtn rtl={rtl} stickyTop='on' onClick={() => this.onToggleEditAds()}/>}</div>
                <div style={{width:'100%', height:'100%', backgroundColor:'#ffffff99'}}>
                <div style={{width:'100%', height:'100%', backgroundColor:'#ffffff99'}}>
                    <div style={{padding:w<s ? '50px 0px' : '70px 0px', fontSize:w<s ? '16px' : '18px'}}>
                        <Container className='center' style={{alignItems:'center', flexDirection:'column'}}>
                            <h1 style={{marginBottom:'50px', textAlign:'center'}}>{adsInfo.adsTitle}</h1>
                            <div className='d-flex' style={{alignItems:w<s ? 'center' : '', flexDirection:w<s ? 'column' : ''}}>
                                {adsInfo.pictures && (
                                    adsInfo.pictureType === 2 ? (
                                        <div className='center' style={{ marginRight: w < s ? '' : '70px', width:'300px', height:'300px', borderRadius:'0px 100px 0px 100px', alignItems:'center', overflow:'hidden'}}>
                                            <BeforAfter
                                                id={`ps-image`}
                                                title={`${adsInfo.adsTitle}`}
                                                beforUrl={`https://www.pix.shiningpage.com/whoraly/ads/big/${adsInfo._id}-${adsInfo.pictures[0]}.jpeg`}
                                                afterUrl={`https://www.pix.shiningpage.com/whoraly/ads/big/${adsInfo._id}-${adsInfo.pictures[1]}.jpeg`}
                                                borderRadius={0}
                                                width={w<s ? '90%' : '100%'}
                                                height={w<s ? '90%' : '100%'}
                                            />
                                        </div>
                                    ) : (
                                        <img
                                            className={w<s ? '' : 'sticky-top'}
                                            style={{ top: w<s ? '' : NavH + 10, zIndex:0, 
                                                objectFit:'cover',
                                                height:'300px',
                                                width: w < s ? 'calc(100% - 20px)' : '300px',
                                                borderRadius:'0px 100px 0px 100px',
                                                marginRight: w < s ? '' : '70px',
                                                marginBottom: w < s ? '50px' : '',
                                                border:'1px solid #99999930'
                                            }}
                                            src={aboutImgSrc}
                                            alt={`${adsInfo.adsTitle} about`}
                                        />
                                    )
                                )}
                                <div style={{whiteSpace:'pre-wrap', width:w < s ? 'calc(100% - 20px)' : ''}}>
                                    {RenderContent(adsInfo.adsComment)}
                                </div>
                            </div>
                        </Container>
                    </div>
                </div>
                </div>
            </div>
        )
    
        const likeNX = likeN ? likeN.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0
        const heart = toggleLike
                        ? <IoMdHeart style={{width:'20px', fontSize:'20px', color:(toggleLikeBtn && fc===8) ? '#ffffff' : 'red'}}/>
                        : <IoMdHeartEmpty style={{width:'20px', fontSize:'20px', color:(toggleLikeBtn && fc===8) ? '#ffffff' : ((advertiserId!==mainUserId && userType===1) ? 'red' : 'grey')}}/>
        const like = (
            <div className={`center btnShadowX2 C${toggleLikeBtn ? fc : ''} backBlur`} onClick={ () => this.onLikeBtn() } //onClick={(advertiserId!==mainUserId && userType===1) ? () => gettingLike ? '' : this.onToggleLike() : ''}
                style={{alignItems:'center', padding:'5px', margin:'0px 0px 0px', borderRadius:'100px', minWidth:'55px', minHeight:'55px', 
                    border: `3px solid ${(fc===4 || fc===14 || fc===undefined || !toggleLikeBtn) ? '#00000020' : '#ffffff99'}`,
                    color: `${(fc===11 || fc===4 || fc===13 || fc===14 || fc===undefined || !toggleLikeBtn) ? '#00000090' : '#ffffff'}`,
                }}>
                <span style={{marginTop:'5px'}}>{likeNX}</span>&nbsp;
                {gettingLike ? loaderX : heart}
            </div>
        )
    // console.log(advertiserId, mainUserId)
        const viewNX = viewN ? viewN.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0
        const eye = <FaRegEye style={{width:'18px', fontSize:'20px', color:'', margin:'0px 2px'}}/>
        const view = (
            <div className={`center btnShadowX2 C${toggleViewBtn ? fc : ''} backBlur`} onClick={ () => this.onViewBtn() }
                style={{alignItems:'center', cursor:(userId!==mainUserId && userType===1) ? 'pointer' : '', padding:'5px', margin:'0px 0px 0px', borderRadius:'100px', minWidth:'55px', minHeight:'55px', 
                    border: `3px solid ${(fc===4 || fc===14 || fc===undefined || !toggleViewBtn) ? '#00000020' : '#ffffff99'}`,
                    color: `${(fc===11 || fc===4 || fc===13 || fc===14 || fc===undefined || !toggleViewBtn) ? '#00000090' : '#ffffff'}`,
                }}>
                <span style={{marginTop:'5px'}}>{viewNX}</span>
                {gettingView ? loaderY : eye}
            </div>
        )
    
        const commentNX = commentN ? commentN.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0
        const chatIcone = <BsChat style={{width:'18px', fontSize:'20px', color:'', margin:'0px 2px'}}/>
        const commentX = (
            <div className={`center btnShadowX2 C${toggleCommentBtn ? fc : ''} backBlur`} onClick={ () => this.onCommentBtn() } // onClick = {() => this.onCommentIcon()}
                style={{alignItems:'center', cursor:(userId!==mainUserId && userType===1) ? 'pointer' : '', padding:'5px', margin:'0px 0px 0px', borderRadius:'100px', minWidth:'55px', minHeight:'55px', 
                    border: `3px solid ${(fc===4 || fc===14 || fc===undefined || !toggleCommentBtn) ? '#00000020' : '#ffffff99'}`,
                    color: `${(fc===11 || fc===4 || fc===13 || fc===14 || fc===undefined || !toggleCommentBtn) ? '#00000090' : '#ffffff'}`,
                }}>
                <span style={{marginTop:'5px'}}>{commentNX}</span>
                {gettingView ? loaderY : chatIcone}
            </div>
        )
      
        const likeViewChat = (
            <div className='center' style={{width:'', alignItems:'center', height:'30px', padding: '20px 0px 0px', margin:'30px 0px 0px', backgroundColor:'', borderTop: '0px solid #efefef', borderRadius:'3px'}}>
                {like}
                <div style={{width:'30px'}}></div>
                {commentX}
                <div style={{width:'30px'}}></div>
                {view}
            </div>
        )
    
        const statisticsTitle = <div className={`f${fc} ${txWhite ? 'txWhite' : 'txBlack'}`} style={titleStyle}>{setLT.viewersStatistics}</div>
        const statisticsSub = (
            <div style={{margin:'20px 0px 0px', padding:'0px 10px'}}>
                {statisticsTitle}
                {likeViewChat}
                <div style={{minHeight:''}}>
                    {toggleLikeBtn && likersSub}
                    {toggleViewBtn && viewersSub}
                    {toggleCommentBtn && commentSub}
                </div>
            </div>
        )

        const copyright = (
            <div style={{fontWeight:'', color: [4, 11, 13, 14].includes(fc) ? '#000000' : '#ffffff'}}>
                <span style={{fontSize:w<s ? '13px' : '', fontWeight:450}}><span style={{fontSize:'18px'}}></span>All Rights Reserved</span>
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

        const dot = (
            <div style={{fontWeight:'', opacity: '0'}}>
                <span style={{fontSize:w<s ? '13px' : ''}}>All Rights Reserved</span>
            </div>
        )

        const footer = (
            <div className={`C${fc}`} style={{width:'100%', height:w<s ? '60px' : '50px', borderTop:`5px solid #ffffff40`}}>
                <Container className={`center tx`} style={{fontSize:'14px', alignItems:'center', width:'100%', height:'100%', padding:'0px 10px', justifyContent:w>s ? 'space-between' : '', flexDirection:w<s ? 'column' : '', direction:'ltr'}}>
                    {w>=s && shiningPage}
                    {w<s && shiningPage}
                    {copyright}
                    {/* dot */}
                </Container>
            </div>
        )

        var psLink = adsInfo.slug ? `https://shiningpage.com/publisher/${adsInfo.username}/${adsInfo.slug}` : `https://shiningpage.com/ps/${adsInfo._id}`
        const shareSub = (
            <div className='backBlur' style={{marginBottom:spaceDown, marginTop:'50px', width:w<s ? '' : '100%', padding:w<s ? '5px' : '10px', border:'1px solid #d1a44a', borderRadius:'5px'}}>
                <SharePage url={psLink} mainTitle={subUserInfo.bizName ? subUserInfo.bizName : subUserInfo.username} subTitle={adsInfo.adsTitle}/>
            </div>
        )

        const QRCode = 
        <div style={{width:'100%', position:'relative'}}>
            <QRCodeX size="180px" url={`https://shiningpage.com/${root}/${subUserInfo.username}`}/>
            {/* <RubyCollector id='adsH2' bottom={20} left={20}/> */}
        </div>

        const modalHandleAds = (
            <ModalHandleAds
                loc='PSPage'
                // loader={loader}
                // adsN={adsN}
                // categoryItems={categoryItems}
                // EditBtn={EditBtn}
                onToggle={this.onToggleAds}
                // handleGetAllAds={handleGetAllAds}
                // resetAds={resetAds}
                // catQty={catQty}
                // mapStateToProps={mapStateToProps}
            />
        )

        const adsBox1 = <div className='adsbox'><AdsHorizontalSmall id='adsH1' /></div>
        const adsBox2 = <div className='adsbox'><AdsHorizontal id='adsH2' /></div>
        const adsBox3 = <div className='adsbox'><AdsMultiplex id='adsH3' /></div>
        const adsBox4 = <div className='adsbox'><AdsMultiplex id='adsH4' /></div>

        const header = (
            <div className='center' style={{alignItems:'center', flexDirection:'column', padding: '0px 10px'}}>
                <div className='d-flex' style={{justifyContent:rtl ? 'space-between' : 'flex-end', alignItems:'center', width:'100%', direction:'rtl'}}>
                    <h1 className='animated fadeInLeft tx' style={{animationDelay:'.5s', color:'#ffffff', fontWeight:'bold', fontSize: w<s ? '30px' : '', textAlign:'center', margin:'30px 10px'}}>{adsInfo.adsTitle}</h1>
                </div>
            </div>
        )

        // console.log('adsInfo: ', adsInfo)
        const backG = (
            <div>
                <img
                    style={{position:'fixed', filter:'blur(50px)', zIndex:'-1'}}
                    height='100%'
                    width={w<s ? '300%' : '100%'}
                    src={aboutImgSrc}
                    alt={`${adsInfo.adsTitle} background`}
                />
            </div>
        )

        return (
            <div>
                {adsInfo.pictures && backG}
                {addressbar}
                <PsCarousel adsInfo={adsInfo} fc={fc}/>
                {googleAds && adsBox1}
                {mainAds}
                {googleAds && adsBox2}
                <Container>
                    {userHeader}
                    {personalInfoSub}
                    <div className='center' style={{flexDirection:'column', alignItems:'center'}}>
                        {/* (userId!==mainUserId && userType===1 && w<s) && connection */}
                        {/* statisticsSub */}
                        {/* QRCode */}
                        {/* shareSub */}
                    </div>
                </Container>
                {googleAds && adsBox3}
                {footer}
                {modalZoomProfileImage}
                {modalZoomLocationImage}
                {modalHandleAds}
            </div>
        )

    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        mainUser: state.userInfo,
        userId: state.userInfo['_id'],
        userInfo: state.userInfo,
        subUserInfo: state.subUserInfo,
        fc: state.subUserInfo.fc,
        userType: state.subUserInfo['userType'],
        lat: state.subUserInfo.lat,
        lon: state.subUserInfo.lon,
        likeN: state.userInfo['likeCount'],
        viewN: state.userInfo['viewCount'],
        username: state.userInfo['username'],
        businessType: state.userInfo.businessType,
        email: state.userInfo['email'],
        genderValue: state.userInfo['genderValue'],
        jobSummary: state.userInfo['jobSummary'],
        biography: state.userInfo['biography'],

        adsInfo: state.adsInfo,
        setLT: state.setLT,
        access: state.userInfo.access,
    
        rtl: state.rtl, 
        lang: state.lang,
        geo: state.geo,
        auth: state.auth,
        page: state.page,
        subject: state.subject,
        pageName: state.pageName,
        pageTitle: state.pageTitle,
        membership: state.membership,
        fullAccess: state.fullAccess,
        seenStatus: state.seenStatus,
        userServiceSelected: state.userServiceSelected,
    }
  }
  export default connect (mapStateToProps)(ContentPage);
