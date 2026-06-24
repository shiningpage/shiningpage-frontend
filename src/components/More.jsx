import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaAngleLeft } from 'react-icons/fa';
import { lightColors } from '../srcSet';

class More extends Component {

  state = {}

  componentDidMount() {  }

  render() {
    const {} = this.state
    const {setLT, fc} = this.props

    return (
        <div className='center'>
            <div className={`C${fc} btnShadow`}
                style={{minWidth: '100px', height: '30px', 
                        textAlign:'center', 
                        margin: '40px 0px 30px',
                        border: `3px solid ${[11].includes(fc) ? '#00000050' : '#ffffff80'}`,
                        padding: '0px 10px',
                        color: `${lightColors.includes(fc) ? '#00000090' : '#ffffff'}`,
                        borderRadius: '100px'}}
            >
                <span>{setLT.more}</span>
                <FaAngleLeft style={{fontSize:'20px', margin:'2px 0px 0px 0px', transform:'rotate(-90deg)'}}/>
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

