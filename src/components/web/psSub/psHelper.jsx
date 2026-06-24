import React from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { setUserInfo, setSubUserInfo } from '../../../dataStore/actions';
import BeforAfter from '../../BeforAfter';
import pixSave from '../../../modules/pixSave';
import pixDelete from '../../../modules/pixDelete';
import pixHandler from '../../../modules/pixHandler';
import pixResizer from '../../../modules/pixResizer';
import { MdEdit } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { BsImages, BsThreeDotsVertical, BsFillCheckCircleFill } from 'react-icons/bs';
import { AiOutlineCloseCircle, AiOutlineZoomIn } from 'react-icons/ai';
import { FaTrash, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa';
import { TbSubtask } from 'react-icons/tb';
import { BiCategory, BiChevronsRight } from 'react-icons/bi';
import { serverURL, listRefreshQty, lightColors } from '../../../srcSet';
import { getPos, dig3 } from '../../../helper';
import aparatImage from "../../../assets/images/other/aparat.png";

var destB = "../pix.shiningpage.com/whoraly/ads/big"

const onSearchAds = async (subUserInfo, searchItems, nAdsSearch, searchAds) => {
    var data = {
        userId:subUserInfo._id,
        searchItems,
        n:nAdsSearch,
        q:listRefreshQty
    }

    const res = await axios.post(`${serverURL}/ads/getUserSearchAds/`, data);
    const x2 = res.data
    const updatedSearchAds = [...searchAds, ...x2];

    return {x2, updatedSearchAds}
}

const onSearchVideo = async (subUserInfo, searchItems, nVideoSearch, searchVideo) => {
    var data = {
        userId:subUserInfo._id,
        searchItems,
        n:nVideoSearch,
        q:listRefreshQty
    }

    const res = await axios.post(`${serverURL}/video/getUserSearchVideo/`, data);
    const x2 = res.data
    const updatedSearchVideo = [...searchVideo, ...x2];

    return {x2, updatedSearchVideo}
}

const onSearchInsta = async (subUserInfo, searchItems, nInstaSearch, searchInsta) => {
    var data = {
        userId:subUserInfo._id,
        searchItems,
        n:nInstaSearch,
        q:listRefreshQty
    }

    const res = await axios.post(`${serverURL}/instagram/getUserSearchInsta/`, data);
    const x2 = res.data
    const updatedSearchInsta = [...searchInsta, ...x2];

    return {x2, updatedSearchInsta}
}

const mapCategory = (ex, data=[], subUserInfo, txBlackx, rtl, setLT, w, s, onCategory, me, EditBtn, onToggleEdit) => {
    const fc = subUserInfo.fc
    const txBlack = lightColors.includes(fc) ? true : false
    // const others = {
    //     "id": 0,
    //     "title": setLT.other,
    //     "sub": []
    // }
    // const exists = data.some(item => JSON.stringify(item) === JSON.stringify(others));
    // if(!exists) data.push(others)

    var dataRV = data.map(
        (item, i) => {
            // console.log(item)
            const index = i===ex ? true : false
            const hasSelected = item.sub.some(category =>
                category.sub.some(service => service.selected === true)
            )
            const img = (
                <div style={{width:'100%', height:'90px', marginBottom:'5px', borderRadius:'7px', overflow:'hidden'}}>
                    <img key={i}
                        className='zoomImg'
                        style={{objectFit:'cover', width:'100%', height:'100%'}}
                        // src={item.image}
                        src={item.id===0
                            ? `https://www.pix.shiningpage.com/whoraly/site/otherPS.jpeg`
                            : `https://www.pix.shiningpage.com/whoraly/category/${subUserInfo._id}-${item.pixId}.jpeg`
                        }
                        alt={item.title}
                    />
                </div>
            )
            // console.log(11111, item);
            const subN = item.sub.length>0 ? ` (${item.sub.length})` : ''
            const title = (
                <div style={{fontSize:w<s ? '15px' : '14px', margin:'0px 5px'}}>
                    {item.title}
                    <span style={{fontSize:'12px'}}>{subN}</span>
                </div>
            )
            const contentCounter = (
                <div className='d-flex' style={{width:'100%', justifyContent:'right', position:'absolute', bottom:0}}>
                    <div id={'catbox' + item.id} className={`d-flex cardShadow C${subUserInfo.fc} f${txBlack ? 7 : 11}`} style={{borderRadius:'100px 0px 22px 0px', padding:'2px 5px 0px 7px'}}>
                        <div id={'cat' + item.id} style={{height:'20px', padding:'0px 7px'}}>{item.qty}</div>
                    </div>
                </div>
            )
            const subCounter = (
                <div className='d-flex' style={{width:'100%', justifyContent:'left', position:'absolute', bottom:0}}>
                    <div id={'subbox' + item.id} className={`d-flex cardShadow f7`} style={{borderRadius:'0px 100px 0px 22px', padding:'2px 7px 0px 5px', backgroundColor:index ? '#ffffff99' : '#ffffff'}}>
                        <div id={'cat' + item.id} style={{height:'20px', padding:'0px 7px'}}>{item.sub.length}</div>
                    </div>
                </div>
            )
            const selectedCheck = <BsFillCheckCircleFill id={`selectedCheck-${item.id}`} color="green" style={{ width: '20px', fontSize: '20px', backgroundColor:'#ffffff', borderRadius:'100px', position:'absolute', zIndex:1, top:10, right:10, display:hasSelected ? '' : 'none' }}/>
            // const editBtn = <EditBtn rtl={rtl} size={30} top={0} right={0} padding='4px' zIndex='1' onClick={() => onToggleEdit(data, i)}/>
            const normalClass = `f7`
            const selectedClass = `f${txBlack ? 7 : 11} C${fc}`

            return (
                <div key={i} className='zoom' style={{position:'relative'}}>
                    <div id={'category' + i} className={`btnShadow disable-select ${index ? selectedClass : normalClass}`}
                        style={{ position:'relative', width:'150px', height:'150px', minWidth:'150px', minHeight:'150px',
                            margin:'5px', border:fc===11 ? '1px solid #99999999' : '1px solid #99999920', //backgroundColor:'#ffffff99',
                            borderRadius:'10px', transition:'.2s', overflow:'hidden', cursor:'pointer'}}
                        onClick={() => onCategory(item, i)}>
                        <div>
                            {img}
                            {title}
                        </div>
                        {item.qty>0 && contentCounter}
                        {/* item.sub.length>0 && subCounter */}
                    </div>
                    {selectedCheck}
                    {/* me && i<data.length-1 && editBtn */}
                </div>
            )
        }
    )

    return dataRV
}

const mapSubcategory = (ex, item, i, data, subUserInfo, setLT, w, s, onSubcategory, onService) => {
    // console.log(99999, data)
    const fc = subUserInfo.fc
    var dataRV = data.map(
        (itemx, ix) => {
            // {ix===ex && console.log('itemx: ', ix, itemx)}
            const index = ix===ex ? true : false
            const hasSelected = itemx.sub?.some(s => s.selected === true);
            const txBlack = lightColors.includes(fc) ? true : false
            const title = <div style={{fontSize:w<s ? '15px' : '14px', margin:'0px 5px'}}>{itemx.title}</div>
            const serviceCount = subUserInfo?.access?.includes("BookingSystem")
                                ? `(${itemx?.sub?.length || 0})`
                                : false;
            const counter = <div id={'subcat' + itemx.id}
                                className={`center C${fc} f${txBlack ? 7 : 11}`}
                                style={{width:'35px', height:'25px', borderRadius:'5px', padding:'2px 5px 0px',
                                marginRight:'10px', display:itemx.qty>0 ? '' : 'none' }}>
                                {itemx.qty}
                            </div>
            const corner = <div id={`subcategoryCorner-${i}-${ix}`}
                                className={`C${fc} b${fc===7 ? 0 : fc}`}
                                style={{position:'absolute', width:'37px', height:'37px', borderRadius:'3px',
                                borderWidth:'0px', transform:'rotate(45deg)', margin: index ? (w<s ? '15px 0px 0px' : '0px -8px 0px 0px') : '0px', 
                                transition:'.3s', top:w<s ? 15 : 6.5, right:w<s ? 12 : -5, zIndex:0}}>
                            </div>
            const whiteCover = <div id={`subcategoryWhiteCover-${i}-${ix}`}
                                    className='d-flex justify-content-start'
                                    style={{width:'100%', height:'100%', zIndex:'100', 
                                    marginRight:'10px',borderRadius:'5.5px', alignItems:'center',
                                    background:"linear-gradient(to right, white 0%, transparent 70%, transparent 100%)", }}>
                                    {title}{serviceCount}
                                </div>
                                //, position:'absolute', zIndex:1, top:20, right:10, display:''
            const selectedCheck = <BsFillCheckCircleFill id={`selectedCheck-${itemx.id}`} color="green"
                                    style={{ minWidth: '20px', fontSize: '20px', marginRight:'10px', backgroundColor:'#ffffff',
                                            borderRadius:'100px', display:hasSelected ? '' : 'none'}}/>
            return (
                <div key={ix}>
                    <div className='d-flex'
                        style={{position:'relative', marginTop: w<s && ix>0 && ix===ex ? '20px' : ''}}
                        onClick={() => onSubcategory(item, i, itemx, ix)}>
                        <div id={`subcategory-${i}-${ix}`}
                            className={`d-flex justify-content-end btnShadow C${index ? fc : 11}`}
                            style={{width:'100%', height:'50px', marginBottom:w<s && index ? '25px' : '10px',
                            padding:'2px', borderRadius:'7px', alignItems:'center', transition:'.2s',
                            backgroundColor:'#ffffff', zIndex:'1'}}
                        >
                            {whiteCover}
                            {counter}
                            {selectedCheck}
                        </div>
                        {corner}
                    </div>
                    { w<s && ix===ex && itemx.sub.length>0 &&
                        <div className={`C${fc}`}
                            style={{ margin:'5px 0px 30px', padding:'2px', borderRadius:'7px', }}>
                            <div style={{padding:'2px', borderRadius:'5px', backgroundColor:'#ffffff'}}>
                                {mapService(item, i, itemx.sub, subUserInfo, setLT, w, s, onService)}
                            </div>
                        </div>
                    }
                    {/*  ix===ex && 
                        <div className={`C${fc}`}
                            style={{ margin:'5px 0px 30px', padding:'2px', borderRadius:'7px', }}>
                            <div style={{padding:'2px', borderRadius:'5px', backgroundColor:'#ffffff'}}>
                                CONTENT
                                {allVideo}
                            </div>
                        </div>
                     */}
                </div>
            )
        }
    )

    return dataRV
}

const mapService = (item, i, data, subUserInfo, setLT, w, s, onService) => {
    // console.log('item: ', item)
    var dataRV = data.map(
        (item, i) => {
            // console.log(678, data.length)
            const h = (
                <span style={{marginRight:'5px'}}>
                    <span style={{marginRight:'3px'}}>{item.h}</span>
                    <span>h</span>
                </span>
            )
            const min = (
                <span>
                    <span style={{marginRight:'3px'}}>{item.min}</span>
                    <span>min</span>
                </span>
            )
            const duration = (
                <div>
                    { item.h>0 && h}
                    { item.min>0 && min}
                </div>
            )
            const priceOff = <span style={{fontWeight:450, color:'#848CA3', textDecoration:'line-through'}}>£{item.price}</span>
            const select = (
                <div className='center' style={{height:'32px', padding:'0px 10px', color: item.selected ? 'green' : 'red', border:`1px solid ${item.selected ? 'green' : 'red'}`, borderRadius:'5px', backgroundColor:item.selected ? '#f1fff8' : ''}}>
                    {item.selected ? 'Selected' : 'Select'}
                </div>
            )

            // const select = (
            //     <div id={`select-${item.id}`} className='center' style={{height:'32px', padding:'0px 10px', color:'red', border:'1px solid red', borderRadius:'5px', display:''}}>
            //         Select
            //     </div>
            // )

            // const selected = (
            //     <div id={`selected-${item.id}`} className='center' style={{height:'32px', padding:'0px 10px', color:'green', border:'1px solid green', borderRadius:'5px', backgroundColor:'#f1fff8', display:'none'}}>
            //         Selected
            //     </div>
            // )

            const price = (
                <div className='d-flex' style={{fontWeight:450, margin:'0px 10px', flexDirection:'column'}}>
                    <span>£{item.offer ? item.offer : item.price}</span>
                    {item.offer && priceOff}
                </div>
            )
            // animated fadeInUp 
            return (
                <div key={i} onClick={() => onService(data, i)}>
                    <div className={`d-flex justify-content-between ${w<s ? '' : 'hoverGreen'}`} style={{width:'100%', borderRadius:'5px'}}>
                        <div style={{}}>
                            {item.service}
                            {duration}
                        </div>
                        <div className='d-flex'>
                            {price}
                            {select}
                        </div>
                    </div>
                    {i!==data.length-1 && <hr style={{margin:'12px 0px'}}/>}
                </div>
            )
        }
    )

    return dataRV
}

const getAllAds = async (type, subUserInfo, userCategoryId, nAds, searchAds) => {
    var data = {
        userId:subUserInfo._id,
        userCategoryId: type==='All' ? type : userCategoryId,
        n: nAds,
        q:listRefreshQty,
    }

    const res = await axios.post(`${serverURL}/ads/getAds/`, data);
    const x2 = res.data
    const updatedSearchAds = [...searchAds, ...x2];

    return {x2, updatedSearchAds}
}

const getAllAdsSub = async (subUserInfo, userCategoryId, userSubCategoryId, nAdsSub, searchAds) => {
    var data = {
        userId:subUserInfo._id,
        // userCategoryId: userCategoryId,
        userSubCategoryId: userSubCategoryId,
        n: nAdsSub,
        q:listRefreshQty,
    }

    const res = await axios.post(`${serverURL}/ads/getAdsSub/`, data);
    const x2 = res.data
    const updatedSearchAds = [...searchAds, ...x2];

    return {x2, updatedSearchAds}
}

const mapAllAds = (data, me, EditBtn, rtl, setLT, w, s,
    onTogglePS,
    onToggleEditAds,
    onToggleDeleteAds,
) => {
    // console.log(222, data)
    var allAds = data.map(
        (item, i) => {
            // console.log(333, item)
            const imgClass = `center ${ item.pictureType===2 ? '' : 'zoom'}`
            const imgStyleContainer = { width: '100%', position: 'relative', overflow: 'hidden' }
            const imgStyleInnerContainer = { paddingTop: '100%', width: '100%', position: 'relative' }
            const imgStyleAbsolute = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }

            const imgSrc = `https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictures[0]}.jpeg`
            const img = ( item.pictureType===2
                ?
                <div style={imgStyleContainer}>
                    <div style={imgStyleInnerContainer}>
                        <div className={imgClass} style={imgStyleAbsolute}>
                            <BeforAfter
                                id={`ad-${i}`}
                                title={`${item.adsTitle}`}
                                beforUrl={`https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictures[0]}.jpeg`}
                                afterUrl={`https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictures[1]}.jpeg`}
                                borderRadius={0}
                                width={'100%'}
                                height={'100%'}
                            />
                        </div>
                    </div>
                </div>
                :
                <div style={imgStyleContainer}>
                    <div style={imgStyleInnerContainer}>
                        <div className={imgClass} style={imgStyleAbsolute}>
                            <BsImages style={{color:'#ffffff', fontSize:'20px', margin:'5px', visibility:item.imgQTY>1 ? 'visible' : 'hidden', position:'absolute', opacity: '1'}}/>
                            <img
                                className='zoomImg'
                                style={{objectFit: 'cover', width:'100%', height:'100%', borderRadius:'10px', cursor:'pointer', filter:'blur(30px)'}}
                                src={imgSrc}
                                alt={`${item.adsTitle} blur`}
                            />
                            <div className='zoom' style={{height:w<s ? '130px' : '350px', width:'100%', position:'absolute', overflow:'hidden'}}>
                                <img
                                    className='zoomImg'
                                    style={{objectFit: 'contain', width:'100%', height:'100%', borderRadius:'10px', cursor:'pointer'}}
                                    src={imgSrc}
                                    alt={item.adsTitle}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )

            const adsTitle = (
                <div className='d-flex' style={{width:'100%', marginBottom:'5px', fontSize:'13px', fontWeight:'', overflow: 'scroll', textAlign:'right', whiteSpace:'nowrap'}}>
                    {item.adsTitle}
                </div>
            )
            const adsPrice = (
                <div className='d-flex' style={{width:'100%', padding:'0px', fontSize:'12px', overflow: 'hidden', textAlign:'right'}}>
                    <div className='center' style={{width:'100%', flexDirection:'column', alignItems:'center'}}>
                        <span style={{ fontSize: '20px', fontWeight: 450 }}>
                            {item.currency}
                            {item.unitPrice && dig3(item.unitPrice, 2)}
                        </span>
                        <div style={{ fontSize: '14px' }}>
                            {item.unitMeasurement}
                        </div>
                    </div>
                </div>
            )
            const zoom = <AiOutlineZoomIn
                className='bin'
                style={{
                    fontSize:'25px', cursor:'pointer',
                    position:'absolute', bottom:10, right:rtl ? '' : 10, left:rtl ? 10 : '',
                }}
                onClick={() => onTogglePS(item)}
            />
            const root = item.businessType>0 ? 'publisher' : 'user'
            const ads = (
                <Link to={item.slug ? `/publisher/${item.username}/${item.slug}` : `/ps/${item._id}`} target="_blank" className='btnShadow' style={{height:'100%', width:'100%', backgroundColor:'#ffffff', borderRadius:'10px', overflow:'hidden', border:'0px solid red'}}>
                    <div className=''  style={{height:'100%', width:'100%'}}>
                        <div className='center'  style={{flexDirection:'column'}}>
                            <div style={{width:'100%', cursor:'pointer'}}
                                // onClick={() => item.pictureType===2 ? null : onTogglePS(item)}
                                // onClick={() => onTogglePS(item)}
                            >
                                {img}
                            </div>
                            { (item.adsTitle || !item.negotiablePrice) &&
                                <div  style={{ width:'100%', padding:item.adsTitle ? '10px' : '0px' }}>
                                    {adsTitle}
                                    {!item.negotiablePrice && adsPrice}
                                </div>
                            }
                            {/* item.pictureType===2 && zoom */}
                        </div>
                    </div>
                </Link>
            )
            const more = (
                <div className={`${rtl ? 'dropdown' : 'dropleft'}`} style={{position:'absolute', left:10}}>
                    <div id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="" aria-expanded="false"
                        style={{width:'100%', height:'40px'}}
                    >
                        <EditBtn type='3dot' size='30px' top={10} right={-35}/>
                    </div>
                    <div className="dropdown-menu animated fadeIn" aria-labelledby="dropdownMenuButton"
                        style={{fontSize:'13px', textAlign:'center', cursor:'pointer', padding:'10px', backgroundColor:''}}>
                        <div className="dropdown-item btnShadow"
                            style={{borderRadius:'4px', backgroundColor:'#ffffff'}}
                            onClick={() => onToggleEditAds(data, i)}
                        >
                            {setLT.edit}
                        </div>
                        <hr/>
                        <div id={`deleteAdsBtn${i}`} className="dropdown-item btnShadow"
                            style={{color:'#ffffff', borderRadius:'4px', backgroundColor:'#ff3547'}}
                            onClick={() => onToggleDeleteAds(data, i)}
                        >
                            {setLT.delete}
                        </div>
                        
                    </div>
                </div>
            )
            return (
                <div key={i}
                    className={`d-flex zoomIn disable-select`}
                    style={{textDecoration:'none', 
                        minWidth: w<s ? '200px' : '30%', minHeight: w<s ? '200px' : '',
                        width: w<s ? '' : '30%',
                        padding:'5px', 
                        alignItems:'stretch', color:'black', position:'relative'}}
                >
                    {ads}
                    {me && more}
                </div>
            )
        }
    )

    return allAds
}

const mapAllPS = async (data, me, EditBtn, setLT, lang, rtl, w, s, ) => {
    const showPSPos = await getPos('modalShowPS')
    const wi = w<1200
    const tw = wi ? 0 : 400
    const pw = showPSPos.width - tw

    var psList = await data.map(
        (item, i) => {
            // console.log(item),
            const imgStyle = { margin:'0px', width:pw, height:w<s ? (item.pictureType===2 ? '350px' : '500px') : '700px', alignItems:'center', overflow:'hidden'}

            const imgSrc = `https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictures[0]}.jpeg`
            const img = ( item.pictureType===2
                ?
                <div className='center' style={imgStyle}>
                    <BeforAfter
                        id={`ps-${i}`}
                        title={`${item.adsTitle}`}
                        beforUrl={`https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictures[0]}.jpeg`}
                        afterUrl={`https://www.pix.shiningpage.com/whoraly/ads/big/${item._id}-${item.pictures[1]}.jpeg`}
                        borderRadius={0}
                        width={w<s ? '90%' : '100%'}
                        height={w<s ? '90%' : '100%'}
                    />
                </div>
                :
                <div className='center' style={imgStyle} onClick={() => item.adsLink ? window.open(item.adsLink) : null}>
                    <BsImages style={{color:'#ffffff', fontSize:'20px', margin:'5px', visibility:item.imgQTY>1 ? 'visible' : 'hidden', position:'absolute', opacity: '1'}}/>
                    <img
                        className=''
                        style={{objectFit: 'cover', width:'100%', height:'100%', borderRadius:'0px', filter:'blur(30px)'}}
                        src={imgSrc}
                        alt={`${item.adsTitle} blur`}
                    />
                    <div style={{height:w<s ? '500px' : '700px', width:pw, position:'absolute', overflow:'hidden'}}>
                        <img
                            className=''
                            style={{objectFit: 'contain', width:'100%', height:'100%', borderRadius:'0px'}}
                            src={imgSrc}
                            alt={item.adsTitle}
                        />
                    </div>
                </div>
            )
            const adsTitle = (
                <div className='d-flex' style={{marginBottom:'10px', fontSize:'16px', fontWeight:450, overflow: 'hidden'}}>
                    {item.adsTitle}
                </div>
            )
            const adsComment = (
                <div className='d-flex' style={{fontSize:'14px', overflow: 'hidden', whiteSpace:'pre-wrap'}}>
                    {item.adsComment}
                </div>
            )
            const adsPrice = (
                <div className='d-flex' style={{marginTop:'10px', fontSize:'14px', fontWeight:450, overflow: 'hidden'}}>
                    { item.negotiablePrice
                        ? <div style={{height:'10px'}}></div>//<p className={w<s ? 'animated fadeIn delay-1s' : ''} style={{margin:'0px', textAlign:rtl ? 'right' : 'left', direction:rtl ? 'rtl' : 'ltr'}}>{setLT.price}:&nbsp;<span style={{fontWeight:''}}>{setLT.byAgreement}</span></p>
                        : <p className='center' style={{width:'', flexDirection:'column', alignItems:'center'}}>
                            <span style={{ fontSize: '20px', fontWeight: 450 }}>
                                {item.currency}
                                {item.unitPrice && dig3(item.unitPrice, 2)}
                            </span>
                            <div style={{ fontSize: '14px' }}>
                                {item.unitMeasurement}
                            </div>
                        </p>
                    }
                </div>
            )

            const root = item.businessType>0 ? 'publisher' : 'user'
            const adsPageLink = (
                <Link to={item.slug ? `/publisher/${item.username}/${item.slug}` : `/ps/${item._id}`} target="_blank" className='underline' style={{fontSize:'14px'}}>
                    {setLT.showDetails}
                </Link>
            )

            return (
                <div key={i} id={item._id}
                    className={`d-flex`}
                    style={{ textDecoration:'none', width: showPSPos.width, height: '100%',
                        margin:'0px 0px 0px', flexDirection: wi ? 'column' : '',
                        padding:wi ? '0px' : '10px', justifyContent:wi ? '' : 'space-between',
                        alignItems:'flex-start', borderRadius:'4px', position:'relative',
                        borderBottom:i<data.length-1 ? '10px solid #99999999' : '',
                        direction:rtl ? 'rtl' : ''
                    }}
                >
                    {/* me && <EditBtn rtl={rtl} top={10} right={10} onClick={() => onEditAd()}/> */}
                    <div style={{width:'', maxWidth:tw, margin:'0px 0px 10px'}}>{img}</div>
                    <div style={{width:wi ? '' : tw-30, padding:wi ? '5px 10px' : '0px'}}>
                        {adsTitle}
                        {adsComment}
                        {adsPrice}
                        {adsPageLink}
                    </div>
                </div>
            )
        }
    )
    return psList
}

const getAllVideo = async (type, subUserInfo, userCategoryId, nVideo, searchVideo) => {
    var data = {
        userId:subUserInfo._id,
        userCategoryId: type==='All' ? type : userCategoryId,
        n: nVideo,
        q: listRefreshQty,
    }

    const res = await axios.post(`${serverURL}/video/getVideo/`, data);
    const x2 = res.data
    const updatedSearchVideo = [...searchVideo, ...x2];

    return {x2, updatedSearchVideo}
}

const getAllVideoSub = async (subUserInfo, userCategoryId, userSubCategoryId, nVideoSub, searchVideo) => {
    var data = {
        userId:subUserInfo._id,
        userCategoryId: userCategoryId,
        userSubCategoryId: userSubCategoryId,
        n: nVideoSub,
        q: listRefreshQty,
    }

    const res = await axios.post(`${serverURL}/video/getVideoSub/`, data);
    const x2 = res.data
    // console.log('AllVideoSub: ', x2)
    const updatedSearchVideo = [...searchVideo, ...x2];

    return {x2, updatedSearchVideo}
}

const mapAllVideo = (data, me, EditBtn, rtl, setLT, w, s, 
    onToggleShowVideo,
    onToggleEditVideo,
    onToggleDeleteVideo
) => {
    var allVideo = data.map(
        (item, i) => {
            //console.log(item),
            const youtubeVideo = `https://www.youtube.com/embed/${item.vCode}`
            const aparatVideo = `https://www.aparat.com/video/video/embed/videohash/${item.vCode}/vt/frame`
            const linkedinVideo = `https://www.linkedin.com/embed/latest/update/urn:li:ugcPost:${item.vCode}?compact=1`

            const TLen = item.title ? item.title.length : 0
            const title = (
                <div className='d-flex ' style={{width:'100%', padding:'3px', fontSize:'12px', marginBottom:'0px', overflow: 'hidden', textAlign:'right', color:'#000000'}}>
                    {TLen>20 ? item.title.substr(0, 15) + ' ...' : item.title}
                </div>
            )
            const YoutubeIcon = <FaYoutube style={{fontSize:'30px', margin:'0px', color:'#c4302b'}}/>
            const AparatIcon = <img style={{width:'30px', height:'25px', margin:'0px'}} src={aparatImage} alt="Aparat Icon"/>
            const LinkedinIcon = <FaLinkedin className='' style={{fontSize:'25px', margin:'0px', color:'#0e76a8'}}/>
            const iframeStyle = {position:'', top: 0, left: 0, width: '100%', height:'100%', zIndex: '-1', border: 'none'}
            const more = (
                <div className={`${rtl ? 'dropdown' : 'dropleft'}`} style={{position:'absolute', left:10}}>
                    <div id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="" aria-expanded="false"
                        style={{width:'100%', height:'40px'}}
                    >
                        <EditBtn type='3dot' size='30px' top={10} right={-30}/>
                    </div>
                    <div className="dropdown-menu animated fadeIn" aria-labelledby="dropdownMenuButton"
                        style={{fontSize:'13px', textAlign:'center', cursor:'pointer', padding:'10px', backgroundColor:''}}>
                        <div className="dropdown-item btnShadow"
                            style={{borderRadius:'4px', backgroundColor:'#ffffff'}}
                            onClick={() => onToggleEditVideo(data, i)}
                        >
                            {setLT.edit}
                        </div>
                        <hr/>
                        <div id={`deleteAdsBtn${i}`} className="dropdown-item btnShadow"
                            style={{color:'#ffffff', borderRadius:'4px', backgroundColor:'#ff3547'}}
                            onClick={() => onToggleDeleteVideo(data, i)}
                        >
                            {setLT.delete}
                        </div>
                        
                    </div>
                </div>
            )
            const video = (
                <div className={`center cardShadow`} style={{height:'100%', width:'100%', backgroundColor:'#ffffff', borderRadius:'0px', position:'relative'}}>
                    <div className='' style={{width:'100%', height:'100%', backgroundColor:'transparent', position:'absolute', cursor:'pointer'}} onClick={() => onToggleShowVideo(item)}></div>
                    <div className={``} onClick={() => onToggleShowVideo(item)}
                        style={{opacity:'1', padding:'0px', width:'100%', height: w<s ? '100%' : '300px', borderRadius:'5px', cursor:'pointer', position:'relative'}}
                    >
                        {item.vType === 'Youtube' && <iframe src={youtubeVideo} style={iframeStyle} allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"/>}
                        {item.vType === 'Aparat' && <iframe src={aparatVideo} style={iframeStyle}/>}
                        {item.vType === 'Linkedin' && <iframe src={linkedinVideo} style={iframeStyle}/>}
                        {/* <div className='center'
                            style={{width:'100%', height:'40px', backgroundColor:'#ffffff', alignItems:'center', fontSize:'14px', fontWeight:450, opacity:'1', padding:'0px 10px'}}
                        >
                            {title}&nbsp;&nbsp;
                            {item.vType === 'Youtube' && YoutubeIcon}
                            {item.vType === 'Aparat' && AparatIcon}
                            {item.vType === 'Linkedin' && LinkedinIcon}
                        </div> */}
                    </div>
                </div>

            )
            const cover = (
                <div onClick={() => window.open(`https://www.youtube.com/shorts/${item.vCode}`, "_blank")}
                    style={{ position: 'absolute', top: 0, left: 0, cursor:'pointer',
                        width: '100%', height: '100%', //background: 'rgba(255,255,255,0.2)'
                    }}>
                </div>
            )

            return (
                <div key={i}
                    className={`d-flex zoomIn disable-select btnShadow`}
                    style={{textDecoration:'none', 
                        minWidth: w<s ? '200px' : '30%', minHeight: w<s ? '200px' : '',
                        width: w<s ? '' : '30%',
                        padding:'3px', margin:w<s ? '' : '5px',
                        alignItems:'stretch', borderRadius:'4px', position:'relative'}}
                >
                    {video}
                    {item.vType === 'Youtube' && cover}
                    {me && more}
                </div>
            )
        }
    )

    return allVideo
}

const getAllInsta = async (type, subUserInfo, userCategoryId, nInsta, searchInsta) => {
    var data = {
        userId:subUserInfo._id,
        userCategoryId: type==='All' ? type : userCategoryId,
        n: nInsta,
        q: listRefreshQty,
    }

    const res = await axios.post(`${serverURL}/instagram/getInsta/`, data);
    const x2 = res.data
    const updatedSearchInsta = [...searchInsta, ...x2];

    return {x2, updatedSearchInsta}
}

const getAllInstaSub = async (subUserInfo, userCategoryId, userSubCategoryId, nInstaSub, searchInsta) => {
    var data = {
        userId:subUserInfo._id,
        userCategoryId: userCategoryId,
        userSubCategoryId: userSubCategoryId,
        n: nInstaSub,
        q: listRefreshQty,
    }

    // console.log('data: ', data)
    const res = await axios.post(`${serverURL}/instagram/getInstaSub/`, data);
    const x2 = res.data
    const updatedSearchInsta = [...searchInsta, ...x2];

    return {x2, updatedSearchInsta}
}

const mapAllInsta = (data, me, EditBtn, rtl, setLT, w, s, 
    onToggleEditInsta,
    onToggleDeleteInsta
) => {
    var allInsta = data.map(
        (item, i) => {
            const TLen = item.title ? item.title.length : 0
            const title = (
                <div className='d-flex ' style={{width:'100%', padding:'5px 8px 10px', fontSize:'12px', marginBottom:'0px', overflow: 'hidden', textAlign:'right', color:'#000000'}}>
                    {TLen>20 ? item.title.substr(0, 15) + ' ...' : item.title}
                </div>
            )
            const instaPost = (
                <div className='center' style={{margin:'0px', textDecoration:'none', width:'', flexDirection:'column'}}>
                    <div className='' style={{padding:'0px', width:'100%', height:'', borderRadius:'5px'}}>
                        <iframe scrolling="no" src={`https://www.instagram.com/p/${item.code}/embed`} width='100%' height={w<s ? '250px' : '450px'} allowtransparency="true" style={{ overflow: 'hidden', border: 'none' }}/>
                    </div>
                </div>
            )
            const more = (
                <div className={`${rtl ? 'dropdown' : 'dropleft'}`} style={{position:'absolute', left:10}}>
                    <div id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="" aria-expanded="false"
                        style={{width:'100%', height:'40px'}}
                    >
                        <EditBtn type='3dot' size='30px' top={10} right={-30}/>
                    </div>
                    <div className="dropdown-menu animated fadeIn" aria-labelledby="dropdownMenuButton"
                        style={{fontSize:'13px', textAlign:'center', cursor:'pointer', padding:'10px', backgroundColor:''}}>
                        <div className="dropdown-item btnShadow"
                            style={{borderRadius:'4px', backgroundColor:'#ffffff'}}
                            onClick={() => onToggleEditInsta(data, i)}
                        >
                            {setLT.edit}
                        </div>
                        <hr/>
                        <div id={`deleteAdsBtn${i}`} className="dropdown-item btnShadow"
                            style={{color:'#ffffff', borderRadius:'4px', backgroundColor:'#ff3547'}}
                            onClick={() => onToggleDeleteInsta(data, i)}
                        >
                            {setLT.delete}
                        </div>
                        
                    </div>
                </div>
            )
            const insta = (
                <div className='btnShadow'
                    style={{height:'100%', width:'100%',//border:'1px solid #999999',
                        backgroundColor:'#ffffff', borderRadius:'3px', margin:'0px',
                        position:'relative'}}>
                    {instaPost}
                    {/* title */}
                </div>
            )
            return (
                <div key={i}
                    className={`d-flex zoomIn disable-select`}
                    style={{textDecoration:'none',
                        minWidth: w<s ? '200px' : '30%', minHeight: w<s ? '200px' : '',
                        width: w<s ? '' : '30%',
                        padding:'5px',
                        alignItems:'stretch', borderRadius:'4px', color:'black', position:'relative'}}
                >
                    {insta}
                    {me && more}
                </div>
            )
        }
    )

    return allInsta
}

// const setSelectCategory = (categoryItems, i, catX, fc, txBlack) => {
//   // console.log('xxx', i, catX, fc)
    // if(i!==catX) {
    //     if(i!=='search') {
    //         // console.log(1)

    //         const elment = document.getElementById('category' + i);
    //         elment.classList.remove('f7')
    //         elment.classList.remove(`b${fc===7 ? 0 : fc}`)
    //         elment.classList.add(`C${fc}`)
    //         elment.classList.add(`f${txBlack ? 7 : 11}`)
    //         elment.classList.add(`b${fc===11 ? 0 : 11}`)
    //     }
    //     const elmentX = document.getElementById('category' + catX);
    //     if(elmentX) {
    //         // console.log(2, elmentX)

    //         elmentX.classList.remove(`C${fc}`)
    //         elmentX.classList.remove(`f${txBlack ? 7 : 11}`)
    //         elmentX.classList.add('f7')
    //         elmentX.classList.add(`b${fc===7 ? 0 : fc}`)
    //         if(catX==='All') {
    //             // console.log(3)
    //             elmentX.classList.remove(`b${txBlack ? 7 : 11}`)
    //         } else {
    //             // console.log(4)
    //             elmentX.classList.remove(`b${fc===11 ? 0 : 11}`)
    //         }
    //     }
    // }

// }

// const setSelectSubcategory = (i, ix, catIXRef, txBlack, fc, w, s) => {
//     // console.log('fc: ', fc)
//     // div ...........
//     const elment = document.getElementById(`subcategory-${i}-${ix}`);
//     // const services = document.getElementById(`services-${i}-${ix}`);
//     if(elment) {
//         // console.log('elment: ', fc)

//         // elment.classList.remove('C11')
//         // elment.classList.remove('f11')
//         // elment.classList.remove(`b${fc===7 ? 0 : fc}`)
//         // elment.classList.add('C11')
//         elment.classList.add(`C${fc}`)
//         // elment.classList.add(`f${txBlack ? 7 : 11}`)
//         // elment.classList.add(`b${fc===11 ? 0 : 11}`)
//         elment.style.borderRadius = '7px'
//         elment.style.borderBottomWidth = '0px'
//         if(w<s) elment.style.marginBottom = '25px'
//     }
//     // if(services) services.style.display = ''

//     // console.log('i: ', i)
//     // console.log('ix-1: ', ix-1)

//     // corner ...........
//     const corner = document.getElementById(`subcategoryCorner-${i}-${ix}`);
//     if(corner) {
//         corner.classList.add(`C${fc}`)
//         if(w<s) {
//             corner.style.marginTop = '20px'
//         } else {
//             corner.style.marginRight = '-8px'
//         }
//     }



//     setDeselectSubcategory(i, catIXRef, fc, w, s)

//     // console.log('catIXRef-1: ', catIXRef-1)

//     const beforElment = document.getElementById(`subcategory-${i}-${ix-1}`);
//     if(beforElment) {
//         beforElment.style.borderBottomWidth = '0px'
//     }

//     offSubcat(i, catIXRef, txBlack, fc)
// }

// const setDeselectSubcategory = (i, catIXRef, fc, w, s) => {
//    // console.log('8888888888: ', i, catIXRef, fc, w, s)
    
//     const preElment = document.getElementById(`subcategory-${i}-${catIXRef}`);
//     const preElmentCorner = document.getElementById(`subcategoryCorner-${i}-${catIXRef}`);
//     const beforePreElment = document.getElementById(`subcategory-${i}-${catIXRef-1}`);

//   // console.log('preElment: ', preElment)

//     if(preElment) {
//         preElment.classList.remove(`C${fc}`)
//         preElment.style.borderRadius = '0px'
//         preElment.style.borderBottomWidth = '1px'
//         if(w<s) preElment.style.marginBottom = '0px'

//         preElmentCorner.classList.remove(`C${fc}`)
//         if(w<s) {
//             preElmentCorner.style.marginTop = '0px'
//         } else {
//             preElmentCorner.style.marginRight = '0px'
//         }
//     }

//     if(beforePreElment) {
//         beforePreElment.style.borderBottomWidth = '1px'
//     }
// }
// const offSubcat = (i, catIXRef, txBlack, fc) => {
//     const elment = document.getElementById(`subcategory-${i}-${catIXRef}`);
//     if(elment) {
//         elment.classList.remove('C11')
//         elment.classList.remove(`f${txBlack ? 7 : 11}`)
//         elment.classList.remove(`b${fc===11 ? 0 : 11}`)
//         elment.classList.add('f7')
//         elment.classList.add(`b${fc===7 ? 0 : fc}`)
//         catIXRef = null
//     }
//     return catIXRef
// }

const mapInModalCategory = (
        data, subUserInfo, rtl, setLT, w, s,
        onToggleEditCategory,
        deleteCategoryFunction,
        moveDownCategoryFunction,
        moveUpCategoryFunction,
        toggleSubCategoryFunction,
        newSubcategoryFunction,
        deleteSubCategoryFunction,
        moveDownSubCategoryFunction,
        moveUpSubCategoryFunction,
        editSubCategoryFunction,
        showNewServiceFunction,
        requestDeleteServiceFunction,
        cancelDeleteServiceFunction,
        editServiceFunction,
        moveUpServiceFunction,
        moveDownServiceFunction,
        deleteServiceFunction,
    ) => {
    data = data.filter(item => item.id !== 0);

    var li = data.length - 1
    const loader02 = <div className='loader-02' style={{margin: '0px', color:'#000000', transform: rtl ? 'rotate(180deg)' : '', fontSize:'14px'}}></div>
    var dataRV = data.map(
        (item, i) => {
            // console.log(item)
            const lix = item.sub.length - 1
            const img = (
                <img
                    className=''
                    style={{objectFit:'cover', width:'45px', height:'45px', borderRadius:'10px'}}
                    src={`https://www.pix.shiningpage.com/whoraly/category/${subUserInfo._id}-${item.pixId}.jpeg`}
                    alt={item.title}
                />
            )
            const category = (
                <div className={`d-flex`} style={{width:w<s ? '100%' : '250px', alignItems:'center'}}>
                    {img}
                    <div style={{fontSize: w<s ? '' : '16px', fontWeight: w<s ? 'bold' : 450, margin:'0px 10px'}}>{item.title}</div>
                </div>
            )
            const moveUp = (
                <button //disabled={i===0 || onAction ? true : false}
                    className={`center ${i===0 ? '' : 'btnShadow'}`}
                    style={{width:'30px', height:'30px', padding:'0px', margin:'0px 10px',
                            color: i===0 ? '#99999999' : '#000000',
                            backgroundColor:'#ffffff',
                            border: i===0 ? '2px solid #99999950' : '2px solid #59b9ff99',
                            borderRadius:'100px', alignItems:'center'}}
                    onClick={() => moveUpCategoryFunction(data, i)}
                >
                    {item.movingUp ? loader02 : <BiChevronsRight style={{fontSize:'20px', lineHeight:'20px', transform: 'rotate(-90deg)'}}/>}
                </button>
            )
            const moveDown = (
                <button //disabled={i===li || onAction ? true : false}
                    className={`center ${i===li ? '' : 'btnShadow'}`}
                    style={{width:'30px', height:'30px', padding:'0px', margin:'0px 10px',
                            color: i===li ? '#99999999' : '#000000',
                            backgroundColor:'#ffffff',
                            border: i===li ? '2px solid #99999950' : '2px solid #59b9ff99',
                            borderRadius:'100px', alignItems:'center'}}
                    onClick={() => moveDownCategoryFunction(data, i)}
                >
                    {item.movingDown ? loader02 : <BiChevronsRight style={{fontSize:'20px', lineHeight:'20px', transform: 'rotate(90deg)'}}/>}
                </button>
            )
            const editBtn = (
                <button className={`center btnShadow`}
                    style={{width:'30px', height:'30px', padding:'0px', margin:'0px 10px',
                            color: '#000000',
                            backgroundColor:'#ffffff',
                            border: '2px solid #59b9ff99',
                            borderRadius:'100px', alignItems:'center'}}
                    onClick={() => onToggleEditCategory(data, i, true)}
                >
                    <MdEdit style={{fontSize:'18px'}}/>
                </button>
            )
            const deleteBtn = (
                <div className={`center ${rtl ? 'dropdown' : 'dropleft'}`}>
                    <div className='center btnShadow' id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="" aria-expanded="false"
                        style={{width:'30px', height:'30px', padding:'0px', margin:'0px 10px',
                        color: '#000000', border: '2px solid #59b9ff99',
                        backgroundColor:'#ffffff',
                        borderRadius:'100px', alignItems:'center'}}
                    >
                        <FaTrash style={{fontSize:'14px'}}/>
                    </div>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton"
                        style={{fontSize:'13px', cursor:'pointer', padding:'0px', backgroundColor:''}}>
                        <div className="dropdown-item" style={{color:'#ffffff', backgroundColor:'red'}}
                            onClick={() => deleteCategoryFunction(data, i)}
                        >
                            {setLT.delete}
                        </div>
                    </div>
                </div>
            )
            const subBtn = (
                <button className={`center btnShadow`}
                    style={{width:'30px', height:'30px', padding:'0px', margin:'0px 10px',
                        color: item.toggleSubCat ? '#000000' : '',
                        border: '2px solid #59b9ff99', 
                        backgroundColor: item.toggleSubCat ? '#ffffff' : '#c0e1f9',
                        borderRadius:'5px', alignItems:'center'}}
                    onClick={() => toggleSubCategoryFunction(data, i)}
                >
                    <TbSubtask style={{fontSize:'20px'}}/>
                </button>
            )
            const btns = (
                <div className={`d-flex`}
                    style={{margin: w<s ? '10px 0px' : '0px'}}>
                    {moveUp}
                    {moveDown}
                    {editBtn}
                    {deleteBtn}
                    {subBtn}
                </div>
            )
            const newSub = (
                <div className='d-flex' style={{alignItems:'center'}}>
                    <div id={`newSub${i}`} className='center btnShadow'
                        style={{width:'30px', height:'30px', paddingTop:'3px',
                            margin:'5px', borderRadius:'5px', fontSize:'14px',
                            alignItems:'center', border:'2px solid #59b9ff99'
                        }}
                        onClick = {() => newSubcategoryFunction(i)}>
                        <span style={{fontSize:'18px', lineHeight:'20px'}}>+</span>
                    </div>
                    <div style={{fontSize:'14px', fontWeight:'bold', margin:'10px 5px 5px', textAlign: rtl ? 'right' : 'left'}}>{setLT.subcategory}</div>
                </div>
            )

            const subcategory = (
                <div style={{backgroundColor:'#ffffff', borderRadius:'0px 0px 10px 10px'}}>
                    <div className={`b7`} style={{ width:'100%', borderWidth:'1px 0px 0px 0px', borderRadius:'0px', padding:'5px', }}>
                        <div style={{marginBottom:'10px'}}>
                            { 
                                item.sub.map(
                                    (itemx, ix) => {
                                        {/* console.log(itemx) */}
                                        const bookingSystem = subUserInfo?.access?.includes("BookingSystem") ? true : false
                                        const lis = itemx.sub.length - 1
                                        const subcategoryTitle = (
                                            <div id={`subcatTitle-${i}-${ix}`} style={{width:w<s ? '100%' : '250px'}}>
                                                <div style={{fontSize: w<s ? '14px' : '14px', fontWeight: w<s ? 'bold' : 450, padding:'0px 10px'}}>{`${ix+1}. ${itemx.title}`}</div>
                                            </div>
                                        )
                                        const subMoveUp = (
                                            <button //disabled={ix===0 || onAction ? true : false}
                                                className={`center ${ix===0 ? '' : 'btnShadow'}`}
                                                style={{width:'25px', height:'25px', padding:'2px', margin:'0px 10px',
                                                    color: ix===0 ? '#99999999' : '#000000',
                                                    border: ix===0 ? '2px solid #99999950' : '2px solid #59b9ff99',
                                                    borderRadius:'100px', alignItems:'center'}}
                                                onClick={() => moveUpSubCategoryFunction(data, i, ix)}
                                            >
                                                {item.movingUp ? loader02 : <BiChevronsRight style={{fontSize:'20px', lineHeight:'20px', transform: 'rotate(-90deg)'}}/>}
                                            </button>
                                        )
                                        const subMoveDown = (
                                            <button //disabled={ix===lix || onAction ? true : false}
                                                className={`center ${ix===lix ? '' : 'btnShadow'}`}
                                                style={{width:'25px', height:'25px', padding:'2px', margin:'0px 10px',
                                                    color: ix===lix ? '#99999999' : '#000000',
                                                    border: ix===lix ? '2px solid #99999950' : '2px solid #59b9ff99',
                                                    borderRadius:'100px', alignItems:'center'}}
                                                onClick={() => moveDownSubCategoryFunction(data, i, ix)}
                                            >
                                                {item.movingDown ? loader02 : <BiChevronsRight style={{fontSize:'20px', lineHeight:'20px', transform: 'rotate(90deg)'}}/>}
                                            </button>
                                        )
                                        const subEditBtn = (
                                            <button className={`center btnShadow`}
                                                style={{width:'25px', height:'25px', padding:'3px', margin:'0px 10px',
                                                    color: '#000000',
                                                    border: '2px solid #59b9ff99',
                                                    borderRadius:'100px', alignItems:'center'}}
                                                onClick={() => editSubCategoryFunction(data, i, ix)}
                                            >
                                                <MdEdit style={{fontSize:'18px'}}/>
                                            </button>
                                        )
                                        const subDeleteBtn = (
                                            <div className={`center ${rtl ? 'dropdown' : 'dropleft'}`}>
                                                <div className='center btnShadow' id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="" aria-expanded="false"
                                                    style={{width:'25px', height:'25px', padding:'5px', margin:'0px 10px',
                                                    color: '#000000', border: '2px solid #59b9ff99',
                                                    borderRadius:'100px', alignItems:'center'}}
                                                >
                                                    <FaTrash style={{fontSize:'14px'}}/>
                                                </div>
                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton"
                                                    style={{fontSize:'13px', cursor:'pointer', padding:'0px', backgroundColor:''}}>
                                                    <div className="dropdown-item" style={{color:'#ffffff', backgroundColor:'red'}} onClick={() => deleteSubCategoryFunction(data, i, ix)}>
                                                        {setLT.delete}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                        const subBtns = (
                                            <div className={`d-flex`}
                                                style={{margin: w<s ? '10px 0px' : '0px'}}>
                                                {subMoveUp}
                                                {subMoveDown}
                                                {subEditBtn}
                                                {subDeleteBtn}
                                            </div>
                                        )
                                        const newService = (
                                            <div className='d-flex' style={{alignItems:'center'}}>
                                                <div id={`newService-${i}-${ix}`} className='center btnShadow'
                                                    style={{width:'25px', height:'25px', paddingTop:'3px',
                                                        margin:'5px', borderRadius:'100px', fontSize:'12px',
                                                        alignItems:'center', border:'1px solid #59b9ff99'
                                                    }}
                                                    onClick = {() => showNewServiceFunction(i, ix)}
                                                >
                                                    <span style={{fontSize:'16px', lineHeight:'20px'}}>+</span>
                                                </div>
                                                <div style={{fontSize:'14px', fontWeight:450, margin:'10px 5px 5px', textAlign: rtl ? 'right' : 'left'}}>Service</div>
                                            </div>
                                        )
                                        // console.log(i, ix)
                                        // console.log('itemxSub: ', itemx.sub)
                                        const services = (
                                            <div>
                                                { 
                                                    itemx.sub.map(
                                                        (itemSx, s) => {
                                                            // console.log('service: ', itemSx)
                                                            
                                                            const h = (
                                                                <span style={{marginRight:'5px'}}>
                                                                    <span style={{marginRight:'3px'}}>{itemSx.h}</span>
                                                                    <span>h</span>
                                                                </span>
                                                            )
                                                            const min = (
                                                                <span>
                                                                    <span style={{marginRight:'3px'}}>{itemSx.min}</span>
                                                                    <span>min</span>
                                                                </span>
                                                            )
                                                            const priceOff = <span style={{fontWeight:450, color:'#848CA3', textDecoration:'line-through'}}>£{itemSx.price}</span>
                                                            const mainPrice = <span style={{fontWeight:450, color:''}}>£{itemSx.offer ? itemSx.offer : itemSx.price}</span>
                                                            const more = (
                                                                <div className="btn-group" style={{padding:'0px', fontSize:'15px', fontWeight:'', cursor:'pointer'}}>
                                                                    <div className={"dropleft"} color=''
                                                                        type="" id="dropdownMenuButton" data-bs-toggle="dropdown" //data-bs-auto-close="outside"
                                                                        aria-haspopup="false" aria-expanded="false" data-bs-offset="-127,-45"
                                                                    >
                                                                        <div className='center btnShadow' style={{height:'100%', backgroundColor:'#ffffff', borderRadius:'3px'}}>
                                                                            <BsThreeDotsVertical />
                                                                        </div>
                                                                    </div>
                                                                    <div className="dropdown-menu animated fadeIn sticky-top" aria-labelledby="dropdownMenuButton"
                                                                        style={{ fontSize: '13px', margin: 230 }}>
                                                                        <div className='dropdown-item d-flex justify-content-between' style={{cursor: 'pointer'}}
                                                                            onClick={() => editServiceFunction(i, ix, s)}>
                                                                            <span>Edit</span>
                                                                            <MdEdit style={{width:'20px', fontSize:'18px'}}/>
                                                                        </div>
                                                                        <div className='dropdown-item d-flex justify-content-between'
                                                                            style={{color: s===0 ? '#99999999' : ''}}
                                                                            onClick={() => s===0 ? null : moveUpServiceFunction(i, ix, s)}>
                                                                            <span>Move Up</span>
                                                                            <BiChevronsRight style={{width:'20px', fontSize:'20px', lineHeight:'20px', transform: 'rotate(-90deg)'}}/>
                                                                        </div>
                                                                        <div className='dropdown-item d-flex justify-content-between'
                                                                            style={{color: s===lis ? '#99999999' : ''}}
                                                                            onClick={() => s===lis ? null : moveDownServiceFunction(i, ix, s)}>
                                                                            <span>Move Down</span>
                                                                            <BiChevronsRight style={{width:'20px', fontSize:'20px', lineHeight:'20px', transform: 'rotate(90deg)'}}/>
                                                                        </div>
                                                                        <hr/>
                                                                        <div className='dropdown-item d-flex justify-content-between binX'
                                                                            onClick={() => requestDeleteServiceFunction(i, ix, s)}>
                                                                            <span>Delete</span>
                                                                            <FaTrash style={{width:'20px', fontSize:'13px', marginTop:'2px'}}/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )

                                                            const deleteBtn = (
                                                                <Button variant='danger' onClick={() => deleteServiceFunction(i, ix, s)}
                                                                    style={{width:'60px', height:'25px', fontSize:'12px', padding:'3px 8px', margin:'5px'}}>
                                                                    Delete
                                                                </Button>
                                                            )
                                                            const cancelBtn = (
                                                                <Button variant='primary' onClick={() => cancelDeleteServiceFunction(i, ix, s)}
                                                                    style={{width:'60px', height:'25px', fontSize:'12px', padding:'3px 8px', margin:'5px'}}>
                                                                    Cancel
                                                                </Button>
                                                            )
                                                            const deleteService = (
                                                                <div id={`deleteServiceBox-${i}-${ix}-${s}`} style={{padding:'3px 8px', marginTop:'5px', borderRadius:'3px', backgroundColor:'#ff7f7f', alignItems:'center', display:'none'}}>
                                                                    <span style={{color:'#ffffff', marginRight:'20px'}}>
                                                                        Would you like to delete this service?
                                                                    </span>
                                                                    {deleteBtn}
                                                                    {cancelBtn}
                                                                </div>
                                                            )
                                                            //, border: itemSx.toggleDelete ? '1px solid #ff7f7f' : ''
                                                            return (
                                                                <div key={s} id={`service-${i}-${ix}-${s}`} className={`d-flex f7`}
                                                                    style={{ position:'relative', minHeight:'50px', padding:'5px', margin:'5px', borderRadius:'5px', borderWidth:'1px', backgroundColor:'#e5f1fe', flexDirection:'column'}}>
                                                                    <div className='d-flex'>
                                                                        <div style={{width:'100%', marginRight:'10px'}}>
                                                                            <div className='d-flex justify-content-between' style={{width:'100%'}}>
                                                                                {itemSx.service}
                                                                                {mainPrice}
                                                                            </div>
                                                                            <div className='d-flex justify-content-between' style={{width:'100%'}}>
                                                                                <div>
                                                                                    { itemSx.h>0 && h}
                                                                                    { itemSx.min>0 && min}
                                                                                </div>
                                                                                {itemSx.offer && priceOff}
                                                                            </div>
                                                                        </div>
                                                                        {more}
                                                                    </div>
                                                                    {deleteService}
                                                                </div>
                                                            )
                                                        }
                                                    )
                                                }
                                            </div>
                                        )
                                        return (
                                            <div key={ix} id={`sub-${i}-${ix}`} className={`d-flex f7 b0`}
                                                style={{ position:'relative', minHeight:'50px', padding:'5px', margin:'5px', borderRadius:'5px', borderWidth:'1px', flexDirection:'column', borderWidth:'0px 0px 1px 0px'}}>
                                                <div className={`d-flex`}
                                                    style={{ position:'relative', minHeight:'50px', alignItems:'center', justifyContent:'space-between', borderRadius:'5px', flexDirection: w<s ? 'column' : ''}}>
                                                    {subcategoryTitle}
                                                    {subBtns}
                                                </div>
                                                {bookingSystem && services}
                                                {bookingSystem && newService}
                                            </div>
                                        )
                                    }
                                )
                            }
                        </div>
                        {newSub}
                        {/* inputEditConst */}
                    </div>
                </div>
            )
            return (
                <div key={i} className={`f7 b0`}
                    style={{ position:'relative', width:'100%', height:'', margin:'5px', borderRadius:'10px', borderWidth:'1px', backgroundColor:'#e0e0e0', direction:rtl ? 'rtl' : ''}}>
                    <div className='d-flex' style={{ width:'100%', padding:'2px', alignItems:'center', flexDirection: w<s ? 'column' : '' }}>
                        {category}
                        {btns}
                    </div>
                    { item.toggleSubCat && subcategory }
                </div>
            )
        }
    )

    return dataRV
}

const setSubcatTrue = (categoryItems=[]) => {
    const items = categoryItems.map(item => {
        return {
            ...item, // کپی سایر خصوصیات بدون تغییر
            toggleSubCat: true // تنظیم مقدار toggleSubCat به true
        };
    });
    return items
}

const filterCategory = (categoryItems) => {
    const items = categoryItems?.filter(item => item.id !== 0) // حذف آیتم‌هایی با id === 0
    .map(item => {
        const validSub = item.sub ? item.sub.filter(subItem => subItem.id !== 0) : [];
        return { ...item, sub: validSub }; // بازگرداندن آیتم با sub فیلترشده
    });
    return items
}

const updateCategory = async (user, categoryData, dispatch) => {
    const filteredItems = filterCategory(categoryData)
    var info = {
        userId: user._id,
        items: filteredItems
    }
    const categoryItems = await axios.post(`${serverURL}/userPanel/saveCategory`, info);
    user.categoryItems = categoryItems.data.items

    dispatch(setUserInfo(user));
    dispatch(setSubUserInfo(user));

    return user
}

const hideInputEditBox = () => {
    const inputEditBox = document.getElementById('inputEditBox')
    inputEditBox.style.display = 'none';
    const inputEdit = document.getElementById('inputEdit');
    inputEdit.value = "";
}

const hideInputServiceBox = () => {
    const serviceTitle = document.getElementById('serviceTitle');
    const servicePrice = document.getElementById('servicePrice');
    const serviceOffer = document.getElementById('serviceOffer');
    const serviceDurationH = document.getElementById('serviceDurationH');
    const serviceDurationMin = document.getElementById('serviceDurationMin');
    const inputServiceBox = document.getElementById('inputServiceBox')
    serviceTitle.value = "";
    servicePrice.value = "";
    serviceOffer.value = "";
    serviceDurationH.value = "";
    serviceDurationMin.value = "";
    inputServiceBox.style.display = 'none';
    // setTimeout(() => {
    // }, 200);
}

const deleteAd = async (data, i) => {
    const adsInfo = data[i]
    const adsId = adsInfo._id
    const pictures = adsInfo.pictures
    await axios.post(`${serverURL}/ads/delete`, {adsId})

    for(let x=0; x<pictures.length; x++) {
      var fileName = adsId + "-" + pictures[x] + ".jpeg"
      await pixDelete({dest: destB + "/" + fileName})
    }
}

const deleteVideo = async (data, i) => {
    const videoInfo = data[i]
    const videoId = videoInfo._id
    await axios.post(`${serverURL}/video/delete`, {videoId})
}

const deleteInsta = async (data, i) => {
    const instaInfo = data[i]
    const instaId = instaInfo._id
    await axios.post(`${serverURL}/instagram/delete`, {instaId})
}

const serviceErrs = (infoErr) => {
    // console.log('infoErr: ', infoErr)
    const titleElm = document.getElementById('serviceTitleLabel')
    const priceElm = document.getElementById('servicePriceLabel')
    const durationElm = document.getElementById('serviceDurationLabel')
    const alertElm = document.getElementById('serviceAlert')
    titleElm.style.color = infoErr.titleErr ? 'red' : ''
    priceElm.style.color = infoErr.priceErr ? 'red' : ''
    durationElm.style.color = infoErr.durationErr ? 'red' : ''
    alertElm.style.display = Object.keys(infoErr).length>0 ? '' : 'none'
}

const showElement = (id) => {
    const elm = document.getElementById(id)
    if(elm) elm.style.display = '';
}

const hideElement = (id) => {
    const elm = document.getElementById(id)
    if(elm) elm.style.display = 'none';
}

const totalPrice = (services) =>
  services.reduce(
    (sum, { serviceInfo }) => sum + (serviceInfo.offer ?? serviceInfo.price ?? 0),
    0
);

const updateCategoryItems = (categoryItems, userServiceSelected) => {
  // لیست id سرویس‌های انتخاب‌شده
  const selectedIds = new Set(userServiceSelected.map(item => item.serviceInfo.id));

  // پیمایش بازگشتی روی categoryItems
  const traverse = (items) =>
    items.map((item) => {
      if (item.sub) {
        return {
          ...item,
          sub: traverse(item.sub),
        };
      } else {
        // اگر id این سرویس توی selectedIds بود → selected: true
        return selectedIds.has(item.id)
          ? { ...item, selected: true }
          : { ...item };
      }
    });

  return traverse(categoryItems);
};

export { mapAllPS, mapCategory, mapSubcategory, mapService,
    onSearchAds, onSearchVideo, onSearchInsta, 
    getAllAds, mapAllAds, getAllAdsSub, updateCategoryItems,
    getAllVideo, mapAllVideo, getAllVideoSub, 
    getAllInsta, mapAllInsta, getAllInstaSub, 
    mapInModalCategory, updateCategory, 
    setSubcatTrue, hideInputEditBox, hideInputServiceBox,
    filterCategory, deleteAd, deleteVideo, deleteInsta,
    serviceErrs, showElement, hideElement, totalPrice,
    // offSubcat, setSelectSubcategory, setDeselectSubcategory,
    // setSelectCategory, 
};