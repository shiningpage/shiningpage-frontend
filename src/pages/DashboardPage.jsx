import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import { setSubject, setAddress, setPageTitle, setPage } from '../dataStore/actions';
import LocalTable from '../components/LocalTable';
import { FaRegPaperPlane } from 'react-icons/fa';
import siteView from '../modules/siteView';
import { addNotification } from '../helper';
import { AdsHorizontal } from '../components/GoogleAds';
import { checkSeen } from '../helper';
import { serverURL, s, googleAds } from '../srcSet';

class DashboardPage extends Component {
    
  state = {
    w: window.innerWidth,
    h: window.innerHeight,
    pageName: 'dashboard',
    allViews: [],
    viewsLoading: false
  }

  componentDidMount = async () => {
    window.scrollTo(0, 0)
    window.addEventListener("resize", this.onResize)
    await this.props.dispatch(setPageTitle(`${this.state.pageName} | ShiningPage`))
    await this.props.dispatch(setPage('dashboard'))
    await this.props.dispatch(setSubject('dashboard'))
    await this.props.dispatch(setAddress({ content:[], fix:this.state.pageName }))
    // if(this.props.auth && this.props.mainUser.ruby) checkSeen('contact', this.props.seenStatus, this.props.dispatch)
    siteView(this.props)
    this.getViews()
  }

  getViews = async () => {
    this.setState({ viewsLoading: true });

    const records = await axios.get(`${serverURL}/view/getAllViews/`);
    const normalizedData = this.normalizeObjects(records.data);

    const cleanedData = normalizedData.map(
      ({ _id, __v, ...rest }) => ({
        _id,     // 👈 اول قرار می‌گیرد
        ...rest  // بقیه فیلدها
      })
    );

    // console.log(cleanedData);

    this.setState({
      allViews: cleanedData,
      viewsLoading: false
    });
  };

  normalizeObjects = (arr, defaultValue = null) => {
    // گرفتن همه key های موجود در کل آرایه
    const allKeys = [...new Set(
      arr.flatMap(obj => Object.keys(obj))
    )];

    // اضافه کردن key های جاافتاده
    return arr.map(obj => {
      const newObj = {};

      allKeys.forEach(key => {
        newObj[key] = key in obj ? obj[key] : defaultValue;
      });

      return newObj;
    });
  }

  removeField = (arr, field) => {
    return arr.map(({ [field]: _, ...rest }) => rest);
  }

  onResize = () => {
    this.setState({
      w: window.innerWidth,
      h: window.innerHeight,
    })
  }

  render() {
    const {w, h, viewsLoading, allViews, } = this.state
    const {auth, rtl, setLT, lang, fullAccess } = this.props;
    const loader13 = <div className='loader-13' style={{margin: '0px', color:'#ffffff', transform: rtl ? 'rotate(180deg)' : ''}}></div>

    const header = (
      <div className='center' style={{alignItems:'center', flexDirection:'column', padding: '0px 10px'}}>
        <div className='d-flex' style={{justifyContent:rtl ? 'space-between' : 'flex-end', alignItems:'center', width:'100%', direction:'rtl'}}>
          <h1 className='animated fadeInLeft tx' style={{animationDelay:'.5s', color:'#ffffff', fontWeight:'bold', fontSize: w<s ? '30px' : '', textAlign:'center', margin:'30px 10px 30px'}}>Dashboard</h1>
        </div>
      </div>
    )

    return (
      <div style={{ width:'100%', }}>
        <div className='center' style={{flexDirection:'column', alignItems:'center'}}>
          {header}
        </div>
        <div style={{padding:'0px 10px 10px', marginBottom:'100px', overflow:'scroll'}}>
          { fullAccess && allViews.length>0 &&
              <LocalTable
                  data={allViews}
                  updateData={this.getViews}
                  loadingData={viewsLoading}
                  checkbox={true}
                  hiddenColumn={[1]}
                  searchBox={true}
                  controlColumn={true}
                  controls={true}
                  costomWidth={
                      {
                          screen: '150px',
                          visitorId: '150px',
                          userAgent: '150px',
                          city: '150px',
                          subject: '200px',
                      }
                  }
                  alignCenterOff={
                      {
                          // Service: true,
                          // Link: true,
                      }
                  }
                  // editUrl={'/crm/edit-record/'}
                  deleteUrl={`${serverURL}/view/deleteSiteView`}
                  deleteSelectionsUrl={`${serverURL}/view/deleteAllSiteView`}
              />
          }
        </div>
      </div>
    );
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
    seenStatus: state.seenStatus,
    fullAccess: state.fullAccess,

  }
}

export default connect (mapStateToProps)(DashboardPage);
