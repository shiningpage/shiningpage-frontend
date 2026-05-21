import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { setSubUserInfo, setUserInfo } from '../../dataStore/actions';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { getUserInfo, exist } from '../../helper';
import { serverURL } from '../../srcSet';

var destX = "../pix.shiningpage.com/whoraly/category"

const ModalEditCategory = (props) => {
    const { me, fc, nx, catE, txBlack, subTitleStyleS, loadingCategory, onAllCategory, mapCategoryFunction, mapModalCategoryFunction, subcatQty, categoryItems, categoryList, subcategoryList, toggleEditCategory, onToggle, pixHandler, pixResizer, pixSave, pixDelete, EditBtn, dispatch, mapStateToProps } = props;
    const { mainUser, subUserInfo, setLT, lang, rtl, } = mapStateToProps;
    const [w, setW] = useState(document.body.clientWidth);
    const [sz] = useState(150);
    const [szx] = useState(1000);
    const [action, setAction] = useState(false);
    const [categoryTitle, setCategoryTitle] = useState('');
    const [imageArray, setImageArray] = useState([]);
    const [fileBArr, setFileBArr] = useState([]);
    const [formatErr, setFormatErr] = useState('');
        const [selectImgErr, setSelectImgErr] = useState(false);
    
    const [categoryTitleErr, setCategoryTitleErr] = useState(false);
    const [change, setChange] = useState(false);

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (toggleEditCategory) {
            setImageArray([]);
            setCategoryTitle(categoryItems[catE].title);
            setChange(false)
            // console.log(12, categoryItems[catE])
        }
    }, [toggleEditCategory]);
    
    const changeHandler = (event) => {
        const { name, value } = event.target;
        setCategoryTitle(value.trim() === "" ? null : value);
        setCategoryTitleErr(false)
        setChange(true)
    };

    const pixChangeHandler = (e) => {
        if (e.target.files[0]) {
            pixHandler(e, szx).then(res => {
                if (res) {
                    setImageArray([res.base64]);
                    const selectedFileB = res.file.size > res.fileResized.size ? res.fileResized : res.file;
                    setFileBArr(prev => [...prev, selectedFileB]);
                    pixResizer(selectedFileB, sz).then(res => {
                        if (res) {
                            setFormatErr('');
                        }
                    });
                    setChange(true)
                } else {
                    setFormatErr(setLT.formatErr);
                    setImageArray([]);
                }
            });
        }
    };

    const checkNull = () => {
        var infoErr = {}
        // if(!imageArray[0]) infoErr.selectImgErr = true
        if(!exist(categoryTitle)) infoErr.categoryTitleErr = true
        // console.log(categoryTitle)
        return infoErr
    }
    
    const onSave = async () => {
        var infoErr = checkNull()
        if(Object.keys(infoErr).length>0) {
            setCategoryTitleErr(infoErr.categoryTitleErr)
        } else {
            setAction(true);
            var userCategoriesX = subUserInfo.categoryItems
            const dateN = new Date().getTime().toString();
            userCategoriesX[catE].title = categoryTitle
            if(imageArray[0]) {
                await pixDelete({dest: destX + "/" + mainUser._id + "-" + userCategoriesX[catE].pixId + ".jpeg"})
                userCategoriesX[catE].pixId = dateN
            }

            var info = {
                userId: mainUser._id,
                items: userCategoriesX
            }
            info.items = info.items.filter(item => item.id !== 0);

            try {
                const categoryItems = await axios.post(`${serverURL}/userPanel/saveCategory`, info);
                if(imageArray[0]) {
                    await pixSave(fileBArr[0], `${sz}|${mainUser._id + "-" + dateN}|${destX.replaceAll("/", "@")}`)
                }
                subUserInfo.categoryItems = categoryItems.data.items
                setTimeout(async () => {
                    setImageArray([]);
                    setFileBArr([]);
                    setAction(false);
                    onToggle();
                    mapCategoryFunction(subUserInfo.categoryItems)
                    mapModalCategoryFunction(subUserInfo.categoryItems)
                }, 1000);
            } catch (error) {
                console.error(error);
            }
        }

    };

    const loader13 = (
        <span
            className='loader-13'
            style={{ fontSize: '10px', margin: rtl ? '20px 10px -20px' : '0px 10px', color: '', transform: rtl ? 'rotate(180deg)' : '' }}
        ></span>
    );

    const imageConst = (
        <div className='center' style={{marginBottom:'20px'}}>
            <div style={{width: '280px', height: '280px', position:'relative'}}>
                <img
                    className=''
                    style={{ objectFit: 'contain', width: '100%', height: '100%', borderRadius: subUserInfo.businessType > 0 ? '3px' : '100%', border: '1px solid #E1E1E1' }}
                    src={imageArray[0]
                        ? imageArray[0]
                            :categoryItems[catE]
                                ? `https://www.pix.shiningpage.com/whoraly/category/${subUserInfo._id}-${categoryItems[catE].pixId}.jpeg`
                                : ''
                    }
                    alt="category Picture"
                />
                <EditBtn file top={-10} right={-10} onClick={() => null} onChange={pixChangeHandler} />
            </div>
        </div>
    )

    const categoryTitleConst = (
        <div>
            <div style={{textAlign:rtl ? 'right' : 'left', fontSize:'14px', fontWeight:450}}>{setLT.categoryName}*</div>
            <input className='form-control' value={categoryTitle} style={{width: '100%', height:'30px', borderRadius:'5px', textAlign:'center', direction:'ltr', border:categoryTitleErr ? '1px solid red' : ''}} name="categoryTitle" onChange={changeHandler}/>
        </div>
    )

    return (
        <Modal show={toggleEditCategory} onHide={onToggle}>
            <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                <Modal.Title>{setLT.editCategory}</Modal.Title>
                <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={onToggle} />
            </Modal.Header>
            <Modal.Body style={{ fontSize: '13px', borderRadius:'10px', padding:'30px' }}>
                {imageConst}
                {categoryTitleConst}
            </Modal.Body>
            {me && (
                <Modal.Footer>
                    <div className='center' style={{ width: '100%' }}>
                        <Button variant={change ? "success" : "light"} style={{minWidth:'100px'}} onClick={change ? onSave : null}>{action ? loader13 : setLT.save}</Button>
                    </div>
                    <span className='invalid-feedback' style={{ textAlign: 'center', display: formatErr ? 'block' : 'none' }}>
                        {formatErr}
                    </span>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default ModalEditCategory;
