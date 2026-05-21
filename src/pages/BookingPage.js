import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setSubject, setAddress, setPageTitle, setPage } from '../dataStore/actions';
import siteView from '../modules/siteView';
import { AdsHorizontal } from '../components/GoogleAds';
import { checkSeen } from '../helper';
import { s, googleAds } from '../srcSet';


class BookingPage extends Component {
    
  state = {
    w: window.innerWidth,
    h: window.innerHeight,
    pageName: 'Booking',
}

  componentDidMount = async () => {
    window.scrollTo(0, 0)
    console.log(this.props.userInfo)
    window.addEventListener("resize", this.onResize)
    await this.props.dispatch(setPageTitle(`${this.state.pageName} | ShiningPage`))
    await this.props.dispatch(setPage('booking'))
    await this.props.dispatch(setSubject('booking'))
    const user = this.props.userInfo
    // const user = this.props.userInfo.bizName ? this.props.userInfo.bizName : this.props.userInfo.username
    await this.props.dispatch(setAddress({ content:[], user, fix:this.state.pageName }))
    // if(this.props.auth && this.props.mainUser.ruby) checkSeen('privacy', this.props.seenStatus, this.props.dispatch)
    siteView(this.props)
  }

  onResize = () => {
    this.setState({
      w: window.innerWidth,
      h: window.innerHeight,
    })
  }

  render() {
    const { w, h, } = this.state
    const { rtl, lang, setLT, } = this.props

    const header = (
      <div className='center' style={{alignItems:'center', flexDirection:'column', padding: '0px 10px'}}>
        <div className='d-flex' style={{justifyContent:rtl ? 'space-between' : 'flex-end', alignItems:'center', width:'100%', direction:'rtl'}}>
          <h1 className='animated fadeInLeft tx' style={{animationDelay:'.5s', color:'#ffffff', fontWeight:'bold', fontSize: w<s ? '30px' : '', textAlign:'center', margin:'30px 10px 30px'}}>Booking</h1>
        </div>
      </div>
    )

    const commingSoon = (
			<div className='center animated fadeInUpX'>
				<div style={{animationDelay:'.5s', width:'200px', textAlign:'center', color:'#ffffff', padding:'10px 15px', marginBottom:'100px', borderRadius:'100px', border:'1px solid #ffffff'}}>
            Comming Soon
				</div>
			</div>
		)

    return (
      <div style= {{lineHeight:'25px'}}>
        <Container>
          <div className='center' style={{flexDirection:'column', alignItems:'center'}}>
            {header}
          </div>
          {commingSoon}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mainUserId: state.userInfo['_id'],
    mainUser: state.userInfo,
    userInfo: state.subUserInfo,
    auth: state.auth,
    rtl: state.rtl,
    lang: state.lang,
    geo: state.geo,
    page: state.page,
    subject: state.subject,
    pageName: state.pageName,
    setLT: state.setLT,
    seenStatus: state.seenStatus,

  }
}

export default connect (mapStateToProps)(BookingPage);
