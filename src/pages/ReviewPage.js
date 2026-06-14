import React, { Component } from 'react';
import { Container, Card, CardBody, Fa, Button, Modal} from "react-bootstrap";
import axios from 'axios';
import { Link } from "react-router-dom";
import 'chartjs-plugin-annotation';
import { connect } from 'react-redux';
import { setSubject, setPageTitle, setPageName, setMembership, setPage } from '../dataStore/actions';
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png'; 
import { MdClose } from 'react-icons/md';
import { FaRegPaperPlane, FaAngleLeft } from 'react-icons/fa';
import StarRating from '../components/StarRating';
import date from 'date-and-time';
import toFarsi from '../modules/toFarsi';
import siteView from '../modules/siteView';
import { AdsHorizontal } from '../components/GoogleAds'
import { exist, checkSeen } from '../helper';
import { serverURL, s, NavH, listRefreshQty, googleAds } from '../srcSet';

class ReviewPage extends Component {

  state = {
    w: window.innerWidth,
    n: 1,
    searchData:[],
    lx: listRefreshQty,
    modal: false,
    comment: '',
    rating: 0,
  }

  async componentDidMount () {
    window.scrollTo(0, 0)
    await this.props.dispatch(setPageName(this.props.setLT.memberReviews))
    await this.props.dispatch(setPageTitle(`${this.props.pageName} | ShiningPage`))
    await this.props.dispatch(setPage('reviews'))
    await this.props.dispatch(setSubject('reviews'))
    // if(this.props.auth && this.props.mainUser.ruby) checkSeen('reviews', this.props.seenStatus, this.props.dispatch)
    if(this.props.subject==='reviews') siteView(this.props)
    await this.getComments()
  }

  onResize = () => {
    this.setState({
      w: window.innerWidth
    })
  }

  toggle() {
    this.setState({
        modal: !this.state.modal
    });
  }

  toggleMembership() {
      this.props.dispatch(setMembership(!this.props.membership))
  }

  onStarClick = (nextValue) => {
      if (this.state.rating === 1 && nextValue === 1){
          this.setState({rating: 0});
      } else {
          this.setState({rating: nextValue});
      }
  }

  onComment = (e) => {
      var tx = toFarsi(e.target.value)
      this.setState({
          comment: tx
      })
  }

  checkNull = () => {
    var infoErr = {}
    console.log(1, this.state.comment)
    if(this.state.comment.trim()==='') infoErr.userCommentErr = this.props.setLT.userCommentErr
    if(this.state.rating===0) infoErr.userRatingErr = this.props.setLT.userRatingErr
    return infoErr
  }

  onSubmit = async() => { 
      if(!this.props.auth) {
          this.toggleMembership()
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

              const info = {
                  userId: this.props.userId,
                  comment: this.state.comment,
                  rating: this.state.rating,
                  commentDate: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
              }
              axios.post(`${serverURL}/comment/addCommentSite`, info) 
              .then((result) => {
                  this.setState({
                      messageSuccess: this.state.modalContent,
                      messageFailed: '',
                      commentErrors: '',
                      ratingErrors: '',
                      modal:true,
                      comment:'',
                      rating: 0
                  });
              })
              .catch((error) => {
                  if(error.response.status === 401) {
                      this.setState({
                          messageFailed: this.props.setLT.userMessageFailed,
                          messageSuccess: ''
                      });
                  }
              });
          }

      }
  }

  duration = (d) => {
    var t = (new Date()-new Date(d))/60000
    const {setLT} = this.props
    var x
    switch (true) {
      case (t<60):
        x = Math.round(t) + ' ' + setLT.minute + ' ';
        break;
      case (60 <= t && t < 60*24):
        x = Math.round(t/60) + ' ' + setLT.hour + ' ';
        break;
      case (60*24 <= t && t < 60*24*30):
        x = Math.round(t/(60*24)) + ' ' + setLT.day + ' ';
        break;
      case ( 60*24*30 <= t && t < 60*24*365):
        x = Math.round(t/(60*24*30)) + ' ' + setLT.month + ' ';
        break;
      case ( t >= 60*24*365):
        x = Math.round(t/(60*24*365)) + ' ' + setLT.year + ' ';
        break;
      default: x = '?'
    }
    return x + setLT.ago + ' '
  }

  getComments = async () => {
    this.setState({
      loadingData:true,
    })

    var data = {
      searchAds: this.state.searchAds,
      n:this.state.n,
      q:listRefreshQty
    }

    await axios.post(`${serverURL}/comment/getApproved`, data).then(async res => {
      var x2 = res.data
      // console.log(x2)
      this.setState(
        (prevState) => ({
          searchData : [...prevState.searchData, ...x2],
          loadingData: false,
          finishData: true,
        }),
        () => {
          this.commentMap(this.state.searchData)
          this.setState({
              finishData: res.data.length<listRefreshQty ? true : false,
          })
        }
      )
    })

    this.setState({
        n: this.state.n + 1,
    })

  }

  commentMap = async (x) => {
    var star, comments, userTime, userImage, tableInfo, userLocation, jobSummary, countryCode, countryCodeZ, JLen, jobSummaryStyle, unknown, userCountry
    const {w, pagArray} = this.state
    const {rtl, setLT} = this.props

    var dataRv = x.map (
        (item, i) => (
            // console.log(item),
            userImage = (
                <div>
                    <img
                        className={`C${item.fc} ${item.userId!==this.props.mainUserId ? 'btnShadow' : ''}`}
                        style={{objectFit: 'contain', width:"50px", height:"50px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px', cursor:'pointer'}}
                        src={ exist(item.profileIndex)
                            ? `https://www.pix.shiningpage.com/whoraly/profile/big/${item.userId}-${item.profileIndex}.jpeg`
                            : item.genderValue===0 ? female : male
                        }
                        alt={`${item.username} image`}
                        onClick={() => this.onToggleWebPage(item)}
                    />
                </div>
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
            userLocation = <span style={{margin:'0px 5px', fontSize:'13px'}}>{item.country}{/* item.city && <span> - {item.city}</span> */}</span>
            ,
            userTime = (
                <div className='d-flex' style={{flexDirection:'column'}}>
                    {/* <span style={{margin:'5px 0px 0px', fontSize:'13px', textAlign:rtl ? 'right' : 'left'}}>{this.duration(item.createdAt)}</span> */}
                    {item.username 
                        ? 
                          <div style={{direction: rtl ? 'rtl' : 'ltr', textAlign:rtl ? 'right' : 'left'}}>
                            <span className='d-flex' style={{color:'#003eba', fontWeight:'bold'}}>
                                {item.username}
                                <span style={{color:'#000000'}}>{userLocation}</span>
                            </span>
                            <span style={{fontSize:'12px', fontWeight:450}}>{item.jobSummary}</span>
                          </div>
                        : <span style={{color:'#999999', fontWeight:450}}>ناشناس</span>
                    }
                </div>
            ),
            comments = (
                <div style={{whiteSpace:'pre-wrap'}}>
                    {item.comment}
                </div>
            ),
            star = (
                <div className='d-flex' style={{height:'10px', justifyContent:'space-between'}}>
                    <div style={{fontSize:'13px'}}>{setLT.scoring}:</div>
                    <StarRating
                        name="rate1"
                        starCount={5}
                        value={item.rating}
                        size={16}
                    />
                </div>
            ),
            tableInfo = (
                <div style={{padding:'10px', width:'100%'}}>
                    <table className="table table-borderless" style={{height:'60px', margin:'0px'}}>
                        <tbody>
                            <tr>
                                <td style={{padding:'0px', verticalAlign:'top', width:'50px'}}>{userImage}</td>
                                <td style={{width:'5px', verticalAlign:'bottom'}}></td>
                                <td style={{padding:'0px', verticalAlign:'middle'}}>{userCountry}</td>
                            </tr>
                            <tr style={{borderBottom:'0.1px solid #999999'}}>
                                <td colSpan="5" style={{padding:'10px 0px 5px', textAlign:'justify'}}>{comments}</td>
                            </tr>
                            <tr>
                                <td colSpan="5" style={{padding:'5px 0px 0px', textAlign:'justify'}}>{star}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ),
            <div key={i}
                className='d-flex cardShadow animated fadeInUpX'
                style={{textDecoration:'none', width:'100%', padding:'0px', borderRadius:'5px', margin:'5px 0px', border: '1px #7b5cff40 solid',
                        backgroundColor:'#ffffff', cursor:'default'}}
            >
                {tableInfo}
            </div>
        )
    )
    this.setState({commentList: dataRv})
  }

  onToggleWebPage = async (user) => {
    const root = user.businessType>0 ? 'publisher' : 'user'
    window.open(`/${root}/${user.username}`);
  }

  render() {
    const {w, loadingData, finishData, commentList,
            modal, rating, comment, commentErrors,
            ratingErrors,
          } = this.state
    const {rtl, auth, lang, setLT} = this.props;
    const containerStyle = {padding:w<s ? '0px' : (rtl ? '0px 270px 0px 0px' : '0px 0px 0px 270px')}

    const loaderX = (
      <div className='center'>
          <div className='loader-13' style={{margin: rtl ? '55px 0px 40px' : '20px 0px 40px', color:'#ffffff', transform: rtl ? 'rotate(180deg)' : ''}}></div>
      </div>
    )

    const more = (
      <div className='center'>
          <div className={`btnShadow`}
              style={{minWidth: '100px', height: '30px', 
                      textAlign:'center',
                      margin: '10px 0px 30px',
                      border: `3px solid #ffffff`,
                      backgroundColor: '#6600ff',
                      padding: '0px 10px',
                      color: `#ffffff`,
                      borderRadius: '100px'}}
              onClick = {() => this.getComments()}>
              <span>{setLT.more}</span>
              <FaAngleLeft style={{fontSize:'20px', margin:'2px 0px 0px 0px', transform:'rotate(-90deg)'}}/>
          </div>
      </div>
    )

    const commentsConst = (
      <div className="center" style={{flexWrap: 'wrap', width:w<s ? '100%' : '800px' }}>
          {commentList}
      </div>
    )

    const comments = (
        <div className='center' style={{marginTop:'0px', padding:'20px 0px 10px'}}>
            {commentsConst}
        </div>
    )

    const modalSend = (
        <Modal isOpen={modal} className='' style={{}} toggle={() => this.toggle()}>
            <Modal.Header className="" style={{backgroundColor: '#00CC33', color: '#ffffff', marginTop:NavH}}>
              <span style={{fontSize:'20px'}}>{setLT.commentSendSuccess}</span>
            </Modal.Header>
            <Modal.Body style={{backgroundColor: '#ffffff', color: '#000000', fontSize:'15px', textAlign:'justify'}}>
                {setLT.commentSendSuccessText}
            </Modal.Body>
            <Modal.Footer style={{backgroundColor: '#ffffff', }}>
                <Button color='success' onClick={() => this.toggle()}>
                    Ok
                </Button>
            </Modal.Footer>
      </Modal>
    )

    const sendComment = (
      <div className='center animated fadeInUpX' style={{animationDelay:'0s' , width:'100%',}}>
          <div style={{padding:'0px', backgroundColor:'#', top:'50px', width:w<s ? '100%' : '800px', zIndex:''}}>
              <Card style={{backgroundColor:'#ffffff99'}}>
                  <CardBody className='backBlur' style={{padding:'20px'}}>
                      <textarea
                          onChange={this.onComment}
                          value={comment}
                          type="text"
                          id="defaultFormContactMessageEx"
                          className="form-control"
                          rows="7"
                      />
                      <span className='invalid-feedback'
                              style={{ margin: '10px 0px 0px 0px', textAlign: rtl ? 'right' : 'left', color:'red', fontSize:'13px',
                                      display : commentErrors ? 'block' : 'none'}}>
                          <ul>{commentErrors}</ul>
                      </span>
                      <div className='text-center' style={{margin:'20px 0px 0px 0px', fontSize:'25px'}}>
                          <StarRating
                              name="rate1"
                              starCount={5}
                              value={rating}
                              onChange={this.onStarClick}
                          />
                      </div>
                      <span className='invalid-feedback'
                              style={{ textAlign: rtl ? 'right' : 'left', color:'red', fontSize:'13px',
                                      display : ratingErrors ? 'block' : 'none'}}>
                          <ul>{ratingErrors}</ul>
                      </span>

                      <div className='center'>
                          <div className='btnShadow C14'
                              style={{width:'100px', textAlign:'center', 
                                height:'30px', margin:'10px', padding:'2px',
                                border:`3px solid #ffffff99`,
                                borderRadius: '100px'}}
                              onClick = {() => this.onSubmit()}>
                              <span style={{fontSize:'13px'}}>{setLT.send}</span>&nbsp;
                              <FaRegPaperPlane style={{fontSize:'13px'}}/>
                          </div>
                      </div>
                  </CardBody>
              </Card>
          </div>
      </div>
    )

    const header = (
      <div className='center' style={{alignItems:'center', flexDirection:'column', padding: '0px 10px'}}>
        <div className='d-flex' style={{justifyContent:rtl ? 'space-between' : 'flex-end', alignItems:'center', width:'100%', direction:'rtl'}}>
          <h1 className='animated fadeInLeft tx' style={{animationDelay:'.5s', color:'#ffffff', fontWeight:'bold', fontSize: w<s ? '30px' : '', textAlign:'center', margin:'30px 10px 30px'}}>{setLT.memberReviews}</h1>
        </div>
      </div>
    )

    const adsBox1 = <div className='adsbox'><AdsHorizontal id='adsH1' /></div>
    const adsBox2 = <div className='adsbox'><AdsHorizontal id='adsH2' /></div>

    return (
      <div>
        {googleAds && adsBox1}
        <Container style={{}}>
          <div className='' style={{marginBottom:'50px', zIndex:'1'}}>
            <div className='center' style={{flexDirection:'column', alignItems:'center'}}>
              {header}
            </div>
            {sendComment}
            {comments}
            {(loadingData && !finishData) && loaderX}
            {(!loadingData && !finishData) && more}
            {modalSend}
          </div>
        </Container>
        {googleAds && adsBox2}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mainUserId: state.userInfo['_id'],
    mainUser: state.userInfo,
    userInfo: state.userInfo,
    userId: state.userInfo['_id'],
    username: state.userInfo['username'],
    auth: state.auth,
    rtl: state.rtl,
    page: state.page,
    subject: state.subject,
    lang: state.lang,
    geo: state.geo,
    chSp: state.chSp,
    genderValue: state.userInfo['genderValue'],
    membership: state.membership,
    setLT: state.setLT,
    pageName: state.pageName,
    seenStatus: state.seenStatus,

  }
}

export default connect (mapStateToProps)(ReviewPage);

