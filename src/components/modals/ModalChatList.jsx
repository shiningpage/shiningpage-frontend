import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { setToggleChatList, setSubChatInfo, setToggleChat } from '../../dataStore/actions';
import userN from '../../assets/images/other/user1.png';
import male from '../../assets/images/other/man2.png';
import female from '../../assets/images/other/woman2.png';
import More from '../More';
import { MdMoreVert, MdMessage } from 'react-icons/md';
import { IoMdHeart } from 'react-icons/io';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaLinkedin, FaYoutube, FaFacebook, FaGlobe, FaInstagram, FaTelegram, FaRegEye } from 'react-icons/fa';
import { BsImage } from 'react-icons/bs';
import { HiOutlineCursorClick } from 'react-icons/hi';
import { dig3, isoDateToDateTime, exist } from '../../helper';
import { serverURL, s, listRefreshQty } from '../../srcSet';

class ModalChatList extends Component{

    state = {
        w: document.body.clientWidth,
        nChat:1,
        finalMsgX: [],
        itemX:'',

    }

    componentDidMount = async () => {
        window.addEventListener("resize", this.onResize)
        this.getChatList()
    }

    getChatList = async () => {
        this.setState({
            loadingChat:true
        })

        var data = {
          id: this.props.mainUserId,
        }

        const chat1 = await axios.post(`${serverURL}/chat/getChatListSender/`, data)
        const chatList1 = chat1.data
        // console.log('chat1: ', chatList1)
        const chat2 = await axios.post(`${serverURL}/chat/getChatListReceiver/`, data)
        const chatList2 = chat2.data
        // console.log('chat2: ', chatList2)
        const updatedChat2 = chatList2.map(chat => ({
            ...chat,
            senderId: chat.receiverId,
            receiverId: chat.senderId,
        }));
        // console.log('updatedChat2: ', updatedChat2)

        var messages = [...chatList1, ...updatedChat2]

        // var messages = [c1.concat(c2)]
        // console.log('messages: ', messages)

        if(messages.length>0) {
            await messages.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
            await messages.sort((a, b) => (a.receiverId > b.receiverId) ? 1 : -1)
    
            var finalMsg = []
            var idIndex = ''
            for(var i=0; i<messages.length; i++) {
              var rx = messages[i].receiverId
              if(rx!==idIndex) {
                finalMsg.push(messages[i])
              }
              var idIndex = messages[i].receiverId
            }
        
            await finalMsg.sort((a, b) => (a.createdAt > b.createdAt) ? -1 : 1)
    
            // console.log(1122333, finalMsg)
            await this.setState({finalMsg})
            this.setChatList(finalMsg)
        } else {
            this.setState({
                loadingChat:false,
                finishDataChat:true
            })
        }
    }

    setChatList = async (finalMsg) => {
        this.setState({
            loadingChat:true
        })

        var mainUserId = this.props.mainUserId
        // var finalMsg = this.state.finalMsg
        var n = this.state.nChat
        var q = listRefreshQty

        var spx = []//finalMsg.splice(q * (n-1), q)
        var qn = q * (n-1)
        // console.log(88888, q, n)

        for(var i=qn; i<qn+q; i++) {
            if(finalMsg[i]) spx.push(finalMsg[i])
        }
        // console.log(88888, finalMsg, spx)

        var finalMsgX = this.state.finalMsgX
        for(var i=0; i<spx.length; i++) {
            var userIdX = spx[i].senderId===mainUserId ? spx[i].receiverId : spx[i].senderId
            // console.log(11122, userIdX, spx[i].senderId)
            if(userIdX!=='unknown') {
                var user = await axios.post(`${serverURL}/user/getUserInfo`, { _id: userIdX }, {})
                delete user.data.password
                // console.log('nnn', user.data)
                // this.setState({userInfoX:user.data})
                const userInfoX = user.data

                spx[i]._id = userInfoX._id
                spx[i].username = userInfoX.username
                spx[i].profileIndex = userInfoX.profileIndex
                spx[i].fc = userInfoX.fc
                spx[i].businessType = userInfoX.businessType
                spx[i].countryCode = userInfoX.countryCode
                spx[i].birthDate = userInfoX.birthDate
                spx[i].genderValue = userInfoX.genderValue
                spx[i].imageData = userInfoX.imageData
                spx[i].selected = userInfoX.userSelectedX
            }

            var notSeenData = {
                senderId: userIdX,
                receiverId: mainUserId,
            }
            var notSeen = await axios.post(`${serverURL}/chat/countNotSeen` , notSeenData)
            spx[i].notSeen = notSeen.data

            finalMsgX.push(spx[i])
            await this.setState({finalMsgX})
            this.chatListMap(this.state.finalMsgX)
        }

        this.setState({
            nChat: this.state.nChat + 1,
            loadingChat:false,
            finishDataChat: finalMsgX.length===finalMsg.length ? true : false,
        })

    }

    chatListMap = async (finalMsgX, ix, loading) => {
        const {w} = this.state
        const {mainUserId, lang , rtl, setLT, mainUser} = this.props
        var dataRv = finalMsgX.map (
            (item, i) => {
                // console.log(i, item)
                const loader = <div className='loader-13' style={{margin: '0px 20px', color:'', transform: rtl ? 'rotate(180deg)' : ''}}></div>
                const index = item.senderUsername===mainUser.username ? true : false
                item.userIdX = item.senderId===mainUserId ? item.receiverId : item.senderId
                const countryCode = item.countryCode ? item.countryCode.toLowerCase() : ''
                const userImage = (
                    <div className='d-flex' style={{flexDirection:'column', justifyContent:'flex-start', marginTop:'-15px'}}>
                        <span className={`flag-icon flag-icon-${countryCode} sticky-top`} style={{right: !rtl ? 3 : '', left: rtl ? 3 : '', top:9}}></span>
                        <img
                            className={`C${item.fc} cardShadow`}
                            style={{objectFit: 'contain', width:"50px", height:"50px", borderRadius: item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px'}}
                            src={ item.receiverId==='unknown'
                                    ? userN
                                    : exist(item.profileIndex)
                                        ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item.userIdX}-${item.profileIndex}.jpeg`
                                        : item.genderValue===0 ? female : male
                            }
                            alt="user"
                        />
                    </div>
                )
                // console.log('notSeen: ', item.notSeen)
                const cns = (
                  <div style={{backgroundColor:'#04B803', color: '#ffffff', fontSize:'13px', textAlign:'center',
                      width: '18px', height: '18px', borderRadius: '100px', lineHeight: '20px'
                  }}>
                      {item.notSeen}
                  </div>
                )

                const iso = isoDateToDateTime(item.createdAt, lang)
                const message = item.image
                    ? (
                        <div className='d-flex'>
                            <div>Picture</div>&nbsp;
                            <BsImage/>
                        </div>
                      )
                    : ( w<s
                        ? <div className='d-flex' style={{width:'100%', margin:'0px'}}>{item.message.length>30 ? item.message.substr(0,25)+'...' : item.message}</div>
                        : <div>{item.message.length>100 ? item.message.substr(0,90)+'...' : item.message}</div>
                      )
                const checkMarksMessage = (
                  <div className='d-flex' style={{}}>
                      { index &&
                        <span>
                            <span>
                              <span className={`f${this.props.fc} C0`} style={{fontSize:'15px', lineHeight:'10px', margin:'4px -5px 0px 0px', textAlign:'center', textShadow:'.4px .4px 1px #999999'}}>✓</span>
                              {item.seen && <span className={item.receiverSelected ? `f${item.receiverSelected[0]}` : 'f11 C0'} style={{fontSize:'15px', lineHeight:'10px', margin:'4px -5px 0px 0px', textAlign:'center', textShadow:'.4px .4px 1px #999999'}}>✓</span>}
                            </span>&nbsp;
                        </span>
                      }
                      <div>{message}</div>
                  </div>
                )
                const userDate = (
                    <div className='d-flex' style={{width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                      {item.username
                        ? (
                            <div className='d-flex' style={{alignItems:'center'}}>
                              <span style={{color:'#bb00f9', fontWeight:'bold'}}>{loading && i===ix ? loader : item.username}</span>&nbsp;
                            </div>
                          )
                        : <span style={{color:'#999999', fontWeight:450}}>{setLT.unknown}</span>
                      }
                      <span style={{margin:'0px 0px 0px', fontSize:'13px', color: item.notSeen>0 ? '#04B803' : 'black' }}>{iso.date}</span>
                    </div>
                )
                const messageCns = (
                    <div className='d-flex' style={{width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                      <span style={{width:'', color:'#666666', fontSize:'13px'}}>{checkMarksMessage}</span>
                      {(item.notSeen && !index) ? <span style={{margin:'0px', fontSize:'13px'}}>{cns}</span> : ''}
                    </div>
                )
                const more = (
                  <div className={`dropdown ${rtl ? 'dropend' : 'dropstart'}`} style={{padding:'0px'}}>
                    <button className='center waves-effect waves-light btn-large'
                        type="" id="dropdownMenuButton" data-bs-toggle="dropdown" data-bs-auto-close="outside"
                        aria-haspopup="true" aria-expanded="false" data-bs-offset={w<s ? "5,5" : "5,5"}
                        style={{width:'20px', height:'70%', padding:'0px', margin:'0px', color:'#00000050', border:'1px solid #00000020', borderRadius:'5px'}}>
                        <MdMoreVert style={{margin:'0px', fontSize:'20px', height:'58px'}}/>
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton"
                          style={{fontSize:'13px', cursor:'pointer'}}>
                        <div id='chatDelete' className="dropdown-item" style={{backgroundColor:'red', color:'#ffffff'}}
                            onClick={(e) => this.deleteModal(item, i, e)}>
                            {setLT.delete}
                        </div>
                    </div>
                  </div>
                )
                const tableInfo = (
                    <div className='d-flex' style={{width:'100%', alignItems:'center', backgroundColor:'#ffffff', borderRadius:'5px'}}>
                        <div id='chat' className={`d-flex c${this.props.fc}`} onClick={(e) => this.onToggleChat(item, i, e)}
                              style={{textDecoration: "none", padding:'5px', width:'100%', borderRadius:'3px', alignItems:'center', overflow:'hidden'}}>
                            <div style={{padding:'0px', verticalAlign:'middle', width:'70px'}}>{userImage}</div>&nbsp;
                            <div style={{width:'100%', height:''}}>
                                <div style={{padding:'0px'}}>{userDate}</div>
                                <div style={{padding:'0px'}}>{messageCns}</div> 
                            </div>
                        </div>&nbsp;
                        {item._id!=='607e9088bede482040af3574' && more}
                    </div>
                )
                return (
                    <div key={i} className={`center btnShadow animated fadeIn waves-effect waves-light btn-large`}
                        style={{alignItems:'center', flexDirection:'column', whiteSpace:'nowrap', animationDelay: '0.44s', width:'100%', padding:'0px', marginBottom:'15px', borderRadius:'5px'}}
                    >
                        <div className={`center animated fadeInUpX`} style={{backgroundColor:'#ffffff99', flexDirection:'column', width:'100%', padding:'5px', margin:'2px', borderRadius:'5px'}}>
                            {tableInfo}
                        </div>
                    </div>
                )
            }
        )

        this.setState({
            ChatMap: dataRv,
        })
    }

    onToggleChatList = () => {
        this.props.dispatch(setToggleChatList(!this.props.toggleChatList))
    }
    
    onToggleChat = async (ID, ix, e) => {
        // console.log(77777, ID)
        const index = e?.target?.id==='chatDelete' ? false : true
        if(index) {
            this.chatListMap(this.state.finalMsgX, ix, true)
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
            this.chatListMap(this.state.finalMsgX, ix, false)
        }
    }

    deleteModal = async (itemX, i, e) => {
        itemX.i = i
        if(itemX.notSeen>0) {
            await this.onToggleChat(itemX, e)
            this.setState({
                deleteChat:true,
                itemX
            })
        } else {
            this.setState({
                deleteChat:true,
                itemX
            })
        }

    }

    onResize = async () => {
        this.setState({ 
            w: document.body.clientWidth
        })
    }

    onDeleteChat = async (item) => {
        this.setState({ deletingChat: true})
        var finalMsgX = this.state.finalMsgX
        var ix = item.i
        finalMsgX.splice(ix,1)

        var id = this.props.mainUserId
        var subId = item.senderId===this.props.mainUserId
              ? item.receiverId
              : item.senderId

        var data1 = {
          senderId: id,
          receiverId: subId
        }

        var data2 = {
          senderId: subId,
          receiverId: id
        }

        await axios.post(`${serverURL}/chat/falseMessageSender/`, data1)
        await axios.post(`${serverURL}/chat/falseMessageReceiver/`, data2)
        await axios.post(`${serverURL}/chat/deleteFalseDisplay/`, data1)
        await axios.post(`${serverURL}/chat/deleteFalseDisplay/`, data2)

        await this.setState({
            deletingChat: false,
            deleteChat: false,
            finishDataChat: true
        })
        // this.onSinglePage('chat')
        this.chatListMap(finalMsgX)
    }

	render() {
        const {w, ChatMap, finishDataChat, loadingChat, deleteChat, itemX, deletingChat} = this.state
        const {rtl, setLT, mainUser} = this.props
        const loader13 = <div className='loader-13' style={{marginTop: '70px', color:'', transform: rtl ? 'rotate(180deg)' : ''}}></div>
        const moreChat = <div onClick={() => this.getChatList()}><More fc={mainUser.fc}/></div>

        const chatSub = (
            <div style={{}}>
                {ChatMap}
                <div className='center' style={{width:'100%', height: !finishDataChat ? '100px' : '0px', alignItems:'center', marginBottom:'60px'}}>
                    {(loadingChat && !finishDataChat) && loader13}
                    {(!loadingChat && !finishDataChat) && moreChat}
                </div>
            </div>
        )

        const modalDeleteChat = (
            <Modal show={deleteChat} onHide={() => this.setState({deleteChat : false})}>
                <Modal.Header className="d-flex justify-content-between" style={{fontFamily:'Vazir', padding:'10px'}}>
                    <div style={{fontWeight:450}}>{setLT.deleteChat}</div>
                    <AiOutlineCloseCircle className='sidebarIcon' style={{fontSize:'30px'}} onClick={() => this.setState({deleteChat : false})}/>
                </Modal.Header>
                <Modal.Body>
                    <div className='center' style={{alignItems:'center', flexDirection:'column'}}>
                        <img
                            className={`C${itemX.fc} cardShadow`}
                            style={{objectFit: 'contain', width:"50px", height:"50px", borderRadius: itemX.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px'}}
                            src={ exist(itemX.profileIndex)
                                ? `https://www.pix.shiningpage.com/whoraly/profile/small/${itemX.userIdX}-${itemX.profileIndex}.jpeg`
                                : itemX.userIdX==='unknown'
                                    ? userN
                                    : itemX.genderValue===0 ? female : male
                            }
                            alt="user"
                        />
                        <div className='d-flex' style={{margin:'0px 0px 20px'}}>
                            {itemX.username 
                              ? <span style={{color:'#bb00f9', fontWeight:'bold'}}>{itemX.username}</span>
                              : <span style={{color:'#999999', fontWeight:450}}>{setLT.unknown}</span>
                            }
                        </div>
                        <div>
                            <span>{setLT.deleteChatText}</span>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <div className='center'>
                        <div className='btnShadow'
                            style={{width: '80px', textAlign:'center', 
                                    height: '30px',
                                    margin: '0px',
                                    border: '2px solid red',
                                    padding: '2px',
                                    color: 'red',
                                    borderRadius: '5px'}}
                            onClick = {() => this.onDeleteChat(itemX)}>
                            <span style={{fontSize:'13px'}}>{deletingChat ? loader13 : setLT.delete}</span>
                        </div>
                    </div>
                </Modal.Footer>

            </Modal>
        )

        return (
            <div>
                <Modal.Header className="d-flex justify-content-between modal-header-fixed">
                    <Modal.Title>{setLT.chatList}</Modal.Title>
                    <AiOutlineCloseCircle className='sidebarIcon' style={{fontSize:'30px'}} onClick={() => this.onToggleChatList()}/>
                </Modal.Header>
                <Modal.Body>
                    {chatSub}
                </Modal.Body>
                {modalDeleteChat}
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
        rtl: state.rtl,
        lang: state.lang,
        geo: state.geo,
        page: state.page,
        setLT: state.setLT,
        fullAccess: state.fullAccess,
        toggleChatList: state.toggleChatList,
    }
}

export default connect (mapStateToProps)(ModalChatList);
