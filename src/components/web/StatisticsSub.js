import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import { setMembership, } from '../../dataStore/actions';
import StarRatingComponent from 'react-star-rating-component';
import KPICards from '../KPICards';
import date from 'date-and-time';
import toFarsi from '../../modules/toFarsi';
import userN from '../../assets/images/other/user1.png';
import male from '../../assets/images/other/man2.png';
import female from '../../assets/images/other/woman2.png';
import { MdOutlineRateReview } from 'react-icons/md';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { FaRegPaperPlane, FaEye, FaStar } from 'react-icons/fa';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { GiGlobe } from 'react-icons/gi';
import RubyCollector from '../RubyCollector';
import { AdsHorizontal } from '../GoogleAds';
import { exist, getPos, dig3, addNotification } from '../../helper';
import { serverURL, s, listRefreshQtySmall, mapColors, lightColors, googleAds } from '../../srcSet';
const WorldMap = require('react-svg-worldmap').WorldMap;

class StatisticsSub extends Component{

    state = {
        w: document.body.clientWidth,
        toggleStatistics: true,
        viewCountAll: [],
        nLiker:1,
        nViewer:1,
        nCommenter:1,
        searchLiker:[],
        searchViewer:[],
        searchCommenter:[],
        comment: '',
        rating: 0,
        likeViewChatWidth: 300,
    }

    componentDidMount = async () => {
        window.addEventListener("resize", this.onResize)
        // this.setStatisticsSize()
    }

    componentDidUpdate = async(prevProps) => {
        if (this.props.index !== prevProps.index) {
            this.onStatistics()
        }
    }

    // setStatisticsSize = async () => {
    //     const statisticsArea = await getPos('statisticsArea')
    //     const worldmap = await getPos('worldmap')
    //     const wz = this.state.likeViewChatWidth
    //     const wx = statisticsArea.width - worldmap.width// + 10
    //     this.setState({
    //         likeViewChatWidth: wx < wz ? wx : wz
    //     })
    // }

    onToggleLike = async () => {
        const { toggleLike, likeN } = this.state
        const { auth, mainUser, userId, fullAccess, geo } = this.props
        if(!auth) {
            this.props.dispatch(setMembership(true))
        } else {
            this.setState({
                nLiker: 1,
                searchLiker:[],
                likersPreviewSet: false,
                gettingLike: true
            })
            // console.log('mainUser: ', mainUser)
            var data = {
                liker: mainUser._id,
                likee: userId,
            }
            await axios.post(`${serverURL}/like/likeProfile`, data).then(async res => {
                if(toggleLike) {
                    await this.deleteNotification('bizPage', 'like')
                } else {
                    await addNotification('bizPage', 'like', fullAccess, mainUser, userId, geo)
                }
                await this.getLikers()
                this.setState({
                    toggleLike: !toggleLike,
                    likeN: toggleLike ? likeN - 1 : likeN + 1,
                })
                
            })
        }
    }

    onReactor = async (user) => {
        const root = user.businessType>0 ? 'publisher' : 'user'
        // console.log(item)
        // window.location.href = `/publisher/${item.username}`;
        window.open(`/${root}/${user.username}`);
    }

    countLikers = async () => {
        axios.post(`${serverURL}/like/countProfileLikers`, {userId:this.props.userId}).then(async res => {
            await this.findLikeProfile() // چک می شود که آیا من لایک کرده ام یا نه؟
            this.setState({
                likeN: res.data,
                gettingLike: false,
            })
        })
    }
    countCommenters = async () => {
        axios.post(`${serverURL}/comment/countCommentProfile`, {commentee:this.props.userId}).then(res => {
            // console.log(res.data)
            this.setState({
                commentN: res.data,
                gettingComment: false,
            })
        })
    }

    checkNull = () => {
        var infoErr = {}
        // console.log(1, this.state.comment)
        if(this.state.comment.trim()==='') infoErr.userCommentErr = this.props.setLT.userCommentErr
        if(this.state.rating===0) infoErr.userRatingErr = this.props.setLT.userRatingErr
        return infoErr
    }

    onSendComment = async() => { 
        const { comment, rating } = this.state
        const { mainUser, userId, auth, fullAccess, geo } = this.props

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
                    commentee: userId,
                    comment: comment,
                    rating: rating,
                    commentDate: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
                }
                // console.log(info)
                await axios.post(`${serverURL}/comment/addCommentProfile`, info).then((res) => {})
                addNotification('bizPage', 'comment', fullAccess, mainUser, userId, geo)
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
        await axios.post(`${serverURL}/comment/deleteCommentProfile`, { commentId: item._id }).then(async res => {})
        
        const info = {
            commenter: this.props.mainUserId,
            commentee: this.props.userId,
        }
        await axios.post(`${serverURL}/comment/countCommentProfileFalse`, info).then(async res => {
            if(res.data===0) await this.deleteNotification('bizPage', 'comment')
        })

        this.countCommenters()
        this.getCommenters()
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

    statisticsItems = () => {
        this.getCountryViewers()
        this.countLikers()
        this.countCommenters()
        this.getViewers()
        this.getLikers()
        this.getCommenters()
    }

    onStatistics = async () => {
        this.setState({ gettingStatistics: true })
        await this.statisticsItems()
    }

    getCountryViewers = async (x) => {
        this.setState({ 
            gettingCountryViewers: true,
            viewCountAll: []
        })

        var data = {
            userId: this.props.userId,
        }
        var cxArr = [{country:'QQ', value:0}]
        await axios.post(`${serverURL}/view/getProfileCountryViewers`, data)
        .then(async res => {
            var cx = res.data
            // console.log(cx)
            var x = 0
            for(var i=0; i<cx.length; i++) {
                cxArr.push({"country": cx[i].countryCodeX, "value": cx[i].view})
            }

            // sort descending
            cxArr.sort((a, b) => b.value - a.value)
        })

        this.makeCountriesData(cxArr)

        this.setState(
            () => ({
                viewCountAll: cxArr,
                gettingCountryViewers: false,
            })
        )
    
    }

    makeCountriesData = (countries) => {
        // تبدیل کد کشور به اسم
        const countryNames = new Intl.DisplayNames(["en"], {
            type: "region",
        });

        // تبدیل کد کشور به پرچم
        const getFlagEmoji = (countryCode) => {
            if (countryCode === "QQ") return "🌍";

            return countryCode
                .toUpperCase()
                .replace(/./g, (char) =>
                    String.fromCodePoint(127397 + char.charCodeAt())
                );
        };

        const maxValue = Math.max(...countries.map((c) => c.value));

        const topCountries = countries.map(
            (item, index) => {
                const percentage = (item.value / maxValue) * 100;

                return (
                    <div className="countryItem" key={index}>
                        <div className="countryTop">
                            <div className="countryInfo">
                                <span className="flag">
                                    {getFlagEmoji(item.country)}
                                </span>

                                <span className="countryName">
                                    {item.country === "QQ"
                                        ? "Unknown"
                                        : countryNames.of(item.country)}
                                </span>
                            </div>

                            <span className="countryValue">{item.value}</span>
                        </div>

                        <div className="progressWrapper">
                            <div className="progressBar" style={{ width: `calc(${percentage}%)` }}/>
                        </div>
                    </div>
                );
            }
        )

        this.setState({
            topCountries
        })

    }

    getViewers = async () => {
        this.setState({
            loadingViewer:true,
        })

        var data = {
          userId: this.props.userId,
          n:this.state.nViewer,
          q:1000 //listRefreshQtySmall
        }
        // console.log(data)
        await axios.post(`${serverURL}/view/getProfileViewers`, data).then(async res => {
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
        var hr, unknown, jobSummaryStyle, JLen, countryCode, countryCodeZ, jobSummary, userCountry, userImage, tableInfo, like, view, viewLike, line
        const {w, } = this.state
        const {rtl, setLT} = this.props
        var dataRv = viewers.map (
            (item, i) => (
                // console.log(item),
                unknown = item.viewer==='unknown' ? true : false ,
                userImage = (
                    <img
                        className={`C${item.fc}`}
                        style={{objectFit: 'contain', minWidth:"50px", minHeight:"50px", maxWidth:"50px", maxHeight:"50px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px', cursor: !unknown ? 'pointer' : ''}}
                        src={unknown
                            ? userN
                            :(exist(item.profileIndex)
                                ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item.viewer}-${item.profileIndex}.jpeg`
                                : item.genderValue===0 ? female : male
                            )
                        }
                        alt="viewer"
                    />
                ),
                countryCode = item.countryCode ? item.countryCode.toLowerCase() : '',
                countryCodeZ = item.countryCodeZ ? item.countryCodeZ.toLowerCase() : '',

                JLen = item.jobSummary ? item.jobSummary.length : 0,
                jobSummaryStyle = {width:'100%', padding:'0px', fontSize:'13px', fontWeight:'', lineHeight:'', marginTop:'0px', overflow: 'hidden', textAlign: rtl ? 'right' : 'left', color:''},
                jobSummary = <div className='d-flex' style={jobSummaryStyle}>{item.jobSummary}</div>,

                userCountry = (
                  <div className='d-flex' style={{flexDirection:'column', textAlign:rtl ? 'right' : 'left'}}>
                      <div className='d-flex' style={{margin: '0px 0px 5px', alignItems:'center', direction:rtl ? 'rtl' : 'ltr'}}>
                          <span className={`flag-icon flag-icon-${unknown ? countryCodeZ : countryCode}`}></span> &nbsp;
                          <div className='d-flex ' style={{fontSize:'12px'}}>{unknown ? item.countryZ : item.country}</div>
                      </div>
                      <div className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap'}}>
                            {item.username
                                ? (
                                <div>
                                    <span style={{color:'#bb00f9', fontWeight:'bold'}}>{item.username}</span>&nbsp;
                                </div>
                                )
                                : <span style={{color:'#999999', fontWeight:''}}>{setLT.unknown} ({item.view})</span>
                            }
                            <div>{jobSummary}</div>
                      </div>
                  </div>
                ),
                view = (
                  <div className='d-flex justify-content-end'
                      style={{ width:'100px', height: '25px', borderRadius:'5px', alignItems:'center', padding:'0px', margin:'0px'}}>
                      <span style={{fontWeight:'', marginTop:'5px'}}>{item.viewCount ? item.viewCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0}</span>&nbsp;&nbsp;
                      <FaEye style={{width:'15px', color:'black', margin:'0px 1px'}}/>
                  </div>
                ),
                like = (
                  <div className='d-flex justify-content-end'
                      style={{ width:'100px', height: '25px', borderRadius:'5px', alignItems:'center', padding:'0px', margin:'0px'}}>
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
                tableInfo = (
                  <div className='d-flex' style={{padding:'10px', width:'100%', fontSize:'14px', justifyContent: 'space-between', alignItems:''}}>
                      {userImage}&nbsp;&nbsp;&nbsp;
                      <div className='' style={{width:'100%'}}>
                          <div className='d-flex' style={{width:'100%', justifyContent: 'space-between', alignItems:'center'}}>
                              {userCountry}
                              {/* viewLike */}
                          </div>
                      </div>
                  </div>
                ),
                <div key={i} className={`d-flex ${unknown ? '' : 'btnShadow'}`} onClick={!unknown ? () => this.onReactor(item) : null}
                    style={{textDecoration:'none', color:'black', width:'100%', marginBottom:'5px', borderRadius:'10px', flexDirection:'column', backgroundColor:unknown ? '#ffffff99' : '#ffffff'}}>
                    <div className={`d-flex`} style={{textDecoration: "none", width:'100%', padding:'0px', borderRadius:'5px', margin:'0px', border: '0px solid #7b5cff40'}}>
                        {tableInfo}
                    </div>
                </div>
            )
        )
        this.setState({
            viewerMap: dataRv,
            nViewer: this.state.nViewer + 1,
            loadingViewer:false,
        })
    }

    getLikers = async () => {
        this.setState({
            loadingLiker:true,
        })

        var data = {
          userId: this.props.userId,//likeeInfo._id,
          n:this.state.nLiker,
          q:1000 //listRefreshQtySmall //this.state.w<s ? listRefreshQtySmall : listRefreshQtyBig
        }

        await axios.post(`${serverURL}/like/getProfileLikers`, data).then(async res => {
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
          var hr, jobSummaryStyle, JLen, countryCode, jobSummary, userCountry, userImage, tableInfo, like, view, viewLike, line
          const {w, } = this.state
          const {rtl, setLT} = this.props
          var dataRv = likers.map (
              (item, i) => (
                //   // console.log(item),
                  userImage = (
                    <div className='' style={{}}>
                        <img
                            className={`C${item.fc} btnShadowX2`}
                            style={{objectFit: 'contain', minWidth:"50px", minHeight:"50px", maxWidth:"50px", maxHeight:"50px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px', cursor:'pointer'}}
                            src={exist(item.profileIndex)
                                ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item.liker}-${item.profileIndex}.jpeg`
                                : item.genderValue===0 ? female : male
                            }
                            alt="liker"
                        />
                    </div>
                ),
                  countryCode = item.countryCode ? item.countryCode.toLowerCase() : '',

                  JLen = item.jobSummary ? item.jobSummary.length : 0,
                  jobSummaryStyle = {width:'100%', padding:'0px', fontSize:'13px', fontWeight:450, lineHeight:'', marginTop:'0px', overflow: 'hidden', textAlign: rtl ? 'right' : 'left'},
                  jobSummary = <div className='d-flex' style={jobSummaryStyle}>{item.jobSummary}</div>,
  
                  userCountry = (
                    <div className='d-flex' style={{flexDirection:'column', textAlign:rtl ? 'right' : 'left'}}>
                        <div className='d-flex' style={{margin: '0px 0px 5px', alignItems:'center', direction:rtl ? 'rtl' : 'ltr'}}>
                            <span className={`flag-icon flag-icon-${countryCode}`}></span> &nbsp;
                            <div className='d-flex ' style={{fontSize:'12px'}}>{item.country}{item.city && ( ' - ' + item.city)}</div>
                        </div>
                        <div className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap'}}>
                            {item.username
                                ? (
                                <div>
                                    <span style={{color:'#bb00f9', fontWeight:'bold'}}>{item.username}</span>&nbsp;
                                </div>
                                )
                                : <span style={{color:'#999999', fontWeight:450}}>{setLT.unknown} ({item.view})</span>
                            }
                            <div>{jobSummary}</div>
                        </div>
                    </div>
                  ),
                  view = (
                    <div className='d-flex justify-content-end'
                        style={{ width:'100px', height: '25px', borderRadius:'5px', alignItems:'center', padding:'0px', margin:'0px'}}>
                        <span style={{fontWeight:'', marginTop:'5px'}}>{item.viewCount ? item.viewCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0}</span>&nbsp;&nbsp;
                        <FaEye style={{width:'15px', color:'black', margin:'0px 1px'}}/>
                    </div>
                  ),
                  like = (
                    <div className='d-flex justify-content-end'
                        style={{ width:'100px', height: '25px', borderRadius:'5px', alignItems:'center', padding:'0px', margin:'0px'}}>
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
                  tableInfo = (
                    <div className='d-flex' style={{padding:'10px', width:'100%', fontSize:'14px', justifyContent: 'space-between', alignItems:''}}>
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
                  <div key={i} className='d-flex btnShadow' onClick={() => this.onReactor(item)}
                        style={{textDecoration:'none', color:'black', width:'100%', marginBottom:'5px', borderRadius:'10px', flexDirection:'column', backgroundColor:'#ffffff'}}>
                        <div className={`d-flex`} style={{textDecoration: "none", width:'100%', padding:'0px', borderRadius:'5px', margin:'0px', border: '0px solid #7b5cff40'}}>
                            {tableInfo}
                        </div>
                  </div>
              )
          )
          this.setState({
            likerMap: dataRv,
            nLiker: this.state.nLiker + 1,
            loadingLiker:false,
            gettingLike: false,
          })
    }

    getCommenters = async () => {
        this.setState({
            loadingCommenter:true,
        })

        var data = {
          userId: this.props.userId,
          n:this.state.nCommenter,
          q:1000 //listRefreshQtySmall //this.state.w<s ? listRefreshQtySmallSmall : listRefreshQtySmallBig
        }
        // console.log(data)
        await axios.post(`${serverURL}/comment/getCommentProfile`, data).then(async res => {
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
        var hr, star, deleteBtn, jobSummary, jobSummaryStyle, JLen, countryCode, comment, userCountry, userImage, tableInfo, like, view, viewLike, line
        const {w, } = this.state
        const {rtl, setLT, mainUserId, userId} = this.props
        var dataRv = commenters.map (
            (item, i) => (
                // console.log(item),
                userImage = (
                    <div className='' style={{}} onClick={() => this.onReactor(item)}>
                        <img
                            className={`C${item.fc} btnShadowX2`}
                            style={{objectFit: 'contain', minWidth:"50px", minHeight:"50px", maxWidth:"50px", maxHeight:"50px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px', cursor:'pointer'}}
                            src={exist(item.profileIndex)
                                    ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item.commenter}-${item.profileIndex}.jpeg`
                                    : item.genderValue===0 ? female : male
                            }
                            alt="viewer"
                        />
                    </div>
                ),
                countryCode = item.countryCode ? item.countryCode.toLowerCase() : '',
                
                JLen = item.jobSummary ? item.jobSummary.length : 0,
                jobSummaryStyle = {width:'100%', padding:'0px', fontSize:'13px', fontWeight:450, lineHeight:'', marginTop:'0px', overflow: 'hidden', textAlign: rtl ? 'right' : 'left'},
                jobSummary = <div className='d-flex' style={jobSummaryStyle}>{item.jobSummary}</div>,

                userCountry = (
                    <div className='d-flex' style={{flexDirection:'column', textAlign:rtl ? 'right' : 'left'}} onClick={() => this.onReactor(item)}>
                        <div className='d-flex' style={{margin: '0px 0px 5px', alignItems:'center', direction:rtl ? 'rtl' : 'ltr'}}>
                            <span className={`flag-icon flag-icon-${countryCode}`}></span> &nbsp;
                            <div className='d-flex ' style={{fontSize:'12px'}}>{item.country}{item.city && ( ' - ' + item.city)}</div>
                        </div>
                        <div className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap'}}>
                            {item.username
                                ? (
                                <div>
                                    <span style={{color:'#bb00f9', fontWeight:'bold'}}>{item.username}</span>&nbsp;
                                </div>
                                )
                                : <span style={{color:'#999999', fontWeight:450}}>{setLT.unknown} ({item.view})</span>
                            }
                            <div>{jobSummary}</div>
                        </div>
                    </div>
                ),
                view = (
                  <div className='d-flex justify-content-end'
                      style={{ width:w<s ? '60px' : '100px', height: '25px', borderRadius:'5px', alignItems:'center', padding:'0px', margin:'0px'}}>
                      <span style={{fontWeight:'', marginTop:'5px'}}>{item.viewCount ? item.viewCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0}</span>&nbsp;&nbsp;
                      <FaEye style={{width:'15px', color:'black', margin:'0px 1px'}}/>
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
                    <div className='d-flex' style={{padding:'10px', width:'100%', fontSize:'14px', justifyContent: 'space-between', alignItems:''}}>
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
                <div key={i} className='d-flex btnShadow' onClick={() => this.onReactor(item)}
                    style={{textDecoration:'none', color:'black', width:'100%', marginBottom:'5px', borderRadius:'10px', flexDirection:'column', backgroundColor:'#ffffff'}}>
                    <div className={`d-flex`} style={{textDecoration: "none", width:'100%', padding:'0px', borderRadius:'5px', margin:'0px', border: '0px solid #7b5cff40'}}>
                        {tableInfo}
                    </div>
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

    deleteNotification = async (subject, type) => {
        var data = {
            visitor: this.props.mainUserId!==undefined ? this.props.mainUserId : 'unknown',
            visitee: this.props.userId,
            subject,
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

    onResize = async () => {
        this.setState({ 
            w: document.body.clientWidth
        })
    }

	render () {
        const {w, toggleStatistics, gettingStatistics, likeN, commentN, viewCountAll, txBlack, likeViewChatWidth, 
            rating, ratingErrors, sendingComment, comment, commentErrors, loadingLiker, loadingViewer,
            loadingCommenter, finishDataLiker, finishDataViewer, finishDataCommenter, likerMap, viewerMap,
            commenterMap, gettingLike, topCountries, toggleLikeBtn, toggleCommentBtn, toggleLike,
        } = this.state
        const {rtl, setLT, fc, viewN, gettingView, titleStyle, userType, mainUserId, userId } = this.props

        const subTitleStyle = {fontSize:'20px', fontWeight:450, marginBottom:'10px', alignItems:'center', width:'100%', color:'#000000'}
        const loader13 = <div className='loader-13' style={{margin: '0px', color:''}}></div>
        const loader02 = <div className='loader-02' style={{color:'red', fontSize:'20px'}}></div>
        const loader02X = <div className='loader-02' style={{color:'red', margin:'5px', fontSize:'20px'}}></div>
        const loader02Y = <div className='loader-02' style={{color:'black'}}></div>

        const statisticsLink = (
            <div className='d-flex' style={{flexWrap:'wrap', alignItems:w<300 ? '' : 'flex-end', flexDirection: w<300 ? 'column' : ''}}>
                <div className='d-flex'>
                    <GiGlobe style={{width:'27px', fontSize:'27px', color:'', margin:'0px', transform: rtl ? '' : 'scaleX(-1)'}}/>&nbsp;&nbsp;
                    <FaEye style={{width:'20px', fontSize:'25px', color:'', margin:'0px 5px'}}/>
                    <IoMdHeart style={{width:'22px', fontSize:'25px', color:'red', margin:'0px 5px'}}/>
                    <FaStar style={{width:'19px', fontSize:'25px', color:'', margin:'0px 5px'}}/>
                </div>
                { gettingStatistics ? loader13 :
                    <div className='nav' style={{textDecoration:'underline', margin:'0px'}} 
                        onClick={() => this.onStatistics()}>
                        Click here to view
                    </div>
                }
            </div>
        )
        console.log('viewCountAll: ', viewCountAll)
        const ViewerBSMMap = (
            <div id='viewMap' className='center animated fadeIn' style={{animationDelay:'0s', width:'100%', margin:'0px'}}>
                <div className='cardShadow' style={{width:'100%', backgroundColor:'#ffffff00', overflow:'scroll', borderRadius:'10px'}}>
                    <WorldMap color={`${mapColors[`C${fc}`]}`} borderColor='#000000' size={w<s ? "lg" : "xl"} data={viewCountAll}/>
                </div>
            </div>
        )

        const viewNX = viewN ? dig3(viewN) : 0
        const likeNX = likeN ? dig3(likeN) : 0
        const commentNX = commentN ? dig3(commentN) : 0

        const heartClick = (
            <div>
                {
                    toggleLike
                            ? <IoMdHeart style={{fontSize:'28px', color:'red'}}/>
                            : <IoMdHeartEmpty style={{fontSize:'28px', color:'red'}}/>
                }
            </div>
        )

        const likeThisPage = (
            <div className='d-flex underline' onClick={this.onToggleLike}>
                <div className='d-flex' style={{alignItems:'center', marginTop:'-8px'}}>
                    <span style={{marginRight:'5px', fontSize:'14px', whiteSpace:'nowrap', display:'none'}}>Like this page</span>
                    {gettingLike ? loader02X : heartClick}
                </div>
            </div>
        )

        const likersTitleSub = (
            <div style={subTitleStyle}>
                Recent Likes
                {loadingLiker && <span style={{fontSize:'12px', marginLeft:'20px'}}>{loader13}</span>}
            </div>
        )

        const likersSub = (
            <div className='animated fadeIn' style={{animationDelay:'0s', width:w<s ? '100%' : '300px', padding:'10px', borderRadius:'10px', backgroundColor:'#ffffff99'}}>
                <div className='d-flex' style={{width:'100%', justifyContent:'space-between'}}>
                    {likersTitleSub}
                    {likeThisPage}
                </div>
                {!loadingLiker &&
                    <div className='mostly-customized-scrollbar' style= {{zIndex:'0', maxHeight:'400px', overflowY:'scroll'}}>
                        <div className="center" style={{flexWrap: 'wrap', width: '100%', padding:'0px 0px 20px'}}>
                            {likerMap}
                        </div>
                    </div>
                }
            </div>
        )

        const viewersTitleSub = (
            <div style={subTitleStyle}>
                Page Views
                {loadingViewer && <span style={{fontSize:'12px', marginLeft:'20px'}}>{loader13}</span>}
            </div>
        )

        const viewersSub = (
            <div className='animated fadeIn' style={{animationDelay:'0s', width:w<s ? '100%' : '300px', padding:'10px', borderRadius:'10px', backgroundColor:'#ffffff99'}}>
                {viewersTitleSub}
                {!loadingViewer &&
                    <div className='mostly-customized-scrollbar' style= {{zIndex:'0', maxHeight:'400px', overflowY:'scroll'}}>
                        <div className="center" style={{flexWrap: 'wrap', width: '100%', padding:'0px 0px 20px'}}>
                            {viewerMap}
                        </div>
                    </div>
                }
            </div>
        )

        const sendComment = (
            <div className='center animated fadeIn' style={{animationDelay:'0s', width:w<s ? '100%' : '300px'}}>
                <div style={{padding:w<s ? '0px' : '0px', backgroundColor:'#', width:'100%', zIndex:''}}>
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
                                <div className={`C${fc} f${txBlack ? 7 : 11} btnShadow`}
                                    style={{width: '', textAlign:'center', 
                                            height: '30px',
                                            margin: '10px', padding:'2px 10px',
                                            border: `3px solid ${[11].includes(fc) ? '#00000050' : '#ffffff80'}`,
                                            color: `${lightColors.includes(fc) ? '#000000' : '#ffffff'}`,
                                            borderRadius: '100px'}}
                                    onClick = {() => this.onSendComment()}>
                                    {sendingComment
                                        ? loader13
                                        : <span style={{fontSize:'15px'}}>Submit Review</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

        const sendCommentTitleSub = (
            <div style={subTitleStyle}>
                Write a Review
            </div>
        )
        const sendCommentSub = (
            <div className='animated fadeIn' style={{animationDelay:'0s', width:w<s ? '100%' : '300px', padding:'10px', borderRadius:'10px', backgroundColor:'#ffffff99'}}>
                {sendCommentTitleSub}
                <div className='mostly-customized-scrollbar' style= {{zIndex:'0', maxHeight:'400px', overflowY:'scroll'}}>
                    <div className="center" style={{flexWrap: 'wrap', width: '100%', padding:'0px 0px 20px'}}>
                        {sendComment}
                    </div>
                </div>
            </div>
        )

        const commentersTitleSub = (
            <div style={subTitleStyle}>
                Recent Reviews
                {loadingCommenter && <span style={{fontSize:'12px', marginLeft:'20px'}}>{loader13}</span>}
            </div>
        )

        const commentSub = (
            <div className='animated fadeIn' style={{animationDelay:'0s', width:w<s ? '100%' : '300px', padding:'10px', borderRadius:'10px', backgroundColor:'#ffffff99'}}>
                {commentersTitleSub}
                {!loadingCommenter &&
                    <div className='mostly-customized-scrollbar' style= {{zIndex:'0', maxHeight:'400px', overflowY:'scroll'}}>
                        <div className="center" style={{flexWrap: 'wrap', width: '100%', padding:'0px 0px 20px'}}>
                            {commenterMap}
                        </div>
                    </div>
                }
            </div>
        )

        const pageViewsIcon = (
            <div className='kpiIconStyleDiv' style={{backgroundColor:'#3881D3'}}>
                <FaEye className='kpiIconStyle'/>
            </div>
        )

        const likesIcon = (
            <div className='kpiIconStyleDiv' style={{backgroundColor:'#d03169'}}>
                <IoMdHeart className='kpiIconStyle'/>
            </div>
        )

        const reviewsIcon = (
            <div className='kpiIconStyleDiv' style={{backgroundColor:'#EDB043'}}>
                <FaStar className='kpiIconStyle'/>
            </div>
        )

        const widthX = w<420 ? '100%' : '200px'
        const views = <KPICards icon={pageViewsIcon} title="Page Views" value={viewNX} width={widthX}/>
        const likes = <KPICards icon={likesIcon} title="Likes" value={likeNX} width={widthX}/>
        const reviews = <KPICards icon={reviewsIcon} title="Reviews" value={commentNX} width={widthX}/>
        const kpiCards = (
            <div className='d-flex' style={{flexWrap:'wrap', gap:'20px'}}>
                {views}
                {likes}
                {reviews}
            </div>
        )

        const topCountriesSub = (
            <div className='animated fadeIn' style={{animationDelay:'0s', width:w<s ? '100%' : '300px', padding:'10px', borderRadius:'10px', backgroundColor:'#ffffff99'}}>
                <div className="topCountriesCard">
                    <div className="cardHeader">
                        <h3>Top Countries</h3>
                    </div>

                    <div className="countriesList">
                        {topCountries}
                    </div>
                </div>
            </div>
        )

        return (
            <div id='statisticsSub' className='' style={{width:'100%', padding:'70px 0px', position:'relative'}}>
                <Container>
                    <div className={`${w<s ? 'center' : 'd-flex'} txWhite tx`} style={{...titleStyle, marginBottom:'50px'}}>{setLT.statistics}&nbsp;&nbsp;&nbsp;<span style={{color:'#ffffff', fontSize:'16px'}}>{gettingStatistics ? loader13 : ''}</span></div>
                    {kpiCards}
                    {!toggleStatistics
                        ? statisticsLink
                        :
                        <div className='' style={{margin:'20px 0px 0px', backgroundColor:'', borderRadius:'10px'}}>
                            <div id='statisticsArea' className='' style={{backgroundColor:'', borderRadius:'10px'}}>
                                <div className='d-flex' style={{width:'100%', flexDirection:w<1000 ? 'column' : '', justifyContent:'space-between', marginBottom:'20px'}}>
                                    <div id='' style={{marginBottom:w<s ? '20px' : ''}}>
                                        {ViewerBSMMap}
                                    </div>
                                </div>
                                <div className='d-flex' style={{flexWrap:'wrap', gap:'10px'}}>
                                    {topCountriesSub}
                                    {viewersSub}
                                    {likersSub}
                                    {commentSub}
                                    {sendCommentSub}
                                </div>
                            </div>
                        </div>
                    }
                </Container>
                {/* <RubyCollector id='adsH4' bottom={30} left={rtl ? 30 : ''} right={rtl ? '' : 30}/> */}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUser: state.userInfo,
        mainUserId: state.userInfo['_id'],
        userInfo: state.subUserInfo,
        userId: state.subUserInfo._id,
        auth: state.auth,
        rtl: state.rtl,
        lang: state.lang,
        geo: state.geo,
        page: state.page,
        setLT: state.setLT,
        fullAccess: state.fullAccess,
    }
}

export default connect (mapStateToProps)(StatisticsSub);
