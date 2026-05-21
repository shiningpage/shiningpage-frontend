import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { setSubUserInfo, setUserInfo } from '../../dataStore/actions';
import { AiOutlineCloseCircle, AiFillTikTok } from "react-icons/ai";
import { MdPhonelinkRing, MdEmail, MdPhoneInTalk } from 'react-icons/md';
import { IoLogoWhatsapp } from 'react-icons/io';
import { FaLinkedin, FaYoutube, FaFacebook, FaInstagram, FaTelegram, FaGlobe } from 'react-icons/fa';

import { serverURL, s } from '../../srcSet';

const ModalContactsInfo = (props) => {
    const {mainUser, setLT, rtl, lang} = props.mapStateToProps
    const [w, setW] = useState(document.body.clientWidth);
    const [action, setAction] = useState(false);
    const [city, setCity] = useState(mainUser.city);
    const [address, setAddress] = useState(mainUser.address);
    const [phone, setPhone] = useState(mainUser.phone);
    const [celphone, setCelphone] = useState(mainUser.celphone);
    const [whatsapp, setWhatsapp] = useState(mainUser.whatsapp);
    const [website, setWebsite] = useState(mainUser.website);
    const [email, setEmail] = useState(mainUser.email);
    const [instagram, setInstagram] = useState(mainUser.instagram);
    const [tikTok, setTikTok] = useState(mainUser.tikTok);
    const [telegram, setTelegram] = useState(mainUser.telegram);
    const [facebook, setFacebook] = useState(mainUser.facebook);
    const [youtube, setYoutube] = useState(mainUser.youtube);
    const [linkedin, setLinkedin] = useState(mainUser.linkedin);
    
    const [websiteY, setWebsiteY] = useState("");
    const [facebookY, setFacebookY] = useState("");
    const [youtubeY, setYoutubeY] = useState("");
    const [linkedinY, setLinkedinY] = useState("");

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        setCity(mainUser.city);
        setAddress(mainUser.address);
        setPhone(mainUser.phone);
        setCelphone(mainUser.celphone);
        setWhatsapp(mainUser.whatsapp);
        setWebsite(mainUser.website);
        setEmail(mainUser.email);
        setInstagram(mainUser.instagram);
        setTikTok(mainUser.tikTok);
        setTelegram(mainUser.telegram);
        setFacebook(mainUser.facebook);
        setYoutube(mainUser.youtube);
        setLinkedin(mainUser.linkedin);
        
        setWebsiteY("");
        setFacebookY("");
        setYoutubeY("");
        setLinkedinY("");
    }, [props.toggleContactsInfo]);

    const changeHandler = (event) => {
        const { name, value } = event.target;
        const stateUpdaters = {
            city: setCity,
            address: setAddress,
            phone: setPhone,
            celphone: setCelphone,
            whatsapp: setWhatsapp,
            email: setEmail,
            instagram: setInstagram,
            tikTok: setTikTok,
            telegram: setTelegram,
        };

        if (stateUpdaters[name]) {
            stateUpdaters[name](value.trim() === "" ? null : value);
        }
    };

    const onWebsite = e => {
        var tx = e.target.value
        var x = tx.trim()
        var y1 = x.replace('www.', '')
        var y2 = y1.replace('https://', '')
        var y3 = y2.replace('http://', '')
        setWebsite(x)
        setWebsiteY(y3)
    };

    const onFacebook = e => {
        var tx = e.target.value
        var x = tx.trim()
        var y1 = x.replace('www.', '')
        var y2 = y1.replace('https://', '')
        var y3 = y2.replace('http://', '')
        setFacebook(x)
        setFacebookY(y3)
    };

    const onYoutube = e => {
        var tx = e.target.value
        var x = tx.trim()
        var y1 = x.replace('www.', '')
        var y2 = y1.replace('https://', '')
        var y3 = y2.replace('http://', '')
        setYoutube(x)
        setYoutubeY(y3)
    };

    const onLinkedin = e => {
        var tx = e.target.value
        var x = tx.trim()
        var y1 = x.replace('www.', '')
        var y2 = y1.replace('https://', '')
        var y3 = y2.replace('http://', '')
        setLinkedin(x)
        setLinkedinY(y3)
    };

    const onSave = () => {
        try {
            setAction(true);
            const user = {
                userId: mainUser._id,
                city,
                address,
                phone,
                celphone,
                whatsapp,
                website: websiteY ? websiteY : website,
                email,
                instagram,
                tikTok,
                telegram,
                facebook: facebookY ? facebookY : facebook,
                youtube: youtubeY ? youtubeY : youtube,
                linkedin: linkedinY ? linkedinY : linkedin,
            }
            // console.log(user)
            axios.post(`${serverURL}/userPanel/update`, user)
            .then((res) => {
                delete res.data.password
                props.dispatch(setUserInfo(res.data))
                props.dispatch(setSubUserInfo(res.data))
                setAction(false);
                props.onToggle();
            })
        } catch (error) {
            console.error(error);
        }
    };

    const loader13 = (
        <span
            className='loader-13'
            style={{ fontSize: '10px', margin: rtl ? '20px 10px -20px' : '0px 10px', color: '', transform: rtl ? 'rotate(180deg)' : '' }}
        ></span>
    );

    const titleStyle = {fontSize:'14px', fontWeight:450, textAlign: rtl ? 'right' : 'left'}
    const inputStyle = {width:'100%', fontSize:'14px', marginBottom:'10px', borderRadius:'5px', textAlign:'center', direction:'ltr'}

    const addressConst = (
        <div>
            <div className='d-flex' style={{alignItems:'center'}}>
                <div style={titleStyle}>{setLT.address}</div>
                <h6 style={{margin:'0px', textAlign:rtl ? 'right' : 'left'}}> : {mainUser.country}</h6>
            </div>
            <div className='d-flex' style={{margin:'0px', flexDirection:'column'}}>
                <input className='form-control' value={city} placeholder={setLT.city} style={{fontSize:'14px', margin:'0px 0px 10px', padding:'0px 5px', width:'100%', height:'30px', borderRadius:'5px'}} name="city" onChange={changeHandler}/>
                <textarea
                    className="form-control"
                    value={address}
                    style={{fontSize:'14px', width:'100%', borderRadius:'5px', padding:'5px', textAlign:'justify', fontSize:'15px' }}
                    placeholder={setLT.addressLine2 + ' ...'}
                    name="address"
                    onChange={changeHandler}>
                </textarea>
            </div>
        </div>
    )

    const phoneConst = (
        <div style={{width: '100%', flexDirection:'column', margin:'0px'}}>
            <div className='d-flex' style={{alignItems:'center'}}>
                <div className='center' style={{width:'25px', height:'25px', alignItems:'center', backgroundColor:'#ffffff', padding:'2px', borderRadius:'100px'}}>
                    <MdPhoneInTalk className='' style={{fontSize:'20px', margin:'0px', color:'#6FD454'}}/>
                </div> &nbsp;
                <div style={titleStyle}>{setLT.phoneNumber}</div>
            </div>
            <input className='form-control' value={phone} style={inputStyle} name="phone" onChange={changeHandler}/>
        </div>
    )

    const celphoneConst = (
        <div style={{width: '100%', flexDirection:'column', margin:'0px'}}>
            <div className='d-flex' style={{alignItems:'center'}}>
                <div className='center' style={{width:'25px', height:'25px', alignItems:'center', backgroundColor:'#ffffff', padding:'2px', borderRadius:'100px'}}>
                    <MdPhonelinkRing className='' style={{fontSize:'20px', margin:'0px', color:'#6FD454'}}/>
                </div> &nbsp;
                <div style={titleStyle}>{setLT.mobilePhoneNumber}</div>
            </div>
            <input className='form-control' value={celphone} style={inputStyle} name="celphone" onChange={changeHandler}/>
        </div>
    )

    const whatsappConst = (
        <div style={{width: '100%', flexDirection:'column', margin:'0px'}}>
            <div className='d-flex' style={{alignItems:'center'}}>
                <div className='center' style={{width:'25px', height:'25px', alignItems:'center', backgroundColor:'#ffffff', padding:'2px', borderRadius:'100px'}}>
                    <IoLogoWhatsapp className='' style={{fontSize:'20px', margin:'0px', color:'#6FD454'}}/>
                </div> &nbsp;
                <div style={titleStyle}>{setLT.whatsapp}</div>
            </div>
            <input className='form-control' value={whatsapp} style={inputStyle} name="whatsapp" onChange={changeHandler}/>
        </div>
    )

    const websiteConst = (
        <div style={{width: '100%', flexDirection:'column', margin:'0px'}}>
            <div className='d-flex' style={{alignItems:'center'}}>
                <div className='center' style={{width:'25px', height:'25px', alignItems:'center', backgroundColor:'#ffffff', padding:'2px', borderRadius:'100px'}}>
                    <FaGlobe className='' style={{fontSize:'20px', margin:'0px', color:'brown'}}/>
                </div> &nbsp;
                <div style={titleStyle}>{setLT.website}</div>
            </div>
            <input className='form-control' value={website} placeholder='' style={inputStyle} name="website" onChange={onWebsite}/>
        </div>
    )

    const emailConst = (
        <div style={{width: '100%', flexDirection:'column', margin:'0px'}}>
            <div className='d-flex' style={{alignItems:'center'}}>
                <div className='center' style={{backgroundColor:'', padding:'2px', borderRadius:'0px'}}>
                    <MdEmail className='' style={{fontSize:'20px', margin:'0px', color:'#D54238'}}/>
                </div> &nbsp;
                <div style={titleStyle}>{setLT.email}</div>
            </div>
            <input className='form-control' value={email} placeholder='' style={inputStyle} name="email" onChange={changeHandler}/>
        </div>
    )

    const instagramConst = (
        <div style={{width: '100%', flexDirection:'column', margin:'0px'}}>
            <div className='d-flex' style={{alignItems:'center'}}>
                <div className='center' style={{backgroundColor:'', padding:'2px', borderRadius:'100px'}}>
                    <FaInstagram className='' style={{fontSize:'20px', margin:'0px', borderRadius:'6px', color:'#ffffff', backgroundImage: 'linear-gradient(to right top, #fcac0f, #fd9522, #fa7f30, #f36a3c, #e85647, #e44751, #dd395b, #d42d65, #d12174, #ca1b85, #be1e96, #ae27a8)'}}/>
                </div> &nbsp;
                <div style={titleStyle}>
                    Instagram&nbsp;
                    <span style={{fontSize:'12px', fontWeight:'bold'}}>(Please enter only the Id name without @)</span>
                </div>
            </div>
            <input className='form-control' value={instagram} style={inputStyle} name="instagram" onChange={changeHandler}/>
        </div>
    )

    const tikTokConst = (
        <div style={{width:'100%', flexDirection:'column', margin:'0px'}}>
            <div className='d-flex' style={{alignItems:'center'}}>
                <div className='center' style={{backgroundColor:'', padding:'2px', borderRadius:'100px'}}>
                    <AiFillTikTok className='' style={{fontSize:'25px', margin:'0px', color:'#35141C'}}/>
                </div> &nbsp;
                <div style={titleStyle}>
                    TikTok&nbsp;
                    <span style={{fontSize:'12px', fontWeight:'bold'}}>(Please enter only the Id name without @)</span>
                </div>
            </div>
            <input className='form-control' value={tikTok} style={inputStyle} name="tikTok" onChange={changeHandler}/>
        </div>
    )

    const telegramConst = (
        <div style={{width: '100%', flexDirection:'column', margin:'0px'}}>
            <div className='d-flex' style={{alignItems:'center'}}>
                <div className='center' style={{backgroundColor:'#ffffff', padding:'2px', borderRadius:'100px'}}>
                    <FaTelegram className='' style={{fontSize:'20px', margin:'0px', color:'#56BFE1'}}/>
                </div> &nbsp;
                <div style={titleStyle}>
                    {setLT.telegram}&nbsp;
                    <span style={{fontSize:'12px', fontWeight:'bold'}}>{setLT.telegramText}</span>
                </div>
            </div>
            <input className='form-control' value={telegram} placeholder={setLT.telegramPlaceHolder} style={inputStyle} name="telegram" onChange={changeHandler}/>
        </div>
    )

    const facebookConst = (
        <div style={{width: '100%', flexDirection:'column', margin:'0px'}}>
            <div className='d-flex' style={{alignItems:'center'}}>
                <div className='center' style={{width:'25px', height:'25px', alignItems:'center', backgroundColor:'#ffffff', padding:'2px', borderRadius:'100px'}}>
                    <FaFacebook className='' style={{fontSize:'20px', margin:'0px', color:'#3b5998'}}/>
                </div> &nbsp;
                <div style={titleStyle}>{setLT.facebook}</div>
            </div>
            <input className='form-control' value={facebook} style={inputStyle} name="facebook" onChange={onFacebook}/>
        </div>
    )

    const youtubeConst = (
        <div style={{width: '100%', flexDirection:'column', margin:'0px'}}>
            <div className='d-flex' style={{alignItems:'center'}}>
                <div className='center' style={{width:'25px', height:'25px', alignItems:'center', backgroundColor:'#ffffff00', padding:'2px', borderRadius:'100px'}}>
                    <FaYoutube className='' style={{fontSize:'20px', margin:'0px', color:'#c4302b'}}/>
                </div> &nbsp;
                <div style={titleStyle}>{setLT.youtube}</div>
            </div>
            <input className='form-control' value={youtube} style={inputStyle} name="youtube" onChange={onYoutube}/>
        </div>
    )

    const linkedinConst = (
        <div style={{width: '100%', flexDirection:'column', margin:'0px'}}>
            <div className='d-flex' style={{alignItems:'center'}}>
                <div className='center' style={{width:'25px', height:'25px', alignItems:'center', backgroundColor:'#ffffff00', padding:'2px', borderRadius:'100px'}}>
                    <FaLinkedin className='' style={{fontSize:'20px', margin:'0px', color:'#0e76a8'}}/>
                </div> &nbsp;
                <div style={titleStyle}>{setLT.linkedin}</div>
            </div>
            <input className='form-control' value={linkedin} style={inputStyle} name="linkedin" onChange={onLinkedin}/>
        </div>
    )

    const sectiontTitleStyle={fontSize:'16px', fontWeight:'bold', marginBottom:'5px'}
    const sectiontStyle={marginBottom:'40px', padding:'10px'}
    return (
        <Modal show={props.toggleContactsInfo} onHide={props.onToggle}>
            <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                <Modal.Title>{setLT.contactInfo}</Modal.Title>
                <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={props.onToggle} />
            </Modal.Header>
            <Modal.Body style={{ fontSize: '13px', borderRadius: '10px' }}>
            <div style={sectiontTitleStyle}>{setLT.address ? setLT.address.toUpperCase() : ''}</div>
            <div style={sectiontStyle}>
                {addressConst}
            </div>
            <div style={sectiontTitleStyle}>{setLT.contact ? setLT.contact.toUpperCase() : ''}</div>
            <div style={sectiontStyle}>
                {phoneConst}
                {celphoneConst}
                {whatsappConst}
                {telegramConst}
                {websiteConst}
                {emailConst}
            </div>
            <div style={sectiontTitleStyle}>{setLT.socialMedia ? setLT.socialMedia.toUpperCase() : ''}</div>
            <div style={sectiontStyle}>
                {instagramConst}
                {tikTokConst}
                {facebookConst}
                {youtubeConst}
                {linkedinConst}
            </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='center' style={{ width: '100%' }}>
                    <Button variant="success" style={{minWidth:'100px'}} onClick={onSave}>{action ? loader13 : setLT.save}</Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalContactsInfo;
