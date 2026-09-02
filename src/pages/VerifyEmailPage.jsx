import React, { Component } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAuth } from '../store/slices/authSlice';
import { setUserInfo } from '../store/slices/userSlice';
import { setPageName, setPageTitle } from '../store/slices/pageSlice';
import { setAddress, setSubject } from '../store/slices/appSlice';
import Manager from '../components/Manager';
import siteView from '../modules/siteView';
import { AdsHorizontal } from '../components/GoogleAds';
import { goToWebPage } from '../helper';
import { serverURL, s, googleAds } from '../srcSet';

var w = window.innerWidth

class VerifyEmailPage extends Component {

    state = {
      w: window.innerWidth,
      page: 'Verify Email',
      loading: true,
      success: false,
      error: '',
      user: null,
      countdown: 3
    }

    async componentDidMount() {
      window.scrollTo(0, 0)
      await this.props.dispatch(setPageTitle(`${this.state.page} | ShiningPage`))
      await this.props.dispatch(setPageName('Verify Email'))
      await this.props.dispatch(setSubject('Verify Email'))
      await this.props.dispatch(setAddress({ content:[], fix:this.state.page }))
      siteView(this.props)
      await this.action()
    }

    action = async () => {

        const params = new URLSearchParams(window.location.search);

        const token = params.get('token');

        if (!token) {

            this.setState({
                loading: false,
                error: 'Verification token is missing.'
            });

            return;
        }


        try {

            const res = await axios.get(`${serverURL}/register/verify-email`, { params: { token } });

            if (res.data.success) {

                this.setState({
                    loading: false,
                    success: true,
                    user: res.data.user,
                    countdown: 3
                }, () => {
                    this.startCountdown(res.data.user);
                });
                console.log('success user: ', res.data.user)

                return;
            }

            this.setState({
                loading: false,
                error: res.data.msg || 'Verification failed.'
            });

        } catch (err) {

            console.error('================ VERIFY ERROR ================');
            console.error('status:', err.response?.status);
            console.error('data:', err.response?.data);
            console.error('message:', err.message);
            console.error('===============================================');

            const errorData = err.response?.data;

            this.setState({
                loading: false,
                error: errorData?.msg || 'Email verification failed.',
            });
        }
    };

    startCountdown = (user) => {
        this.setState({ countdown: 3 });
        this.countdownInterval = setInterval(() => {
            this.setState((prevState) => {
                if (prevState.countdown <= 1) {
                    clearInterval(this.countdownInterval);

                    // کدی که باید بعد از رسیدن به 0 اجرا شود
                    this.onToggleUser(user)

                    return { countdown: 0 };
                }

                return {
                    countdown: prevState.countdown - 1
                };
            });
        }, 1000);
    };

    onToggleUser = async (user) => {
      if(!user.username) return;
      await this.props.dispatch(setUserInfo(user))
      await this.props.dispatch(setAuth(true));
      goToWebPage(user)
      window.scrollTo(0, 0);
    }

    render() {
        const {w, loading, success, error, countdown } = this.state;
        const { } = this.props;

        if(loading) return (
            <div className="flex justify-center items-center text-white text-center">
                <div>
                  <h2>Verifying your email...</h2>
                  <p>Please wait.</p>
                </div>
            </div>
        );

        if(success) return (
            <div className="flex justify-center items-center text-white text-center p-[20px]">
                <div className='center flex-col'>
                    <h1 className='!mb-[30px]'><span className="gold">Email verified successfully</span> 🎉</h1>
                    <h4 className='font-bold !mb-[30px]'>Welcome to ShiningPage.</h4>
                    <div className='golden-border w-[250px] p-3'>
                      <p className='!mb-[20px]'>Redirecting to your page...</p>
                      <h1 className='goldenText m-0'>{countdown}</h1>
                    </div>
                </div>
            </div>
        );

        const header = (
          <div className="animated fadeInLeft [animation-delay:.5s] text-4xl font-extrabold tracking-tight my-[30px]">
            <span className="purple-blue">
              Verify Email
            </span>
          </div>
        )

        const adsBox = <div className='adsbox'><AdsHorizontal id='adsH1' /></div>

        return (
          <div className='text-[#ffffff] font-thin'>
            {/* {googleAds && adsBox} */}
            <Container>
              <div className='center' style={{flexDirection:'column', alignItems:'center'}}>
                {header}
              </div>
              <div className="flex justify-center items-center text-white text-center p-5">
                  <div>
                      <h1 className="text-[#ff4d6d]">Verification failed</h1>
                      <p>{error}</p>
                  </div>
              </div>
            </Container>
            {/* {googleAds && adsBox} */}
          </div>
        )

    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.user.userInfo['_id'],
        mainUser: state.user.userInfo,
        rtl: state.app.rtl,
        lang: state.app.lang,
        geo: state.app.geo,
        subject: state.app.subject,
        setLT: state.app.setLT,
        seenStatus: state.app.seenStatus,
    }
  }
  export default connect (mapStateToProps)(VerifyEmailPage);
