import React, { Component, } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { setSubject, setToggleChat, setNotSeenChatQTY } from '../dataStore/actions';
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';
import userN from '../assets/images/other/user1.png';
import { MdClose } from 'react-icons/md';
import { FaRegPaperPlane } from 'react-icons/fa';
import { GrUpdate } from 'react-icons/gr';
import jalaali from 'jalaali-js';
import siteView from '../modules/siteView';
import { exist } from '../helper';
import { isoDateToDateTime, addNotification } from '../helper';
import {serverURL, s, lightColors } from '../srcSet';

class SubChat extends Component {

    state = {
        mesX: 0,
        d: '',
        chat1: [],
        chat2: [],
        w: document.body.clientWidth,
        h: window.innerHeight,
        msgDraft: '',
    }

    componentDidMount = async () => {
        window.addEventListener("resize", this.onResize)
        await this.props.dispatch(setSubject('sub-chat'))
        siteView(this.props)
        await this.getMessage()
        setTimeout(() => {
            this.chatTableDown()
        }, 100);
        await this.updateSeen()
        await this.notSeenChat(this.props.mainUser._id)
    }

    hashChange = () => {
        window.onhashchange = () => {
            // console.log('hash change')
            this.props.dispatch(setToggleChat(false))
            //this.onSetSidebarOpen()
        }
    }

    subUserImagePanel = async (user) => {
        const root = user.businessType>0 ? 'publisher' : 'user'
        window.open(`/${root}/${user.username}`);
    }

    updateSeen = async () => {
        if(!this.props.fullAccess || this.props.mainUser.username==='whoraly') {
            const {mainUser, subChatInfo} = this.props
            var data = {
                senderId: subChatInfo._id,
                receiverId: mainUser._id,
            }
            axios.post(`${serverURL}/chat/updateSeen`, data)
        }
    }

    notSeenChat = async (id) => {
        await axios.post(`${serverURL}/chat/notSeenChat` , {id}).then(async res => {
            var x = (res.data).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        })
    }

    deleteMsg = async (item, n) => {
        var data = {
            type: n,
            id: item._id,
        }

        await axios.post(`${serverURL}/chat/delete/`, data)
        await this.notSeenChat(this.props.subChatInfo._d)
        if(Number(this.props.notSeenChatQTY)===0) await this.deleteNotification('chat', 'message')

        await this.getMessage()
    }

    onWriteMsg = (e) => {
        this.setState({
            msgDraft: e.target.value
        })
    }

    getMessage = async () => {
        var mx = this.state.mesX.length
        var senderData = {
            senderId: this.props.mainUser._id,
            receiverId: this.props.subChatInfo._id,
        }

        var receiverData = {
            senderId: this.props.subChatInfo._id,
            receiverId: this.props.mainUser._id, 
        }

        const chat1 = await axios.post(`${serverURL}/chat/findSender/`, senderData)
        const chatList1 = chat1.data
        const chat2 = await axios.post(`${serverURL}/chat/findReceiver/`, receiverData)
        const chatList2 = chat2.data
        var messages = [...chatList1, ...chatList2]

        await messages.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)

        await this.messageListMap(messages)
        this.setState({
            mesX:messages,
            d:'',
        })
        if(mx!==this.state.mesX.length) this.chatTableDown('smooth')
    }

    deleteNotification = async (subject, type) => {
        var data = {
            visitor: this.props.mainUser._id!==undefined ? this.props.mainUser._id : 'unknown',
            visitee: this.props.subChatInfo._id,
            subject,
            type,
        }
        if(this.props.mainUser._id===undefined) {
            data.countryCodeZ = this.props.geo.countryCode
            data.countryZ = this.props.geo.country
        }
        if(data.visitor!==data.visitee) await axios.post(`${serverURL}/notification/delete`, data).then(res => {})
    }

    onSendMsg = async () => {
        const { mainUser, subChatInfo, geo } = this.props
        var data = {
            senderId: mainUser._id,
            username: mainUser.username,
            fc: mainUser.fc,
            profileIndex: mainUser.profileIndex,
            receiverId: subChatInfo._id,
            message: this.state.msgDraft,
            image: null,
            from: null,
        }
        // console.log(data)
        await axios.post(`${serverURL}/chat/send/`, data).then(async res => {
            if(res.data==='saved ok') {
                this.setState({
                    msgDraft: ''
                })
                await this.deleteNotification('chat', 'message')
                addNotification('chat', 'message', false, mainUser, subChatInfo._id, geo)
                await this.getMessage()
            }
        })
        setTimeout(() => {
            this.chatTableDown('smooth')
        }, 100);
    }

    chatTableDown = async (x) => {
        let elem = document.getElementById("chatTable");
        if(elem) {
            elem.scrollBy({
                top: elem.scrollHeight, //1000000,//elem.offsetHeight, // Scroll to the end of the tabele's height
                behavior: x==='smooth' ? 'smooth' : 'auto'
            });
        }
    }

    dayFarsi = (x) => {
        switch(x){
            case 'Sat': x = 'شنبه'; break;
            case 'Sun': x = 'یکشنبه'; break;
            case 'Mon': x = 'دوشنبه'; break;
            case 'Tue': x = 'سه شنبه'; break;
            case 'Wed': x = 'چهارشنبه'; break;
            case 'Thu': x = 'پنجشنبه'; break;
            case 'Fri': x = 'جمعه'; break;
            default: x = '';
        }
        return x
    }

    dateShamsi = (x) => {
        var localDateArray = x.split('/')
        var dSh = jalaali.toJalaali(Number(localDateArray[2]), Number(localDateArray[0]), Number(localDateArray[1]))
        var dShamsi = dSh.jy+'/'+dSh.jm+'/'+dSh.jd
        return dShamsi
    }

    messageListMap = async (x) => {
        const {w, d} = this.state
        const {setLT, lang, rtl, mainUser, subChatInfo } = this.props
        
        let lastDate = d;
        var dataRv = x.map (
        (item, i) => {
            // console.log(199999, item)
            const type = item.senderId===mainUser._id ? 1 : 0
            const userP = type===1 ? mainUser.profileIndex : subChatInfo.profileIndex
            const businessType = type===1 ? mainUser.businessType : subChatInfo.businessType
            const selectedX = type===1 ? mainUser.fc : subChatInfo.fc
            const genderValueX = type===1 ? mainUser.genderValue : subChatInfo.genderValue
            const iso = isoDateToDateTime(item.createdAt, lang)
            const dateDay = iso.date + ' ' + iso.day

            const dx = iso.date !== lastDate; // بررسی تغییر تاریخ
            if (dx) {
                lastDate = iso.date; // به‌روزرسانی تاریخ محلی
            }
            // console.log('d: ', this.state.d, 'iso.date :', iso.date)
            // const dx = iso.date!==this.state.d ? true : false
            // this.setState({ d: iso.date })
            const date = (
                <div className='center sticky-top' style={{top:'0px', zIndex:'1'}}>
                    <div className='center'
                        style={{backgroundColor:'#f2f2f2', padding:'0px 15px', margin: dx===true && '10px 0px', borderRadius:'100px'}}>
                        {dx===true && <span style={{marginTop:'3px', fontSize:'13px'}}>{dateDay}</span>}
                    </div>
                </div>
            )

            const userImage = (
                <img
                    className={`C${selectedX}`}
                    style={{objectFit: 'contain', width:"25px", height:"25px", borderRadius: businessType>0 ? '3px' : '100px', margin:'0px', border:'1px solid #ffffff40', padding:'1px'}}
                    src={ exist(userP)
                        ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item.senderId}-${userP}.jpeg`
                        : item.senderId==='unknown'
                            ? userN
                            : genderValueX===0 ? female : male
                    }
                    alt="user"
                />
            )
            const imageX = (
                <img
                    style={{objectFit: 'contain', width:"150px", height:"", borderRadius:'5px', margin:'0px', border:'1px solid #ffffff40', padding:'1px'}}
                    src={item.image}
                    alt="user X"
                />
            )
            const dwItemStyle={padding:'10px 15px', textAlign: rtl ? 'right' : 'left', cursor:'pointer'}
            const more = (
                <div className="dropdown" style={{padding:'-5px 0px'}}>
                    <button className="dropdown-toggle" style={{fontSize:'15px', border:'1px solid #ffffff', height:'16px', color:'#000000', zIndex:'2'}} type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    ...
                    </button>
                    <div className="dropdown-menu sticky-top" aria-labelledby="dropdownMenuButton" style={{fontSize:'13px'}}>
                    {type!==1 &&
                        <div className="dropdown-item" style={dwItemStyle} onClick={() => this.deleteMsg(item, 0)}>
                            {setLT.delete}
                        </div>
                    }
                    {type===1 &&
                        <div className="dropdown-item" style={dwItemStyle} onClick={() => this.deleteMsg(item, 1)}>
                            {setLT.deleteForMe}
                        </div>
                    }
                    {type===1 &&
                        <div className="dropdown-item" style={dwItemStyle} onClick={() => this.deleteMsg(item, 2)}>
                            {setLT.deleteForAll}
                        </div>
                    }
                    </div>
                </div>
            )
            const checkMarksTime = (
                <div>
                    { type===1 &&
                        <span>
                            <span>
                                <span className={`f${selectedX}`} style={{fontSize:'14px', lineHeight:'10px', margin:'4px -5px 0px 0px', textAlign:'center', textShadow:'.4px .4px 1px #999999'}}>✓</span>
                                {item.seen && <span className={subChatInfo.fc ? `f${subChatInfo.fc}` : 'f11 C0'} style={{fontSize:'14px', lineHeight:'10px', margin:'4px -5px 0px 0px', textAlign:'center', textShadow:'.4px .4px 1px #999999'}}>✓</span>}
                            </span>&nbsp;
                        </span>
                    }
                    <span style={{fontSize:'10px', lineHeight:'10px', margin:'4px 0px 0px', color:'#999999', textAlign:'center'}}>{iso.time}</span>&nbsp;
                </div>
            )
            const message = (
                <div className={`cardShadow C${selectedX}`}
                    style={{ maxWidth:'90%', borderRadius:'10px', padding:'2px', margin:'0px 5px'}}>
                    <div className='d-flex' style={{borderRadius:'8px', flexDirection:'column', textAlign:rtl ? 'right' : 'left',
                            padding:'5px 10px 0px', whiteSpace:'pre-wrap',backgroundColor:'#ffffff'}}>
                        {item.message}{item.image!==null && imageX}
                        <div className='d-flex' style={{alignItems:'center', justifyContent:'space-between'}}>
                            {checkMarksTime}
                            <span style={{fontSize:'10px', lineHeight:'10px', margin:'3px 0px', color:'#999999', textAlign:'center'}}>{!(item.receiverId==='607e9088bede482040af3574' || item.senderId==='607e9088bede482040af3574') && more}</span>
                            {/* <span style={{fontSize:'10px', lineHeight:'10px', margin:'3px 0px', color:'#999999', textAlign:'center'}}>{more}</span> */}
                        </div>
                    </div>
                </div>
            )
            return (
                <div key={i}
                    style={{textDecoration: "none", width:'100%', padding:'0px', fontSize:'15px',
                            borderRadius:'100px', margin:'5px 0px'}}
                    >
                    {type===1
                        ? (
                            <div>
                                {date}
                                <div className='d-flex justify-content-end'>{message}{userImage}</div>
                            </div>
                        )
                        : (
                            <div>
                                {date}
                                <div className='d-flex '>{userImage}{message}</div>
                            </div>
                        )
                        }
                    </div>
                )
            }
        )

        this.setState({
            messageMap: dataRv,
        })
    }

    onToggleChat = () => {
        this.props.dispatch(setToggleChat(false))
    }

    onResize = () => {
        this.setState({ 
            w: document.body.clientWidth,
            h: window.innerHeight,
        })
    }

    render() {
        const {w, h, messageMap, } = this.state
        const {auth, rtl, setLT, mainUser, subChatInfo, fc, } = this.props;
        var fcSub = subChatInfo.fc
        const txBlack = lightColors.includes(mainUser.fc) ? true : false

        const chatBody = (
            <div id="chatTable" className="d-flex"
                style={{flexWrap: 'wrap', alignItems:'top', width:'100%', padding:'10px', overflowY: 'auto'}}>
                {messageMap}
            </div>
        )

        const sendBtn = (
            <div className={`center`}>
                <div className={`btnShadow C${fc} f${txBlack ? 7 : 11}`}
                    style={{width: '40px', height: '40px', textAlign:'center', 
                        padding: '2px', border: `2px solid #ffffff99`, borderRadius: '100px'}}
                    onClick = {() => this.onSendMsg()}>
                    <FaRegPaperPlane style={{margin:'7px 3px 0px 0px'}}/>
                </div>
            </div>
        )

        const updateBtn = (
            <div className={`center`}>
                <div className={`btnShadow C${fc} f${txBlack ? 7 : 11}`}
                    style={{width: '40px', textAlign:'center', height: '40px',
                        margin: '10px', border: `2px solid #ffffff99`,
                        padding: '2px', borderRadius: '100px'}}
                    onClick = {() => this.getMessage()}>
                    <GrUpdate style={{margin:'7px 3px 0px 0px'}}/>
                </div>
            </div>
        )

        const chatTape = (
            <div className='center'
                style={{marginTop:'10px', width:'100%', borderRadius:'3px',
                fontWeight:'', fontSize:'15px', backgroundColor:'#ffffff'}}
            >
                <textarea
                    onChange={this.onWriteMsg}
                    value={this.state.msgDraft}
                    type="text"
                    className="form-control"
                    placeholder={setLT.chatPlaceHolder}
                    style={{minHeight: '10px', height: 'unset', borderRadius:'5px', fontSize:'14px', direction:rtl ? 'rtl' : ''}}
                    rows="5"
                />&nbsp;&nbsp;
                <div>
                    {sendBtn}
                    {/* updateBtn */}
                </div>
            </div>
        )

        const subUserImage = (
            <div className='d-flex' style={{alignItems:'center', cursor:'pointer'}}  onClick={() => this.subUserImagePanel(subChatInfo)}>
                <img className={`C${fcSub}`}
                    style={{objectFit: 'contain', width:"40px", height:"40px", borderRadius:subChatInfo.businessType>0 ? '3px' : '100px', border:'2px solid #ffffff40', padding:'2px'}}
                    src={ !auth
                        ? userN
                        :(exist(subChatInfo.profileIndex)
                            ? `https://www.pix.shiningpage.com/whoraly/profile/small/${subChatInfo._id}-${subChatInfo.profileIndex}.jpeg`
                            : subChatInfo.userIdX==='unknown'
                                ? userN
                                : subChatInfo.genderValue===0 ? female : male)
                    }
                    alt="sub user"
                />&nbsp;
                {subChatInfo.username}
            </div>
        )

        const closeBtn = (
            <section className='center btnShadow' onClick={() => this.onToggleChat()}
                style={{width:'30px', height:'30px', padding:'2px', position:'relative', margin:'0px 0px 0px 0px', borderRadius:'100px',// position:'fixed', top:10,
                    color: `#f9e8ff`, backgroundColor:'#ffffff00',
                    border: `3px solid #f9e8ff`,
                }}>
                <MdClose className='sidebarIcon' style={{marginTop:'0px', width:'20px', fontSize:'20px', fontWeight:'bold', cursor:'pointer', position:''}}/>
            </section>
        )

        const chatHeader =  (
            <div className='d-flex'
                style={{ backgroundImage:'linear-gradient(to right , #db5bff , #5b5bff)',
                    width:'100%', height: '60px', color:'white', alignItems:'center',
                    justifyContent:'space-between', padding: '0px 15px',
                    borderBottom:'2px solid #FEED97'
                }}>
                {subUserImage}
                {closeBtn}
            </div>
        )

        console.log('subChatInfo: ', subChatInfo.receiverId)
        return (
            <div>
                <Modal.Header>
                    {chatHeader}
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex' style= {{height:h-150, flexDirection:'column', borderRadius:'10px'}}>
                        <div className='d-flex' style={{flex: 1, flexDirection:'column', overflow:'scroll'}}>
                            {chatBody}
                        </div>
                        {subChatInfo.receiverId!=='unknown' && chatTape}
                    </div>
                </Modal.Body>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUser: state.userInfo,
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
        notSeenChatQTY: state.notSeenChatQTY,
        fullAccess: state.fullAccess,
    }
}

export default connect (mapStateToProps)(SubChat);

