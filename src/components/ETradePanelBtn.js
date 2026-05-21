import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import { s } from '../srcSet';

class WhoralyBtn extends Component {

  state = {
    w: window.innerWidth
  }

  componentDidMount() {  }

  render() {
    const {w} = this.state
    const {setLT, fc} = this.props
    const loaderAlert = <div className='loader-07' style={{marginTop:'10px', color:'#d1a44a', width:'70px', height:'70px', position:'absolute'}}></div>

    return (
      <div className='center'>
          <Link to='/' className='d-flex btnShadowX animated fadeInUpX'
                style={{textDecoration:'none', color:'#ffffff', padding:'2px', backgroundImage: `linear-gradient(to left , #00000099 , #00000099)`, margin:'20px 0px', border: '2px solid #d1a44a', width:w<s ? '90%' : '350px', alignItems:'center', borderRadius:'0px 20px 0px 20px'}}>
              <div className='logo' style={{width:'50px', height:'50px', backgroundColor: '#ffffff', border: '1px solid #d1a44a', borderRadius:'100px'}}></div>&nbsp;&nbsp;&nbsp;
              <div className="" style={{fontWeight:'', width:''}}>Whoraly Marketing Platform</div>
          </Link>
          {loaderAlert}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    rtl: state.rtl,
    lang: state.lang,
    auth: state.auth,
    setLT: state.setLT,
  }
}

export default connect (mapStateToProps)(WhoralyBtn);

