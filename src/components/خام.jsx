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
        mainUserId: state.userInfo['_id'],
        userInfo: state.subUserInfo,
        userId: state.subUserInfo._id,
        rtl: state.rtl,
        lang: state.lang,
        geo: state.geo,
        page: state.page,
        setLT: state.setLT,
        fullAccess: state.fullAccess,
    }
}

export default connect (mapStateToProps)(Contact);
