import React, { Component } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setSubject, setPageTitle, setPageName, setPage } from '../dataStore/actions';
import { s, serverURL, langArray } from '../srcSet';

class Page404 extends Component {

    state = {
        // page:''
    }

    componentDidMount = async () => {
        window.addEventListener("resize", this.onResize)
        await this.props.dispatch(setPageName('page404'))
        await this.props.dispatch(setPageTitle(`page404 | ShiningPage`))
        await this.props.dispatch(setPage('page404'))
        await this.props.dispatch(setSubject('page404'))

        var pth = window.location.pathname;
        var x = pth.split('/')[1]
        var langCheck = langArray.includes(x) ? true : false
        // this.setState({ langCheck })
    
        // setTimeout(() => {
            // console.log(this.state.page)
            // if(this.state.page==='page404') {
                axios.post(`${serverURL}/err404`)
                .then(async res => {
                    // console.log('err404 is done')
                })
            // }
        // }, 5000);

        // axios.get()
        // .then((res) => {
        //   res.writeHead(404, {'content-type': 'text/html'});
        //   res.end();
        // })
        // .catch(error => {
        //   if (error.response) {
        //     console.log('Error:', error.message);
        //   }
        // })

        // let newUrlIS =  window.location.origin + `/404`;
        // await window.history.pushState({}, null, newUrlIS);
    }

    onResize = () => {
        this.setState({ 
            w: window.innerWidth,
            h: window.innerHeight,
        })
    }
    
    setstate = () => {
        this.setState({ page: 'this.props.page' })
    }

    render() {
        const {w} = this.state;
        const {rtl} = this.props;
        const containerStyle = {padding:w<s ? '0px' : (rtl ? '0px 270px 0px 0px' : '0px 0px 0px 270px')}
        
        // function setstate () {
        //     this.setState({ page: this.props.page })
        // }
        // setstate()
        // console.log(this.props.page)
        // this.props.dispatch(setPageName(this.props.page))
        return (
            <Container style={containerStyle}>
                <h1 className='animated fadeInDown' style={{animationDelay:'1s', margin:'30px 10px', color:'#ffffff'}}>
                    Page Not Found
                </h1>
                <p className='animated fadeInDown' style={{animationDelay:'1.5s', margin:'30px 10px', color:'#ffffff'}}>
                    Sorry, the page you are looking for does not exist.
                </p>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        mainUser: state.userInfo,
        userId: state.userInfo['_id'],
        lang: state.lang,
        rtl: state.rtl,
        page: state.page,

    }
  }
  export default connect (mapStateToProps)(Page404);
