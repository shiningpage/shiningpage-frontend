import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import { FaAngleLeft } from 'react-icons/fa';
import { IoGlobeSharp, IoGlobeOutline } from "react-icons/io5";
import { WorldMap } from 'react-svg-worldmap';
import { getPos, dig3 } from '../helper';
import { serverURL, s, countryArr, mapColors, listRefreshQty, listRefreshQtySmall, colors, lightColors } from '../srcSet';

class SiteView extends Component {

  state = {
    w: document.body.clientWidth,
    h: document.body.clientHeight,
    likeViewChatWidth: 300,
    likeViewChatHeight: 450,
    viewCountAll: [],
    topCountries:[],
  }

  componentDidMount = async () => {
    window.addEventListener("resize", this.onResize)
    const statisticsSub = document.getElementById('statisticsSub');
    const statisticsSubTop = statisticsSub.getBoundingClientRect().top;
    await this.getCountryViewers()
    // this.setStatisticsSize()
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

  getCountryViewers = async () => {
    this.setState({
      gettingPageViewers: true,
      viewCountAll: []
    });

    const data = {
      userId: this.props.userId,
    };

    let cxArr = [];

    await axios.post(`${serverURL}/view/getSiteViewMainGroup`, data).then(res => {

      let cx = res.data;
      console.log("cx:", cx);

      // map سریع برای countryCode -> countryName
      const countryMap = Object.fromEntries(
        countryArr.map(item => [item.code, item.country])
      );

      // merge بر اساس countryCode
      const merged = {};

      cx.forEach(item => {
        const code = item.countryCode;

        if (!merged[code]) {
          merged[code] = {
            countryCode: code,
            country: countryMap[code] || item.country,
            value: item.view,
          };
        } else {
          merged[code].value += item.view;
        }
      });

      const finalData = Object.values(merged);
      const totalViews = finalData.reduce(
        (sum, item) => sum + item.value,
        0
      );

      this.setState({ totalViews });
      console.log('totalViews: ', totalViews)
      cxArr = finalData
        .map(item => ({
          country: item.countryCode,
          value: item.value,
          percentage: totalViews ? `${((item.value / totalViews) * 100).toFixed(1)}%` : "0%"
        }))
        .sort((a, b) => b.value - a.value);

      console.log("cxArr:", cxArr);
    });

    this.makeCountriesData(cxArr);

    console.log('viewCountAll: ', [...cxArr, { country: "xx", value: 0 }])
    this.setState(
      {
        viewCountAll: [...cxArr, { country: "xx", value: 0 }],
        gettingPageViewers: false,
      }
    );
  };

  makeCountriesData = (countries) => {
    console.log('countries: ', countries)
    // تبدیل کد کشور به اسم
    const countryNames = new Intl.DisplayNames(["en"], {
      type: "region",
    });

    // تبدیل کد کشور به پرچم
    const getFlagEmoji = (countryCode) => {
      if (countryCode === "QQ") return "🌍";

      return countryCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(127397 + char.charCodeAt())
        );
    };

    const maxValue = Math.max(...countries.map((c) => c.value));

    const topCountries = countries.map(
      (item, index) => {
        const percentage = (item.value / maxValue) * 100;
        return (
          <div className="width-full mb-4" key={index}>
            <div className="flex items-start justify-between text-[#ffffff]">
              <div className="flex items-center gap-2.5 -mt-1">
                <span className="text-[20px]">
                  {getFlagEmoji(item.country)}
                </span>

                <span className="text-[15px] font-medium">
                  {item.country === "QQ"
                    ? "Unknown"
                    : countryNames.of(item.country)}
                </span>
              </div>

              <div>
                <div className="text-[14px] font-light -mb-1">{item.value.toLocaleString()}</div>
                <div className='text-right text-[12px] text-[#858BAD]'>{item.percentage}</div>
              </div>
            </div>

            <div className="w-full h-2 bg-[#1B2D61] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#3072E9] via-[#CA3DD8] to-[#FCBD2F] transition-[width] duration-400 ease-in-out" style={{ width: `${percentage}%` }}/>
            </div>
          </div>
        );
      }
    )

    this.setState({
      topCountries
    })
  }

  onResize = async () => {
    this.setState({ w: document.body.clientWidth })
  }

  render() {
    const { w, h, topCountries, totalViews, gettingCountryViewers, likeViewChatWidth, likeViewChatHeight, viewCountAll, totalView, countriesList, countryQTY } = this.state
    const {setLT, rtl, fc} = this.props
    const titleStyle = {fontSize:  w<s ? '25px' : '30px', fontWeight:450, margin:'0px 0px 15px', textAlign: rtl ? 'right' : 'left', alignItems:'center', whiteSpace:'', color:'', width:'100%'}
    const loader13 = <div className='loader-13' style={{margin: rtl ? '35px 20px -25px' : '0px 20px 0px', color:'#000000', transform: rtl ? 'rotate(180deg)' : '', fontSize:'14px'}}></div>

    const ViewerBSMMap = (
      <div id='viewMap' className='center animated fadeIn [&_path]:!fill-[#f2ba4b] [&_*]:!bg-[#020D7000]' style={{animationDelay:'0s', width:'100%', margin:'0px'}}>
        <div className='' style={{width:'100%', overflow:'scroll', borderRadius:'10px'}}>
          <WorldMap color='#0066ff' borderColor='#f2ba4b' size={w<1000 ? "lg" : "xl"} data={viewCountAll}/>
        </div>
      </div>
    )

    const topCountriesSub = (
      <div className={`bg-[#02011B99] rounded-[22px] p-[22px] shadow-[0_1px_20px_#ffffff30] h-full ${w < s ? "w-full" : "w-[30%]"}`}>
        <div className="flex mb-6 text-white items-center justify-between">
          <h5 className='font-[650] font-light'>Audience views</h5>
          <h4 className='!text-[18px]'>{Number(totalViews).toLocaleString()}</h4>
        </div>
        <div className={`z-0 w-full max-h-[400px] overflow-y-scroll ${topCountries.length > 0 ? "" : "min-w-[300px]"} mostly-customized-scrollbar`}>
          <div className="countriesList">
            {topCountries}
          </div>
        </div>
      </div>
    )

    const worldmapTitle = (
      <div className={`flex text-white text-[18px] font-bold items-center gap-[5px] ${w < s ? 'mx-[15px]' : ''}`}>
        <IoGlobeOutline className="goldenText -mt-2.5 text-[25px]"/>
        <h5 className='goldenText font-[650] !font-light'>Audience Map</h5>
      </div>
    )

    const worldmapSection = (
      <div className='flex cardShadow backBlur border !border-white/20' style={{width:'100%', maxWidth:'1100px', height:w<s ? '' : '550px', flexDirection:w<s ? 'column' : '', justifyContent:w<s ? '' : 'space-between', marginBottom:'20px', padding:w<s ? '20px 0px 0px' : '20px', backgroundColor:'#ffffff10', borderRadius:'20px', flexWrap:'wrap'}}>
        <div>
          {worldmapTitle}
          {ViewerBSMMap}
        </div>
        {topCountriesSub}
      </div>
    )

    return (
      <div id='statisticsSub' className='center' style={{width:'100%', padding:'70px 10px'}}>
          {worldmapSection}
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

