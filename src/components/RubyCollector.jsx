import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
// import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { setRubyAmount, setRubyBlock, setRubyInterval } from '../store/slices/rubySlice';
import { setToggleViewStatus } from '../store/slices/appSlice';
import rubyS from '../assets/images/other/rubyS.png';
import { ImBlocked } from "react-icons/im";
import { getFingerprint, countryAdsenseRate, createConfetti, checkRubyInterval } from '../helper';
import { serverURL, s, siteName, } from '../srcSet';

const RubyCollector = ({ id, objects, top, bottom, left, right, mainUser, geo, subject, lang, rubyBlock, rubyInterval, dispatch }) => {
    const [status, setStatus] = useState(false);
    const [saving, setSaving] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // بررسی وجود آیتم و فعال بودن آن
        const foundItem = objects.find((item) => item.id === id && item.active === true);

        if (foundItem) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [id, JSON.stringify(objects)]); // بررسی تغییر در آرایه به صورت عمقی

    const toggleScrollLock = (lock) => {
        if (lock) {
            document.body.style.overflow = 'hidden'; // قفل کردن اسکرول
            document.body.style.height = '100vh';   // جلوگیری از اسکرول اضافی
        } else {
            document.body.style.overflow = ''; // باز کردن اسکرول
            document.body.style.height = '';
        }
    };

    const addRuby = async () => {
        if(clicked || status) return; // اگر قبلا کلیک شده باشد یا وضعیت تغییر کرده باشد، هیچ کاری انجام نده
        setClicked(true); // جلوگیری از کلیک‌های اضافی
        setSaving(true);
        // toggleScrollLock(true)

        setTimeout( async () => {
            try {
                const data = {
                    userId: mainUser._id,
                    username: mainUser.username,
                    visitorId: await getFingerprint(),
                    ruby: countryAdsenseRate(geo.countryCode),
                    continent: geo.continent,
                    countryCode: geo.countryCode,
                    country: geo.country,
                    city: geo.city,
                    subject,
                    lang,
                    version: import.meta.env.VITE_VERSION,
                    siteName,
                    ip: geo.query,
                    isp: geo.isp,
                    platform: navigator.platform,
                    userAgent: navigator.userAgent,
                    screen: `height: ${(window.screen || []).height}, width: ${(window.screen || []).width}`,
                };

                await axios.post(`${serverURL}/ruby/saveScore`, data);
                const res = await axios.post(`${serverURL}/ruby/totalScore`, { userId: mainUser._id });

                createConfetti();
                dispatch(setRubyAmount(parseFloat(res.data).toFixed(3)));
                rubyInterval.done = rubyInterval.done+1
                dispatch(setRubyInterval(rubyInterval))
                // console.log('ruby: ', rubyInterval.ruby)
                // console.log('done: ', rubyInterval.done)
                // console.log('xxx: ', rubyInterval.ruby===rubyInterval.done)
                if(rubyInterval.done!==0 && rubyInterval.done >= rubyInterval.ruby) {
                    dispatch(setRubyBlock(true));
                    checkRubyInterval(rubyInterval, dispatch)
                }
                setStatus(true);
            } catch (error) {
                console.error('Error saving score:', error);
            } finally {
                setSaving(false);
                setClicked(false);
                // toggleScrollLock(false);
            }
        }, 3000);

    };

    const loaderRed = <div className='loader-02' style={{color:'red', fontSize:'18px'}}></div>
    const loaderOn = <div className={`loader-07`} style={{width:'70px', height:'70px', position:'absolute', color:'red'}}></div>
    const loaderOff = <div className={`loader-07`} style={{width:'50px', height:'50px', position:'absolute', color:'white', opacity:'.5'}}></div>
    const rubyDo = mainUser.ruby && !status && visible ? true : false
    const rubyBtn = (
        <div className={`${!status ? 'btnShadow' : ''} C${visible ? 23 : 7} center`}
            style={{width:'30px', height:'30px', borderRadius:'100px', padding:'2px', filter: !status ? '' : 'grayscale(100%)', position:'relative'}}
            onClick={() => {
                if (rubyBlock) {
                    dispatch(setToggleViewStatus({ toggle: true, page: false }));
                } else if (rubyDo) {
                    addRuby();
                }
            }}
        >
            <div className={`C${11} center`} style={{width:'100%', height:'100%', borderRadius:'100px', padding:'3px'}}>
                { !saving ?
                    <img
                        className=''
                        style={{objectFit:'contain', width:'100%', height:'100%'}}
                        src={rubyS}
                        alt="ruby"
                    />
                    :loaderRed
                }
            </div>
            {rubyBlock && <ImBlocked style={{fontSize:'30px', color:'red', position:'absolute'}}/>}
            { rubyDo ? (rubyBlock ? loaderOff : loaderOn) : loaderOff }
        </div>
    )

    const tooltipTitle = rubyBlock
        ? 'Ruby Block'
        : !status
          ? (rubyDo ? 'Ruby Collector' : 'Ruby Activating ...')
          : 'Done!'
      
    return (
        <div className='' style={{ borderRadius:'100px', position:'absolute', top, bottom, left, right, zIndex:'1' }}>
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{tooltipTitle}</Tooltip>}>
                <span className="d-inline-block">
                    {rubyBtn}
                </span>
            </OverlayTrigger>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.user.userInfo._id,
        mainUser: state.user.userInfo,
        userId: state.user.subUserInfo._id,
        subUserInfo: state.user.subUserInfo,
        fc: state.user.subUserInfo.fc,
        username: state.user.subUserInfo.username,
        businessType: state.user.subUserInfo.businessType,
        email: state.user.subUserInfo.email,
        genderValue: state.user.subUserInfo.genderValue,
        jobSummary: state.user.subUserInfo.jobSummary,
        biography: state.user.subUserInfo.biography,
        lat: state.user.subUserInfo.lat,
        lon: state.user.subUserInfo.lon,
        rtl: state.app.rtl, 
        lang: state.app.lang,
        geo: state.app.geo,
        country: state.app.country,
        subject: state.app.subject,
        setLT: state.app.setLT,
        fullAccess: state.auth.fullAccess,
        scrollDirection: state.app.scrollDirection,
        objects: state.app.objects,
        rubyBlock: state.ruby.block,
        rubyInterval: state.ruby.interval,
    }
}

export default connect (mapStateToProps)(RubyCollector);
