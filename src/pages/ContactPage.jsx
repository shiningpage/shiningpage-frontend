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
    const name = e.target.name;

    if (name === 'message') {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }

    this.setState({ [name]: e.target.value });

    if(name==='name') this.setState({ nameErr: false });
    if(name==='contactInfo') this.setState({ contactInfoErr: false });
    if(name==='message') this.setState({ messageErr: false });
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
      <div className="animated fadeInLeft [animation-delay:.5s] text-4xl font-extrabold tracking-tight my-[30px]">
        <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
          Contact Us
        </span>
      </div>
    )

    const adsBox = <div className='adsbox'><AdsHorizontal id='adsH1' /></div>

    const nameConst = (
      <div className='mb-4'>
        <label className="mb-2">
            Name
        </label>
        <input 
          className={`w-full h-12 border rounded-[8px] px-4 outline-none focus:ring-1 focus:ring-[#6D3EE3] ${nameErr ? '!border-red-500' : '!border-[#E1E4EC50]'}`}
          value={name} name="name" onChange={this.changeHandler}
        />
      </div>
    )

    const contactConst = (
      <div className='mb-4'>
        <label className="mb-2">
            Contact <span className='text-[10px]'>(Email, WhatsApp, ...)</span>
        </label>
        <input 
          className={`w-full h-12 border rounded-[8px] px-4 outline-none focus:ring-1 focus:ring-[#6D3EE3] ${contactInfoErr ? '!border-red-500' : '!border-[#E1E4EC50]'}`}
          value={contactInfo} name="contactInfo" onChange={this.changeHandler}
        />
      </div>
    )

    const messageConst = (
      <div className='mb-4'>
        <label className="mb-2">
            Message
        </label>
        <textarea 
          className={`w-full border rounded-[8px] px-4 py-2.5 !resize-none outline-none focus:ring-1 focus:ring-[#6D3EE3] ${messageErr ? '!border-red-500' : '!border-[#E1E4EC50]'}`}
          value={message} name="message" onChange={this.changeHandler}
          placeholder={setLT.chatPlaceHolder}
          rows={5}
        />
      </div>
    )

    const sendBtn = (
      <div className='center btnShadow w-full h-12 my-10 rounded-[8px] bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl active:scale-98 focus:outline-none focus:ring-4 focus:ring-blue-300'
        onClick = {() => this.onSendMessage()}>
        <span style={{fontSize:'16px'}}>{sendingMessage ? loader13 : 'Submit'}</span>
      </div>
    )

    const alertSuccess = <div className={`alert alert-success animated fadeInDown w-full my-10 text-[15px] ${messageSuccess ? '' : 'hidden'}`} role="alert">{messageSuccess}</div>

    return (
      <div>
        {/* {googleAds && adsBox} */}
        <Container>
          <div className='center flex-col'>
            {header}
            <div className={`animated fadeInUpX [animation-elay:.5s] ${w<s ? 'w-full' : 'w-[800px]'} mb-[30px] p-[20px] text-white rounded-[20px] backdrop-blur-[20px] bg-[#ffffff10] border !border-white/20`}>
              <div>
                {nameConst}
                {contactConst}
                {messageConst}
                { messageSuccess ? alertSuccess : sendBtn }
              </div>
              <div dangerouslySetInnerHTML={{ __html: setLT.referToEmail }}></div>
            </div>
          </div>
        </Container>
        {/* {googleAds && adsBox} */}
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
