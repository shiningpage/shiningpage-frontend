import React, { Component } from 'react';
import { connect } from 'react-redux';

class Contact extends Component{

    state = {
        w: document.body.clientWidth,
    }

    componentDidMount = async () => {
        window.addEventListener("resize", this.onResize)

    }

    onResize = async () => {
        this.setState({ 
            w: document.body.clientWidth
        })
    }

	render () {
        const {w, } = this.state
        const {rtl, setLT, hr} = this.props

        return (
            <div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.user.userInfo['_id'],
        userInfo: state.user.subUserInfo,
        userId: state.user.subUserInfo._id,
        rtl: state.app.rtl,
        lang: state.app.lang,
        geo: state.app.geo,
        setLT: state.app.setLT,
        fullAccess: state.auth.fullAccess,
    }
}

export default connect (mapStateToProps)(Contact);
