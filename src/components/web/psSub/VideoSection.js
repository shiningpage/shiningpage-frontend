import React, { useState, useEffect } from 'react';
import { Container, Modal, Button } from 'react-bootstrap';
import { setToggleVideo, setAdsInfo } from '../../../dataStore/actions';
import ModalHandleVideo from '../../modals/ModalHandleVideo';
import RubyCollector from '../../RubyCollector';
import { FcStackOfPhotos } from "react-icons/fc";
import { BsImages, BsFillCaretLeftFill } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';
import { AdsHorizontal, AdsHorizontalSmall } from '../../GoogleAds'
import {  } from './psHelper';
import { s, lightColors, googleAds } from '../../../srcSet';

const VideoSection = (props) => {
    const { me, fc, loader, loadingVideo, subTitleStyleS, allVideo, activeType, categoryTitleX, categoryTitleXSub, categoryItems, catXRef, videoN, videoNCat, videoNCatSub, videoNSearch, searchVideo, psList, finishDataVideo, loader13, More, MoreX,  EditBtn, handleGetAllVideo, handleGetAllVideoSub, handleGetAllSearchVideo, toggleShowVideo, onToggleShowVideo, resetVideo, catQty, dispatch, mapStateToProps } = props;
    const { mainUser, subUserInfo, setLT, lang, rtl, } = mapStateToProps;
    const [w, setW] = useState(document.body.clientWidth);

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const onToggleVideo = (type) => {
        dispatch(setToggleVideo({type}))
    }

    const setVideoFunction = (type) => {
        var func
        switch (true) {
            case type==='sub' : func = handleGetAllVideoSub(); break;
            case type==='search' : func = handleGetAllSearchVideo(); break;
            default: func = handleGetAllVideo('')
        }
        return func
    }

    const moreVideo = <div onClick={() => setVideoFunction(activeType)}><More fc={fc}/></div>
    const moreXVideo = <div onClick={() => setVideoFunction(activeType)}><MoreX fc={fc} margin='130px 40px 40px'/></div>

    const moreConst = (
        <div key='more' className='center' style={{width:'100%', height:!finishDataVideo ? '100px' : '0px', alignItems:'center', marginBottom:'100px'}}>
            {(loadingVideo && !finishDataVideo) && loader}
            {(!loadingVideo && !finishDataVideo && allVideo.length>0) && (w<s ? moreXVideo : moreVideo)}
        </div>
    )
    
    const allVideoWithMore = w<s ? [...allVideo, moreConst] : allVideo;

    const allVideoList = (
        <div className={w<s ? 'd-flex mostly-customized-scrollbar' : 'center'} style={{alignItems:'stretch', flexWrap: w<s ? '' : 'wrap', overflow: w<s ? 'scroll' : '', overflowY: 'hidden',}}>
            {allVideoWithMore}
        </div>
    )

    const videoTitleSub = (
        <div className={`d-flex`} style={subTitleStyleS}>
            {me && <EditBtn type={'add'} position={''} margin={'0px 10px'} onClick={() => onToggleVideo('new')}/>}
            <img
                style={{width:'25px', height:'25px', margin:'0px 5px', filter: mainUser.businessType>=1 ? '' : 'grayscale(100%)'}}
                src={require(`../../../assets/images/other/video.png`)}
                alt="video icon"
            />
            <div className={ w<s ? '' : 'd-flex' } style={{alignItems:'center'}}>
                <span style={{fontSize:'14px', display: activeType==='' ? '' : 'none'}}>&nbsp;({videoN ? allVideo.length + '/' + (catXRef==='All' ? subUserInfo.totalVideo : videoNCat) : '-'})</span>
                { activeType==='sub' && <span style={{fontSize:'14px'}}>({searchVideo.length + '/' + videoNCatSub})</span>}
                { activeType==='search' &&
                    <div className='d-flex'>
                        <div className='d-flex' style={{alignItems:'center'}}>
                            <div><BsFillCaretLeftFill style={{width:'30px', transform:'rotate(180deg)'}}/></div>
                        </div>
                        <span>({searchVideo.length + '/' + videoNSearch})</span>
                    </div>
                }
            </div>
        </div>
    )
    
    const modalHandleVideo = (
        <ModalHandleVideo
            loader={loader}
            videoN={videoN}
            categoryItems={categoryItems}
            EditBtn={EditBtn}
            onToggle={onToggleVideo}
            handleGetAllAds={handleGetAllVideo}
            resetVideo={resetVideo}
            catQty={catQty}
            mapStateToProps={mapStateToProps}
        />
    )

    const adsBox = <div className='adsbox2'><AdsHorizontal id='adsHVideo' /></div>

    return (
        <div id='video' style={{marginTop:'20px', position:'relative'}}>
            {videoTitleSub}
            {allVideoList}
            {w>=s && videoN>0 && moreConst}
            {me && w>s && googleAds && subUserInfo.ads && adsBox}
            {/* <RubyCollector id='adsHVideo' bottom={-50} left={rtl ? (me ? 60 : 20) : ''} right={rtl ? '' : (me ? 60 : 20)}/> */}
            {modalHandleVideo}
        </div>
    );
}

export default VideoSection;
