import React, { Component } from 'react';
import { connect } from 'react-redux';
import EditBtn from '../EditBtn';
import { Container } from 'react-bootstrap';
import googleMapImg from '../../assets/images/other/googleMap.png';
import ModalLocationImage from '../modals/ModalLocationImage';
import ModalContactsInfo from '../modals/ModalContactsInfo';
import ModalGoogleMap from '../modals/ModalGoogleMap';
import { MdLocationOn, MdEmail, MdPhoneInTalk, MdPhonelinkRing } from 'react-icons/md';
import pixSave from '../../modules/pixSave';
import pixDelete from '../../modules/pixDelete';
import pixHandler from '../../modules/pixHandler';
import pixResizer from '../../modules/pixResizer';
import { IoLogoWhatsapp } from 'react-icons/io';
import { FaLinkedin, FaYoutube, FaFacebook, FaGlobe, FaTelegram } from 'react-icons/fa';
import { AiFillInstagram, AiFillTikTok } from 'react-icons/ai';
import RubyCollector from '../RubyCollector';
import { AdsHorizontal } from '../GoogleAds'
import { exist, addNotification } from '../../helper';
import { s, serverURL, colors, googleAds } from '../../srcSet';

class ContactSub extends Component{

    state = {
        w: document.body.clientWidth,
        toggleLocationImage: false,
        toggleContactsInfo: false,
        toggleEditGoogleMap: false,
    }

    componentDidMount = async () => {
        window.addEventListener("resize", this.onResize)
    }

    goToGoogle = (lat, lon) => {
        window.open(`https://maps.google.com/?q=${lat},${lon}&z=15`);
    }

    toggleContactsInfo = () => {
        this.setState({
            toggleContactsInfo: !this.state.toggleContactsInfo,
        });
    }

    toggleGoogleMap = () => {
        this.setState({
            toggleGoogleMap: !this.state.toggleGoogleMap,
        });
    }

    toggleLocationImage = () => {
        this.setState({
            toggleLocationImage: !this.state.toggleLocationImage,
            locationImageArray: [],
        });
    }

    onResize = async () => {
        this.setState({ 
            w: document.body.clientWidth
        })
    }

	render () {
        const {w, toggleLocationImage, toggleContactsInfo, toggleGoogleMap} = this.state
        const {rtl, setLT, me, hr, titleStyle, subUserInfo, fullAccess, mainUser, userId, geo} = this.props
        const { fc, email, phone, celphone, whatsapp, website, telegram, instagram, tikTok, 
            facebook, youtube, linkedin, city, country, address, lat, lon,  } = subUserInfo

        const contactClass = `i${fc}`
        const contactStyle = { fontSize:'23px', margin:'0px' }
        const subStyle = {fontSize:'15px', fontWeight:'', margin: '10px', alignItems:'center', direction: rtl ? 'ltr' : 'ltr'}
        const locationStyle = {objectFit: 'contain', height:'', width:'100%', borderRadius:'3px', border:'0px solid #999999'}
        const socialMediaStyle = {textDecoration:'none', alignItems:'center', color:'#000000'}

        const locationImage = (
            <div className='d-flex' style={{height:'', width:'250px', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                <img
                    className=''
                    style={locationStyle}
                    src={`https://www.pix.shiningpage.com/whoraly/location/big/${subUserInfo._id}-${subUserInfo.locationIndex}.jpeg`}
                    alt={`${subUserInfo.username} location`}
                />
            </div>
        )

        const goGoogleMap = (
            <div className='d-flex' style={{height:'60px', width:'60px', flexDirection:'column', alignItems:'center', justifyContent:'center', margin:'10px 0px'}}>
                <img
                    className=''
                    style={{objectFit: 'contain', height:'60px', width:'60px',
                        borderRadius:'3px', marginTop:'0px', cursor:lat && lon ? 'pointer' : '',
                        filter: lat && lon ? '' : 'grayscale(100%)'}}
                    src={googleMapImg}
                    onClick = {() => lat && lon ? this.goToGoogle(lat, lon) : null}
                    alt='go Google Map'
                />
            </div>
        )

        const phoneSub = (
            <div className='d-flex' style = {subStyle}>
                <MdPhoneInTalk className={contactClass} style={{ ...contactStyle, fontSize:'21px', transform: 'rotate(10deg)' }}/>
                <span style={{margin:'5px 10px 0px', whiteSpace:'nowrap'}}>{phone}</span>
            </div>
        )
    
        const celphoneSub = (
            <div className='d-flex' style = {subStyle}>
                <MdPhonelinkRing className={contactClass} style={ contactStyle }/>
                <span style={{margin:'5px 10px 0px', whiteSpace:'nowrap'}}>{celphone}</span>
            </div>
        )

        const whatsappSub = (
            <div className='d-flex' style = {subStyle}>
                <IoLogoWhatsapp className={contactClass} style={ contactStyle }/>
                <span style={{margin:'5px 10px 0px', whiteSpace:'nowrap'}}>{whatsapp}</span>
            </div>
        )
    
        const websiteSub = (
            <div className='d-flex underline' style = {subStyle}>
                <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" className='d-flex' style={socialMediaStyle}
                    onClick={() => addNotification('website', 'click', fullAccess, mainUser, userId, geo)}>
                    <FaGlobe className={contactClass} style={{ ...contactStyle, fontSize:'21px' }}/>
                    <span style={{margin:'5px 10px 0px', direction:'ltr'}}>{website}</span>
                </a>
            </div>
        )
    
        const emailSub = (
            <div className='d-flex' style = {subStyle}>
                <MdEmail className={contactClass} style={ contactStyle }/>
                <span style={{margin:'5px 10px 0px'}}>{email}</span>
            </div>
        )
    
        const instagramSub = (
            <div className='d-flex underline' style = {subStyle}>
                <a className='d-flex' href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" style={socialMediaStyle}
                    onClick={() => addNotification('instagram', 'click', fullAccess, mainUser, userId, geo)}>
                    <AiFillInstagram className={contactClass} style={{ ...contactStyle, fontSize:'27px', margin:'0px -2px' }}/>
                    <span style={{margin:'5px 10px 0px', direction:'ltr'}}>{instagram}</span>
                </a>
            </div>
        )
    
        const tikTokSub = (
            <div className='d-flex underline' style = {subStyle}>
                <a className='d-flex' href={`https://tiktok.com/@${tikTok}`} target="_blank" rel="noopener noreferrer" style={socialMediaStyle}
                    onClick={() => addNotification('tikTok', 'click', fullAccess, mainUser, userId, geo)}>
                    <AiFillTikTok className={contactClass} style={{ ...contactStyle, fontSize:'27px', margin:'0px -2px' }}/>
                    <span style={{margin:'5px 10px 0px', direction:'ltr'}}>{tikTok}</span>
                </a>
            </div>
        )
    
        const telegramSub = (
            <div className='d-flex underline' style = {subStyle}>
                <a className='d-flex' href={`https://t.me/${telegram}`} target="_blank" rel="noopener noreferrer" style={socialMediaStyle}
                    onClick={() => addNotification('telegram', 'click', fullAccess, mainUser, userId, geo)}>
                    <FaTelegram className={contactClass} style={{ ...contactStyle, fontSize:'24px' }}/>
                    <span style={{margin:'5px 10px 0px', direction:'ltr'}}>{telegram}</span>
                </a>
            </div>
        )

        const facebookSub = (
            <div className='d-flex underline' style = {subStyle}>
                <a className='d-flex' href={`https://${facebook}`} target="_blank" rel="noopener noreferrer" style={socialMediaStyle}
                    onClick={() => addNotification('facebook', 'click', fullAccess, mainUser, userId, geo)}>
                    <FaFacebook className={contactClass} style={ contactStyle }/>
                    <span style={{margin:'5px 10px 0px', direction:'ltr'}}>Facebook</span>
                </a>
            </div>
        )

        const youtubeSub = (
            <div className='d-flex underline' style = {subStyle}>
                <a className='d-flex' href={`https://${youtube}`} target="_blank" rel="noopener noreferrer" style={socialMediaStyle}
                    onClick={() => addNotification('youtube', 'click', fullAccess, mainUser, userId, geo)}>
                    <FaYoutube className={contactClass} style={ contactStyle }/>
                    <span style={{margin:'5px 10px 0px', direction:'ltr'}}>Youtube</span>
                </a>
            </div>
        )

        const linkedinSub = (
            <div className='d-flex underline' style = {subStyle}>
                <a className='d-flex' href={`https://${linkedin}`} target="_blank" rel="noopener noreferrer" style={socialMediaStyle}
                    onClick={() => addNotification('linkedin', 'click', fullAccess, mainUser, userId, geo)}>
                    <FaLinkedin className={contactClass} style={ contactStyle }/>
                    <span style={{margin:'5px 10px 0px', direction:'ltr'}}>Linkedin</span>
                </a>
            </div>
        )

        const addressSub = (
            <div className='' style={{width:'100%', padding:'0px', textAlign:'justify', flexDirection:''}}>
                <div className='d-flex' style={{width:'100%', height:'30px', padding:'0px', marginBottom:'5px', textAlign:'justify', alignItems:'center'}}>
                    <MdLocationOn className={contactClass} style={{ ...contactStyle, fontSize:'27px' }}/>
                    <p style={{fontSize: '15px', margin:'0px'}}>{city}</p>
                    {/* <p style={{fontSize: '15px', margin:'0px'}}>{country}</p> */}
                </div>
                {exist(address) &&
                    <div className={``} style={{width:'100%', padding:'0px', textAlign:'justify', flexDirection:''}}>
                        <p style={{fontSize: '15px', textAlign:rtl ? 'right' : ''}}>{address}</p>
                    </div>
                }
                { subUserInfo.businessType>0 && 
                    <div>
                        <div className='d-flex' style={{width:'100%', padding:me ? '10px' : '', marginTop:'20px', border:me ? '1px solid #99999999' : '', borderRadius:'5px', alignItems:'flex-end', position:'relative'}}>
                            {me && <EditBtn rtl={false} top={10} right={10} onClick={() => this.toggleGoogleMap()}/>}
                            {(me || (lat && lon)) && goGoogleMap}
                            {me && !(lat && lon) && <span style={{margin:'10px'}}>{setLT.setAddressOnGoogleMap}</span>}
                        </div>
                        <div className='d-flex' style={{width:'100%', padding:me ? '10px' : '', marginTop:'20px', border:me ? '1px solid #99999999' : '', borderRadius:'5px', alignItems:'flex-end', position:'relative'}}>
                            {me && <EditBtn rtl={false} top={10} right={10} onClick={() => this.toggleLocationImage()}/>}
                            {me && !subUserInfo.locationIndex && <div className='location' style={{width:'100px', height:'80px', borderRadius:'5px'}}></div>}
                            {me && !subUserInfo.locationIndex && <span style={{margin:'10px'}}>{setLT.setLocationPicture}</span>}
                            {subUserInfo.locationIndex && locationImage}
                        </div>
                    </div>
                }
            </div>
        )

        const modalLocationImage = (
            <ModalLocationImage
                pixDelete={pixDelete}
                pixSave={pixSave}
                pixHandler={pixHandler}
                pixResizer={pixResizer}
                EditBtn={EditBtn}
                exist={exist}
                serverURL={serverURL}
                toggleLocationImage={toggleLocationImage}
                onToggle={this.toggleLocationImage}
            />
        )

        const modalContactsInfo = (
            <ModalContactsInfo
                dispatch={this.props.dispatch}
                EditBtn={EditBtn}
                toggleContactsInfo={toggleContactsInfo}
                onToggle={this.toggleContactsInfo}
                mapStateToProps={this.props}
            />
        )

        const modalGoogleMap = (
            <ModalGoogleMap
                dispatch={this.props.dispatch}
                EditBtn={EditBtn}
                toggleGoogleMap={toggleGoogleMap}
                onToggle={this.toggleGoogleMap}
                mapStateToProps={this.props}
            />
        )

        const adsBox = <div className='adsbox' style={{marginTop:'10px'}}><AdsHorizontal id='adsContact'/></div>

        return (
            <div id='contactSub' style={{padding:'70px 10px', fontWeight:400, backgroundColor:`${colors[`C${fc===11 ? 0 : fc}`]}00`, position:'relative'}}>
                {me && <EditBtn rtl={rtl} onClick={() => this.toggleContactsInfo()}/>}
                <Container className={`center`} style={{fontSize:'14px', alignItems:'flex-start', width:'100%', maxWidth:'1000px', height:'100%', padding:'0px 10px', justifyContent:w>s ? 'space-between' : '', flexDirection:w<s ? 'column' : '', direction:'ltr'}}>
                    <div style={{width:w<s ? '100%' : '33%', padding:w<s ? '20px 0px' : '0px 20px'}}>
                        <div style={{...titleStyle, fontSize:'16px', marginBottom:'3px'}}>{setLT.contact ? setLT.contact.toUpperCase() : ''}</div>
                        {hr}
                        {phone && phoneSub}
                        {celphone && celphoneSub}
                        {whatsapp && whatsappSub}
                        {website && websiteSub}
                        {email && emailSub}
                    </div>
                    <div style={{width:w<s ? '100%' : '33%', padding:w<s ? '20px 0px' : '0px 20px'}}>
                        <div style={{...titleStyle, fontSize:'16px', marginBottom:'3px'}}>{setLT.socialMedia ? setLT.socialMedia.toUpperCase() : ''}</div>
                        {hr}
                        {telegram && telegramSub}
                        {instagram && instagramSub}
                        {tikTok && tikTokSub}
                        {facebook && facebookSub}
                        {youtube && youtubeSub}
                        {linkedin && linkedinSub}
                    </div>
                    <div style={{width:w<s ? '100%' : '33%', padding:w<s ? '20px 0px' : '0px 20px', position:'relative'}}>
                        <div style={{...titleStyle, fontSize:'16px', marginBottom:'0px'}}>{setLT.address ? setLT.address.toUpperCase() : ''}</div>
                        {hr}
                        {addressSub}
                    </div>
                </Container>
                <Container>
                    {me && googleAds && subUserInfo.ads && adsBox}
                </Container>
                {/* <RubyCollector id='adsContact' bottom={5} left={20}/> */}
                {modalLocationImage}
                {modalContactsInfo}
                {modalGoogleMap}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUser: state.userInfo,
        subUserInfo: state.subUserInfo,
        userId: state.subUserInfo._id,
        rtl: state.rtl,
        lang: state.lang,
        geo: state.geo,
        page: state.page,
        setLT: state.setLT,
        fullAccess: state.fullAccess,
    }
}

export default connect (mapStateToProps)(ContactSub);
