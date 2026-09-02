import React, { Component } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setPageName, setPageTitle } from '../store/slices/pageSlice';
import { setAddress, setSubject } from '../store/slices/appSlice';
import Manager from '../components/Manager';
import siteView from '../modules/siteView';
import pixSave from '../modules/pixSave';
import pixDelete from '../modules/pixDelete';
import pixHandler from '../modules/pixHandler';
import { AdsHorizontal } from '../components/GoogleAds';
import { checkSeen } from '../helper';
import { s, googleAds } from '../srcSet';

var w = window.innerWidth

class AboutUsPage extends Component {

    state = {
      w: window.innerWidth,
      page: 'About',
      uc: 0,
      // selectedFile: [],
      zx: 1000,
    }

    async componentDidMount() {
        window.scrollTo(0, 0)
		    await this.props.dispatch(setPageTitle(`${this.state.page} | ShiningPage`))
        await this.props.dispatch(setPageName('about'))
        await this.props.dispatch(setSubject('about'))
        await this.props.dispatch(setAddress({ content:[], fix:this.state.page }))
        siteView(this.props)
    }

    onClickHandler = async () => {
      this.setState({
        refreshing: true,
      })
      var selectedFile = this.state.selectedFile
      if(selectedFile) {
        const dest = "../test/public"
        // const dest = "../pix.shiningpage.com/public"
        const d1 = new Date();
        const dateN = d1.getTime().toString();
        const name = "mahmoud" + dateN
        const nameOld = "mahmoud1677578676877.jpeg"
        pixDelete({address: dest + "/" + nameOld})
        pixSave(selectedFile, `${this.state.zx}|${name}|${dest.replaceAll("/", "@")}`)
        this.setState({
          selectedFile: "",
          image: "" ,
          refreshing: false,
        })
      }
    }

    pixChangeHandler= (e) =>{
      pixHandler(e, this.state.zx).then(res => {
        if(res) {
          var At = res.file.size
          var Bt = res.fileResized.size
          this.setState({
            selectedFile: At > Bt ? res.fileResized : res.file,
            image: res.base64,
            formatErr: null,
          })
        } else {
          this.setState({
            image: null,
            formatErr:this.props.setLT.formatErr,
          })
        }
      })
    }

    render() {
        const { } = this.state;
        const { } = this.props;

        const header = (
          <div className="animated fadeInLeft [animation-delay:.5s] text-4xl font-extrabold tracking-tight my-[30px]">
            <span className="purple-blue">
              About
            </span>
          </div>
        )

        const adsBox = <div className='adsbox'><AdsHorizontal id='adsH1' /></div>

        return (
          <div className='text-[#ffffff] font-thin'>
            {/* {googleAds && adsBox} */}
            <Container>
              <div className='center' style={{flexDirection:'column', alignItems:'center'}}>
                {header}
              </div>
              <div className='animated fadeInUpX' style={{animationDelay:'.5s', margin:'0px 5px 30px', padding:'10px', backgroundColor:'#ffffff00', borderRadius:'5px'}}>
                <div className='' style={{backgroundColor:'#ffffff00', borderRadius:'5px', padding:'10px'}}>
                  <Manager />
                </div>
              </div>
            </Container>
            {/* {googleAds && adsBox} */}
          </div>
        )

    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.user.userInfo['_id'],
        mainUser: state.user.userInfo,
        rtl: state.app.rtl,
        lang: state.app.lang,
        geo: state.app.geo,
        pageName: state.page.name,
        subject: state.app.subject,
        setLT: state.app.setLT,
        seenStatus: state.app.seenStatus,
    }
  }
  export default connect (mapStateToProps)(AboutUsPage);
