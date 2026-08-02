import React, { Component } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAddress, setSubject, setPageTitle, setPageName, setPage } from '../dataStore/actions';
import siteView from '../modules/siteView';
import { AdsHorizontal } from '../components/GoogleAds';
import { checkSeen } from '../helper';
import { s, googleAds } from '../srcSet';

var w = window.innerWidth

class PricingPage extends Component {

    state = {
      w: window.innerWidth,
      pageName: 'Pricing',
    }

    async componentDidMount() {
        window.scrollTo(0, 0)
        await this.props.dispatch(setPageName('Pricing'))
		    await this.props.dispatch(setPageTitle(`${this.state.pageName} | ShiningPage`))
        await this.props.dispatch(setPage('pricing'))
        await this.props.dispatch(setSubject('pricing'))
        await this.props.dispatch(setAddress({ content:[], fix:this.props.pageName }))
        siteView(this.props)
    }

    render() {
        const { w } = this.state;
        const { auth } = this.props;

        const header = (
          <div className="animated fadeInLeft [animation-delay:.5s] text-4xl font-extrabold tracking-tight my-[30px]">
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
              Pricing
            </span>
          </div>
        )

        return (
          <div className='text-[#ffffff] font-thin'>
            <Container>
              <div className='center' style={{flexDirection:'column', alignItems:'center'}}>
                {header}
              </div>
              <div className='animated fadeInUpX' style={{animationDelay:'.5s', margin:'0px 5px 30px', padding:'10px', backgroundColor:'#ffffff00', borderRadius:'5px'}}>
                <div className='' style={{backgroundColor:'#ffffff00', borderRadius:'5px', padding:'10px'}}>
                  Pricing Coming Soon
                </div>
              </div>
            </Container>
          </div>
        )

    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        mainUser: state.userInfo,
        geo: state.geo,
        auth: state.auth,
        page: state.page,
        subject: state.subject,
        setLT: state.setLT,
        pageName: state.pageName,
        seenStatus: state.seenStatus,
    }
  }
  export default connect (mapStateToProps)(PricingPage);
