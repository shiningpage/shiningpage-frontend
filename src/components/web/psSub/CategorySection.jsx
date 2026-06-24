import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import ModalHandleCategory from '../../modals/ModalHandleCategory';
import ModalNewCategory from '../../modals/ModalNewCategory';
import ModalEditCategory from '../../modals/ModalEditCategory';
import pixSave from '../../../modules/pixSave';
import pixDelete from '../../../modules/pixDelete';
import pixHandler from '../../../modules/pixHandler';
import pixResizer from '../../../modules/pixResizer';
import '../../../assets/css/style.css';

import { BiSolidCategory } from 'react-icons/bi';
import { BsFillCaretLeftFill } from 'react-icons/bs';
import { AdsHorizontal, AdsMultiplex } from '../../GoogleAds';
import { filterCategory } from './psHelper';
import { s, serverURL, googleAds } from '../../../srcSet';

const CategorySection = (props) => {
    const { me, fc, nx, action, saveService, txBlack, activeType, loadingAds, loadingVideo, loadingInsta, categoryTitleX, categorySubs, categoryTitleXSub, subTitleStyleS, loadingCategory, onAllCategory, mapCategoryFunction, mapModalCategoryFunction, subcatQty, categoryItems, categoryList, modalCategoryList, subcategoryList, serviceList, toggleEditCategory, onToggleEditCategory, catE, inputEditChangeHandler, serviceTitleChangeHandler, servicePriceChangeHandler, serviceOfferChangeHandler, serviceDurationHChangeHandler, serviceDurationMinChangeHandler, addSubCat, addService, allAds, allVideo, allInsta, catXRef, adsN, adsNCat, adsNCatSub, videoN, videoNCat, videoNCatSub, instaN, instaNCat, instaNCatSub, adsSection, videoSection, instaSection, EditBtn, dispatch, mapStateToProps } = props;
    const { mainUser, subUserInfo, setLT, lang, rtl, } = mapStateToProps;
    const [w, setW] = useState(document.body.clientWidth);
    const [toggleHandleCategory, setToggleHandleCategory] = useState(false);
    const [toggleNewCategory, setToggleNewCategory] = useState(false);
    const catExist = (categoryItems || []).length>0 ? true : false
    const catSubExist = categorySubs.length>0 ? true : false
    const catTitle = categoryTitleX ? categoryTitleX : ((me || categoryList.length>0) ? 'All' : <span style={{fontSize:'25px', fontWeight:450, }}>Content</span>)
    const contentLoading = loadingAds && loadingVideo && loadingInsta ? true : false

    const countTotalSub = (data) => {
        let totalSub = [];
        data.forEach(item => {
            totalSub = totalSub.concat(item.sub);
        });
        return totalSub.length
    }

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const onToggleNewCategory = () => {
        setToggleNewCategory(!toggleNewCategory)
    }

    const onToggleHandleCategory = () => {
        setToggleHandleCategory(!toggleHandleCategory)
    }

    // console.log('categoryTitleX: ', categoryTitleX)
    // console.log('categorySubs: ', categorySubs)
    const adsBox1 = <div className=''><AdsHorizontal id='adsH1' /></div>
    const adsBox2 = <div className=''><AdsHorizontal id='adsH2' /></div>
    const adsBox3 = <div className=''><AdsHorizontal id='adsH3' /></div>

    const loader = <div className='loader-13' style={{margin: rtl ? '35px 20px -25px' : '0px 20px 0px', transform: rtl ? 'rotate(180deg)' : ''}}></div>

    const allClass = `C${fc} f${txBlack ? 7 : 11} b${fc===11 ? 0 : 11}`
    const allDeselectClass = `f7 b${fc===7 ? 0 : fc}`
    const allCategory = (
        <div id='categoryAll' className={`center btnShadow disable-select ${catXRef==='All' ? allClass : allDeselectClass}`}
            onClick = {() => onAllCategory()}
            style={{minWidth:'50px', height:'150px', padding:'2px', margin:'0px 5px 5px 0px', alignItems:'center', borderRadius:'10px', borderWidth:'2px', flexDirection:'column'}}>
            <span style={{fontSize:'16px', fontWeight:400}}>Show</span>
            <span style={{fontSize:'18px', fontWeight:400}}>All</span>
        </div>
    )

    // const allCategory = (
    //     <div id='categoryAll' className={`d-flex btnShadow disable-select ${catXRef==='All' ? allClass : allDeselectClass}`}
    //         onClick = {() => onAllCategory()}
    //         style={{minWidth:'50px', height:'150px', padding:'2px', margin:'5px', alignItems:'center', borderRadius:'10px', borderWidth:'2px', flexDirection:'column'}}>
    //         <span style={{fontSize: w<s ? '' : '16px', fontWeight:400, margin:'0px 10px', whiteSpace:'nowrap'}}>All</span>
    //         <div style={{width:'100%', marginBottom:'10px', borderRadius:'5px', color:'#000000', backgroundColor:'#ffffff90', textAlign:'center'}}>
    //             <div>Sub</div>
    //             <span style={{margin:'0px', fontSize:'14px'}}>{countTotalSub(categoryItems)}</span>
    //         </div>
    //         <div>
    //             <div>Content</div>
    //             <span style={{margin:'0px', fontSize:'14px'}}>{nx ? nx : '-'}</span>
    //         </div>
    //     </div>
    // )

    const categoryTitle = (
        <div className='d-flex' style={{...subTitleStyleS, margin:'0px', alignItems:'center'}}>
            {me && <EditBtn type={catExist ? 'edit' : 'add'} margin='0px 10px 0px 5px' position={''} onClick={() => onToggleHandleCategory()}/>}
            <span style={{fontSize:'22px', fontWeight:450}}>Category</span>
        </div>
    )

    const nullCategory = (
        <div className={`C${fc}`} style={{ position:'relative', width:'100%', margin:'5px 0px 10px', padding:'2px', borderRadius:'7px', }}>
            <div style={{width:'100%', minHeight:'100px', padding:'10px', borderRadius:'5px', backgroundColor:'#ffffff'}}>
                There is no category.
            </div>
        </div>
    )
    const allCategoryList = (
        <div id='categoryTape' className='' style={{padding:'0px', marginBottom:'30px', position:'relative'}}>
            <div className='d-flex mostly-customized-scrollbar'
                style={{width:'100%', height:'', padding:'0px', flexWrap:'nowrap', backgroundColor:'#ffffff99',
                borderRadius:w<s ? '0px' : '10px', alignItems:'flex-end', top:0, overflow:'scroll', overflowY: 'hidden',
                zIndex:'1'}}
            >
                {allCategory}
                {categoryList.length===0 && nullCategory}
                {loadingCategory ? loader : categoryList}
            </div>
        </div>
    )

    // console.log('categoryList: ', categoryList)
    // console.log('categorySubs: ', categorySubs)
    // console.log('subcategoryList: ', subcategoryList)
    // console.log('subcategoryList: ', subcategoryList)
    const subcategoryListWithGoogleAds = subcategoryList //w>=s && subUserInfo.ads ? [...subcategoryList, adsBox3] : subcategoryList;

    const allSubcategoryList = (
        <div id='allSubcategories' style={{width:w<s ? '100%' : '350px', marginBottom:'30px', paddingRight: w<s ? '' : (subcategoryList.length>0 ? '50px' : '10px'), zIndex:1}}>
            { subcategoryList.length>0
                ? subcategoryListWithGoogleAds
                : (
                    <div className={`C${fc}`} style={{ position:'relative', width:'100%', marginBottom:'20px', padding:'2px', borderRadius:'7px', }}>
                        <div style={{width:'100%', minHeight:'100px', padding:'10px', borderRadius:'5px', backgroundColor:'#ffffff'}}>
                            <div style={{marginBottom:'10px'}}>There is no subcategory.</div>
                        </div>
                    </div>
                )
            }
        </div>
    )

    const serviceTitle = (
        <div className='d-flex' style={{position:'absolute', top:-13, left:10, fontWeight:450, padding:'3px', backgroundColor:'#ffffff', whiteSpace:'nowrap'}}>
            <div>SERVICES <span style={{fontSize:'13px'}}>(Book Online)</span></div>
        </div>
    )

    const allServiceList = (
        <div id='services' style={{width:w<s ? '100%' : 'calc(100% - 350px)'}}>
            <div className={`C${fc}`} style={{ position:'relative', width:'100%', marginBottom:'20px', padding:'2px', borderRadius:'7px', }}>
                <div style={{width:'100%', minHeight:'100px', padding:'20px 10px 10px', borderRadius:'5px', backgroundColor:'#ffffff'}}>
                    {serviceList}
                </div>
                {serviceTitle}
            </div>
        </div>
    )

    const cotentTitle = (
        <div className='d-flex' style={{position:'absolute', top:-13, left:10, fontWeight:450, padding:'3px', backgroundColor:'#ffffff', whiteSpace:'nowrap'}}>
            <span>Contents</span>
        </div>
    )
            // <div><BsFillCaretLeftFill style={{width:'20px', transform:'rotate(180deg)'}}/></div>
            // {categoryTitleX ? categoryTitleX : 'All'}
            // { activeType==='sub' &&
            //     <div className='d-flex'>
            //         <div className='d-flex' style={{alignItems:'center'}}>
            //             <div><BsFillCaretLeftFill style={{width:'20px', transform:'rotate(180deg)'}}/></div>
            //             {categoryTitleXSub}
            //         </div>
            //     </div>
            // }

    // console.log('activeType: ', activeType ? 'sub' : 'main ' + videoNCat)
    // console.log('------------')
    // console.log('allAds: ', allAds)
    // console.log('allVideo: ', allVideo)
    // console.log('allInsta: ', allInsta)

    // console.log('adsN: ', adsN)
    // console.log('videoN: ', videoN)
    // console.log('instaN: ', instaN)
    // console.log('------------')
    // console.log('adsNCat: ', adsNCat)
    // console.log('videoNCat: ', videoNCat)
    // console.log('instaNCat: ', instaNCat)
    // console.log('------------')
    // console.log('adsNCatSub: ', adsNCatSub)
    // console.log('videoNCatSub: ', videoNCatSub)
    // console.log('instaNCatSub: ', instaNCatSub)
    const content = (
        <div id='content' style={{width:w<s ? '100%' : 'calc(100% - 350px)'}}>
            {w>s && subUserInfo?.access?.includes("BookingSystem") && allServiceList}
            <div className={`C${fc}`} style={{ position:'relative', width:'100%', marginBottom:w<s ? '30px' : '', padding:'2px', borderRadius:'7px'}}>
                <div style={{width:'100%', padding:'2px', borderRadius:'5px', backgroundColor:'#ffffff'}}>
                    <div id='socialContent' style={{width:w<s ? '100%' : ''}}>
                        {/* searchTapeSection */}
                        { (!me && allAds.length===0 && allVideo.length===0 && allInsta.length===0)
                            ?
                            <div>
                                <div style={{margin:'20px 10px 10px'}}>There is no content. <span style={{fontSize:'12px'}}>(Coming soon)</span></div>
                            </div>
                            :
                            <div>
                                {(me || allAds.length>0) ? adsSection : ''}
                                {(me || allVideo.length>0) ? videoSection : ''}
                                {(me || allInsta.length>0) ? instaSection : ''}
                            </div>
                        }
                    </div>
                </div>
                {cotentTitle}
            </div>
        </div>
    )

    const contentSectionWithSub = (
        <div id='container' className={w<s ? '' : 'd-flex'} style={{width:'100%'}}>
            <div>
                <div style={{marginBottom:'20px', fontWeight:450}}>
                    <div style={{fontSize:'22px'}}>{catTitle}</div>
                    <div style={{fontSize:'16px'}}>
                        <span style={{marginRight:'5px'}}>Subcategories</span>
                        <span style={{fontSize:'14px', fontWeight:''}}>({categorySubs.length})</span>
                    </div>
                </div>
                {/* subUserInfo?.access?.includes("BookingSystem") && <div style={{fontSize:'20px', fontWeight:450, marginBottom:'0px', textAlign: w<s ? 'center' : ''}}>Select a service</div> */}
                {allSubcategoryList}
            </div>
            {content}
        </div>
    )

    // console.log('loadingAds: ', loadingAds)
    // console.log('loadingVideo: ', loadingVideo)
    // console.log('loadingInsta: ', loadingInsta)
    // console.log('AllItems: ', allAds.length+ allVideo.length>+ allInsta.length)
    const contentSectionWithoutSub = (
        <div id='container' className='' style={{width:'100%'}}>
            <div style={{fontSize:'22px'}}>{ contentLoading ? 'Loading ...' : catTitle }</div>
            <div>
                {(me || allAds.length>0) ? adsSection : ''}
                {(me || allVideo.length>0) ? videoSection : ''}
                {(me || allInsta.length>0) ? instaSection : ''}
            </div>
        </div>
    )

    const modalHanddleCategory = (
        <ModalHandleCategory
            loader={loader}
            action={action}
            saveService={saveService}
            serverURL={serverURL}
            categoryItems={categoryItems}
            EditBtn={EditBtn}
            toggleHandleCategory={toggleHandleCategory}
            onToggle={onToggleHandleCategory}
            onToggleNewCategory={onToggleNewCategory}
            toggleNewCategory={toggleNewCategory}
            mapCategoryFunction={mapCategoryFunction}
            mapModalCategoryFunction={mapModalCategoryFunction}
            inputEditChangeHandler={inputEditChangeHandler}
            serviceTitleChangeHandler={serviceTitleChangeHandler}
            servicePriceChangeHandler={servicePriceChangeHandler}
            serviceOfferChangeHandler={serviceOfferChangeHandler}
            serviceDurationHChangeHandler={serviceDurationHChangeHandler}
            serviceDurationMinChangeHandler={serviceDurationMinChangeHandler}
            addSubCat={addSubCat}
            addService={addService}
            modalCategoryList={modalCategoryList}
            subcatQty={subcatQty}
            pixSave={pixSave}
            pixHandler={pixHandler}
            pixResizer={pixResizer}
            dispatch={dispatch}
            mapStateToProps={mapStateToProps}
        />
    )
    const modalNewCategory = (
        <ModalNewCategory
            loader={loader}
            serverURL={serverURL}
            EditBtn={EditBtn}
            toggleNewCategory={toggleNewCategory}
            onToggle={onToggleNewCategory}
            mapCategoryFunction={mapCategoryFunction}
            mapModalCategoryFunction={mapModalCategoryFunction}
            subcatQty={subcatQty}
            pixSave={pixSave}
            pixHandler={pixHandler}
            pixResizer={pixResizer}
            dispatch={dispatch}
            mapStateToProps={mapStateToProps}
        />
    )

    const modalEditCategory = (
        <ModalEditCategory
            me={me}
            loader={loader}
            serverURL={serverURL}
            catE={catE}
            EditBtn={EditBtn}
            categoryItems={categoryItems}
            toggleEditCategory={toggleEditCategory}
            onToggle={onToggleEditCategory}
            mapCategoryFunction={mapCategoryFunction}
            mapModalCategoryFunction={mapModalCategoryFunction}
            subcatQty={subcatQty}
            pixSave={pixSave}
            pixDelete={pixDelete}
            pixHandler={pixHandler}
            pixResizer={pixResizer}
            dispatch={dispatch}
            mapStateToProps={mapStateToProps}
        />
    )

    return (
        <div>
            {(me || categoryList.length>0) && categoryTitle}
            {w<s && (me || categoryList.length>0) && allCategoryList}
            <div>
                {w>=s && (me || categoryList.length>0) && allCategoryList}
                {me || catSubExist ? contentSectionWithSub : contentSectionWithoutSub}
            </div>
            {modalHanddleCategory}
            {modalNewCategory}
            {modalEditCategory}
        </div>
    );
}

export default CategorySection;
