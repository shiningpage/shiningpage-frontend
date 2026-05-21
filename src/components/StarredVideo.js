import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setStarredVideo, setSubUserInfo, setToggleShowVideo, setVideoInfo } from '../dataStore/actions'; 
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';
import { Link } from "react-router-dom";
import { MdLocationOn } from 'react-icons/md';
import { FaYoutube, FaLinkedin } from 'react-icons/fa';

import { serverURL, s } from '../srcSet';

class StarredVideo extends Component{

    state = {
        w: window.innerWidth,
        // n: 15,
        // lx:listRefreshQty, 
        n: 1,
        lx:30,
        searchVideo:[],
        loadingData: true,

    }

    componentDidMount = async () => {
        this.getStarredVideo()
    }

    getStarredVideo = async () => {
        this.setState({
            loadingData:true,
        })

        const {lx} = this.state
        var dx = {
            lx,

        }
        await axios.post(`${serverURL}/video/getStarredVideo`).then(async res => {
            var x2 = res.data
            // console.log(4455, x2)
            var x1 = this.state.searchVideo
            this.setState({
              searchVideo : x1.concat(x2),
            })

            await this.props.dispatch(setStarredVideo(this.state.searchVideo))
            await this.mapVideo(this.state.searchVideo)
            this.setState({
                loading:false,
                finishData: res.data.length<lx ? true : false
            })
        })
    }

    mapVideo = async (video) => {
        const {w, } = this.state
        const {rtl, setLT, geo} = this.props
        var YoutubeIcon, AparatIcon, LinkedinIcon, star, starIcon, aparat, aparatVideo, youtube, youtubeVideo, linkedinVideo, countryCode, address, userImage, userLine, adsCommentStyle, adsTime, starIcon, star, starSystem, img, TLen, CLen, adsTitle
        const loaderZ = <div className='loader-02' style={{margin: '0px', color:'#000000', transform: rtl ? 'rotate(180deg)' : ''}}></div>
        var allVideo = video.map(
            (item, i) => (
                // console.log(12, item),
                youtubeVideo = `https://www.youtube.com/embed/${item.vCode}`,
                aparatVideo = `https://www.aparat.com/video/video/embed/videohash/${item.vCode}/vt/frame`,
                linkedinVideo = `https://www.linkedin.com/embed/latest/update/urn:li:ugcPost:${item.vCode}?compact=1`,
                starIcon = (
                    <img
                        className=''
                        style={{height:'20px', width:'20px'}}
                        src={require('../assets/images/other/starX.png')}
                        alt='star'
                    />
                ),
                star = (
                    <div className='d-flex' style={{height:'30px', float:'right', direction:'ltr'}}>
                        {item.star > 0 && starIcon}
                        {item.star > 1 && starIcon}
                        {item.star > 2 && starIcon}
                    </div>
                ),
                userImage = (
                    <img
                        className={`C${item.fc}`}
                        style={{objectFit: 'contain', width:"30px", height:"30px", borderRadius:item.businessType>0 ? '3px' : '100px', border:'0px solid #ffffff40', margin:'0px 0px', padding:'1px'}}
                        src={(item.imageData!=='' && item.imageData!==undefined)
                            ? item.imageData
                            : item.genderValue===0 ? female : male}
                        alt="user"
                    />
                ),
                YoutubeIcon = <FaYoutube style={{fontSize:'30px', margin:'10px', color:'#c4302b'}}/>,
                AparatIcon = <img style={{width:'30px', height:'25px', margin:'10px'}} src={require('../assets/images/other/aparat.png')} alt="Aparat Icon"/>,
                LinkedinIcon = <FaLinkedin className='' style={{fontSize:'25px', margin:'10px', color:'#0e76a8'}}/>,
                userLine = (
                    <div className='d-flex' style={{alignItems:'center', cursor:'pointer', justifyContent:'space-between'}}
                        onClick={() => this.getUserInfo(i, item.userId)}>
                        <div>
                            {userImage}&nbsp;
                            {item.username}&nbsp;
                            {item.loading && loaderZ}
                        </div>
                        <div>
                            {item.vType === 'Youtube' && YoutubeIcon}
                            {item.vType === 'Aparat' && AparatIcon}
                            {item.vType === 'Linkedin' && LinkedinIcon}
                        </div>
                    </div>
                ),
                countryCode = item.countryCode ? item.countryCode.toLowerCase() : '',
                address = (
                    <div className='d-flex' style={{direction:'ltr', alignItems:'flex-start'}}>
                        <span className={`flag-icon flag-icon-${countryCode} cardShadow`}></span> &nbsp;
                        <div style={{margin: '0px', fontSize:'12px', textAlign:'center'}}>{item.country}</div>
                    </div>
                ),
                <div key={i} className='center' style={{textDecoration:'none', width:'100%'}}>
                    <div className='cardShadow' style={{opacity:'.9', margin:'10px', padding:'5px', width:'250px', height:'', borderRadius:'5px', backgroundColor:'#ffffff', cursor:'pointer'}}>
                        <div className='d-flex' style={{width:'100%', height:'', margin: '0px 0px -3px', alignItems:'center', justifyContent:'space-between', direction: 'ltr'}}>
                            {address}
                            {star}
                        </div>
                        <div sttyle={{}} onClick={() => this.onToggleShowVideo(item)}>
                            {item.vType === 'Youtube' && <iframe src={youtubeVideo}/>}
                            {item.vType === 'Aparat' && <iframe src={aparatVideo}/>}
                            {item.vType === 'Linkedin' && <iframe src={linkedinVideo}/>}
                        </div>
                        <div style={{width:'100%', height:'', margin: '5px 0px 0px', direction: 'ltr'}}>
                            {userLine}
                        </div>
                    </div>
                </div>
            )
        )
        this.setState({
            allVideo,
            loadingData:false,
        })
    }

    getUserInfo = async (i, userId) => {
        var data = this.state.searchVideo
        data[i].loading=true
        await this.mapVideo(data)
        this.setState({loading:true})
        axios.post(`${serverURL}/user/getUserInfo`, { _id: userId })
        .then(async res => {
            delete res.data.password
            // console.log('nnn', res.data)

            var item = res.data
            // console.log(item)
            if(item) this.props.dispatch(setSubUserInfo(item))
            data[i].loading=false
            await this.mapVideo(data)
        })
    }

    onToggleShowVideo = async (item) => {
        // console.log(item)
        this.props.dispatch(setToggleShowVideo(!this.props.toggleShowVideo))
        this.props.dispatch(setVideoInfo(item))

        // this.updateVideoInfo(item)
    }

	render () {
        const {w, allVideo, loading, loadingData, finishData} = this.state
        const {rtl, auth, page, setLT, starredVideo} = this.props

        const ColorLoadingCenter = (
            <div className='center' style={{width:'100%', direction:'ltr'}}>loading...</div>
        )
        const allVideoList = (
            <div className={'d-flex'} style={{width:'', padding:w<s ? '0px' : '0px', alignItems:'', justifyContent:'', flexWrap: '', zIndex:'0', backgroundColor:''}}>
                {(loadingData  && starredVideo.length===0) ? ColorLoadingCenter : allVideo}
            </div>
        )

        return (
            <div className='d-flex' style={{width: '100%', padding:'10px 0px', margin:'0px 0px 0px', alignItems:'stretch'}}>
                <div className='d-flex animated fadeInUpX' style={{animationDelay:'1s', width: '100%', height:'', borderRadius:'0px', backgroundColor:'', margin:'0px', border:'0px solid #00CCFF', flexDirection:'column'}}>
                    <div className='' style={{top:0, width:'100%', height:'', padding:'0px 0px 0px 0px', flexDirection:'', direction:'rtl', overflow:'scroll'}}>
                        {allVideoList}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        rtl: state.rtl,
        lang: state.lang,
        auth: state.auth, 
        page: state.page,
        setLT: state.setLT,
        starredVideo: state.starredVideo,
        geo: state.geo,
    }
}

export default connect (mapStateToProps)(StarredVideo);
