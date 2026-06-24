import React, { Component } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setSubject, setAddress, setPageTitle, setPage } from '../dataStore/actions';
import { FaRegPaperPlane } from 'react-icons/fa';
import siteView from '../modules/siteView';
import { addNotification } from '../helper';
import { AdsHorizontal } from '../components/GoogleAds';
import { checkSeen } from '../helper';
import { serverURL, s, googleAds } from '../srcSet';

class ContactPage extends Component {
    
  state = {
    w: window.innerWidth,
    h: window.innerHeight,
    pageName: this.props.setLT.contact,
    name:'',
    contactInfo:'',
    message:'',
    messageSuccess:'',
  }

  componentDidMount = async () => {
    window.scrollTo(0, 0)
    window.addEventListener("resize", this.onResize)
    await this.props.dispatch(setPageTitle(`${this.state.pageName} | ShiningPage`))
    await this.props.dispatch(setPage('contact'))
    await this.props.dispatch(setSubject('contact'))
    await this.props.dispatch(setAddress({ content:[], fix:this.state.pageName }))
    // if(this.props.auth && this.props.mainUser.ruby) checkSeen('contact', this.props.seenStatus, this.props.dispatch)
    siteView(this.props)
  }

  checkNull = () => {
    var infoErr = {}
    const { name, contactInfo, message } = this.state
    // console.log(1, this.state.comment)
    if(name.trim()==='') infoErr.nameErr = true
    if(contactInfo.trim()==='') infoErr.contactInfoErr = true
    if(message.trim()==='') infoErr.messageErr = true
    return infoErr
  }

  onSendMessage = async() => {
    const { name, contactInfo, message } = this.state
    const { setLT, subUserInfo, fullAccess, mainUser, userId, geo } = this.props
    var infoErr = this.checkNull()
    // console.log(1, infoErr)
    if(Object.keys(infoErr).length>0) {
      this.setState({
        nameErr: infoErr.nameErr,
        contactInfoErr: infoErr.contactInfoErr,
        messageErr: infoErr.messageErr,
      })
    } else {
        this.setState({
          sendingMessage: true,
        })
        const info = {
          message: `Site: *** ShiningPage ***\nFrom: ${name}\n\nContact Information:\n${contactInfo}\n\nMessage:\n${message}`,
          senderId: 'unknown',
          receiverId: '607e9088bede482040af3574',
          image: null,
          from: null,
        }
        // console.log(info)
        await axios.post(`${serverURL}/chat/send/`, info).then((res) => {})
        addNotification('chat', 'message', fullAccess, mainUser, userId, geo)

        this.setState({
            sendingMessage: false,
            nameErr: false,
            contactInfoErr: false,
            messageErr: false,
            messageSuccess:setLT.sendMessageSuccess,
        });

    }
  }

  changeHandler = async (e) => {
    const name = e.target.name
    this.setState({ [name]: e.target.value })
    if(name==='name') this.setState({ nameErr: false })
    if(name==='contactInfo') this.setState({ contactInfoErr: false })
    if(name==='message') this.setState({ messageErr: false })
  }

  onResize = () => {
    this.setState({
      w: window.innerWidth,
      h: window.innerHeight,
    })
  }

  render() {
    const {w, h, messageSuccess, nameErr, contactInfoErr, messageErr, sendingMessage, name, contactInfo, message, } = this.state
    const {auth, rtl, setLT, lang } = this.props;
    const loader13 = <div className='loader-13' style={{margin: '0px', color:'#ffffff', transform: rtl ? 'rotate(180deg)' : ''}}></div>

    const header = (
      <div className='center' style={{alignItems:'center', flexDirection:'column', padding: '0px 10px'}}>
        <div className='d-flex' style={{justifyContent:rtl ? 'space-between' : 'flex-end', alignItems:'center', width:'100%', direction:'rtl'}}>
          <h1 className='animated fadeInLeft tx' style={{animationDelay:'.5s', color:'#ffffff', fontWeight:'bold', fontSize: w<s ? '30px' : '', textAlign:'center', margin:'30px 10px 30px'}}>{setLT.contact}</h1>
        </div>
      </div>
    )

    const sendMessage = (
      <div>
        {setLT.name}
        <input className='form-control' value={name} name="name" onChange={this.changeHandler}
          style={{marginBottom:'15px', minHeight: '10px', height: 'unset', borderRadius:'5px', fontSize:'14px', border: `1px solid ${nameErr ? 'red' : '#CED4DA'}`}}
        />
        {setLT.email}
        <textarea
          onChange={this.changeHandler}
          name="contactInfo"
          value={contactInfo}
          type="text"
          className="form-control"
          style={{marginBottom:'15px', minHeight: '10px', height: 'unset', borderRadius:'5px', fontSize:'14px', border: `1px solid ${contactInfoErr ? 'red' : '#CED4DA'}`}}
          rows= '1'
        />
        {setLT.message}
        <textarea
          onChange={this.changeHandler}
          name="message"
          value={message}
          type="text"
          className="form-control"
          placeholder={setLT.chatPlaceHolder}
          style={{marginBottom:'15px', minHeight: '10px', height: 'unset', borderRadius:'5px', fontSize:'14px', border: `1px solid ${messageErr ? 'red' : '#CED4DA'}`}}
          rows="5"
        />
        { !messageSuccess
          ?
          <div className='center'>
            <div className={`btnShadow C14`}
              style={{width:'100px', textAlign:'center', 
                height:'30px', margin:'10px', padding:'2px',
                border:`3px solid #ffffff99`,
                borderRadius: '100px'}}
              onClick = {() => this.onSendMessage()}>
                { sendingMessage
                  ? loader13
                  :<div>
                    <span style={{fontSize:'14x'}}>{setLT.send}</span>&nbsp;
                    <FaRegPaperPlane/>
                  </div>
                }
            </div>
          </div>
          :
          <div>
            <div className="alert alert-success animated fadeInDown" role="alert" style={{width:'100%', textAlign:rtl ? 'right' : 'left', fontSize:'15px', display: messageSuccess ? '' : 'none', margin:'0px' }}>{messageSuccess}</div>
          </div>
        }
      </div>
    )

    const adsBox = <div className='adsbox'><AdsHorizontal id='adsH1' /></div>

    return (
      <div>
        {googleAds && adsBox}
        <Container>
          <div className='center' style={{flexDirection:'column', alignItems:'center'}}>
            {header}
          </div>
          <div className='center' style={{padding:'0px 10px'}}>
            <div className='animated fadeInUpX' style={{animationDelay:'.5s', width:w<s ? '100%' : '800px', margin:'0px 0px 30px', padding:'10px', fontFamily:'Vazir', top:'50px', zIndex:'0', backgroundColor:'#ffffff99', borderRadius:'5px'}}>
              <div style={{backgroundColor:'#ffffff99', borderRadius:'5px', padding:'10px', marginBottom:'20px', direction: rtl ? 'rtl' : 'ltr'}}>
                {sendMessage}
              </div>
              <div dangerouslySetInnerHTML={{ __html: setLT.referToEmail }}></div>
            </div>
          </div>
        </Container>
        {googleAds && adsBox}
      </div>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    mainUserId: state.userInfo['_id'],
    mainUser: state.userInfo,
    userId: state.userInfo['_id'],
    username: state.userInfo['username'],
    password: state.userInfo['password'],
    email: state.userInfo['email'],
    genderValue: state.userInfo['genderValue'],
    businessType: state.userInfo['businessType'],
    userImg: state.userInfo['imageData'],
    auth: state.auth,
    rtl: state.rtl,
    page: state.page,
    subject: state.subject,
    lang: state.lang,
    geo: state.geo,
    subUserId: state.subUserInfo['_id'],
    setLT: state.setLT,
    pageName: state.pageName,
    country: state.country,
    seenStatus: state.seenStatus,
  }
}

export default connect (mapStateToProps)(ContactPage);
