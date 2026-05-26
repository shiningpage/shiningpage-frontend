import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import { FaAngleLeft } from 'react-icons/fa';
import { getPos, dig3 } from '../helper';
import { serverURL, s, listRefreshQty, listRefreshQtySmall, colors, lightColors } from '../srcSet';
const WorldMap = require('react-svg-worldmap').WorldMap;

class SiteView extends Component {

  state = {
    w: document.body.clientWidth,
    h: document.body.clientHeight,
    likeViewChatWidth: 300,
    likeViewChatHeight: 450,
    viewCountAll: [],

  }

  componentDidMount = async () => {
    window.addEventListener("resize", this.onResize)
    const statisticsSub = document.getElementById('statisticsSub');
    const statisticsSubTop = statisticsSub.getBoundingClientRect().top;
    await this.getCountryViewers()
    this.setStatisticsSize()
    // await this.countLikers()
    // await this.countCommenters()
    // await this.getViewers()
  }

  setStatisticsSize = async () => {
    const { w } = this.state
    const statisticsArea = await getPos('statisticsArea')
    // console.log(statisticsArea)
    if(statisticsArea) {
      const worldmap = await getPos('worldmap')
      const wz = this.state.likeViewChatWidth
      const wx = statisticsArea.width - worldmap.width// + 10
      const hz = this.state.likeViewChatHeight
      const hx = worldmap.height// + 10
      this.setState({
          likeViewChatWidth: wx < wz ? wx : wz,
          likeViewChatHeight: w<s ? hz : hx
      })
    }
  }

  getCountryViewers = async (x) => {
    this.setState({ 
        gettingCountryViewers: true,
        viewCountAll: []
    })

    var data = {
        userId: this.props.userId,
    }    
    await axios.post(`${serverURL}/view/getSiteViewMainGroup`, data)
    .then(async res => {
        var cx = res.data
        // console.log(1, cx)

        var cxArr = [{country:'QQ', value:0}]
        var x = 0
        var maxView = 0
        for(var i=0; i<cx.length; i++) {
          if (cx[i].countryCode === "UM") {
            cx[i].countryCode = "US";
            cx[i].country = "United States";
          }
          if (cx[i].countryCode === "RU") {
            cx[i].countryCode = "RU";
            cx[i].country = "Russia";
          }
          if (cx[i].countryCode === "DO") {
            cx[i].countryCode = "DO";
            cx[i].country = "Dominican Republic";
          }
          if (cx[i].countryCode === "AE") {
            cx[i].countryCode = "AE";
            cx[i].country = "United Arab Emirates";
          }

        }
        // console.log(2, cx)

        const cxGroup = cx.reduce((acc, { countryCode, country, view }) => {
          const existingEntry = acc.find(entry => entry.countryCode === countryCode);
          if (existingEntry) {
              existingEntry.view += view;
          } else {
              acc.push({ countryCode, country, view });
          }
          return acc;
        }, []);
        await cxGroup.sort((a, b) => (a.view > b.view) ? -1 : 1)

        // console.log(3, cxGroup)

        for(var i=0; i<cxGroup.length; i++) {
          cxArr.push({"country": cxGroup[i].countryCode, "value": cxGroup[i].view})
          x += cxGroup[i].view
          if (cxGroup[i].view > maxView) {
              maxView = cxGroup[i].view
          }
        }

        // console.log(cxGroup)
        await this.setState({
            viewCountAll: cxArr,
            gettingCountryViewers: false,
            totalView: dig3(x),
            maxView: maxView,
            countryQTY: cxArr.length-1,
        })

        this.mapCountries(cxGroup, maxView)
    })

  }

  mapCountries = (data, maxView) => {
    const countriesList = data.map(
      (item, i) => {
        const p = (item.view/maxView)*100
        return (
          <div key={i} className='d-flex' style={{width:'100%', alignItems:'flex-start', justifyContent: '', flexDirection:'column', overflow:'hidden'}}>
              <span className='d-flex' style={{width:'100%', margin:'15px 0px -2px', fontSize:'15px', alignItems:'center', justifyContent:'space-between', textAlign:'left'}}>
                {item.country}
                <div className='d-flex'>
                  <div style={{fontSize:'12px', margin:'0px 10px', alignItems:'center', marginTop:'3px'}}>{dig3(item.view)}</div>
                  <div className={`cardShadow flag-icon flag-icon-${item.countryCode ? item.countryCode.toLowerCase() : ''}`} style={{border:'0px solid #99999930', fontSize:'17px'}}></div>
                </div>
              </span>
              <hr style={{margin:'3px 0px 5px', width: '100%', height:'hairline', backgroundColor:'#99999999', marginBottom:'-7px'}}/>
              <hr className={this.props.rtl ? 'right' : 'left'} style={{margin:'5px 0px 5px', width: `calc(${p}%)`, height:'2px', backgroundColor:'green', opacity:'1'}}/>
              <hr className='sticky-top' style={{margin:'-12px -22px 0px', width: '20px', height:'10px', backgroundColor:'#ffffff', border:'1px solid #ffffff'}}/>
          </div>
        )
      }
    )
    this.setState({ countriesList })
  }

  onResize = async () => {
    this.setState({ w: document.body.clientWidth })
  }

  render() {
    const { w, h, gettingCountryViewers, likeViewChatWidth, likeViewChatHeight, viewCountAll, totalView, countriesList, countryQTY } = this.state
    const {setLT, rtl, fc} = this.props
    const titleStyle = {fontSize:  w<s ? '25px' : '30px', fontWeight:450, margin:'0px 0px 15px', textAlign: rtl ? 'right' : 'left', alignItems:'center', whiteSpace:'', color:'', width:'100%'}
    const loader13 = <div className='loader-13' style={{margin: rtl ? '35px 20px -25px' : '0px 20px 0px', color:'#000000', transform: rtl ? 'rotate(180deg)' : '', fontSize:'14px'}}></div>

    const ViewerBSMMap = (
      <div id='worldmap' className='center animated fadeIn' style={{animationDelay:'0s', width:'100%', height:'', padding:'0px', margin:'0px', backgroundColor:''}}>
        <div className='cardShadow' style={{width:'100%', backgroundColor:'#ffffff', overflow:'scroll', borderRadius:'10px'}}>
          {/* gettingCountryViewers && loaderX */}
          <div className='' style={{width:'100%', backgroundColor:'#ffffff00'}}>
            <WorldMap color={`${colors[`C${14}`]}`} backgroundColor='#ffffff00' title='' borderColor='#000000' size={w<s ? "lg" : "xl"} data={viewCountAll}/>
          </div>
        </div>
      </div>
  )

    return (
      <div id='statisticsSub' style={{width:'100%', padding:'70px 0px'}}>
        <Container>
          <div className={`${w<s ? 'center' : 'd-flex'} txWhite tx`} style={{...titleStyle, marginBottom:'50px'}}>{setLT.viewersStatistics} : {gettingCountryViewers ? loader13 : totalView}</div>
          <div style={{margin:'20px 0px 0px', backgroundColor:'#ffffff50', borderRadius:'10px'}}>
            <div id='statisticsArea' style={{padding:w<s ? '0px' : '10px', backgroundColor:'#ffffff50', borderRadius:'10px'}}>
              <div className='d-flex' style={{width:'100%', flexDirection:w<1000 ? 'column' : '', justifyContent:'space-between'}}>
                <div id='worldmap'>
                  {ViewerBSMMap}
                </div>&nbsp;&nbsp;
                <div className='cardShadow' style={{height:w<s ? '250px' : likeViewChatHeight, width:w<s ? '100%' : likeViewChatWidth, padding:'10px', overflow:'scroll', backgroundColor:'#ffffff', borderRadius:'10px'}}>
                  <div className='d-flex justify-content-between' style={{width:'100%'}}>
                    <div>{setLT.totalCountries}: {gettingCountryViewers ? loader13 : countryQTY}</div>
                    <div>{gettingCountryViewers ? loader13 : totalView} {setLT.views}</div>
                  </div>
                  <div style={{minHeight:'350px'}}>
                    {countriesList}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
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

export default connect (mapStateToProps)(SiteView);

