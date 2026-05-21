import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { serverURL, s, } from '../srcSet';
import { setToggleChat, setSubChatInfo } from '../dataStore/actions';

class CreateTicket extends Component{

    state = {
        w: document.body.clientWidth,
    }

    componentDidMount = async () => {
        window.addEventListener("resize", this.onResize)

    }

    onCreateTicket = async (ID, e) => {
        const index = e?.target?.id==='chatDelete' ? false : true
        if(index) {
            this.setState({loading:true})
            if(ID.receiverId!=='unknown') {
                var user = await axios.post(`${serverURL}/user/getUserInfo`, { _id: ID })
                var item = user.data
                delete item.password
                if(item) this.props.dispatch(setSubChatInfo(item))
            } else {
                ID._id='unknown'
                this.props.dispatch(setSubChatInfo(ID))
            }
            this.props.dispatch(setToggleChat(true))
            this.setState({loading:false})
        }
    }

    onResize = async () => {
        this.setState({ 
            w: document.body.clientWidth
        })
    }

	render () {
        const {w, loading, } = this.state
        const {rtl, setLT, hr} = this.props
        const loader13 = <div className='loader-13' style={{margin: '0px 20px', color:'', transform: rtl ? 'rotate(180deg)' : ''}}></div>

        return (
            <span
                className='underline'
                style={{fontWeight:450, padding:'4px 16px', color:'blue'}}
                onClick={() => this.onCreateTicket("607e9088bede482040af3574")}
            >
                {loading ? loader13 : 'Create a ticket'}
            </span>
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
        page: state.page,
        setLT: state.setLT,
        fullAccess: state.fullAccess,
    }
}

export default connect (mapStateToProps)(CreateTicket);
