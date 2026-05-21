import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Container, CardBody } from 'react-bootstrap';
import userN from '../assets/images/other/user1.png';
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';
import rubyS from '../assets/images/other/rubyS.png';
import rubyB from '../assets/images/other/rubyB.png';
import { connect } from 'react-redux';
import { setAddress, setCountry, setSubject, setPageTitle,
    setPageName, setPage, setUserInfo, setAuth, setFullAccess} from '../dataStore/actions';
import siteView from '../modules/siteView';
import { FaInstagram } from 'react-icons/fa';
import { IoIosWarning } from "react-icons/io";
import { BiSolidCategory } from 'react-icons/bi';
import { GrAttachment } from 'react-icons/gr';
import { FcStackOfPhotos } from "react-icons/fc";
import { AdsHorizontal } from '../components/GoogleAds';
import { exist, checkSeen } from '../helper';
import { serverURL, s, googleAds } from '../srcSet';

const rubySmall = (
    <img
        className=''
        style={{objectFit:'contain', width:'20px', height:'20px', margin:'0px 5px'}}
        src={rubyS}
        alt="ruby"
    />
)

class RubyPage extends Component {

    state = {
        w: document.body.clientWidth,
        pageName: 'Ruby',
        rubyShare: 0.1,
    }

    componentDidMount = async () => {
        window.scrollTo(0, 0)
        window.addEventListener("resize", this.onResize)
        await this.props.dispatch(setPageTitle(`${this.state.pageName} | ShiningPage`))
        await this.props.dispatch(setPage('ruby'))
        await this.props.dispatch(setSubject('ruby'))
        await this.props.dispatch(setAddress({ content:[], fix:this.state.pageName }))
        // if(this.props.auth && this.props.mainUser.ruby) checkSeen('ruby', this.props.seenStatus, this.props.dispatch)
        siteView(this.props)
        this.getSubRuby()
    }

    getSubRuby = () => {
        // console.log(1111, this.props.mainUserId)
        axios.post(`${serverURL}/ruby/getSubUserRuby` , {userId: this.props.mainUserId}).then(res => {
            const data = res.data
            const updatedData = data.map(item => ({
                ...item,
                rubyShareAmount: (item.totalRuby * this.state.rubyShare).toFixed(3)
            }));

            const totalRubyShareAmount = updatedData.reduce((sum, item) => sum + Number(item.rubyShareAmount), 0).toFixed(3);
            // console.log('totalRubyShareAmount: ', totalRubyShareAmount)
            this.setState({
                totalShareRuby: Number(totalRubyShareAmount),
                totalUserRuby: (Number(this.props.ruby) + Number(totalRubyShareAmount)).toFixed(3),
            });

            // console.log('subRuby: ', updatedData)
            this.mapSubRuby(updatedData)
        })
    }

    mapSubRuby = (data) => {
        const { w } = this.state
        const { lang } = this.props
        var subRuby = data.map(
            (item, i) => {
                const root = item.businessType>0 ? 'publisher' : 'user'
                const img = (
                    <Link to={exist(item.username) ? `/${root}/${item.username}` : `/login`} style={{ zIndex:'1' }}>
                        <img
                            className={`btnShadow C${item.fc}`}
                            style={{objectFit: 'cover', width:'45px', height:'45px', borderRadius:item.businessType>0 ? '3px' : '100px', padding:'2px'}}
                            src={exist(item.profileIndex)
                                ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item.userId}-${item.profileIndex}.jpeg`
                                : item.genderValue===0 ? female : male
                            }
                            alt={item.username}
                        />
                    </Link>
                )
                const userRuby = (
                    <div className='d-flex' style={{position:'absolute', left: w<s ? 160 : 230}}>
                        {item.rubyShareAmount}
                        {rubySmall}
                    </div>
                )

                const username = (
                    <div className='d-flex' style={{position:'absolute', top:5, left:50, whiteSpace:'nowrap'}}>
                        {item.bizName ? item.bizName : item.username}
                    </div>
                )

                return (
                    <div key={i} style={{ width:w<s ? '180px' : '250px', height:i===0 ? '50px' : '80px', marginBottom:'-10px', borderLeft:'1px solid #ffffff', borderBottom:'1px solid #ffffff', borderRadius:'0px 0px 0px 10px', position:'relative' }}>
                        <div className='d-flex' style={{ alignItems:'center', position:'absolute', bottom:-23, left:30 }}>
                            {img}
                            {username}
                            {userRuby}
                        </div>
                    </div>
                )
            }
        )

        this.setState({
            subRuby
        })
    }

    render() {
        const { w, subRuby, totalUserRuby, totalRubyShareAmount } = this.state;
        const {auth, rtl, lang, setLT, country, mainUser, ruby} = this.props;
        const root = mainUser.businessType>0 ? 'publisher' : 'user'

        const userImage = (
            <Link to={exist(mainUser.username) ? `/${root}/${mainUser.username}` : `/login`}>
                <img
                    className={`btnShadow C${mainUser.fc}`}
                    style={{objectFit: 'cover', width:'45px', height:'45px', borderRadius:mainUser.businessType>0 ? '3px' : '100px', padding:'2px'}}
                    src={!auth
                        ? userN
                        : exist(mainUser.profileIndex)
                            ? `https://www.pix.shiningpage.com/whoraly/profile/small/${mainUser._id}-${mainUser.profileIndex}.jpeg`
                            : mainUser.genderValue===0 ? female : male
                    }
                    alt={mainUser.username}
                />
            </Link>
        )

        const header = (
            <div className='center' style={{alignItems:'center', flexDirection:'column', padding: '0px 10px'}}>
                <div className='d-flex' style={{justifyContent:rtl ? 'space-between' : 'flex-end', alignItems:'center', width:'100%', direction:'rtl'}}>
                    <h1 className='animated fadeInLeft tx' style={{animationDelay:'.5s', color:'#ffffff', fontWeight:'bold', fontSize: w<s ? '30px' : '', textAlign:'center', margin:'30px 10px'}}>{setLT.ruby}</h1>
                </div>
            </div>
        )
        
        const rubyBig = (
            <div className={`center animated fadeInUpX`} style={{width:'100%', margin:'20px 0px', alignItems:'center'}}>
                <img
                      className=''
                      style={{height:'', width:'130px'}}
                      src={rubyB}
                      alt='ruby'
                />
            </div>
        )

        const warning = (
            <div style={{width:'100%', color:'#ffffff', marginBottom:'30px', padding:'10px', borderRadius:'10px', border:'1px solid #ffffff'}}>
                <span style={{fontSize:'14px', fontWeight:'bold'}}>
                    <span><IoIosWarning style={{fontSize:'22px', color:'#ffcc00'}}/></span>&nbsp;
                    {setLT.rubyWarning}
                </span>
                <div>
                    {setLT.rubyWarningText}
                </div>
            </div>
		)

        const category = (
            <div className={`d-flex`} style={{marginBottom:'10px', alignItems:'center'}}>
                <BiSolidCategory style={{width:'25px', height:'25px', margin:'0px 5px'}}/>
                <span style={{fontWeight:'bold'}}>{setLT.category}:</span>
                <div style={{margin:'0px 10px', direction:'ltr'}}>
                    5
                    {rubySmall}
                </div>
                {setLT.perUnit}
            </div>
        )

        const ads = (
            <div className={`d-flex`} style={{marginBottom:'10px', alignItems:'center'}}>
                <FcStackOfPhotos style={{width:'30px', height:'30px', margin:'0px 5px'}} />
                <span style={{fontWeight:'bold'}}>{setLT.ProductsServices}:</span>
                <div style={{margin:'0px 10px', direction:'ltr'}}>
                    3
                    {rubySmall}
                </div>
                {setLT.perUnit}
            </div>
        )

        const video = (
            <div className={`d-flex`} style={{marginBottom:'10px', alignItems:'center'}}>
                <img
                    style={{width:'25px', height:'25px', margin:'0px 5px'}}
                    src={require(`../assets/images/other/video.png`)}
                    alt="video icon"
                />
                <span style={{fontWeight:'bold'}}>{setLT.userVideos}:</span>
                <div style={{margin:'0px 10px', direction:'ltr'}}>
                    1
                    {rubySmall}
                </div>
                {setLT.perUnit}
            </div>
        )

        const insta = (
            <div className={`d-flex`} style={{marginBottom:'10px', alignItems:'center'}}>
                <FaInstagram className='' style={{fontSize:'25px', margin:'0px 5px', borderRadius:'8px', color:'#ffffff', backgroundImage: 'linear-gradient(to right top, #fcac0f, #fd9522, #fa7f30, #f36a3c, #e85647, #e44751, #dd395b, #d42d65, #d12174, #ca1b85, #be1e96, #ae27a8)'}}/>
                <span style={{fontWeight:'bold'}}>{setLT.instagram}:</span>
                <div style={{margin:'0px 10px', direction:'ltr'}}>
                    1
                    {rubySmall}
                </div>
                {setLT.perUnit}
            </div>
        )

        const attachment = (
            <div className={`d-flex`} style={{marginBottom:'10px', alignItems:'center'}}>
                <img
                    style={{width:'25px', height:'25px', margin:'0px 5px'}}
                    src={require(`../assets/images/file/attachIco.png`)}
                    alt="video icon"
                />
                <span style={{fontWeight:'bold'}}>{setLT.attachments}:</span>
                <div style={{margin:'0px 10px', direction:'ltr'}}>
                    2
                    {rubySmall}
                </div>
                {setLT.perMB}
            </div>
        )

        const priceList = (
            <div style={{width:'100%', color:'#ffffff', marginBottom:'30px', padding:'10px', borderRadius:'10px', border:'1px solid #ffffff'}}>
                <div style={{fontWeight:450, marginBottom:'15px'}}>{setLT.rubiesForExpansion}</div>
                {category}
                {ads}
                {video}
                {insta}
                {attachment}
            </div>
        )

        const userRuby = (
            <div className='d-flex'>
                {ruby}
                {rubySmall}
            </div>
        )

        const user = (
            <div className='d-flex' style={{ alignItems:'center' }}>
                {userImage}
                <hr style={{ width:w<s ? '157px' : '227px', height:'1px', marginRight:'10px', backgroundColor:'#ffffff', opacity:'1' }}/>
                {userRuby}
            </div>
        )

        const subUser = (
            <div style={{ margin:'0px 22px 50px'}}>
                {subRuby}
            </div>
        )

        const totalRuby = (
            <div className='d-flex' style={{direction:'ltr'}}>
                {totalUserRuby}
                {rubySmall}
            </div>
        )

        const totalRubies = (
            <div style={{width:'100%', color:'#ffffff', marginBottom:'30px', padding:'10px', borderRadius:'10px', border:'1px solid #ffffff'}}>
                <div className='d-flex'>
                    <div style={{ fontWeight:450, marginBottom:'15px' }}>{setLT.yourRubiesSoFar}</div>&nbsp;&nbsp;
                    {totalRuby}
                </div>
                <div style={{direction:'ltr'}}>
                    {user}
                    {subUser}
                </div>
            </div>
        )

        const adsBox1 = <div className='adsbox'><AdsHorizontal id='adsH1' /></div>
        const adsBox2 = <div className='adsbox'><AdsHorizontal id='adsH2' /></div>

        return (
            <div>
                {/* {googleAds && adsBox1} */}
                <Container>
                    <div className='center' style={{flexDirection:'column', alignItems:'center'}}>
                        {header}
                    </div>
                    {rubyBig}
                    {warning}
                    {priceList}
                    {totalRubies}
                </Container>
                {googleAds && adsBox2}
            </div>
        )
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
        ruby: state.ruby,
        seenStatus: state.seenStatus,
    }
  }
  export default connect (mapStateToProps)(RubyPage);
