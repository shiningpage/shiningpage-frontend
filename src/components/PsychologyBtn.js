import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaAngleLeft } from 'react-icons/fa';

import { s, NavH, headerColor1, langArray } from '../srcSet';

class PsychologyBtn extends Component {

  state = {
    w: window.innerWidth
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize)
  }

  onGoPsychology = () => {
    // window.open(`https://www.psychology.shiningpage.com/en`);
    window.location = `https://www.psychology.shiningpage.com/en`;

  }

  onResize = () => {
    this.setState({ 
      w: window.innerWidth,
      h: window.innerHeight,
    })
  }

  render() {
    const {w} = this.state
    const {setLT, fc} = this.props
    const loaderAlert = <div className='loader-07' style={{marginTop:'-7px', color:'#d1a44a', width:'70px', height:'70px', position:'absolute'}}></div>

    return (
      <div className='d-flex'>
        <div className='center'>
            <div className='d-flex btnShadowX animated fadeInUpX nav' onClick={() => this.onGoPsychology()}
                  style={{textDecoration:'none', padding:'2px',
                  margin:'0px', border: '1px solid #d1a44a', width:w<s ? '100%' : '350px',
                  alignItems:'center', borderRadius:'0px 20px'}}>
                <div className='character' style={{width:'50px', height:'50px', border: '1px solid #d1a44a', borderRadius:'100px'}}></div>
                <span className="nav" style={{margin:'0px 10px'}}>{setLT.BCR}</span>
            </div>
            {/* loaderAlert */}
        </div>
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

export default connect (mapStateToProps)(PsychologyBtn);

