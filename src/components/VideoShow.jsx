import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import userN from '../assets/images/other/user1.png';
import male from '../assets/images/other/man2.png'; 
import female from '../assets/images/other/woman2.png';
import { setSubject, setMembership, setToggleLoading, setPage, setToggleShowVideo, setSubUserInfo } from '../dataStore/actions'; 
import { FaRegPaperPlane, FaRegEye, FaAngleLeft, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { BsChat } from 'react-icons/bs';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import date from 'date-and-time';
import toFarsi from '../modules/toFarsi';
import siteView from '../modules/siteView';
import { AdsHorizontal } from './GoogleAds'
import { exist, addNotification } from '../helper';
import { serverURL, s, listRefreshQtySmall, googleAds } from '../srcSet';
import aparatImage from "../assets/images/other/aparat.png";

class VideoShow extends Component { 
 
    state = {
        nLiker:1,
        nViewer:1,
        nCommenter:1,
        loadingLiker:true,
        loadingViewer:true,
        loadingCommenter:true,
        gettingLike: true,
        gettingView:true,
        gettingComment:true,
        searchLiker:[],
        searchViewer:[],
        searchCommenter:[],
        comment: '',
        rating: 0,
        viewN:'-',
        likeN:'-',
        commentN: '-', 
        iframe: false,
        w: window.innerWidth,
        toggleLikeX: false,
        adsImageData: this.props.adsImageData,
        country:'',
        countryCode:'',
        advertiserName:'',
        advertiserJobSummary:'',
        businessType:'',
        toggleViewBtn: true,
        toggleLikeBtn: false,
        toggleCommentBtn: false,

    }

    componentDidMount = async () => {
			  const { auth, mainUser, subChatInfo, videoInfo, geo, fullAccess } = this.props
        await this.props.dispatch(setSubject('video-show'))
        siteView(this.props)
        // console.log(this.props.videoInfo)
        await this.addViewVideo(this.props.videoInfo)
        await this.countItems()
        this.setState({
            fc:this.props.fc,
            country:this.props.country,
            countryCode:this.props.countryCode,
        })

        this.mapAllVideo([this.props.videoInfo])

        addNotification('video', 'view', fullAccess, mainUser, videoInfo.userId, geo, videoInfo._id)
        this.getLikers()
        this.getViewers()
        this.getCommenters()
    }

    mapAllVideo = async (info) => {
        const {w} = this.state
        const {geo} = this.props
        var mainVideo = info.map(
            (item, i) => {
                // console.log(item),
                const youtubeVideo = `https://www.youtube.com/embed/${item.vCode}`
                const aparatVideo = `https://www.aparat.com/video/video/embed/videohash/${item.vCode}/vt/frame`
                const linkedinVideo = `https://www.linkedin.com/embed/latest/update/urn:li:ugcPost:${item.vCode}?compact=1`

                return (
                    <div key={i} className='' style={{backgroundColor:'#ffffff00', borderRadius:'3px', padding:'0px'}}>
                        {item.vType === 'Youtube' && <iframe src={youtubeVideo} style={{width:'100%', height:w<s ? '400px' : '500px'}} allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"/>}
                        {item.vType === 'Aparat' && <iframe src={aparatVideo} style={{width:'100%', height:w<s ? '400px' : '500px'}}/>}
                        {item.vType === 'Linkedin' && <iframe src={linkedinVideo} style={{width:'100%', height:w<s ? '400px' : '500px'}}/>}
                    </div>
                )
            }
        )
        // console.log(mainVideo)
        this.setState({
            mainVideo
        })
    }

    addViewVideo = async (info) => {
        if(!this.props.fullAccess){
            var data = {
                viewer: this.props.mainUserId!==undefined ? this.props.mainUserId : 'unknown',
                viewee: info.userId,
                videoId: info._id,
            }
            if(this.props.mainUserId===undefined) {
                data.countryCodeZ = this.props.geo.countryCode
                data.countryZ = this.props.geo.country
            }
            // console.log(data)
            if(data.viewer!==info.userId) await axios.post(`${serverURL}/view/addViewVideo`, data).then(res => {})
        }
    }

    deleteNotification = async (subject, type) => {
        var data = {
            visitor: this.props.mainUserId!==undefined ? this.props.mainUserId : 'unknown',
            visitee: this.props.videoInfo.userId,
            subId: this.props.videoInfo._id,
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

    findLikeVideo() {
        var data = {
            liker: this.props.mainUserId,
            videoId: this.props.videoInfo._id,
        }
        //console.log(data)
        axios.post(`${serverURL}/like/findLikeVideo`, data, {
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
      axios.post(`${serverURL}/like/countVideoLikers`, {videoId:this.props.videoInfo._id}).then(async res => {
          await this.findLikeVideo() // چک می شود که آیا من لایک کرده ام یا نه؟
          this.setState({
              likeN: res.data,
              gettingLike: false,
          })
      })
  }

  countViewers = async () => {
      axios.post(`${serverURL}/view/countVideoViewers`, {videoId:this.props.videoInfo._id}).then(res => {
          // console.log(res.data)
          this.setState({
              viewN: res.data.map(n => n.view).reduce((a, b) => a + b, 0),
              gettingView: false,
          })
      })
  }

  countCommenters = async () => {
      axios.post(`${serverURL}/comment/countCommentVideo`, {videoId:this.props.videoInfo._id}).then(res => {
          // console.log(res.data)
          this.setState({
              commentN: res.data,
              gettingComment: false,
          })
      })
  }

  countItems = async () => {
      this.countLikers()
      this.countViewers()
      this.countCommenters()
  }

  getUserInfo = async (advertiserId) => {
    axios.post(`${serverURL}/user/getUserInfo`, { _id: advertiserId })
    .then(async res => {
        delete res.data.password
        // console.log('nnn', res.data)

        this.props.dispatch(setSubUserInfo(res.data))
        this.setState({
            fc:res.data.fc,
            country:res.data.country,
            countryCode:res.data.countryCode,
            advertiserName:res.data.username,
            advertiserJobSummary:res.data.jobSummary,
            businessType:res.data.businessType,
        })
    })
  }

  getImage = async (videoId) => {
    this.setState({ adsImg:false })
    await axios.post(`${serverURL}/image/getImage`, { xId: videoId }, {})
    .then(async res => {
        this.setState({ adsImg:true })
        if(res.data.xImageData) {
            this.setState({
              adsImageData:res.data.xImageData
            })
        }
    })
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
              likee: videoInfo.userId,
              videoId: videoInfo._id,
          }
          await axios.post(`${serverURL}/like/likeVideo`, data).then(async res => {
                if(this.state.toggleLike) {
                    // console.log(1)
                    await this.deleteNotification('video', 'like')
                } else {
                    // console.log(2)
                    await addNotification('video', 'like', fullAccess, mainUser, videoInfo.userId, geo, videoInfo._id)
                }
                await this.getLikers()
                // console.log(res.data)
                this.setState({
                    toggleLike: !this.state.toggleLike,
                    likeN: this.state.toggleLike ? this.state.likeN-1 : this.state.likeN+1,
                })
              
          })
      }
  }

  onToggleShowVideo = async () => {
    this.props.dispatch(setToggleShowVideo(!this.props.toggleShowVideo))
    // this.setState({iframe: false})
  }

  onToggleAdvertiser = async () => {
    var pth = window.location.href;
    var parts = pth.split('/');
    var p1 = parts.slice(-1).shift() // check username root
    var p2 = parts.slice(-2).shift() // check profile root
    // console.log(44444, p1)
    // console.log(44444, p2)

    // if(p2==='profile' || p2==='ps') { 
    //   this.props.dispatch(setToggleShowVideo(!this.props.toggleShowVideo))
    // } else {
    //     this.props.dispatch(setToggleShowVideo(!this.props.toggleShowVideo))
    //   } else  {
    //     this.props.dispatch(setToggleShowVideo(!this.props.toggleShowVideo))
    //   }
    // }
  }

    getLikers = async () => {
        this.setState({
            loadingLiker:true,
        })

        var data = {
            videoId: this.props.videoInfo._id,
            n:this.state.nLiker,
            q:listRefreshQtySmall //this.state.w<s ? listRefreshQtySmallSmall : listRefreshQtySmallBig
        }

        await axios.post(`${serverURL}/like/getVideoLikers`, data).then(async res => {
            var x2 = res.data
            this.setState(
                (prevState) => ({
                    searchLiker : [...prevState.searchLiker, ...x2],
                    finishDataLiker: (res.data.length<listRefreshQtySmall || res.data.length===this.state.likeN) ? true : false,
                }),
                () => {
                    this.mapAllLikers(this.state.searchLiker)
                }
            )
        })

    }

  mapAllLikers = async (likers) => {
      const {w, } = this.state
      const {rtl, setLT} = this.props
      var dataRv = likers.map (
          (item, i) => {
              const userImage = (
                  <div className='' style={{}}>
                      <img
                          className={`C${item.fc} btnShadowX2`}
                          style={{objectFit: 'contain', width:"50px", height:"50px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px', cursor:'pointer'}}
                          src={exist(item.profileIndex)
                                ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item.liker}-${item.profileIndex}.jpeg`
                                : item.genderValue===0 ? female : male
                            }
                          alt="liker"
                          onClick={() => this.onReactor(item, item.liker)}
                      />
                  </div>
              )
              const countryCode = item.countryCode ? item.countryCode.toLowerCase() : ''
              const userCountry = (
                <div className='d-flex' style={{flexDirection:'column', textAlign:rtl ? 'right' : 'left'}}>
                    <div className='d-flex' style={{margin: '0px 0px 5px', alignItems:'center', direction:rtl ? 'rtl' : 'ltr'}}>
                        <span className={`flag-icon flag-icon-${countryCode}`}></span> &nbsp;
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
              )
              const tableInfo = (
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
              )

              return (
                  <div key={i} className='d-flex' style={{textDecoration:'none', color:'black', width:w<s ? '100%' : '80%', flexDirection:'column'}}>
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
          }
      )
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
      videoId: this.props.videoInfo._id,
      n:this.state.nViewer,
      q:listRefreshQtySmall //this.state.w<s ? listRefreshQtySmallSmall : listRefreshQtySmallBig
    }
    // console.log(this.props.videoInfo)
    await axios.post(`${serverURL}/view/getVideoViewers`, data).then(async res => {
        // var x1 = this.state.searchViewer
        var x2 = res.data
        // console.log(x2)
        this.setState(
            (prevState) => ({
                searchViewer : [...prevState.searchViewer, ...x2],
                finishDataViewer: (res.data.length<listRefreshQtySmall || res.data.length===this.state.viewN) ? true : false,
            }),
            () => {
                this.mapAllViewers(this.state.searchViewer)
            }
        )
    })

  }

  mapAllViewers = async (viewers) => {
    const {w, } = this.state
    const {rtl, setLT} = this.props
    var dataRv = viewers.map (
        (item, i) => {
            const unknown = item.viewer==='unknown' ? true : false
            const userImage = (
                <div className='' style={{}}>
                    <img
                        className={`C${item.fc} btnShadowX2`}
                        style={{objectFit: 'contain', width:"50px", height:"50px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px', cursor: !unknown ? 'pointer' : ''}}
                        src={unknown
                            ? userN
                            :(exist(item.profileIndex)
                                ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item.viewer}-${item.profileIndex}.jpeg`
                                : item.genderValue===0 ? female : male
                            )
                        }
                        alt="viewer"
                        onClick={() => !unknown ? this.onReactor(item, item.viewer) : null}
                    />
                </div>
            )
            const countryCode = item.countryCode ? item.countryCode.toLowerCase() : ''
            const countryCodeZ = item.countryCodeZ ? item.countryCodeZ.toLowerCase() : ''
            const userCountry = (
              <div className='d-flex' style={{flexDirection:'column', textAlign:rtl ? 'right' : 'left'}}>
                  <div className='d-flex' style={{margin: '0px 0px 5px', alignItems:'center', direction:rtl ? 'rtl' : 'ltr'}}>
                      <span className={`flag-icon flag-icon-${unknown ? countryCodeZ : countryCode}`}></span> &nbsp;
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
            )
            const tableInfo = (
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
            )
            return (
                <div key={i} className='d-flex' style={{textDecoration:'none', color:'black', width:w<s ? '100%' : '80%', flexDirection:'column'}}>
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
        }
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
      videoId: this.props.videoInfo._id,
      n:this.state.nCommenter,
      q:listRefreshQtySmall //this.state.w<s ? listRefreshQtySmallSmall : listRefreshQtySmallBig
    }
    // console.log(data)
    await axios.post(`${serverURL}/comment/getCommentVideo`, data).then(async res => {
        var x2 = res.data
        this.setState(
            (prevState) => ({
                searchCommenter : [...prevState.searchCommenter, ...x2],
                finishDataCommenter: (res.data.length<listRefreshQtySmall || res.data.length===this.state.commentN) ? true : false,
            }),
            () => {
                this.mapAllCommenters(this.state.searchCommenter)
            }
        )
    })

  }

  mapAllCommenters = async (commenters) => {
    const {w, } = this.state
    const {rtl, setLT, mainUserId, userId} = this.props
    var dataRv = commenters.map (
        (item, i) => {
            const userImage = (
                <div className='' style={{}}>
                    <img
                        className={`C${item.fc} btnShadowX2`}
                        style={{objectFit: 'contain', width:"50px", height:"50px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px', cursor:'pointer'}}
                        src={exist(item.profileIndex)
                            ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item.commenter}-${item.profileIndex}.jpeg`
                            : item.genderValue===0 ? female : male
                        }
                        alt="liker"
                        onClick={() => this.onReactor(item, item.commenter)}
                    />
                </div>
            )
            const countryCode = item.countryCode ? item.countryCode.toLowerCase() : ''
            const userCountry = (
                <div className='d-flex' style={{flexDirection:'column', textAlign:rtl ? 'right' : 'left'}}>
                    <div className='d-flex' style={{margin: '0px 0px 5px', alignItems:'center', direction:rtl ? 'rtl' : 'ltr'}}>
                        <span className={`flag-icon flag-icon-${countryCode}`}></span> &nbsp;
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
            )
            const view = (
              <div className='d-flex justify-content-end'
                  style={{ width:w<s ? '60px' : '100px', height: '25px', borderRadius:'5px', alignItems:'center', padding:'0px', margin:'0px'}}>
                  <span style={{fontWeight:'', marginTop:'5px'}}>{item.viewCount ? item.viewCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0}</span>&nbsp;&nbsp;
                  <FaRegEye style={{width:'15px', color:'black', margin:'0px 1px'}}/>
              </div>
            )
            const like = (
              <div className='d-flex justify-content-end'
                  style={{ width:w<s ? '60px' : '100px', height: '25px', borderRadius:'5px', alignItems:'center', padding:'0px', margin:'0px'}}>
                  <span style={{fontWeight:'', marginTop:'5px'}}>{item.likeCount ? item.likeCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0}</span>&nbsp;&nbsp;
                  <IoMdHeart style={{width:'17px', color:'red', fontSize:'17px'}}/>
              </div>
            )
            const viewLike = (
              <div className='d-flex justify-content-end' style={{flexDirection: w<s ? 'column' : 'row'}}>
                {view}
                {like}
              </div>
            )
            const comment = (
                <div className='d-flex' style={{width:'100%', padding:'0px', fontSize:'14px', fontWeight:'', lineHeight:'18px', marginTop:'10px', whiteSpace:'pre-wrap', textAlign: rtl ? 'right' : 'left'}}>
                    {item.comment}
                </div>
            )
            const deleteBtn = (
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
            )
            const tableInfo = (
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
                    </div>
                </div>
            )
            return (
                <div key={i} className='d-flex' style={{textDecoration:'none', color:'black', width:w<s ? '100%' : '80%', flexDirection:'column'}}>
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
        }
    )
    this.setState({
        commenterMap: dataRv,
        nCommenter: this.state.nCommenter + 1,
        loadingCommenter:false,
        gettingComment: false,
    })
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
                commentee: videoInfo.userId,
                videoId: videoInfo._id,
                comment: this.state.comment,
                rating: this.state.rating,
                commentDate: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
            }
            // console.log(info)
            await axios.post(`${serverURL}/comment/addCommentVideo`, info).then((res) => {})
            addNotification('video', 'comment', fullAccess, mainUser, videoInfo.userId, geo, videoInfo._id)
            this.countCommenters()
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
        await axios.post(`${serverURL}/comment/deleteCommentVideo`, { commentId: item._id }).then(async res => {})

        const info = {
            commenter: this.props.mainUserId,
            videoId: this.props.videoInfo._id,
        }
        await axios.post(`${serverURL}/comment/countCommentVideoFalse`, info).then(async res => {
            if(res.data===0) await this.deleteNotification('video', 'comment')
        })
        this.countCommenters()
        this.getCommenters()
    }

    onReactor = async (item, userId) => {
        if(userId!=='unknown') {
            await this.props.dispatch(setToggleLoading(true))
            // item._id = userId
            item.userId = userId
            // console.log(item)
            await this.props.dispatch(setSubUserInfo(item))
            await this.props.dispatch(setToggleShowVideo(false))
            setTimeout(async () => {
                await this.props.dispatch(setToggleLoading(false))
            }, 1000);
    
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

  render() {
    const { w, fc, toggleViewBtn, toggleLikeBtn, toggleCommentBtn, mainVideo, businessType, advertiserName,
            viewN, likeN, commentN, toggleLike,
            gettingLike, gettingView, comment, sendingComment, commentErrors, ratingErrors, rating, countryCode, 
            likerMap, viewerMap, commenterMap, loadingLiker, loadingViewer, loadingCommenter, finishDataLiker, finishDataViewer,
            finishDataCommenter, } = this.state
    const { rtl, videoInfo, setLT, genderValue, mainUser, userId, mainUserId, subUserInfo, userType} = this.props

    const titleStyle = {fontSize:'20px', fontWeight:'bold', margin:'10px 0px 5px 0px', textAlign: rtl ? 'right' : 'left', alignItems:'center'}
    const subTitleStyle = {fontSize:'18px', fontWeight:'bold', margin:'10px 0px 5px 0px', textAlign: rtl ? 'right' : 'left', alignItems:'center', width:w<s ? '100%' : '80%'}
    const loaderX = <div className='loader-02' style={{margin: rtl ? '0px' : '0px', color:'red', fontSize:'20px'}}></div>
    const loaderX2 = <div className='loader-02' style={{margin: rtl ? '0px' : '0px', color:'red', fontSize:'30px'}}></div>
    const loaderY = <div className='loader-02' style={{margin: rtl ? '0px' : '0px', color:'black'}}></div>
    const loaderZ = <div className='loader-13' style={{margin: rtl ? '35px 20px -25px' : '0px 20px 0px', color:'#ffffff', transform: rtl ? 'rotate(180deg)' : ''}}></div>
    const spaceDown = 20

    const txWhite = [4, 11].includes(fc) ? false : true

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

    const likeNX = likeN ? likeN.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0
    const heart = toggleLike
                    ? <IoMdHeart style={{width:'20px', fontSize:'20px', color:(toggleLikeBtn && fc===8) ? '#ffffff' : 'red'}}/>
                    : <IoMdHeartEmpty style={{width:'20px', fontSize:'20px', color:(toggleLikeBtn && fc===8) ? '#ffffff' : ((videoInfo.userId!==mainUserId && userType===1) ? 'red' : 'grey')}}/>
    const like = (
        <div className={`center btnShadowX2 C${toggleLikeBtn ? fc : ''} backBlur`} onClick={ () => this.onLikeBtn() } // onClick={(adsInfo.userId!==mainUserId && userType===1) ? () => gettingLike ? '' : this.onToggleLike() : ''}
            style={{alignItems:'center', padding:'5px', margin:'0px 0px 0px', borderRadius:'100px', minWidth:'55px', minHeight:'55px', 
                border: `3px solid ${(fc===4 || fc===14 || fc===undefined || !toggleLikeBtn) ? '#00000020' : '#ffffff99'}`,
                color: `${(fc===11 || fc===4 || fc===13 || fc===14 || fc===undefined || !toggleLikeBtn) ? '#00000090' : '#ffffff'}`,
            }}>
            <span style={{marginTop:'5px'}}>{likeNX}</span>&nbsp;
            {gettingLike ? loaderX : heart}
        </div>
    )

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
        <div className='center' style={{width:'', alignItems:'center', height:'30px', padding: '20px 0px 0px', margin:'10px 0px 0px', backgroundColor:'', borderTop: '0px solid #efefef', borderRadius:'3px'}}>
            {view}
            <div style={{width:'30px'}}></div>
            {like}
            <div style={{width:'30px'}}></div>
            {commentX}
        </div>
    )

    const UserImageX = (
        <div>
            <img
                className={`C${fc}`}
                style={{objectFit: 'contain', width:"35px", height:"35px", borderRadius:businessType>0 ? '3px' : '100px', border:'2px solid #ffffff40', margin:'4px 0px 0px', padding:'2px'}}
                src={ exist(subUserInfo.profileIndex)
                    ? `https://www.pix.shiningpage.com/whoraly/profile/big/${subUserInfo._id}-${subUserInfo.profileIndex}.jpeg`
                    : genderValue===0 ? female : male
                }
                alt="advertiser"
            />
        </div>
    )

    const isClickable = videoInfo.userId !== mainUserId && userType === 1;
    const shouldHandleClick = userId !== mainUserId && userType === 1;
    const heartClick = (
        <div style={{cursor:isClickable ? 'pointer' : '', position:''}}
            onClick={shouldHandleClick ? (gettingLike ? null : this.onToggleLike) : null}>
            { toggleLike
                ? <IoMdHeart style={{width:'30px', fontSize:'30px', color:'red'}}/>
                : <IoMdHeartEmpty style={{width:'30px', fontSize:'30px', color:shouldHandleClick ? 'red' : 'grey'}}/>
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
        </div>
    )

    const sendComment = (
        <div className='center' style={{width:'100%', marginTop:'10px'}}>
            <div style={{padding:w<s ? '0px' : '0px', backgroundColor:'#', width:w<s ? '100%' : '80%', zIndex:''}}>
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
            {/* hr */}
        </div>
    )
    
    const countryConst = (
        <div className='d-flex ' style={{alignItems:'flex-end', height:'', justifyContent:'flex-start', margin:'0px'}}>
            <div className={`flag-icon flag-icon-${countryCode ? countryCode.toLowerCase() : ''} cardShadow`} style={{width:'', border:'1px solid #ffffff50', fontSize:'15px'}}></div>&nbsp;&nbsp;
        </div>
    )

    const closeBtn = (
        <div className={`center C${fc}`} onClick={() => this.onToggleShowVideo()}
            style={{width:'30px', height:'30px', padding:'2px', margin:'0px', borderRadius:'100px',// position:'fixed', top:10,
                    color: `${(fc===11 || fc===4 || fc===13 || fc===14 || fc===undefined) ? '#00000090' : '#ffffff'}`,
                    border: `3px solid ${(fc===11 || fc===4 || fc===14 || fc===undefined) ? '#00000020' : '#ffffff99'}`,
            }}>
            <MdClose className='sidebarIcon' style={{marginTop:'0px', width:'20px', fontSize:'20px', fontWeight:'bold', cursor:'pointer', position:'absolute'}}/>
        </div>
    )

    const adsUserLine = (
        <div className='d-flex' style={{alignItems:'center', cursor:'pointer'}} onClick={() => this.onToggleAdvertiser()}>
            {UserImageX}&nbsp;
            <div className='' style={{fontSize:'12px', color: `${(fc===11 || fc===4 || fc===13 || fc===14 || fc===undefined) ? '#00000090' : '#ffffff'}`}}>
                <div style={{margin:'0px 0px 0px ', fontWeight:'bold'}}>{countryConst}</div>
                <div style={{margin:'0px 0px -5px '}}>{advertiserName}</div>
            </div>
        </div>
    )

    const YoutubeIcon = <FaYoutube style={{fontSize:'30px', margin:'0px', color:'#c4302b'}}/>
    const AparatIcon = <img style={{width:'30px', height:'25px', margin:'0px'}} src={aparatImage} alt="aparat"/>
    const LinkedinIcon = <FaLinkedin className='' style={{fontSize:'25px', margin:'0px', color:'#0e76a8'}}/>

    const videoType = (
        <div>
            {videoInfo.vType === 'Youtube' && YoutubeIcon}
            {videoInfo.vType === 'Aparat' && AparatIcon}
            {videoInfo.vType === 'Linkedin' && LinkedinIcon}
        </div>
    )

    const header = (
        <div className = {`d-flex C${fc} cardShadow sticky-top`} style={{width:'100%', height: '50px', alignItems:'center', borderBottom:`5px solid #ffffff40`, padding:'8px', borderRadius:'10px 10px 0px 0px', justifyContent:'space-between'}}>
            <div className='d-flex' style={{margin: '0px'}}>
                {fc ? adsUserLine : loaderZ}
            </div>
            <div className='d-flex' style={{alignItems:'center'}}>
                <div className='d-flex' style={{margin: '0px 20px'}}>
                    {videoType}
                </div>
                {closeBtn}
            </div>
        </div>
    )
    
    const videoTitle = <div className='sticky-top cardShadow' style={{backgroundColor:'#ffffff', top:'50px', fontSize:'15px', margin:'10px 0px', fontWeight:'bold', textAlign:'center', direction:rtl ? 'rtl' : 'ltr'}}>{videoInfo.title}</div>
    
    const videoText = (
        <div style={{width:'100%'}}>
            <div className='' style={{padding:'10px', borderRadius:'5px', backgroundColor:'#ffffff'}}>
                <div className={`d-flex ${w<s ? '' : 'typewriter'}`} style={{marginTop:'0px', textAlign:'justify', flexDirection:'column'}}>
                    <p className={w<s ? 'animated fadeIn delay-1s' : ''} style={{fontSize: w<500 ? '14px' : '15px', whiteSpace:'pre-wrap', margin:'0px', lineHeight:'30px', textAlign:rtl ? 'right' : 'left', direction:rtl ? 'rtl' : 'ltr'}}>{videoInfo.comment}</p>
                </div>
            </div>
        </div>
    )

    const statisticsTitle = <div className={`f${fc} ${txWhite ? 'txWhite' : 'txBlack'}`} style={titleStyle}>{setLT.viewersStatistics}</div>
    const statisticsSub = (
        <div style={{margin:'10px 0px 0px', padding:'0px 10px'}}>
            {statisticsTitle}
            {likeViewChat}
            <div style={{minHeight:'200px'}}>
                {toggleLikeBtn && likersSub}
                {toggleViewBtn && viewersSub}
                {toggleCommentBtn && commentSub}
            </div>
        </div>
    )

    const adsBox1 = <div className='adsbox'><AdsHorizontal id='adsH1' /></div>

    return (
        <div className="" style={{fontSize:'15px'}}>
            {header}
            {googleAds && adsBox1}
            {videoTitle}
            {mainVideo}
            <div style={{fontSize:'13px', backgroundColor:'#ffffff00', borderRadius:'3px', padding:w<s ? '' : '10px'}}>
                {videoText}
            </div>
            <Container>
                <div className={`b${fc}`} style={{margin:w<s ? '0px 0px 10px' : '0px 20px 20px', borderRadius:'10px', borderWidth:'2px', transition: '.3s'}}>
                    {statisticsSub}
                </div>
            </Container>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mainUserId: state.userInfo['_id'],
    mainUser: state.userInfo,
    subUserInfo: state.subUserInfo,
    userId: state.userInfo._id,
    username: state.userInfo.username,
    userImg: state.userInfo.imageData,
    jobSummary: state.userInfo.jobSummary,
    businessType: state.userInfo.businessType,
    fc: state.userInfo.fc,
    country: state.userInfo.country,
    countryCode: state.subUserInfo.countryCode,
    userType: state.subUserInfo.userType,
    rtl: state.rtl,
    lang: state.lang,
    geo: state.geo,
    auth: state.auth,
    page: state.page,
    subject: state.subject,
    pageName: state.pageName,
    videoInfo: state.videoInfo,
    advertiserId: state.adsInfo.advertiserId,
    adsId:state.adsInfo.adsId,
    genderValue:state.adsInfo.genderValue,
    adsTitle:state.adsInfo.adsTitle,
    adsComment:state.adsInfo.adsComment,
    negotiablePrice:state.adsInfo.negotiablePrice,
    unitPrice:state.adsInfo.unitPrice,
    currency:state.adsInfo.currency,
    unitMeasurement:state.adsInfo.unitMeasurement,
    adsImageData:state.adsInfo.adsImageData,
    viewNX:state.adsInfo.viewNX,
    likeNX:state.adsInfo.likeNX,
    toggleLikeX: state.adsInfo.toggleLikeX,
    toggleShowVideo: state.toggleShowVideo,
    setLT: state.setLT,
    access: state.userInfo.access,
    fullAccess: state.fullAccess,
  }
}

export default connect (mapStateToProps)(VideoShow);

