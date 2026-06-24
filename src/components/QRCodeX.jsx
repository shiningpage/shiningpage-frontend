import React, { Component } from 'react';
import { connect } from 'react-redux';
import QRCode from "react-qr-code";

class QRCodeX extends Component {

  state = {}

  componentDidMount() {  }

  render() {
    const {} = this.state
    const {size, url} = this.props

    return (
      <div className='center' style={{width:'100%', alignItems:'center', padding:'65px 0px'}}>
        <div className='center' style={{ height: size, maxWidth: size, minWidth: size, width: size, padding:'5px', backgroundColor:'#ffffff', borderRadius:'3px', cursor:'pointer'}}>
          <QRCode
            size={256}
            style={{ height: "100%", width: "100%" }}
            value={url}
            viewBox={`0 0 256 256`}
          />
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

export default connect (mapStateToProps)(QRCodeX);

