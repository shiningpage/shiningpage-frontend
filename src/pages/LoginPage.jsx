import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Container, CardBody } from 'react-bootstrap';
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';
import ReCAPTCHA from "react-google-recaptcha";
import { connect } from 'react-redux';
import { setAddress, setCountry, setSubject, setPageTitle,
    setPageName, setPage, setUserInfo, setAuth, setFullAccess,
    setBalance, setRuby, setRubyInterval, } from '../dataStore/actions';
import toFarsi from '../modules/toFarsi';
import CountrySelector from '../components/CountrySelector';
import siteView from '../modules/siteView';
import { FaRegEye, FaRegEyeSlash, FaUser, FaLock, FaShieldAlt, FaBolt,
  FaStar, FaGlobe, } from "react-icons/fa";
import { exist, checkSeen } from '../helper';
import { serverURL, s } from '../srcSet';

var w = window.innerWidth

const membershipOptions = [
    { value: 0},
    { value: 1},
];

class LoginPage extends Component {

    state = {
        genderTitleL: this.props.setLT.gender,
        membershipTitleL: 'Membership Type',
        registerType: false,
        loginType: true,
        passwordView: false,
        username: '',
        password: '',
        email: '',
        genderValue: '',
        membershipOption: '',
        toggleEye: false,
}

    componentDidMount = async () => {
        window.scrollTo(0, 0)
        await this.props.dispatch(setPageName(this.props.setLT.signupLogin))
        await this.props.dispatch(setPageTitle(`${this.props.pageName} | ShiningPage`))
        await this.props.dispatch(setPage('login'))
        await this.props.dispatch(setSubject('login'))
        await this.props.dispatch(setAddress({ content:[], fix:this.props.pageName }))

        // if(this.props.auth && this.props.mainUser.ruby) checkSeen('login', this.props.seenStatus, this.props.dispatch)
        siteView(this.props)
        membershipOptions[0].label = 'Normal - Access to typical features'
        membershipOptions[1].label = 'Business - Access to special features and insert ads'
    }

    logout = () => {
        localStorage.removeItem('jwtToken');
        this.props.dispatch(setPage(''))
        this.props.dispatch(setAuth(false))
        this.props.dispatch(setFullAccess(false))
        this.props.dispatch(setUserInfo([]))
        this.props.dispatch(setCountry({}))
        this.props.dispatch(setBalance('0.00'))
        this.props.dispatch(setRuby('0.00'))
        this.props.dispatch(setRubyInterval({ ruby:0, done:0, dateTime:'' }))
        window.scrollTo(0, 0);
        window.location.reload();
        window.location.href = `/login`;
    }

    changeHandler = e => {
        var tx = e.target.value
        this.setState({ ...this.state, [e.target.name]: tx.toLowerCase().replace(/\s/g, '') });
    };

    passwordHandler = e => {
        var tx = e.target.value
        this.setState({ ...this.state, [e.target.name]: tx.replace(/\s/g, '') });
    };

    usernameHandler = e => {
        var tx = e.target.value
        var char = [
            'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
            'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
            '0','1','2','3','4','5','6','7','8','9',
            '_'
        ]
        if(tx.length<=20) {
            for(var i=0; i<tx.length; i++) {
                // console.log(tx[i].toString())
                if( !char.includes(tx[i]) ) {
                    // console.log(true)
                    var tx = tx.replace(tx[i].toString(), '')
                }
            }
            this.setState({ username: tx.toLowerCase().replace(/\s/g, '') });
        }
    };

    handlePasswordView = () => {
        this.setState({
            passwordView: !this.state.passwordView
        })
    }

    onRecaptchaChange = (value) => {
        this.setState({ recaptchaValue: value })
    }

    checkRegisterNull = () => {
        var infoErr = {}
        if(this.state.genderValue==='') infoErr.genderErr = this.props.setLT.genderErr
        // if(!this.state.fc) infoErr.fcErr = this.props.setLT.fcErr
        if(!this.props.country.countryCode) infoErr.countryErr = this.props.setLT.countryErr
        if(!this.state.username) {
            infoErr.usernameErr = this.props.setLT.usernameNullErr
        } else if(this.state.username.length<3) {
            infoErr.usernameErr = this.props.setLT.usernameCharErr
        }
        if(this.state.password.trim()==='') infoErr.passwordErr = this.props.setLT.passwordErr
        if(!this.state.recaptchaValue) infoErr.recaptchaErr = this.props.setLT.recaptchaErr

        return infoErr
    }

    onRegister = async () => {
        var infoErr = this.checkRegisterNull()
        if(Object.keys(infoErr).length>0) {
            this.setState({
                genderErr: infoErr.genderErr,
                countryErr: infoErr.countryErr,
                fcErr: infoErr.fcErr,
                usernameErr: infoErr.usernameErr,
                passwordErr: infoErr.passwordErr,
                recaptchaErr: infoErr.recaptchaErr,
            })
        } else {
            const user = {
                userId: this.props.userId,
                lang: this.props.lang,
                username: this.state.username,
                fc: 11,//this.state.fc,
                continent: this.props.country.continent,
                country: this.props.country.country,
                countryCode: this.props.country.countryCode,
                password: this.state.password,
                recaptchaValue: this.state.recaptchaValue,
                genderValue: this.state.genderValue,
                businessType: 0,
                userType : 1,
            }
            console.log(user.genderValue)
            axios.post(`${serverURL}/register/register`, user).then(async (res) => {
                if(res.data.msg==='Registration failed. Username is already exist.') {
                    this.setState({
                        signedInUserErr: this.props.setLT.signedInUserErr,
                        usernameErr: "",
                        passwordErr: "",
                        genderErr: "",
                        fcErr: "",
                        recaptchaErr: ""
                    });
                } else {
                    delete res.data.user.password
                    await this.props.dispatch(setUserInfo(res.data.user))
                    await this.props.dispatch(setAuth(true))

                    this.setState({
                        signedInUserErr: "",
                        usernameErr: "",
                        passwordErr: "",
                        genderErr: "",
                        fcErr: "",
                        recaptchaErr: ""
                    });
                    window.scrollTo(0, 0);
                    window.location.href = `/user/${this.props.username}`
                }

            })
        }
    }

    checkLoginNull = () => {
        var infoErr = {}
        if(!this.state.username) {
            infoErr.usernameErr = this.props.setLT.usernameNullErr
        } else if(this.state.username.length<3) {
            infoErr.usernameErr = this.props.setLT.usernameCharErr
        }
        if(this.state.password.trim()==='') infoErr.passwordErr = this.props.setLT.passwordErr
        if(!this.state.recaptchaValue) infoErr.recaptchaErr = this.props.setLT.recaptchaErr

        return infoErr
    }

    onLogin = async() => {
        var infoErr = this.checkLoginNull()
        if(Object.keys(infoErr).length>0) {
            this.setState({
                genderErr: infoErr.genderErr,
                countryErr: infoErr.countryErr,
                fcErr: infoErr.fcErr,
                usernameErr: infoErr.usernameErr,
                passwordErr: infoErr.passwordErr,
                recaptchaErr: infoErr.recaptchaErr,
            })
        } else {
            const loginInfo = {
                page:'login',
                username:this.state.username, 
                password:this.state.password,
            }
            axios.post(`${serverURL}/login/login`, loginInfo).then(async(result) => {
                if(result.data==='User not found') {
                    this.setState({
                        userPassErr: this.props.setLT.userPassErr,
                        passwordErr:'',
                        recaptchaErr: ""
                    });
                } else if(result.data==='Wrong password') {
                    this.setState({
                        userPassErr: this.props.setLT.userPassErr,
                        passwordErr: this.state.passwordNotOK,
                        usernameErr: '',
                        recaptchaErr: ""
                    });
                } else {
                    this.setState({
                        usernameErr: '',
                        passwordErr:'',
                        recaptchaErr: ""
                    });

                    // console.log(result.data.user)
                    delete result.data.user.password
                    await this.props.dispatch(setUserInfo(result.data.user))
                    // await this.props.dispatch(token(result.data.token))
                    await this.props.dispatch(setAuth(true))
                    if(this.props.userId==='607e9088bede482040af3574') await this.props.dispatch(setFullAccess(true))
                    // this.props.history.push(`/`)

                    const root = this.props.businessType>0 ? 'publisher' : 'user'
                    window.location.href = `/${root}/${this.props.username}`
                    // window.scrollTo(0, 0);
                }
            })
        }
    }

    onRegisterX = () => {
        this.setState({
            registerType: true,
            loginType: false,
            userPassErr: "",
        })
    }

    onLoginX = () => {
        this.setState({
            loginType: true,
            registerType: false,
        })
    }

    favoriteTheme = (x) => {
        this.setState({ fc : x })
    }
    
    onToggleEye = () => {
        this.setState({
            toggleEye: !this.state.toggleEye,
        })
    }

    onGender = (x) => {
        this.setState({
            genderValue: x
        })
    }

    render() {
        const {fc, toggleEye, userPassErr, signedInUserErr, registerType, loginType, username, email, password,
                usernameErr, emailErrors, recaptchaErr, passwordErr, genderErr, fcErr, countryErr,
                genderValue, membershipOption, emailL, genderTitleL, membershipTitleL, 
            } = this.state;

        const {auth, lang, setLT, country, mainUser} = this.props;

        window.recaptchaOptions = {
            lang: lang,
            useRecaptchaNet: true,
            removeOnUnmount: false,
        };

        const genderConst = (
            <div>
                <label className="block mb-2 font-medium">
                    Gender
                </label>
                <div className='center animated fadeIn' style={{marginBottom:'50px', gap:'10px'}}>
                    <div className="radio" style={{width:'100%', padding:w<400 ? '6px 10px' : '6px 20px', border:`1px solid ${genderValue===1 ? '#6D3EE3' : '#E1E4EC50'}`, borderRadius:'8px', backgroundColor:`${genderValue===1 ? '#6D3EE330' : ''}`, cursor:'pointer'}} onClick={() => this.onGender(1)}>
                        <label className='' style={{margin:'0px', alignItems:'center', flexWrap:'wrap', cursor:'pointer'}}>
                            <div className='d-flex' style={{alignItems:'center', gap:w<350 ? '5px' : '10px'}}>
                                <input type="radio" value="option2" checked={genderValue===1 ? true : false} style={{cursor:'pointer'}} onChange={() => null} />
                                <img src={male} alt="male" style={{filter: genderValue===1 ? '' : 'grayscale(100%)', objectFit: 'contain', borderRadius:'100px', width:'35px', height:'35px'}} />
                                <span style={{marginTop:'5px'}}>Male</span>
                            </div>
                        </label>
                    </div>
                    <div className="radio" style={{width:'100%', padding:w<400 ? '6px 10px' : '6px 20px', border:`1px solid ${genderValue===0 ? '#6D3EE3' : '#E1E4EC50'}`, borderRadius:'8px', backgroundColor:`${genderValue===0 ? '#6D3EE330' : ''}`, cursor:'pointer'}} onClick={() => this.onGender(0)}>
                        <label className='' style={{margin:'0px', alignItems:'center', flexWrap:'wrap', cursor:'pointer'}}>
                            <div className='d-flex' style={{alignItems:'center', gap:w<350 ? '5px' : '10px'}}>
                                <input type="radio" value="option3" checked={genderValue===0 ? true : false} style={{cursor:'pointer'}} onChange={() => null} />
                                <img className='' src={female} alt="female" style={{filter: genderValue===0 ? '' : 'grayscale(100%)', objectFit: 'contain', borderRadius:'100px', width:'35px', height:'35px'}} />
                                <span style={{marginTop:'5px'}}>Female</span>
                            </div>
                        </label>
                    </div>
                </div>
                <span className='invalid-feedback' style={{ marginTop: '-40px', display: genderErr ? 'block' : 'none'}}>
                    {genderErr}
                </span>
            </div>
        )

        const cStyle = { height: '40px', width: '40px', margin: '5px', borderRadius: '5px' };
        const buttons = [];
        
        for (let i = 0; i < 17; i++) {
            if(i!==15) {
                buttons.push(
                    <div
                        key={`C${i}`}
                        className={`C${i} btnShadow waves-effect waves-light btn-large`}
                        style={cStyle}
                        onClick={() => this.favoriteTheme(i)}
                    ></div>
                );
            }
        }
    
        const scFc = (<div className = {`C${fc} cardShadow`} style={cStyle}></div>)

        const themeConst = (
            <div className='animated fadeIn' style={{animationDelay:'.4s', margin: '0px 0px 30px'}}>
                <div className='d-flex' style={{alignItems:'center'}}>
                    {setLT.favoriteTheme}&nbsp;
                    {scFc}
                </div>
                <div className='d-flex ' style={{width:'100%', margin: '0px 0px 0px', padding:'0px', borderRadius:'5px', flexWrap:'wrap'}}>
                    {buttons}
                </div>
                <span className='invalid-feedback' style={{ margin: '10px 0px 0px 0px', display: fcErr ? 'block' : 'none'}}>
                    {fcErr}
                </span>

            </div>
        )

        const usernameConst = (
            <div className='mb-4'>
                <label className="block mb-2 font-medium">
                    Username
                </label>
                <div className='animated fadeIn relative' style={{animationDelay:loginType ? '0s' : '.8s'}}>
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6D3EE3]" />
                    <input type="text" value={username} autoComplete="off" name="username"
                        placeholder="Enter your username"
                        className="w-full h-12 border !border-[#E1E4EC50] rounded-[8px] pl-12 pr-4 outline-none focus:ring-1 focus:ring-[#6D3EE3]"
                        onChange={this.usernameHandler}
                    />
                </div>
                <span className='invalid-feedback' style={{ display : usernameErr ? 'block' : 'none'}}>
                    {usernameErr}
                </span>
                <span className='invalid-feedback' style={{ display : signedInUserErr ? 'block' : 'none'}}>
                    {signedInUserErr}
                </span>
            </div>
        )
        const passwordConst = (
            <div style={{marginBottom:'20px'}}>
                <label className="block mb-2 font-medium">
                    Password
                </label>
                <div className='animated fadeIn relative' style={{animationDelay: loginType ? '.2s' : '1s', position:'relative'}}>
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6D3EE3]" />
                    <input type={ toggleEye ? '' : 'password' } value={password} autoComplete="off" name="password"
                        placeholder="Enter your password"
                        className="w-full h-12 border !border-[#E1E4EC50] rounded-[8px] pl-12 pr-12 outline-none focus:ring-1 focus:ring-[#6D3EE3]"
                        onChange={this.passwordHandler}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2" onClick={() => this.onToggleEye()}
                        style={{ cursor:'pointer'}}>
                        { toggleEye ? <FaRegEye /> : <FaRegEyeSlash /> }
                    </div>
                </div>
                <span className='invalid-feedback' style={{ display: passwordErr ? 'block' : 'none'}}>
                    {passwordErr}
                </span>
            </div>
        )
        const recaptchaConst = (
            <div>
                <div className="d-flex justify-content-start animated fadeIn" style={{animationDelay: loginType ? '.4s' : '1.2s'}}>
                    <div style={{margin: '20px 0px -5px 0px', transform:'scale(0.77)'}}>
                        <ReCAPTCHA
                            className='-ml-[38px]'
                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                            secretkey={import.meta.env.VITE_RECAPTCHA_SECRET_KEY}
                            onChange={this.onRecaptchaChange}
                        />
                    </div>
                </div>
                <span className='invalid-feedback' style={{ display : recaptchaErr ? 'block' : 'none'}}>
                    {recaptchaErr}
                </span>
            </div>
        )
        const registerBtn = (
            <div className='center animated fadeIn' style={{animationDelay:loginType ? '.6s' : '1.2s', alignItems:'center', flexDirection:'column'}}>
                <span className='invalid-feedback' style={{ margin: '20px 0px 0px', display: userPassErr ? 'block' : 'none', textAlign:'center'}}>
                    {userPassErr}
                </span>
                <div className='center btnShadow w-full h-12 my-10 rounded-[8px] bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl active:scale-98 focus:outline-none focus:ring-4 focus:ring-blue-300'
                    onClick = {() => registerType ? this.onRegister() : this.onLogin()}>
                    <span style={{fontSize:'16px'}}>{registerType ? setLT.signUp : setLT.login}</span>
                </div>
            </div>
        )

        const registerX = (
            <div className='disable-select waves-effect waves-light btn-large'>
                <div style={{margin:'0px', color:registerType ? '#ffffff' : '#000000'}} onClick={() => this.onRegisterX()}>
                    <div  className={`btnShadow`} style={{width:w<300 ? '110px' :'140px', height:'33px', margin:'8px', fontSize:'16px', border: '2px solid #FFA502', backgroundColor:registerType && '#FFA502', borderRadius:'3px', padding: '3px 5px', textAlign:'center'}}>{setLT.notMember}</div>
                </div>
            </div>
        )

        const loginX = (
            <div className='disable-select waves-effect waves-light btn-large'>
                <div style={{margin:'0px', color:loginType ? '#ffffff' : '#000000'}} onClick={() => this.onLoginX()}>
                    <div className={`btnShadow`} style={{width:w<300 ? '110px' : '140px', height:'33px', margin:'8px', fontSize:'16px', border: '2px solid #00CCFF', backgroundColor:loginType && '#00CCFF', borderRadius:'3px', padding: '3px 5px', textAlign:'center'}}>{setLT.isMember}</div>
                </div>
            </div>
        )

        const countryConst = (
            <div className='animated fadeIn sticky-top' style={{animationDelay:'0s', margin:'20px 0px 50px', }}>
                <label className="block mb-2 font-medium">
                    Country
                </label>
                <div className='d-flex' style={{marginBottom:'0px', alignItems: 'flex-start', gap:'10px'}}>
                    <div className='d-flex sticky-top' style={{direction:'ltr', }}>
                        <CountrySelector/>
                    </div>
                </div>
                <span className='invalid-feedback' style={{ margin: '0px 0px 0px 0px', display: countryErr ? 'block' : 'none'}}>
                    {countryErr}
                </span>
            </div>
        )

        const UserImage = (
            <img
                className={`C${mainUser.fc} btnShadow`}
                style={{objectFit: 'contain', width:'50px', height:'50px', borderRadius:mainUser.businessType>0 ? '3px' : '100px', border:'2px solid #ffffff40', margin:'0px', padding:'0px'}}
                src={exist(mainUser.profileIndex)
                      ? `https://www.pix.shiningpage.com/whoraly/profile/small/${mainUser._id}-${mainUser.profileIndex}.jpeg`
                      : mainUser.genderValue===0 ? female : male
                  }
                alt="user"
            />
        )
      
        const signOutBtn = (
            <div className='d-flex center btnShadow' onClick={this.logout}
                style={{width:'140px', margin:'30px 10px 40px', fontSize:'15px', border: '2px solid red', borderRadius:'3px', padding: auth ? '' : '0px 5px', alignItems:'center', color: '#000000'}}>
                {setLT.exit}
            </div>
        )

        const signupHeader = (
            <div className="text-center mb-10">
                <h3 className="text-4xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                        Create your account
                    </span>
                </h3>

                <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    Join us today! Fill in the details below to get started.
                </p>
            </div>
        )
        const loginHeader = (
            <div className="text-center mb-10">
                <h3 className="text-4xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                        Welcome back
                    </span>
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    Login to your account to continue.
                </p>
            </div>
        )
        const signupLink = (
            <div>
                Already have an account? <span className='link-underline text-[#0C6DFB] font-medium' onClick={() => this.onLoginX()}>Login</span>
            </div>
        )
        const loginLink = (
            <div>
                {"Don't have an account?"} <span className='link-underline text-[#0C6DFB] font-medium' onClick={() => this.onRegisterX()}>Sign up</span>
            </div>
        )
        const forgetPassword = <div className='link-underline mt-5 text-[#0C6DFB] font-medium' onClick={() => null}>Forget Password?</div>

        return (
            <Container className={`${w<s ? 'p-4' : 'p-10'} text-white`}>
                <div className='center' style={{flexDirection:'column'}}>
                    <div className='center' style={{width:'100%'}}>
                        <div className='animated fadeInUpX backBlur' style={{animationDelay:'.5s', backgroundColor: '#ffffff10', width: '100%', maxWidth:'400px', borderRadius:'20px'}}>
                            { auth
                                ?
                                <div style={{padding:'30px 0px 10px'}}>
                                    <div className='center' style={{alignItems:'center', flexDirection:'column'}}>
                                        <Link to={`/`} className='center' style={{alignItems:'center', flexDirection:'column'}}>
                                            {UserImage}
                                            {setLT.home}
                                            {/* mainUser.username */}
                                        </Link>
                                        {signOutBtn}
                                    </div>
                                </div>
                                :
                                <div className='p-10px' style={{padding: w<300 ? '10px 0px' :'10px'}}>
                                    <div className=' animated fadeInUpX' style={{padding:'25px 10px 5px'}}>
                                        {registerType ? signupHeader : loginHeader}
                                        {registerType && genderConst}
                                        {/* registerType && themeConst */}
                                        {registerType && countryConst}
                                        {usernameConst}
                                        {/* emailConst */}
                                        {passwordConst}
                                        {recaptchaConst}
                                        { loginType && forgetPassword }
                                        {registerBtn}
                                        { registerType ? signupLink : loginLink }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </Container>
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
        page: state.page,
        subject: state.subject,
        lang: state.lang,
        geo: state.geo,
        subUserId: state.subUserInfo['_id'],
        setLT: state.setLT,
        pageName: state.pageName,
        country: state.country,
        seenStatus: state.seenStatus,

    }
  }
  export default connect (mapStateToProps)(LoginPage);
