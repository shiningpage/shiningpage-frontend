import axios from 'axios';
import date from 'date-and-time';
import { setGeo } from '../dataStore/actions';
import { getFingerprint, getLocalIPs } from '../helper';
import { serverURL, s, siteName } from '../srcSet';
import { exist } from '../helper';

const siteView = async (props) => {
    var today = date.format(new Date(), 'YYYY/MM/DD')
    const visitorId = await getFingerprint()
    const local = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? true : false

    // const ips = await getLocalIPs()
    const siteViewInfo = {
        visitorId,
        // deviceIP : ips ? ips[0] : '',
        // externalIP : ips ? ips[1] : '',
        // ips,
        continent : props.geo.continent,
        countryCode : props.geo.countryCode,
        country : props.geo.country,
        city : props.geo.city,
        genderValue: props.mainUser ? props.mainUser.genderValue : '',
        username: props.mainUser ? props.mainUser.username : '',
        subject: props.subject!=='' ? props.subject : window.location.pathname.split('/')[2],
        lang: props.lang,
        viewDate: today,
        view: 1,
        version: process.env.REACT_APP_VERSION,
        siteName: local ? 'local - ' + siteName : siteName,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        screen: `height: ${(window.screen||[]).height}, width: ${(window.screen||[]).width}`,
    }

    // console.log(siteViewInfo)

    // if(!siteViewInfo.countryCode) {
    //     await axios.get('https://extreme-ip-lookup.com/json/?key=0Pj2L6oNoa307KidCFE6')
    //     .then(async (res) => {
    //         let data = res.data;
    //         siteViewInfo.continent = data.continent
    //         siteViewInfo.countryCode = data.countryCode
    //         siteViewInfo.country = data.country
    //         siteViewInfo.city = data.city
    //     })
    // }

    axios.post(`${serverURL}/view/addSiteView/` , siteViewInfo).then(async res => {
        console.log(res.data)
        const result = res.data
        // await props.dispatch(setGeo(result))
        if(exist(result.countryCode)) {
            axios.post(`${serverURL}/view/addSiteViewMain/` , result)//.then(res => {});
        }
    })

    var dataView = {
        option: 1000000000,
        dx: 0
    }

    axios.post(`${serverURL}/view/getSiteViewMain`, dataView)
    .then(async res => {
        var data = res.data

        let accumulation = data.reduce((total, val, index)=>{
            let foundItemIndex = total.findIndex((obj)=>obj.country == val.country);
            if(foundItemIndex < 0) total.push(val) 
            else total[foundItemIndex].view = 1; //+= val.view;
            return total;
        }, []);

        var vx = accumulation
        var vxArr = []
        // console.log(vx)
        // var x = 0
        for(var i=0; i<vx.length; i++) {
            vxArr.push({"_id": vx[i].countryCode, "country": vx[i].country, "count": vx[i].view})
        }

        // console.log('cx :', cx)
        // console.log('vxArr :', vxArr)
        var total = vxArr //cx ? cx.concat(vxArr) : vxArr
        // console.log(vxArr)

        var tSum = total.map(n => n.count).reduce((a, b) => a + b, 0);
        // console.log(tSum, total)

        var fn = Math.floor(Math.random() * 10) //+ 1
        var tl = total.length
        // console.log('fn',fn)

        for(var x=0; x<fn; x++) {
            var ti = Math.floor(Math.random() * tSum) + 1
            // console.log('ti',ti)
            var q=0
            var finish = false
            for(var a=0; a<tl && !finish; a++) {
                q = q + total[a].count
                // console.log('q', q)

                if(ti<=q) {
                    const fakeViewInfo = {
                        countryCode : total[a]._id,
                        country : total[a].country,
                        viewDate: today,
                        view: 1
                    }
                    // console.log(fakeViewInfo.countryCode)
                    finish = true

                    if(fakeViewInfo.countryCode!=='AF') axios.post(`${serverURL}/view/addSiteViewMain/`, fakeViewInfo).then(res => {});
                }

            }
        }
  

      })



}

export default siteView;

  // function getGeo () {
  //   return axios.get('https://extreme-ip-lookup.com/json/')
  //     .then(async (res) => {
  //       let data = res.data;
  //       // console.log(data)
  //       data.country_name = data.country
  //       return data
  //   })
  // }

  // if(props.geo===undefined) {
    // getGeo().then(res => {
    //   console.log(res)
    //   const siteViewInfo = {
    //     continent : 'rrr',//res.continent,
    //     countryCode : res.countryCode,
    //     country : res.country,
    //     city : res.city,
    //     genderValue: props.mainUser.genderValue,
    //     username: props.mainUser.username,
    //     subject: '22222',//props.geo,
    //     viewDate: date.format(new Date(), 'YYYY/MM/DD'),
    //     view: 1
    //   }
    //   // console.log(siteViewInfo)
    //   axios.post(`${serverURL}/view/addSiteView/` , siteViewInfo).then(res => {
    //   });
    // })
  // } else {
  //   const siteViewInfo = {
  //     continent : props.geo.continent,
  //     countryCode : props.geo.countryCode,
  //     country : props.geo.country,
  //     city : props.geo.city,
  //     genderValue: props.mainUser.genderValue,
  //     username: props.mainUser.username,
  //     viewDate: date.format(new Date(), 'YYYY/MM/DD'),
  //     view: 1
  //   }
  //   // console.log(siteViewInfo)
  //   axios.post(`${serverURL}/view/addSiteView/` , siteViewInfo).then(res => {
  //   });
  // }

