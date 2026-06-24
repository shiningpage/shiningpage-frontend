import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HiOutlineRefresh } from 'react-icons/hi';

class UpdateVersion extends Component{

    state = {
        w: window.innerWidth,
    }

    componentDidMount = async () => {}

    onUpdateVersion = () => {

        caches.keys().then((keyList) => Promise.all(keyList.map((key) => caches.delete(key))))

        if('caches' in window){
            caches.keys().then((names) => {
                // Delete all the cache files
                names.forEach(name => {
                    caches.delete(name);
                })
            });
            window.location.reload()
        }

    }

	render () {
        const {w, } = this.state
        const {setLT, color, fontWeight } = this.props

        return (
            <div className='d-flex nav' style={{alignItems:'center', width:'100%', color, fontWeight}} onClick={() => this.onUpdateVersion()}>
                <HiOutlineRefresh style={{width:'18px', margin:'10px 0px', fontSize:'18px'}}/>
                <div style={{margin:'0px 10px', fontSize:'15px'}}>{setLT.versionUpdate}</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        lang: state.lang,
        rtl: state.rtl,
        page: state.page,
        setLT: state.setLT,
    }
}

export default connect (mapStateToProps)(UpdateVersion);
