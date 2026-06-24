import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { setSubUserInfo, setUserInfo } from '../../dataStore/actions';
import { FaTrash } from "react-icons/fa";
import { TbSubtask } from 'react-icons/tb';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiCategory, BiChevronsRight } from 'react-icons/bi';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { IoMdCloseCircle } from "react-icons/io";
import { MdEdit } from 'react-icons/md';
import { hideInputEditBox, hideInputServiceBox, setSubcatTrue } from '../web/psSub/psHelper';
import { getUserInfo, exist } from '../../helper';
import { serverURL, s, lightColors } from '../../srcSet';

var destX = "../pix.shiningpage.com/whoraly/category"

const ModalHandleCategory = (props) => {
    const { loader, me, fc, nx, txBlack, action, saveService, toggleHandleCategory, onToggle, onToggleNewCategory, modalCategoryList, categoryItems, mapModalCategoryFunction, inputEditChangeHandler, serviceTitleChangeHandler, servicePriceChangeHandler, serviceOfferChangeHandler, serviceDurationHChangeHandler, serviceDurationMinChangeHandler, inputEditText, inputServiceText, addSubCat, addService, pixHandler, pixResizer, dispatch, mapStateToProps } = props;
    const { mainUser, subUserInfo, setLT, lang, rtl, } = mapStateToProps;
    const [w, setW] = useState(document.body.clientWidth);
    const [catIndex, setCatIndex] = useState(null);
    const [subEditIndex, setSubEditIndex] = useState(null);

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if(toggleHandleCategory) {
            const items = setSubcatTrue(subUserInfo.categoryItems)
            mapModalCategoryFunction(items)
        }
    }, [toggleHandleCategory]);

    const newCategoryBtn = (
        <div className='d-flex center' style={{width:'100%', alignItems:'center', margin:'15px 0px 30px'}}>
            <div className='d-flex btn-file btnShadow waves-effect waves-light btn-large'
                style={{width:'', height:'40px', padding:'10px', textDecoration:'none', color:'#000000',
                fontSize:'16px', flexDirection:'', alignItems:'center', border:'2px solid #00CCFF',
                backgroundColor: '#ffffff', borderRadius:'5px'}}
                onClick = {() => onToggleNewCategory()}>
                {/* loaderAlert */}
                <BiCategory style={{fontSize:'20px'}}/>&nbsp;&nbsp;
                <span style={{textDecoration:'none', fontSize:''}}>{setLT.new} + </span>
            </div>
        </div>
    )

    const allCategoryList = (
        <div className='center' style={{width:'100%', flexWrap:'wrap', zIndex:'0', flexDirection:'column', opacity: action ? '0.4' : '1'}}>
            {modalCategoryList}
        </div>
    )

    const inputEditConst = (
        <div id='inputEditBox' style={{ position: 'absolute', display:'none' }}>
            <div style={{ position: 'relative' }}>
                <input id='inputEdit' type="text" className='form-control'
                    style={{width:'250px', height:'30px', padding:'6px 30px 6px 10px', color:'#000000'}}
                    // value={inputEditText}
                    onChange={(e) => inputEditChangeHandler(e)}
                />
                <BsFillCheckCircleFill color="green" className='btnShadow' //'hoverX'
                    style={{ width: '20px', fontSize: '20px', borderRadius:'100px', position: 'absolute', left: rtl ? 5 : '', right: rtl ? '' : 5, top: 5}}
                    onClick={() => addSubCat()}
                />
                <IoMdCloseCircle color="" className='btnShadow' //'hoverX'
                    style={{ width: '22px', fontSize: '22px', borderRadius:'100px', position: 'absolute', left: rtl ? -30 : '', right: rtl ? '' : -30, top: 4}}
                    onClick={() => hideInputEditBox()}
                />
            </div>
        </div>
    )

    const serviceHeader = (
        <div className='d-flex justify-content-between' style={{marginBottom:'10px', fontWeight:450}}>
            <span>Service Information</span>
            <IoMdCloseCircle className='sidebarIcon' style={{ width: '22px', fontSize: '22px'}} onClick={() => hideInputServiceBox()}/>
        </div>
    )
    const serviceTitle = (
        <div className='d-flex' style={{alignItems:'center', marginBottom:'10px'}}>
            <span id='serviceTitleLabel' style={{margin:'0px 10px'}}>Title*</span>
            <input id='serviceTitle' type="text" className='form-control'
                style={{fontSize:'14px', width:'100%', height:'30px', padding:'6px 30px 6px 10px'}}
                // value={inputServiceText}
                onChange={(e) => serviceTitleChangeHandler(e)}
            />
        </div>
    )
    const servicePrice = (
        <div className='d-flex' style={{alignItems:'center', marginBottom:'10px'}}>
            <span id='servicePriceLabel' style={{margin:'0px 10px'}}>Price<span style={{fontSize:'12px'}}>(£)</span>*</span>
            <div className='d-flex' style={{alignItems:'center', marginRight:'10px'}}>
                <input id='servicePrice' type="number" className='form-control'
                    style={{fontSize:'14px', width:'70px', height:'26px', padding:'5px 0px', marginRight:'5px', textAlign:'center'}}
                    // value={inputServiceText}
                    onChange={(e) => servicePriceChangeHandler(e)}
                />
            </div>
            <span style={{margin:'0px 10px'}}>Offer<span style={{fontSize:'12px'}}>(£)</span></span>
            <div className='d-flex' style={{alignItems:'center', marginRight:'20px'}}>
                <input id='serviceOffer' type="number" className='form-control'
                    style={{fontSize:'14px', width:'70px', height:'26px', padding:'5px 0px', marginRight:'5px', textAlign:'center'}}
                    // value={inputServiceText}
                    onChange={(e) => serviceOfferChangeHandler(e)}
                />
            </div>
        </div>
    )
    const serviceDuration = (
        <div className='d-flex' style={{alignItems:'center', marginBottom:'10px'}}>
            <span id='serviceDurationLabel' style={{margin:'0px 10px'}}>Duration*</span>
            <div className='d-flex' style={{alignItems:'center', marginRight:'20px'}}>
                <input id='serviceDurationH' type="number" className='form-control'
                    style={{fontSize:'14px', width:'50px', height:'26px', padding:'5px 0px', marginRight:'5px', textAlign:'center'}}
                    // value={inputServiceText}
                    onChange={(e) => serviceDurationHChangeHandler(e)}
                />
                <span style={{margin:''}}>h</span>
            </div>
            <div className='d-flex' style={{alignItems:'center'}}>
                <input id='serviceDurationMin' type="number" className='form-control'
                    style={{fontSize:'14px', width:'50px', height:'26px', padding:'5px 0px', marginRight:'5px', textAlign:'center'}}
                    // value={inputServiceText}
                    onChange={(e) => serviceDurationMinChangeHandler(e)}
                />
                <span style={{margin:''}}>min</span>
            </div>
        </div>
    )
    const serviceSaveBtn = (
        <div className='d-flex justify-content-end'>
            <div className='d-flex btnShadow' onClick={() => addService()}
                style={{ width:'80px', height:'', padding:'3px', backgroundColor:'#ffffff', border:'1px solid green', borderRadius:'100px', alignItems:'center', opacity: saveService ? '0.4' : '1' }}
            >
                <BsFillCheckCircleFill color="green" style={{ width: '20px', fontSize: '20px', marginRight:'5px'}}/>
                <div style={{marginTop:'2px'}}>{saveService ? 'Saving' : 'Save'}</div>
            </div>
        </div>
    )
    const alert = <span id='serviceAlert' style={{fontSize:'12px', color:'red', display:'none'}}>Please complete all required fields marked with *.</span>
    const inputServiceConst = (
        <div id='inputServiceBox' className='cardShadow' style={{ position:'absolute', fontSize:'14px', width:'calc(100% - 35px)', height:'', marginLeft:'-20px', padding:'10px', backgroundColor:'#e5f1fe', borderRadius:'10px', display:'none',  }}>
            {serviceHeader}
            {serviceTitle}
            {servicePrice}
            {serviceDuration}
            {alert}
            {serviceSaveBtn}
        </div>
    )

    // onHide={onToggle}
    return (
        <Modal id='categorySection' show={toggleHandleCategory}>
            <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                <Modal.Title>{setLT.category}</Modal.Title>
                <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={onToggle} />
            </Modal.Header>
            <Modal.Body style={{ fontSize: '14px', borderRadius: '10px' }}>
                <div style={{}}>
                    {newCategoryBtn}
                    {allCategoryList}
                    {/* inputEditConst */}
                </div>
            </Modal.Body>
            {inputEditConst}
            {inputServiceConst}
        </Modal>
    );
}

export default ModalHandleCategory;
