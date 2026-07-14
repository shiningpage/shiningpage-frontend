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
      <div className={`center items-center C${fc} btnShadow min-w-[100px] h-[30px] text-centermy-[40px] mb-[30px] px-[10px] rounded-full border-[3px]
          ${[11].includes(fc) ? "border-black/30" : "border-white/50"}
          ${lightColors.includes(fc) ? "text-black/60" : "text-white"}
        `}
      >
        <span>{setLT.more}</span>
        <FaAngleLeft className="text-[20px] mt-[2px] -rotate-90"/>
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

