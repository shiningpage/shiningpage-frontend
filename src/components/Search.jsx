import React, { Component } from 'react';
import axios from 'axios';
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
    const {w, n,} = this.state
    const {setLT, fullAccess} = this.props
    var dataRv = x.map (
        (item, i) => {
          //console.log(55555555, item),
          const userImage = (
              <div>
                  <img
                      className={`C${item.fc>=0 ? item.fc : ''} btnShadow`}
                      style={{objectFit: 'contain', minWidth:"40px", minHeight:"40px", width:"40px", height:"40px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'0px solid #ffffff40', padding:'2px', cursor:'pointer'}}
                      src={ exist(item.profileIndex)
                          ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item._id}-${item.profileIndex}.jpeg`
                          : item.genderValue===0 ? female : male
                      }
                      alt={item.username}
                  />
              </div>
          )
          const countryCode = item.countryCode ? item.countryCode.toLowerCase() : ''
          const userCountry = (
            <div className="flex flex-col w-full text-left">
              <div className="flex w-full justify-end items-center">
                <div className="flex items-center gap-[5px] [direction:rtl]">
                  <span className={`flag-icon flag-icon-${countryCode}`}></span>
                  <span className="text-[12px] text-[#ffffff99]">
                    {item.country}
                  </span>
                </div>
              </div>

              <div className="flex justify-between flex-wrap text-[12px]">
                {item.username
                  ? item.username
                  : <span>{setLT.unknown} ({item.view})</span>
                }
              </div>
            </div>
          )
          return (
            <div
              key={i}
              className={`flex animated fadeInUpX btnShadow text-white no-underline
                ${w < s ? 'w-[230px]' : 'w-[250px]'}
                p-1 rounded-[3px] m-[5px]
                border-[0.5px] border-l-[5px]

                transition-all duration-300 ease-out

                hover:-translate-y-1
                hover:scale-[1.02]
                hover:shadow-xl

                active:translate-y-1
                active:scale-[0.98]
                active:shadow-md

                ${
                  fullAccess
                    ? 'border-[#03c61a60] border-l-[#03c61a] hover:border-[#03c61a] hover:shadow-[#03c61a40]'
                    : 'border-[#d5ad6d60] border-l-[#d5ad6d] hover:border-[#d5ad6d] hover:shadow-[#d5ad6d40]'
                }

                [direction:ltr]`}
              onClick={() => fullAccess ? this.onToggleUser(item) : goToWebPage(item)}
            >
              <div className="no-underline p-[3px] w-full">
                <div className="flex items-center gap-1">
                  <div className="p-0 w-[50px] flex items-center">{userImage}</div>
                  <div className="p-0 w-full flex items-center">{userCountry}</div>
                </div>
              </div>
            </div>
          )
        }
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
    const {setLT, auth, fullAccess} = this.props;
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
      <div
        className={`relative m-0 rounded-[3px] text-[13px] ${
          w < s
            ? "w-full"
            : w < 1400
            ? w < 992
              ? "w-40"
              : auth
              ? "w-40"
              : "w-[230px]"
            : "w-[230px]"
        }`}
      >
        <input
          type="text"
          value={searchUsers}
          placeholder="Members ..."
          name="searchUsers"
          autoComplete="off"
          onChange={this.changeUsername}
          onKeyPress={this.startSearch}
          onFocus={this.startSearch}
          className="form-control w-full h-[30px] px-[70px] pl-[10px] !text-[14px] !font-medium !rounded-[100px] bg-transparent !text-[#e5bc7b] placeholder:!text-[#d5ad6d] placeholder:opacity-80 [direction:ltr] outline-none !border-1 !border-[#d5ad6d] !bg-[#00000030] !shadow-[0_0_8px_rgba(213,173,109,0.45)]"
        />

        <BsSearch
          size="1.3em"
          onClick={this.startSearch}
          className={`absolute top-[6px] right-[5px] text-[#e5bc7b] drop-shadow-[0_0_4px_rgba(213,173,109,0.8)] ${
            w < s ? "w-[30px]" : "w-[35px]"
          }`}
        />

        <IoMdClose
          size="1.3em"
          onClick={this.clearSearch}
          className={`absolute top-[6px] right-[40px] text-[#e5bc7b] drop-shadow-[0_0_4px_rgba(213,173,109,0.8)] ${
            w < s ? "w-[30px]" : "w-[35px]"
          } ${
            searchUsers.length > 0 ? "block" : "hidden"
          }`}
        />
      </div>
    );

    return (
      <div className="btn-group p-0 text-[12px] mx-[10px] cursor-pointer">
        <div className='dropdown' color=''
            type="" id="dropdownMenuButton" data-bs-toggle="dropdown" data-bs-auto-close="outside"
            aria-haspopup="false" aria-expanded="false" data-bs-offset="0,10"
            //style={{borderRadius:'3px'}}
        >
          {searchTape}
        </div>
        <div className="dropdown-menu animated fadeIn text-[13px] cursor-pointer p-0 bg-transparent"
            aria-labelledby="dropdownMenuButton">
          <div className={`${w < s ? 'h-[300px]' : 'h-[400px]'} overflow-scroll p-[5px] flex-col bg-[url('/src/assets/images/other/ai-background.jpg')] border-[0.5px] border-[#d1a44a00] rounded-[5px]`}>
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
