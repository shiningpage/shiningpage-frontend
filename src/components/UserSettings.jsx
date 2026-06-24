import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaCaretDown } from "react-icons/fa";
import { RiUserSettingsFill } from "react-icons/ri";
import { s } from '../srcSet';

class UserSettings extends Component{

    state = {
        w: window.innerWidth,
    }

    componentDidMount = async () => {}

	render () {
        const {w, } = this.state
        const {setLT, rtl, lang, page, fc} = this.props

        return (
            <div className="btn-group" style={{padding:'0px', fontSize:'15px', fontWeight:'', cursor:'pointer'}}>
                <div className={ w<s ? "dropleft" : 'dropdown'} color=''
                    type="" id="dropdownMenuButton" data-bs-toggle="dropdown" //data-bs-auto-close="outside"
                    aria-haspopup="false" aria-expanded="false" data-bs-offset="0,0"
                >
                    <div className={`center ${['web', 'ps'].includes(page) ? `fontColor h${fc===11 ? 0 : fc}` : 'nav' }`}
                        style={{fontSize:'14px', fontWeight:300, alignItems:'center', padding:'5px', margin: w<s ? '3px 0px 0px' : '0px 8px 0px', flexWrap:'nowrap'}}>
                        <span style={{fontSize:'18px'}}><RiUserSettingsFill /></span>
                        <FaCaretDown />
                    </div>
                </div>
                <div className="dropdown-menu animated fadeIn sticky-top" aria-labelledby="dropdownMenuButton"
                    style={{ fontSize: '13px', cursor: 'pointer', margin: 230, zIndex:'100' }}>
                    <div className='d-flex dropdown-item' style={{}}
                        onClick={ () => null }>
                        {setLT.profileTheme}&nbsp;&nbsp;
                        <div className={`C${fc} cardShadow`} style={{height:'20px', width:'20px', borderRadius:'3px'}}></div>
                    </div>
                    <div className='dropdown-item' style={{}}
                        onClick={ () => null }>
                        {setLT.changePassword}
                    </div>
                    <div className='dropdown-item' style={{}}
                        onClick={ () => null }>
                        {setLT.otherSettings}
                    </div>
                    <hr />
                    <Link to={`/login`} className='dropdown-item' style={{}}
                        onClick={ () => null }>
                        {setLT.exit}
                    </Link>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        subUserInfo: state.subUserInfo,
        fc: state.subUserInfo.fc,
        lang: state.lang,
        rtl: state.rtl,
        page: state.page,
        setLT: state.setLT,
    }
}

export default connect (mapStateToProps)(UserSettings);
