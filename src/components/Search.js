import React, { Component } from 'react';
import axios from 'axios';
import 'chartjs-plugin-annotation';
import { connect } from 'react-redux';
import { setFullAccess, setUserInfo, setAuth, setPage, setCountry, setRuby,  } from '../dataStore/actions';
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';
import { IoMdClose } from 'react-icons/io';
import { BsSearch } from "react-icons/bs";
import toFarsi from '../modules/toFarsi';
import { exist, goToWebPage } from '../helper';
import { serverURL, s, listRefreshQty } from '../srcSet';

class Search extends Component {

  state = {
    n: 0,
    searchData: [],
    username: '',
    searchUsers:'',
    searchUsersX:'',
    w: window.innerWidth
  }

  componentDidMount = async () => {
    window.addEventListener("resize", this.onResize)
  }

  changeUsername = (e) => {
    var tx = toFarsi(e.target.value)
    this.setState({
      searchUsers: e.target ? tx.toLowerCase() : e,
      n:0,
    })
    this.startSearch(e)
  }

  scrollSearch = async () => {
    this.setState({
        loadingData: true,
    })

    var data = {
        username: this.state.searchUsers,
        n:this.state.n,
        q:listRefreshQty //this.state.w<s ? listRefreshQtySmall : listRefreshQtyBig
    }
    // console.log(data)
    await axios.post(`${serverURL}/user/findUser`, data).then( async res => {
      delete res.data.password
      // console.log('nnn', res.data)
      var x2 = res.data
      this.setState(
        (prevState) => ({
          searchData: [...prevState.searchData, ...x2], // اضافه کردن x2 به searchData
          finishData: res.data.length < listRefreshQty, // شرط ساده‌تر
          n: prevState.n + 1, // افزایش مقدار n
        }),
        () => {
          // انجام عملیات وابسته به searchData در callback
          this.searchMemberMap(this.state.searchData);
        }
      );
    });

  }

  searchMemberMap = async (x) => {
    var addUser, countryCode, userCountry, userImage, tableInfo
    const {w, n,} = this.state
    const {rtl, setLT, fullAccess} = this.props
    var dataRv = x.map (
        (item, i) => (
          //console.log(55555555, item),
          userImage = (
              <div>
                  <img
                      className={`C${item.fc>=0 ? item.fc : ''} btnShadow`}
                      style={{objectFit: 'contain', width:"40px", height:"40px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'0px solid #ffffff40', padding:'2px', cursor:'pointer'}}
                      src={ exist(item.profileIndex)
                          ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item._id}-${item.profileIndex}.jpeg`
                          : item.genderValue===0 ? female : male
                      }
                      alt={item.username}
                  />
              </div>
          ),
          countryCode = item.countryCode ? item.countryCode.toLowerCase() : '',
          userCountry = (
            <div className='d-flex' style={{flexDirection:'column', textAlign:'left'}}>
                <div className='d-flex' style={{margin: '0px 3px', alignItems:'center', direction:'rtl'}}>
                    <span className={`flag-icon flag-icon-${countryCode}`}></span> &nbsp;
                    <div className='d-flex ' style={{fontSize:'12px',}}>{item.country}</div>
                </div>
                <div className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap', fontSize:'12px'}}>
                    {item.username
                        ? (
                        <div>
                            <span style={{color:'#bb00f9', fontWeight:450}}>{item.username}</span>&nbsp;
                        </div>
                        )
                        : <span style={{color:'#999999', fontWeight:450}}>{setLT.unknown} ({item.view})</span>
                    }
                </div>
            </div>
          ),
          tableInfo = (
              <div className='' style={{backgroundColor:'#ffffff99', textDecoration:'none', padding:'3px', width:'100%'}}>
                  <table className="table table-borderless" style={{margin:'0px'}}>
                      <tbody>
                          <tr>
                              <td style={{padding:'0px', verticalAlign:'middle', width:'50px'}}>{userImage}</td>
                              <td style={{padding:'0px 3px'}}></td>
                              <td style={{padding:'0px 0px', verticalAlign:'middle', width:'100%'}}>{userCountry}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          ),
          <div key={i}
              className={`d-flex animated fadeInUpX btnShadowX`} onClick={() => fullAccess ? this.onToggleUser(item) : goToWebPage(item)}
              style={{backgroundColor:'#ffffff', textDecoration: "none", width:w<s ? '230px' : '250px', padding:'0px', borderRadius:'5px', margin:'2px', border: fullAccess ? '1px green solid' : '1px #7b5cff40 solid', direction:'ltr'}}
          >
              {tableInfo}
          </div>
      )
    )

    this.setState({
      searchMember: dataRv,
      loadingData:false,
    })
  }

  startSearch = async (e) => {
    if (e.keyCode === 13 || e.keyCode === undefined || e.which === 13 || e.which === undefined) {
        this.setState({
          n:1,
          searchData: [],
          searchMember: [],
          loadingData:true,
        })
        await this.searchMemberMap([])
        await this.scrollSearch()
    }
  }

  clearSearch = async (e) => {
    this.setState({
      searchUsers: '',
      n:0,
    })
  }

  onToggleUser = async (item) => {
    const root = item.businessType>0 ? 'publisher' : 'user'
    // بدلیل اینکه پس از انتخاب کاربر FullAccess از بین می رفت این بخش غیر فعال شد.
    // localStorage.removeItem('jwtToken');
    // this.props.dispatch(setPage(''))
    // this.props.dispatch(setAuth(false))
    // this.props.dispatch(setFullAccess(false))
    // this.props.dispatch(setUserInfo([]))
    // this.props.dispatch(setCountry({}))
    // this.props.dispatch(setBalance('0.00'))
    // this.props.dispatch(setRuby('0.00'))

    this.setState({
      loadingUser: true
    })
    const loginInfo = {
        username:item.username,
        page:this.props.page,
    }
    axios.post(`${serverURL}/login/login`, loginInfo)
    .then(async(result) => {
          console.log(888, result.data)

        if(result.data==='User not found'){
            this.setState({
                loginModal: true,
                userPassErr: this.props.setLT.userPassErr,
                emailErrors:'',
                passwordErrors:'',
                recaptchaErrors: '',
                loadingUser: false,
            });
        } else if(result.data==='Wrong password') {
            this.setState({
                loginModal: true,
                userPassErr: this.props.setLT.userPassErr,
                passwordErrors: this.state.passwordNotOK,
                usernameErrors: '',
                recaptchaErrors: '',
                loadingUser: false,
            });
        } else {
            this.setState({
                messageFailed: '',
                loginModal: false,
                loginError: '',
                usernameErrors: '',
                passwordErrors:'',
                recaptchaErrors: ''
            });
            await this.props.dispatch(setUserInfo(result.data.user))
            // console.log(111, this.props.mainUserId)
            await this.props.dispatch(setAuth(true))
            if(this.props.userId==='607e9088bede482040af3574') await this.props.dispatch(setFullAccess(true))
            // this.props.history.push(`/`)
            // window.location.reload();
            window.location.href=`/${root}/${item.username}`
            window.scrollTo(0, 0);
            this.setState({
              loadingUser: false
            })
        }
    })

  }

  onResize = () => {
    this.setState({ 
      // w: document.body.clientWidth,
      w: window.innerWidth,
      h: window.innerHeight,
    })
  }
  
  render() {
    const {w, finishData, loadingData, searchUsers, searchMember, } = this.state
    const {rtl, setLT, auth, fullAccess} = this.props;
    const loaderZ = <div className='loader-13' style={{margin: '0px', color:'#d1a44a'}}></div>

    const more = (
      <div className='center'>
          <div className='center btnShadow'
              style={{minWidth: '100px', height: '25px',
                  textAlign:'center', alignItems:'center',
                  margin: '0px 0px 0px',
                  border: `1px solid #f2ba4b`,
                  backgroundColor: '',
                  padding: '0px 10px',
                  color: `#d1a44a`,
                  fontWeight:450,
                  borderRadius: '100px'}}
              onClick = {() => this.scrollSearch()}>
              <span style={{}}>{setLT.more}</span>
          </div>
      </div>
    )

    const ColorLoadingCenter = (
      <div className='center' style={{width:'100%', direction:'ltr'}}>{loaderZ}</div>
    )

    const searchMemberConst = (
      <div className="center" style={{flexWrap: 'wrap', minWidth:w<s ? '230px' : '250px', }}>
          {searchMember}
          <div className='center' style={{width:'100%', height: !finishData ? '100px' : '0px', alignItems:'center', margin:'0px 0px 0px'}}>
              {(loadingData && !finishData) && ColorLoadingCenter}
              {(!loadingData && !finishData) && more}
          </div>
      </div>
    )

    const searchTape = (
      <div style={{position:'relative', margin:'0px', borderRadius:'3px', width:w<s ? '100%' : (w<1400 ? (w<992 ? '160px' : (auth ? '160px' : '230px')) : '230px'), fontSize:'13px'}}>
        <input type="text" value={searchUsers} placeholder='Members ...' name='searchUsers' autoComplete="off"
          className="form-control"
          style={{textAlign: rtl ? 'right' : 'left', padding:rtl ? '0px 10px 0px 70px' : '0px 70px 0px 10px', backgroundColor:'#ffffff99',
            width:'100%', height:'30px', fontSize:'13px', borderRadius:'8px', direction:rtl ? 'rtl' : 'ltr'}}
          onChange={this.changeUsername} onKeyPress={this.startSearch} onFocus={this.startSearch}/>
        <BsSearch color="" size="1.3em" onClick={this.startSearch}
          style={{position:'absolute', top: '6px', right: rtl ? '' : '5px', left: rtl ? '5px' : '', width: w<s? '30px' : '35px'}}/>
        <IoMdClose color="" size="1.3em" onClick={this.clearSearch}
          style={{position:'absolute', top: '6px', left:rtl ? '40px' : '', right: rtl ? '' : '40px', width: w<s? '30px' : '35px', display: searchUsers.length>0 ? '' : 'none'}}/>
      </div>
    )

    return (
      <div className="btn-group" style={{padding:'0px', fontSize:'12px', fontWeight:'', margin:'0px 10px', cursor:'pointer'}}>
        <div className='dropdown' color=''
            type="" id="dropdownMenuButton" data-bs-toggle="dropdown" data-bs-auto-close="outside"
            aria-haspopup="false" aria-expanded="false" data-bs-offset="0,10"
            //style={{borderRadius:'3px'}}
        >
          {searchTape}
        </div>
        <div className="dropdown-menu animated fadeIn" aria-labelledby="dropdownMenuButton"
            style={{fontSize:'13px', cursor:'pointer', margin:'', padding:'0px', backgroundColor:'transparent'}}>
          <div className='' style={{width:'', height:w<s ? '300px' : '400px', overflow:'scroll', padding:'5px', flexDirection:'column', backgroundColor:'#ffffff', border:'2px solid #d1a44a', borderRadius:'5px'}}>
            {searchMemberConst}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mainUserId: state.userInfo['_id'],
    mainUser: state.userInfo,
    userInfo: state.userInfo,
    userId: state.userInfo['_id'],
    username: state.userInfo['username'],
    fc: state.userInfo.fc,
    auth: state.auth,
    rtl: state.rtl,
    lang: state.lang,
    geo: state.geo,
    page: state.page,
    subject: state.subject,
    setLT: state.setLT,
    pageName: state.pageName,
    fullAccess: state.fullAccess,

  }
}

export default connect (mapStateToProps)(Search);
