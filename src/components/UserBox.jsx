import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { setToggleChat, setSubChatInfo } from '../dataStore/actions';
import EditBtn from './EditBtn';
import ModalWebPageTheme from './modals/ModalWebPageTheme';
import ModalChangePassword from './modals/ModalChangePassword';
import rubyIcon from '../assets/images/other/rubyS.png';
import userN from '../assets/images/other/user1.png';
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';
import { FaCaretDown } from "react-icons/fa";
import { SiMediamarkt } from "react-icons/si";
import { logout, goToWebPage, exist } from '../helper';
import { s, serverURL } from '../srcSet';
import { fullAccess } from '../dataStore/reducers/other/fullAccess';

class UserBox extends Component{

    state = {
        w: window.innerWidth,
        toggleWebPageTheme: false,
        toggleChangePassword: false,
    }

    componentDidMount = async () => {}

    toggleWebPageTheme = () => {
        this.setState({
            toggleWebPageTheme: !this.state.toggleWebPageTheme,
        });
    }

    toggleChangePassword = () => {
        this.setState({
            toggleChangePassword: !this.state.toggleChangePassword,
        });
    }

    onGoBusiness = (section) => {
        // window.location = `https://panel.shiningpage.com/${this.props.mainUser.username}#${section}`;
        window.open(`https://panel.shiningpage.com/${this.props.mainUser.username}#${section}`, '_blank');
    }
    
    onCreateTicket = async (ID, e) => {
        const index = e?.target?.id==='chatDelete' ? false : true
        if(index) {
            this.setState({loading:true})
            if(ID.receiverId!=='unknown') {
                var user = await axios.post(`${serverURL}/user/getUserInfo`, { _id: ID })
                var item = user.data
                delete item.password
                if(item) this.props.dispatch(setSubChatInfo(item))
            } else {
                ID._id='unknown'
                this.props.dispatch(setSubChatInfo(ID))
            }
            this.props.dispatch(setToggleChat(true))
            this.setState({loading:false})
        }
    }

	render () {
        const {w, toggleWebPageTheme, toggleChangePassword} = this.state
        const {auth, setLT, rtl, page, lang, fullAccess, mainUser, subUserInfo, loading, balance, ruby} = this.props
        const loader13 = <div className='loader-13' style={{margin: '0px 20px', color:'', transform: rtl ? 'rotate(180deg)' : ''}}></div>
        const me = mainUser._id===subUserInfo._id ? true : false

        const rubyIndex = auth
                        ? mainUser.access.includes('ruby') ? true : false 
                        : false

        const userImage = (
            <img
                className={`C${mainUser.fc}`}
                style={{objectFit: 'cover', width:'50px', height:'50px', borderRadius:mainUser.businessType>0 ? '3px' : (!auth ? '' : '100px'), border:'0px solid #99999920', margin:'0px', padding:'0px'}}
                src={
                  !auth
                  ? 'https://www.pix.shiningpage.com/whoraly/site/login.png'
                  : exist(mainUser.profileIndex)
                    ? `https://www.pix.shiningpage.com/whoraly/profile/small/${mainUser._id}-${mainUser.profileIndex}.jpeg`
                    : mainUser.genderValue===0 ? female : male
                }
                alt="user"
            />
        )

        const userProfileImage = (
            <div className={`btnShadow C${auth ? mainUser.fc : 14}`} style={{width:w<s ? '35px' : '27px', height:w<s ? '35px' : '27px', minWidth:w<s ? '35px' : '27px', minHeight:w<s ? '35px' : '27px', borderRadius:mainUser.businessType>0 ? '2px' : '100px', border:`2 px solid #ffffff40`, padding:'2px'}}>
                <img
                    className={`btnShadow C${auth ? mainUser.fc : 11}`}
                    style={{objectFit: 'cover', width:'100%', height:'100%', borderRadius:mainUser.businessType>0 ? '2px' : '100px'}}
                    src={
                        !auth
                        ? 'https://www.pix.shiningpage.com/whoraly/site/login.png'
                        : exist(mainUser.profileIndex)
                            ? `https://www.pix.shiningpage.com/whoraly/profile/small/${mainUser._id}-${mainUser.profileIndex}.jpeg`
                            : mainUser.genderValue===0 ? female : male
                    }
                    alt="user"
                />
            </div>
        )
        const webLinkIcon = (
            <div className='center white-nav' style={{width:'', height:'100%', marginTop:w<s ? '' : '3px', padding:w<s ? '' : '0px 15px', textAlign:'center', flexDirection:'column'}}
                onClick={() => auth ? null : window.location.href = '/login'}>
                {userProfileImage}
                { w>=s &&
                    <div className='flex'>
                        <span style={{fontSize:'12px', margin:'0px', whiteSpace: 'nowrap'}}>{auth ? 'Me' : 'Login'}</span>
                        {auth && <FaCaretDown/>}
                    </div>
                }
            </div>
        )
      
        const modalWebPageTheme = (
            <ModalWebPageTheme
                me={me}
                dispatch={this.props.dispatch}
                EditBtn={EditBtn}
                toggleWebPageTheme={toggleWebPageTheme}
                onToggle={this.toggleWebPageTheme}
                mapStateToProps={this.props}
            />
        )

        const modalChangePassword = (
            <ModalChangePassword
                dispatch={this.props.dispatch}
                EditBtn={EditBtn}
                toggleChangePassword={toggleChangePassword}
                onToggle={this.toggleChangePassword}
                mapStateToProps={this.props}
            />
        )

        const hasUsername = !!mainUser?.username
        const root = mainUser.businessType>0 ? 'publisher' : 'user'
        const linkTarget = auth && hasUsername
            ? `/${root}/${mainUser.username}`
            : '/login'
        const userLink = (
            <a href={linkTarget} style={{textDecoration:'none', color:'#000000'}}
                onClick={() => (page!=='web' && page!=='publisher')
                                    ? null
                                    : me
                                        ? window.scroll(0, 0)
                                        : goToWebPage(mainUser)
                }
            >
                <div className='d-flex' style={{marginBottom:'10px'}}>
                    {userImage}&nbsp;&nbsp;
                    <div>
                        <div style={{fontWeight:450}}>{mainUser.bizName ? mainUser.bizName : mainUser.username}</div>
                        <div>{mainUser.jobSummary ? mainUser.jobSummary : ''}</div>
                    </div>
                </div>
                { fullAccess && <div style={{fontSize:'12px', textAlign:'center'}}>{mainUser._id}</div>}
                <div style={{padding:'4px 14px'}}>
                    <div className={`C${auth ? mainUser.fc : 14} btnShadow`} style={{height:'30px', fontWeight:450, marginBottom:'5px', padding:'2px', borderRadius:'0px 10px'}}>
                        <div className={`center`} style={{height:'100%', width:'100%', textAlign:'center', padding:'2px', borderRadius:'0px 10px', backgroundColor:'#ffffff99', color:'#000000'}}>
                            <div className={`center`} style={{height:'100%', width:'100%', textAlign:'center', padding:'2px', borderRadius:'0px 10px', backgroundColor:'#ffffff', color:'#000000'}}>
                                {auth ? setLT.viewWebPage : setLT.signupLogin}
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        )

        const changeTheme = (
            <div className='d-flex dropdown-item' style={{alignItems:'center'}}
                onClick={ () => this.toggleWebPageTheme() }>
                {setLT.changeTheme}
                <div className={`C${mainUser.fc} cardShadow`} style={{height:'20px', width:'20px', margin:'0px 13px', borderRadius:'3px'}}></div>
            </div>
        )

        const changePassword = (
            <div className='dropdown-item'
                onClick={ () => this.toggleChangePassword() }>
                {setLT.changePassword}
            </div>
        )

        const sendTicket = (
            <div className='dropdown-item' onClick={() => this.onCreateTicket("607e9088bede482040af3574")}>
                {loading ? loader13 : setLT.sendTicket}
            </div>
        )

        const signOut = (
            <div className='dropdown-item' onClick={() => logout(lang, this.props.dispatch)}>
                {setLT.exit}
            </div>
        )

        const socialMedia = (
            <Link to={`/social-media`} className='d-flex dropdown-item' style={{alignItems:'center'}}>
                {setLT.socialMediaPanel}
                <SiMediamarkt style={{width:'20px', height:'20px', margin:'0px 13px', color:'#d1a44a'}}/>
            </Link>
        )

        const currentBalance = (
            <span className='dropdown-item' style={{ fontWeight:450 }}>{setLT.balance}:&nbsp;{'£' + balance}</span>
        )

        const rubySection = (
            <span className='dropdown-item' style={{ fontWeight:450 }}>
                {setLT.ruby}:&nbsp;
                <img
                    className=''
                    style={{objectFit:'contain', width:'17px', height:'17px'}}
                    src={rubyIcon}
                    alt="user"
                />&nbsp;
                {ruby}
            </span>
        )

        return (
            <div className="btn-group" style={{padding:'0px', fontSize:'15px', fontWeight:'', cursor:'pointer'}}>
                <div className={ w<s ? "dropleft" : 'dropdown'} color=''
                    type="" id="dropdownMenuButton" data-bs-toggle="dropdown" //data-bs-auto-close="outside"
                    aria-haspopup="false" aria-expanded="false" data-bs-offset="0,0"
                >
                    {webLinkIcon}
                </div>
                { auth &&
                    <div className="dropdown-menu animated fadeIn sticky-top" aria-labelledby="dropdownMenuButton"
                        style={{ width:'250px', fontSize: '13px', cursor: 'pointer', margin: 230, padding:'10px', borderRadius:'10px' }}>
                        {userLink}
                        <div>
                            <br/>
                            {changeTheme}
                            {changePassword}
                            {sendTicket}
                            <div>
                                <hr/>
                                {currentBalance}
                                {rubyIndex && rubySection}
                                {/* mainUser.access.includes('socialMedia') && socialMedia */}
                            </div>
                            <hr/>
                            {signOut}
                        </div>
                    </div>
                }
                {modalWebPageTheme}
                {modalChangePassword}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo._id,
        mainUser: state.userInfo,
        subUserInfo: state.subUserInfo,
        lang: state.lang,
        rtl: state.rtl,
        page: state.page,
        setLT: state.setLT,
        auth: state.auth,
        balance: state.balance,
        ruby: state.ruby,
        fullAccess: state.fullAccess,
    }
}

export default connect (mapStateToProps)(UserBox);
