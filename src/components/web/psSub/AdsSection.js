import React, { useState, useEffect, useRef } from 'react';
import { Container, Modal } from 'react-bootstrap';
import { setToggleAds, setAdsInfo } from '../../../dataStore/actions';
import ModalHandleAds from '../../modals/ModalHandleAds';
import RubyCollector from '../../RubyCollector';
import { FcStackOfPhotos } from "react-icons/fc";
import { BsFillCaretLeftFill } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';
import { AdsHorizontal } from '../../GoogleAds'
import {  } from './psHelper';
import { s, lightColors, googleAds } from '../../../srcSet';

const AdsSection = (props) => {
    const { me, fc, loadingAds, subTitleStyleS, allAds, activeType, categoryTitleX, categoryTitleXSub, categoryItems, catXRef, adsN, adsNCat, adsNCatSub, adsNSearch, searchAds, psList, finishDataAds, loader, More, MoreX, EditBtn, handleGetAllAds, handleGetAllAdsSub, handleGetAllSearchAds, toggleShowPS, onToggleShowPS, resetAds, catQty, dispatch, mapStateToProps } = props;
    const { mainUser, subUserInfo, setLT, lang, rtl, } = mapStateToProps;
    const [w, setW] = useState(document.body.clientWidth);
    // const adsRef = useRef(null); // اضافه کردن رفرنس برای adsAdsSection

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // ⬇️ مشاهده adsAdsSection با استفاده از Intersection Observer
    // useEffect(() => {
    //     if (adsRef.current) {
    //         const observer = new IntersectionObserver(
    //             (entries) => {
    //                 entries.forEach((entry) => {
    //                     if (entry.isIntersecting) {
    //                         console.log('ads seen');
    //                     }
    //                 });
    //             },
    //             { threshold: 0.5 } // زمانی که 50٪ از عنصر دیده شود
    //         );
    //         observer.observe(adsRef.current);

    //         // پاک کردن observer در هنگام unmount
    //         return () => {
    //             if (adsRef.current) {
    //                 observer.unobserve(adsRef.current);
    //             }
    //         };
    //     }
    // }, []);

    const onToggleAds = (type) => {
        dispatch(setToggleAds({type}))
    }

    const setAdsFunction = (type) => {
        var func
        switch (true) {
            case type==='sub' : func = handleGetAllAdsSub(); break;
            case type==='search' : func = handleGetAllSearchAds(); break;
            default: func = handleGetAllAds('')
        }
        return func
    }

    const moreAds = <div onClick={() => setAdsFunction(activeType)}><More fc={fc}/></div>
    const moreXAds = <div onClick={() => setAdsFunction(activeType)}><MoreX fc={fc} margin='140px 40px 40px'/></div>

    const moreConst = (
        <div key='more' className='center' style={{width:'100%', height:!finishDataAds ? '100px' : '0px', alignItems:'center', marginBottom:'100px'}}>
            {(loadingAds && !finishDataAds) && loader}
            {(!loadingAds && !finishDataAds && allAds.length>0) && (w<s ? moreXAds : moreAds)}
        </div>
    )

    const allAdsWithMore = w<s ? [...allAds, moreConst] : allAds;

    const allAdsList = (
        <div className={w<s ? 'd-flex mostly-customized-scrollbar' : 'center'} style={{alignItems:'stretch', flexWrap: w<s ? '' : 'wrap', overflow: w<s ? 'scroll' : '', overflowY: 'hidden',}}>
            {allAdsWithMore}
        </div>
    )

    const adsTitleSub = (
        <div className={`d-flex`} style={subTitleStyleS}>
        {me && <EditBtn type={'add'} position={''} margin={'0px 10px'} onClick={() => onToggleAds('new')}/>}
            <FcStackOfPhotos style={{width:'30px', height:'30px', margin:'0px 5px'}} />
            <div className={ w<s ? '' : 'd-flex'} style={{alignItems:'center'}}>
                <span style={{fontSize:'14px', display: activeType==='' ? '' : 'none'}}>&nbsp;({adsN ? allAds.length + '/' + (catXRef==='All' ? subUserInfo.totalAds : adsNCat) : '-'})</span>
                { activeType==='sub' && <span style={{fontSize:'14px'}}>({searchAds.length + '/' + adsNCatSub})</span>}
                { activeType==='search' &&
                    <div className='d-flex'>
                        <div className='d-flex' style={{alignItems:'center'}}>
                            <div><BsFillCaretLeftFill style={{width:'30px', transform:'rotate(180deg)'}}/></div>
                        </div>
                        <span>({searchAds.length + '/' + adsNSearch})</span>
                    </div>
                }
            </div>
        </div>
    )

    const modalShowPS = (
        <Modal show={toggleShowPS} onHide={() => onToggleShowPS()} size='xl' >
            <div id='modalShowPS' className = '' style={{padding:'0px'}}>
                <Modal.Body style={{fontSize:'13px', backgroundColor:'#ffffff00', borderRadius:'3px', padding:'0px'}}>
                    <div className='d-flex sticky-top' style={{top:10, margin:'10px', alignItems:'center', color:`${lightColors.includes(fc) ? '#00000090' : '#ffffff'}`, direction:'rtl'}}>
                        <div className={`center C${fc}`} onClick={() => onToggleShowPS()}
                            style={{width:'40px', height:'40px', padding:'2px', margin:'0px 0px 5px',borderRadius:'100px',
                                border: `3px solid ${lightColors.includes(fc) ? '#00000020' : '#ffffff99'}`,
                            }}>
                            <MdClose className='sidebarIcon sticky-top' style={{marginTop:'5px', width:'30px', fontSize:'30px', fontWeight:'bold', cursor:'pointer', position:'absolute', zIndex: '1000'}}/>
                        </div>
                    </div>
                    {psList}
                    { adsN>0 &&
                        <div className='center' style={{width:'100%', height:!finishDataAds ? '100px' : '0px', alignItems:'center'}}>
                            {(loadingAds && !finishDataAds) && loader}
                            {(!loadingAds && !finishDataAds && allAds.length>0) && moreAds}
                        </div>
                    }
                </Modal.Body>
            </div>
        </Modal>
    )
    
    const modalHandleAds = (
        <ModalHandleAds
            loader={loader}
            adsN={adsN}
            categoryItems={categoryItems}
            EditBtn={EditBtn}
            onToggle={onToggleAds}
            handleGetAllAds={handleGetAllAds}
            resetAds={resetAds}
            catQty={catQty}
            mapStateToProps={mapStateToProps}
        />
    )

    const adsBox = <div className='adsbox2'><AdsHorizontal id='adsHAds' /></div>

    return (
        <div id='ads' style={{marginTop:'20px', position:'relative'}}>
            {adsTitleSub}
            {allAdsList}
            {w>=s && adsN>0 && moreConst}
            {me && w>s && googleAds && subUserInfo.ads && adsBox}
            {/* <RubyCollector id='adsHAds' bottom={-70} left={rtl ? (me ? 60 : 20) : ''} right={rtl ? '' : (me ? 60 : 20)}/> */}
            {modalShowPS}
            {modalHandleAds}
        </div>
    );
}

export default AdsSection;
