import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { setToggleViewStatus, setRubyBlock } from '../../dataStore/actions';
import male from '../../assets/images/other/man2.png';
import female from '../../assets/images/other/woman2.png';
import rubyS from '../../assets/images/other/rubyS.png';
import { FaCheckCircle } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ImBlocked } from "react-icons/im";
import { shuffleArray, getRemainingTime, exist } from '../../helper';
import { serverURL } from '../../srcSet';

class ModalViewStatus extends Component {
    state = {
        width: document.body.clientWidth,
        pageTimer: { countdown: null, text: '' },
        rubyTimer: { countdown: null, text: '' },
        allBusiness: [],
        allPS: [],
        loadingBusiness: false,
        loadingPS: false,
    };

    pageInterval = null;
    rubyInterval = null;

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.initTimers();
        this.getAllBusiness()
        this.getPS()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        clearInterval(this.pageInterval);
        clearInterval(this.rubyInterval);
    }

    handleResize = () => {
        this.setState({ width: document.body.clientWidth });
    };

    initTimers = () => {
        const { pageRubyTime, rubyInterval } = this.props;

        if (pageRubyTime?.includes(':')) {
            const seconds = this.timeStringToSeconds(pageRubyTime.split(' ')[0]);
            this.setState({ pageTimer: { countdown: seconds, text: pageRubyTime } }, this.startPageTimer);
        }

        const remainingTime = getRemainingTime(rubyInterval.dateTime);
        if (remainingTime?.includes(':')) {
            const seconds = this.timeStringToSeconds(remainingTime.split(' ')[0]);
            this.setState({ rubyTimer: { countdown: seconds, text: remainingTime } }, this.startRubyTimer);
        }
    };

    timeStringToSeconds = (timeStr) => {
        const [h, m, s] = timeStr.split(':').map(Number);
        return h * 3600 + m * 60 + s;
    };

    secondsToTimeString = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    startPageTimer = () => {
        this.pageInterval = setInterval(() => {
            this.setState((prevState) => {
                const countdown = prevState.pageTimer.countdown - 1;
                if (countdown <= 0) {
                    clearInterval(this.pageInterval);
                    this.props.dispatch(setRubyBlock(false));
                    this.onCloseModal();
                    return { pageTimer: { countdown: 0, text: '00:00:00' } };
                }
                return { pageTimer: { countdown, text: this.secondsToTimeString(countdown) } };
            });
        }, 1000);
    };

    startRubyTimer = () => {
        this.rubyInterval = setInterval(() => {
            this.setState((prevState) => {
                const countdown = prevState.rubyTimer.countdown - 1;
                if (countdown <= 0) {
                    clearInterval(this.rubyInterval);
                    return { rubyTimer: { countdown: 0, text: '00:00:00' } };
                }
                return { rubyTimer: { countdown, text: this.secondsToTimeString(countdown) } };
            });
        }, 1000);
    };

    onCloseModal = () => {
        this.props.dispatch(setToggleViewStatus({ toggle: false, page: true }));
    };

    getAllBusiness = () => {
        this.setState({
            loadingBusiness:true,
        })

        axios.get(`${serverURL}/user/allCompany`).then(async res => {
            // console.log('users: ', res.data)
            var users = res.data
            var seenStatus = this.props.seenStatus
            for(var i=0; i<users.length; i++) {
                delete users[i].password
            }

            const now = new Date();
            const filteredUsers = users.filter(user => {
                const status = seenStatus.find(
                    s => s.page === user.username && new Date(s.nextAllowedTime) > now
                );
                return !status; // اگر پیدا نشد یا زمان گذشته بود، نگه دار
            });

            const shuffleUsers =  shuffleArray(filteredUsers);

            // console.log('filteredUsers: ', filteredUsers);

            await this.mapBusiness(shuffleUsers)
            // console.log(res.data)
            this.setState({
                loadingBusiness:false,
            })
        })
    }

    mapBusiness = async (data) => {
        const {w, } = this.state
        const {lang, rtl, setLT} = this.props
          var allBusiness = await data.map(
            (item, i) => {
                const root = item.businessType>0 ? 'publisher' : 'user'
                const usernameX = item.bizName ? item.bizName : item.username
                const userImg = (
                    <div className={`C${item.fc}`} style={{width:"35px", height:"35px", borderRadius: item.businessType>0 ? '3px' : '100px', border:'1px solid #99999940', padding:'1px', overflow:'hidden'}}>
                        <img
                            style={{objectFit: 'cover', width:'100%', height:'100%'}}
                            src={ exist(item.profileIndex)
                                ? `https://www.pix.shiningpage.com/whoraly/profile/big/${item._id}-${item.profileIndex}.jpeg`
                                : item.genderValue===0 ? female : male
                            }
                            alt={usernameX}
                        />
                    </div>
                )
                const country = (
                    <div className='d-flex' style={{alignItems:'center', height:'20px'}}>
                        <div className={`flag-icon flag-icon-${item.countryCode ? item.countryCode.toLowerCase() : ''}`} style={{border:'1px solid #99999950', fontSize:'17px'}}></div>&nbsp;
                        <div style={{fontSize:'12px', marginTop:'4px', lineHeight:'20px'}}>{item.country ? item.country.toUpperCase() : ''}</div>
                    </div>
                )
                const username = (
                    <div className='' style={{margin:'0px', lineHeight:'20px'}}>
                        {usernameX}
                    </div>
                )
    
                const jobSummary = (
                    <div className='' style={{margin:'0px', lineHeight:'20px'}}>
                        {item.jobSummary}
                    </div>
                )
    
                const link = (
                    <a className='d-flex' href={`/${root}/${item.username}`}>
                        <span style={{direction:'ltr'}}>{`https://shiningpage.com/publisher/${item.username}`}</span>
                    </a>
                )

                return (
                    <div key={i} style={{marginBottom:'20px', fontSize:'14px', overflow:'hidden'}}>
                        <div className='d-flex'>
                            {userImg}&nbsp;&nbsp;
                            <div>
                                {country}
                                {username}
                            </div>
                        </div>
                        {jobSummary}
                        {link}
                    </div>
                )
            }
        )

        this.setState({ allBusiness })
    }

    getPS = async () => {
        this.setState({
            loadingPS:true,
        })
        await axios.post(`${serverURL}/ads/getAllAds`).then(async res => {
            var ps = res.data
            var seenStatus = this.props.seenStatus
            // console.log(888, ps)

            const now = new Date();
            const filteredPS = ps.filter(item => {
                const status = seenStatus.find(
                    s => s.page === item._id && new Date(s.nextAllowedTime) > now
                );
                return !status; // اگر پیدا نشد یا زمان گذشته بود، نگه دار
            });

            const shufflePS =  shuffleArray(filteredPS);

            this.mapPS(shufflePS)
        })

        this.setState({
            loadingPS:false,
        })
    }

    mapPS = (data) => {
        const {w, } = this.state
        const {lang, rtl, setLT} = this.props
          var allPS = data.map(
            (item, i) => {
                // console.log(item.username)
                const root = item.businessType>0 ? 'publisher' : 'user'
                const psImg = (
                    <img
                        style={{objectFit: 'cover', width:'35px', height:'35px', borderRadius:'3px'}}
                        src={`https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictureType === 1 ? item.pictures[0] : item.pictures[1]}.jpeg`}
                        alt={item.adsTitle}
                    />
                )
                const title = (
                    <div className='' style={{marginTop:'15px', lineHeight:'20px'}}>
                        {item.adsTitle}
                    </div>
                )
    
                const link = (
                    <a className='d-flex' href={item.slug ? `/publisher/${item.username}/${item.slug}` : `/ps/${item._id}`}>
                        <span style={{direction:'ltr'}}>{item.slug ? `https://shiningpage.com/publisher/${item.username}/${item.slug}` : `https://shiningpage.com/ps/${item._id}`}</span>
                    </a>
                )

                return (
                    <div key={i} style={{marginBottom:'20px', overflow:'hidden'}}>
                        <div className='d-flex'>
                            {psImg}&nbsp;&nbsp;
                            <div>
                                {/* country */}
                                {title}
                            </div>
                        </div>
                        {link}
                    </div>
                )
            }
        )

        this.setState({ allPS })
    }

    onResize = async () => {
        this.setState({ 
            w: document.body.clientWidth
        })
    }

    render() {
        const { rtl, setLT, toggleViewStatus, rubyInterval } = this.props;
        const { pageTimer, rubyTimer, allBusiness, allPS, loadingBusiness, loadingPS } = this.state;
        const rubyDone = rubyInterval.done!==0 && rubyInterval.done >= rubyInterval.ruby ? true : false
        const rubyIcon = <img src={rubyS} alt="ruby" style={{ width: 20, height: 20, objectFit: 'contain' }} />;

        const loader = (
            <div className='center' style={{width:'100%'}}>
                <div className='loader-13' style={{fontSize:'14px', transform: rtl ? 'rotate(180deg)' : ''}}></div>
            </div>
        )

        return (
            <div style={{ fontSize: '14px', direction: rtl ? 'rtl' : 'ltr' }}>
                <Modal.Header className="d-flex justify-content-between modal-header-fixed">
                    <Modal.Title>{setLT.rubyCollectionList}</Modal.Title>
                    <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={this.onCloseModal} />
                </Modal.Header>
                <Modal.Body>
                    {toggleViewStatus.page && (
                        <div>
                            <ImBlocked style={{marginTop:'-4px', fontSize:'18px', color:'red'}}/>&nbsp;
                            {setLT.remainingTimeForPage} {pageTimer.text || '00:00:00'}
                            <div style={{ fontSize: '12px', marginTop: 10 }}>✓ {setLT.collectRubiesMessage}</div>
                            <hr style={{ margin: '20px 0' }} />
                        </div>
                    )}

                    <div style={{marginBottom:'10px'}}>
                        {rubyIcon}&nbsp;
                        { rubyDone && setLT.allRubiesCollected}
                        { !rubyDone &&
                            <span>
                                {setLT.availableRubies}&nbsp;
                                {rubyInterval.done}/{rubyInterval.ruby} 🎉
                            </span>
                        }
                    </div>
                    { rubyDone &&
                        <div>
                            <MdAccessTime style={{margin:'-4px 1px 0px', fontSize:'18px'}}/>&nbsp;
                            {setLT.nextCollectionTime}&nbsp;
                            {rubyTimer.text || '00:00:00'}
                        </div>
                    }
                    { !rubyDone && 
                        <div>
                            <MdAccessTime style={{margin:'-4px 1px 0px', fontSize:'18px'}}/>&nbsp;{rubyTimer.text || '00:00:00'}
                            <div style={{ marginTop: 10, fontSize: '12px' }}>✓ {setLT.remainingTimeToCollectRubies}</div>
                            <hr style={{ margin: '20px 0' }} />

                            <FaCheckCircle style={{marginTop:'-4px', fontSize:'20px', color:'#10A653'}}/>&nbsp; {setLT.collectRubiesInAccess}
                            <div style={{ fontSize: '18px', fontWeight: 450, textAlign: 'center', margin: '30px 0' }}>Business Members / Owners</div>
                            {loadingBusiness ? loader : allBusiness}
                            <div style={{ fontSize: '18px', fontWeight: 450, textAlign: 'center', margin: '60px 0 30px' }}>Contents/Products/Services</div>
                            {loadingPS ? loader : allPS}
                        </div>
                    }
                </Modal.Body>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    mainUserId: state.userInfo._id,
    mainUser: state.userInfo,
    userInfo: state.subUserInfo,
    userId: state.subUserInfo._id,
    rtl: state.rtl,
    lang: state.lang,
    geo: state.geo,
    page: state.page,
    setLT: state.setLT,
    fullAccess: state.fullAccess,
    toggleNotificationList: state.toggleNotificationList,
    toggleViewStatus: state.toggleViewStatus,
    pageRubyTime: state.pageRubyTime,
    seenStatus: state.seenStatus,
    rubyInterval: state.rubyInterval,
});

export default connect(mapStateToProps)(ModalViewStatus);
