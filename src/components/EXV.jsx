import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setToggleSidebar } from '../dataStore/actions';
import { Link } from "react-router-dom";

import { s } from '../srcSet';

class EXV extends Component{

    state = {
        w: window.innerWidth,
    }

    componentDidMount = async () => {
        window.addEventListener("resize", this.onResize)
    }

    onSetSidebarOpen = async () => {
        this.props.dispatch(setToggleSidebar(false))
    }

    onResize = () => {
        this.setState({
            w: window.innerWidth
        })
    }

    //☨
	render () {
        const {w, } = this.state
        const {lang, page} = this.props

        const logoBox = (
            <div className='center'
                style={{minWidth:'45px', maxWidth:'45px', minHeight:'45px', maxHeight:'45px', borderRadius:'6px', alignItems:'center'}}>
                <img
                    style={{width:'100%', height:'100%'}}
                    src='https://www.pix.shiningpage.com/whoraly/site/logo.png'
                    alt="ShiningPage Logo"
                />
            </div>
        )

        return (
            <Link to='/' className='flex font-light' style={{textDecoration:'none', color:'#ffffff', alignItems:'center'}}
                onClick={() => this.onSetSidebarOpen()}>
                {logoBox}
                <div className='center' style={{ fontSize:'14px', alignItems:'center', flexDirection:'column' }}>
                    <span className='goldenText' style={{fontSize:'18px', marginBottom:'-2px'}}>ShiningPage</span>
                    <div className='C14' style={{maxWidth:'130px', minWidth:'130px', height:'2px'}}></div>
                    <span className='goldenText' style={{marginTop:'2px'}}>Version {import.meta.env.VITE_VERSION}</span>
                </div>
            </Link>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        lang: state.lang,
        rtl: state.rtl,
        page: state.page,
        toggleSidebar: state.toggleSidebar
    }
}

export default connect (mapStateToProps)(EXV);
