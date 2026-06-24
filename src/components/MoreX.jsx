import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaAngleLeft } from 'react-icons/fa';
import { lightColors } from '../srcSet';

class More extends Component {

  state = {}

  componentDidMount() {  }

  render() {
    const {} = this.state
    const {setLT, fc, margin} = this.props

    return (
        <div className='center'>
            <div className={`center C${fc} btnShadow`}
                style={{minWidth: '100px', height: '100px', 
                        textAlign:'center', 
                        margin,
                        border: `3px solid ${[11].includes(fc) ? '#00000050' : '#ffffff80'}`,
                        padding: '0px 10px',
                        color: `${lightColors.includes(fc) ? '#00000090' : '#ffffff'}`,
                        borderRadius: '100px'}}
            >
                <span>{setLT.more}</span>
                <FaAngleLeft style={{fontSize:'20px', margin:'2px 0px 0px 0px', transform:'rotate(180deg)'}}/>
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

export default connect (mapStateToProps)(More);

