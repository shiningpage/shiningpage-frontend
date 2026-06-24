import React, { Component, } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { FaRegPaperPlane } from 'react-icons/fa';
import { addNotification } from '../helper';

import {serverURL, s, lightColors } from '../srcSet';

class SendMessage extends Component {

  state = {
    w: document.body.clientWidth,
    h: window.innerHeight,
    name:'',
    contactInfo:'',
    message:'',
    messageSuccess:'',

  }

  componentDidMount = async () => {
    window.addEventListener("resize", this.onResize)
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
          message: `From: ${name}\n\nContact Information:\n${contactInfo}\n\nMessage:\n${message}`,
          senderId: 'unknown',
          receiverId: subUserInfo._id,
          image: null,
          from: null,
        }

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
      w: document.body.clientWidth,
      h: window.innerHeight,
    })
  }

  render() {
    const {w, h, messageSuccess, nameErr, contactInfoErr, messageErr, sendingMessage, name, contactInfo, message, } = this.state
    const {auth, rtl, setLT, subUserInfo } = this.props;
    const txBlack = lightColors.includes(subUserInfo.fc) ? true : false
    const loader13 = <div className='loader-13' style={{margin: '0px', color:'', transform: rtl ? 'rotate(180deg)' : ''}}></div>

    return (
      <div>
        {setLT.name}
        <input className='form-control' value={name} name="name" onChange={this.changeHandler}
          style={{marginBottom:'15px', minHeight: '10px', height: 'unset', borderRadius:'5px', fontSize:'14px', border: `1px solid ${nameErr ? 'red' : '#CED4DA'}`}}
        />
        {setLT.contactInfo}
        <textarea
          onChange={this.changeHandler}
          name="contactInfo"
          value={contactInfo}
          type="text"
          className="form-control"
          style={{marginBottom:'15px', minHeight: '10px', height: 'unset', borderRadius:'5px', fontSize:'14px', border: `1px solid ${contactInfoErr ? 'red' : '#CED4DA'}`}}
          rows= '2'
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
            <div className={`C${subUserInfo.fc} f${txBlack ? 7 : 11} btnShadow`}
              style={{width: '100px', textAlign:'center', 
                height: '30px',margin: '10px', padding: '2px',
                border: `3px solid ${lightColors.includes(subUserInfo.fc) ? '#00000020' : '#ffffff99'}`,
                borderRadius: '100px'}}
              onClick = {() => this.onSendMessage()}>
                { sendingMessage
                  ? loader13
                  :<div>
                      <span style={{fontSize:'15px', fontWeight:450}}>{setLT.send}</span>&nbsp;
                      <FaRegPaperPlane style={{fontSize:'15px'}}/>
                  </div>
                }
  
            </div>
          </div>
          :
          <div>
            <div className="alert alert-success animated fadeInDown" role="alert" style={{width:'100%', textAlign:rtl ? 'right' : 'left', fontSize:'15px', display: messageSuccess ? '' : 'none', marginTop:'' }}>{messageSuccess}</div>
            {/* <span className='underline'>Close</span> */}
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mainUser: state.userInfo,
    subUserInfo: state.subUserInfo,
    fc: state.userInfo.fc,
    subChatInfo: state.subChatInfo,
    auth: state.auth,
    rtl: state.rtl,
    lang: state.lang,
    geo: state.geo,
    page: state.page,
    subject: state.subject,
    pageName: state.pageName,
    msgDraft: state.msgDraft,
    activityStatus: state.activityStatus,
    setLT: state.setLT,
    fullAccess: state.fullAccess,
  }
}

export default connect (mapStateToProps)(SendMessage);

