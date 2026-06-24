import React, { Component } from 'react';
import axios from 'axios';
import { Col } from "react-bootstrap";
import { connect } from 'react-redux';
import { setSubUserInfo } from '../dataStore/actions'; 
import { HiArrowNarrowLeft } from 'react-icons/hi';

import { serverURL, s } from '../srcSet';

class Manager extends Component{

    state = {
        w: window.innerWidth,
    }

    componentDidMount = async () => {
        window.addEventListener("resize", this.onResize)
        await this.getUserInfo('5dbecb35c9812f0875cf1965')
    }

    getUserInfo = async (userId) => {
        this.setState({loading:true})
        axios.post(`${serverURL}/user/getUserInfo`, { _id: userId }, {})
        .then(async res => {
            delete res.data.password

            var item = res.data
            // console.log(item)
            if(item) this.props.dispatch(setSubUserInfo(item))
            this.setState({loading:false})
        })
    }
    onToggleWebPage = async () => {
        // const username = this.props.subUserInfo.username
        window.open(`/user/mahmoud_sadollahi`);
    }

    onResize = () => {
        this.setState({
            w: window.innerWidth
        })
    }

	render () {
        const {w, loading} = this.state
        const {lang, rtl, setLT, page, subUserInfo} = this.props

        const loaderZ = <div className='loader-02' style={{margin: '0px', color:'#000000', transform: rtl ? 'rotate(180deg)' : ''}}></div>
        const mahmoud = (
            <Col id='mahmoud' md="6" style={{marginTop:'0px', padding:'0px 10px'}}>
              <h6 className="title" style={{fontSize:'20px'}}>{setLT.ownerTitle}</h6>
              <hr/>
              <div className='d-flex' style={{justifyContent:'space-between'}}>
                <div>
                  <img
                      style={{objectFit: 'contain', minWidth:"70px", minHeight:"70px", maxWidth:"70px", maxHeight:"70px", borderRadius:'100px', border:'2px solid #ffffff40', margin:'0px 5px', padding:'2px', cursor:'pointer'}}
                      className={`C14`}
                      src={`https://www.pix.shiningpage.com/whoraly/profile/big/${subUserInfo._id}-${subUserInfo.profileIndex}.jpeg`}
                      alt='Mahmoud Sadollahi'
                      onClick={() => this.onToggleWebPage()}
                  />
                </div>
                <div className='d-flex' style={{flexDirection:'column'}}>
                    <div style={{fontWeight:400}}>MBA + MERN Stack</div>
                    <div style={{fontWeight:400}}>{subUserInfo.jobSummary}</div>
                    <div className='d-flex' style={{alignItems:'center'}}>
                        { loading ? loaderZ : <HiArrowNarrowLeft style={{transform: rtl ? 'scaleX(1)' : 'scaleX(-1)'}}/>}&nbsp;
                        <span className='link-underline' style={{color:'#0057F6'}} onClick={() => this.onToggleWebPage()}>Mahmoud Sadollahi</span>
                    </div>
                </div>
              </div>
            </Col>
        )

        return (
            <div className='d-flex' style={{padding: w<s ? '10px 0px' : '20px 0px', flexDirection:'column'}}>
                {mahmoud}
                <div style={{padding:'30px 10px 0px'}}>
                    <div style={{lineHeight:'25px', borderRadius:'5px', padding:w<s ? '' : '20px', borderRight:'10px', border:'2px solid #ffffff', textAlign: rtl ? 'justify' : 'left', direction: rtl ? 'rtl' : 'ltr'}}>
                        <div style={{ padding: '20px' }}>
                            <p dangerouslySetInnerHTML={{ __html: setLT.aboutIntro }}></p>

                            <h5>{setLT.missionTitle}</h5>
                            <p>{setLT.mission}</p>

                            <h5>{setLT.offeringsTitle}</h5>
                            <ul>
                            {[
                                "<strong style='font-weight: 450;'>Customizable Profile Pages</strong>: Each individual or organization can have a unique page to showcase their services, products, skills, or mission.",
                                "<strong style='font-weight: 450;'>Global Accessibility</strong>: With support for multiple languages, including English, Arabic, and Persian, ShiningPage ensures that users can connect with audiences worldwide.",
                                "<strong style='font-weight: 450;'>Easy Management</strong>: Users can manage their information directly through their ShiningPage profile. Once logged in, settings for information and communication are easily accessible. This feature allows users to update their details, manage requests, and interact seamlessly.",
                                "<strong style='font-weight: 450;'>Search Engine Visibility (SEO)</strong>: ShiningPage profiles are indexed by Google and other search engines, making it easier for others to find you.",
                                "<strong style='font-weight: 450;'>Built-in Communication Tools</strong>: Receive notifications, chat with other users, and connect directly through the platform."
                            ].map((item, index) => (
                                <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                            </ul>
                        
                            <h5>{setLT.whyChooseUsTitle}</h5>
                            <p>{setLT.whyChooseUsText}</p>
                        
                            <h5>{setLT.commitmentTitle}</h5>
                            <p>{setLT.commitment}</p>
                        
                            <h5>{setLT.joinUsTitle}</h5>
                            <p dangerouslySetInnerHTML={{ __html: setLT.joinUs }}></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        subUserInfo: state.subUserInfo,
        lang: state.lang,
        rtl: state.rtl,
        page: state.page,
        setLT: state.setLT,
    }
}

export default connect (mapStateToProps)(Manager);
