import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";

class Addressbar extends Component {

  state = {

  }

  componentDidMount() {

  }

  render() {
    const { } = this.state
    const {rtl, auth, setLT, lang, address} = this.props
    const {content, user, fix} = address
    const UN = user?.bizName ? user?.bizName : user?.username
    const indicator = <FaAngleRight style={{margin:'0px 5px', transform: rtl ? 'scaleX(-1)' : ''}}/>
    const hrC14 = <div className='C14' style={{width:'100%', height:'2px'}}></div>

    const homeNav = (
      <div className='d-flex' style={{alignItems:'center'}}>
        <Link to='/' className='link-underline' >{setLT.home}</Link>
        {indicator}
      </div>
    )

    const root = user?.businessType>0 ? 'publisher' : 'user'
    const userNav = (
      <div className='d-flex' style={{alignItems:'center'}}>
        <Link to={`/${root}/${user?.username}`} className='link-underline-white' style={{color:'#ffffff'}}>{UN}</Link>
        {indicator}
      </div>
    )

    return (
      <div className='cardShadow'>
        <div style={{padding:'10px', fontWeight:450, color:'#ffffff', backgroundColor:'#ffffff00'}}>
          <Container>
            <div className='d-flex'>
              {homeNav}
              {user && userNav}
              <span className='underline' onClick={() => window.location.reload()}>{fix}</span>
            </div>
          </Container>
        </div>
        {hrC14}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    rtl: state.rtl,
    lang: state.lang,
    auth: state.auth,
    page: state.page,
    genderChange: state.genderChange,
    toggleGender: state.toggleGender,
    PSYInfo: state.PSYInfo,
    setLT: state.setLT,
    address: state.address,
  }
}

export default connect (mapStateToProps)(Addressbar);

