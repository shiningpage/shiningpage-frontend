import React, { useState, useEffect } from 'react';
import { Container, Modal, Button } from 'react-bootstrap';
import { setToggleInsta, setAdsInfo } from '../../../dataStore/actions';
import ModalHandleInsta from '../../modals/ModalHandleInsta';
import RubyCollector from '../../RubyCollector';
import { FcStackOfPhotos } from "react-icons/fc";
import { BsImages, BsFillCaretLeftFill } from 'react-icons/bs';
import { FaInstagram } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { AdsHorizontal } from '../../GoogleAds'
import {  } from './psHelper';
import { s, lightColors, googleAds } from '../../../srcSet';

const Test = (props) => {
    const { me, fc, loader, loadingInsta, subTitleStyleS, allInsta, activeType, categoryTitleX, categoryTitleXSub, categoryItems, catXRef, instaN, instaNCat, instaNCatSub, instaNSearch, searchInsta, finishDataInsta, loader13, More, MoreX,  EditBtn, handleGetAllInsta, handleGetAllInstaSub, handleGetAllSearchInsta, resetInsta, catQty, dispatch, mapStateToProps } = props;
    const { mainUser, subUserInfo, setLT, lang, rtl, } = mapStateToProps;
    const [w, setW] = useState(document.body.clientWidth);

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const onToggleInsta = (type) => {
        dispatch(setToggleInsta({type}))
    }

    const setInstaFunction = (type) => {
        var func
        switch (true) {
            case type==='sub' : func = handleGetAllInstaSub(); break;
            case type==='search' : func = handleGetAllSearchInsta(); break;
            default: func = handleGetAllInsta('')
        }
        return func
    }

    const moreInsta = <div onClick={() => setInstaFunction(activeType)}><More fc={fc}/></div>
    const moreXInsta = <div onClick={() => setInstaFunction(activeType)}><MoreX fc={fc} margin='180px 40px 40px'/></div>

    const moreConst = (
        <div key='more' className='center' style={{width:'100%', height:!finishDataInsta ? '100px' : '0px', alignItems:'center', marginBottom:'100px'}}>
            {(loadingInsta && !finishDataInsta) && loader}
            {(!loadingInsta && !finishDataInsta && allInsta.length>0) && (w<s ? moreXInsta : moreInsta)}
        </div>
    )
    
    const allInstaWithMore = w<s ? [...allInsta, moreConst] : allInsta;

    const allInstaList = (
        <div className={w<s ? 'd-flex mostly-customized-scrollbar' : 'center'} style={{alignItems:'stretch', flexWrap: w<s ? '' : 'wrap', overflow: w<s ? 'scroll' : '', overflowY: 'hidden',}}>
            {allInstaWithMore}
        </div>
    )

    const instaTitleSub = (
        <div className={`d-flex`} style={subTitleStyleS}>
            {me && <EditBtn type={'add'} position={''} margin={'0px 10px'} onClick={() => onToggleInsta('new')}/>}
            <FaInstagram className='' style={{fontSize:'25px', margin:'0px 5px', borderRadius:'8px', color:'#ffffff', backgroundImage: 'linear-gradient(to right top, #fcac0f, #fd9522, #fa7f30, #f36a3c, #e85647, #e44751, #dd395b, #d42d65, #d12174, #ca1b85, #be1e96, #ae27a8)'}}/>
            <span>Instagram</span>
            <div className={ w<s ? '' : 'd-flex'} style={{alignItems:'center'}}>
                <span style={{fontSize:'14px', display: activeType==='' ? '' : 'none'}}>&nbsp;({instaN ? allInsta.length + '/' + (catXRef==='All' ? subUserInfo.totalInstagram : instaNCat) : '-'})</span>
                { activeType==='sub' && <span style={{fontSize:'14px'}}>({searchInsta.length + '/' + instaNCatSub})</span> }
                { activeType==='search' &&
                    <div className='d-flex'>
                        <div className='d-flex' style={{alignItems:'center'}}>
                            <div><BsFillCaretLeftFill style={{width:'30px', transform:'rotate(180deg)'}}/></div>
                        </div>
                        <span>({searchInsta.length + '/' + instaNSearch})</span>
                    </div>
                }
            </div>
        </div>
    )

    const modalHandleInsta = (
        <ModalHandleInsta
            loader={loader}
            instaN={instaN}
            categoryItems={categoryItems}
            EditBtn={EditBtn}
            onToggle={onToggleInsta}
            handleGetAllAds={handleGetAllInsta}
            resetInsta={resetInsta}
            catQty={catQty}
            mapStateToProps={mapStateToProps}
        />
    )

    const adsBox = <div className='adsbox2'><AdsHorizontal id='adsHInsta' /></div>

    return (
        <div id='insta' style={{marginTop:'20px', position:'relative'}}>
            {instaTitleSub}
            {allInstaList}
            {w>=s && instaN>0 && moreConst}
            {me && w>s && googleAds && subUserInfo.ads && adsBox}
            {/* <RubyCollector id='adsHInsta' bottom={-50} left={rtl ? 20 : ''} right={rtl ? '' : 20}/> */}
            {modalHandleInsta}
        </div>
    );
}

export default Test;
