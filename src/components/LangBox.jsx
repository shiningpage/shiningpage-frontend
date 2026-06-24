import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setSetLT, setLang, setRtl } from '../dataStore/actions'; 
import setLangText from '../modules/setLangText';
import { FaCaretDown } from "react-icons/fa";
import { CiGlobe } from 'react-icons/ci';

import { s, langArray, colors, lightColors } from '../srcSet';

class LangBox extends Component{

    state = {
        w: window.innerWidth,
    }

    componentDidMount = async () => {}

    langText = (x) => {
        var w = this.state.w
        var auth = this.props.auth
        switch (this.props.lang) {

            case 'en': x = 'En'; break;
            case 'fa': x = 'Fa'; break;
            case 'ar': x = 'Ar'; break;
            case 'ru': x = 'Ru'; break;
            case 'tr': x = 'Tr'; break;
            case 'de': x = 'De'; break;
            case 'fr': x = 'Fr'; break;
            case 'es': x = 'Es'; break;
            case 'zh': x = 'Zh'; break;
    
        //   case 'en': x = 'English'; break;
        //   case 'fa': x = 'فارسی'; break;
        //   case 'ar': x = 'العربية'; break;
        //   case 'ru': x = 'Русский'; break;
        //   case 'tr': x = 'Türkçe'; break;
        //   case 'de': x = 'Deutsch'; break;
        //   case 'fr': x = 'Français'; break;
        //   case 'es': x = 'Española'; break;
        //   case 'zh': x = '中文'; break;

            default: x = '';
        }
        return x
    }

    changeLanguage = async (x) => {
        this.props.dispatch(setLang(x))
        this.props.dispatch(setSetLT(setLangText(x)))
        // console.log(111, this.props.lang)
        // console.log(x)

        if(x==='fa' || x==='ar') {
            this.props.dispatch(setRtl(true))
        } else {
            this.props.dispatch(setRtl(false))
        }

        var pth = window.location.pathname;
        var firstRout = pth.split('/')[1]
        if(firstRout===''){
            window.location.href=`/${x}`
        } else {
            // if(langArray.includes(firstRout)) {
                window.history.pushState('data', 'Title', pth.replace(firstRout, x));
                let newUrlIS =  window.location.origin + pth.replace(firstRout, x);
                // console.log(pth)
                // console.log(window.location.origin)
                await window.history.pushState({}, null, newUrlIS);

                // var currentUrl = window.location.href;
                // // تغییر URL به https://etradepanel.com
                // var newUrl = 'https://etradepanel.com';
                // window.history.pushState({ path: newUrl }, '', newUrl);
            // }
            window.location.reload();
        }
    }

    langMap = () => {
        const {setLT, rtl, page, lang, fc, subUserInfo} = this.props

        const languages = [
            { name:'English', code:'en', active: true},
            { name:'العربية', code:'ar', active: true},
            { name:'فارسی', code:'fa', active: true},
        ]
        // { name:'Русский', code:'ru', active: true},
        // { name:'Türkçe', code:'tr', active: false},
        // { name:'Deutsch', code:'du', active: false},
        // { name:'Français', code:'fr', active: false},
        // { name:'Española', code:'es', active: false},
        // { name:'中文', code:'zh', active: false},

        var styleOn, styleOff
        var langList = languages.map(
            (language, i) => (
                styleOn = {color: lang===language.code ? '#f2ba4b' : ''},
                styleOff = {color:'#999999'},
                <div key={i} className='dropdown-item' style={language.active ? styleOn : styleOff}
                    onClick={ language.active ? () => this.changeLanguage(language.code) : null }>
                    { language.name }
                </div>
            ))
        return langList
    }

	render () {
        const {w, } = this.state
        const {setLT, rtl, page, fc} = this.props

        return (
            <div className="btn-group" style={{padding:'0px', fontSize:'15px', fontWeight:'', cursor:'pointer'}}>
                <div className={ w<s ? "dropleft" : 'dropdown'} color=''
                    type="" id="dropdownMenuButton" data-bs-toggle="dropdown" //data-bs-auto-close="outside"
                    aria-haspopup="false" aria-expanded="false" data-bs-offset="0,0"
                >
                    <div className={`center ${['web', 'ps'].includes(page) ? `fontColor h14` : 'nav' }`}
                        style={{fontSize:'14px', fontWeight:300, alignItems:'center', padding:'5px', margin: w<s ? '3px 0px 0px' : '0px 8px 0px', flexWrap:'nowrap'}}>
                        {this.langText()}
                        <FaCaretDown />
                    </div>
                </div>
                <div className="dropdown-menu animated fadeIn sticky-top" aria-labelledby="dropdownMenuButton"
                    style={{ fontSize: '13px', cursor: 'pointer', margin: 230 }}>
                    { this.langMap() }
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

export default connect (mapStateToProps)(LangBox);
