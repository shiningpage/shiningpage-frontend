import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { setSubUserInfo, setUserInfo } from '../../dataStore/actions';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { filterCategory, mapInModalCategory } from '../web/psSub/psHelper';
import { getUserInfo, exist } from '../../helper';
import { serverURL, s } from '../../srcSet';

var destX = "../pix.shiningpage.com/whoraly/category"

const ModalNewCategory = (props) => {
    const { loader, me, fc, nx, txBlack, toggleNewCategory, onToggle, mapCategoryFunction, mapModalCategoryFunction, subcatQty, pixSave, pixHandler, pixResizer, dispatch, mapStateToProps } = props;
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

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        setAction(false)
        setCategoryTitle('')
        setImageArray([])
        setFileBArr([])
        setFormatErr('')
        setSelectImgErr('')
        setCategoryTitleErr('')
    }, [toggleNewCategory]);

    const changeHandler = (event) => {
        const { name, value } = event.target;
        setCategoryTitle(value.trim() === "" ? null : value);
        setCategoryTitleErr(false)
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
                } else {
                    setFormatErr(setLT.formatErr);
                    setImageArray([]);
                }
            });
        }
    };

    const checkNull = () => {
        var infoErr = {}
        if(!imageArray[0]) infoErr.selectImgErr = true
        if(!exist(categoryTitle)) infoErr.categoryTitleErr = true
        // console.log(categoryTitle)
        return infoErr
    }

    const onSave = async () => {
        var infoErr = checkNull()
        // console.log(infoErr)
        if(Object.keys(infoErr).length>0) {
            setSelectImgErr(infoErr.selectImgErr)
            setCategoryTitleErr(infoErr.categoryTitleErr)
        } else {
            setAction(true);
            var userCategoriesX = subUserInfo.categoryItems
            const dateN = new Date().getTime().toString();
            var newCategory = {
                id: dateN,
                pixId: dateN,
                title: categoryTitle,
                sub: [],
                toggleSubCat: true,
            }
            var info = {
                userId: mainUser._id,
                items: [...[newCategory], ...userCategoriesX]
            }
            info.items = info.items.filter(item => item.id !== 0);

            try {
                const categoryItems = await axios.post(`${serverURL}/userPanel/saveCategory`, info);
                // console.log('categoryItems:', categoryItems.data.items)
                await pixSave(fileBArr[0], `${sz}|${mainUser._id + "-" + newCategory.id}|${destX.replaceAll("/", "@")}`)
                
                subUserInfo.categoryItems = categoryItems.data.items
                onToggle();
                setTimeout(async () => {
                    setImageArray([]);
                    setFileBArr([]);
                    setAction(false);
                    mapCategoryFunction(subUserInfo.categoryItems)
                    mapModalCategoryFunction(subUserInfo.categoryItems)
                    // setTimeout(() => {
                    //     subcatQty()
                    // }, 500);
                }, 1000);
            } catch (error) {
                console.error(error);
            }
        }

    };

    const addBtn = (
        <span className="btn btn-file center btnShadowX disable-select"
            style={{color:'', height:'70px', width:'70px', border:selectImgErr ? '1px solid red' : '1px solid #99999999', borderRadius:'3px', fontSize:'40px', fontWeight:10, alignItems:'center', margin:'5px', padding:'5px 0px 0px'}}>
            + <input type="file" onChange={pixChangeHandler}></input>
        </span>
    )

    const categoryImage = (
        <img
            className=''
            style={{ objectFit: 'contain', width: '280px', height: '280px', borderRadius:'3px', border: '1px solid #E1E1E1' }}
            src={imageArray[0]}
            alt="location photo"
        />
    )

    const imageConst =  (
        <div style={{border:'0px solid gray', borderRadius:'5px', width:'100%'}}>
            <div style={{textAlign:rtl ? 'right' : 'left', fontSize:'14px', fontWeight:450}}>{setLT.categoryPicture}*</div>
            <div className='center' style={{width:'100%', flexWrap:'wrap', direction:rtl ? 'rtl' : 'ltr'}}>
                { imageArray[0] ? categoryImage : addBtn }
            </div>
        </div>
    )

    const categoryTitleConst = (
        <div style={{ margin:'20px 0px' }}>
            <div style={{textAlign:rtl ? 'right' : 'left', fontSize:'14px', fontWeight:450}}>{setLT.categoryName}*</div>
            <input className='form-control' value={categoryTitle} style={{width: '100%', height:'30px', borderRadius:'5px', textAlign:'center', direction:'ltr', border:categoryTitleErr ? '1px solid red' : ''}} name="categoryTitle" onChange={changeHandler}/>
        </div>
    )

    return (
        <Modal show={toggleNewCategory} onHide={onToggle} backdropClassName="custom-backdrop">
            <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                <Modal.Title>
                    <span>New Category</span>&nbsp;
                    <span style={{fontSize:'12px'}}>Limit({(filterCategory(subUserInfo.categoryItems) || []).length + '/' + (subUserInfo.limits || {category:3}).category})</span>
                </Modal.Title>
                <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={onToggle} />
            </Modal.Header>
            { (filterCategory(subUserInfo.categoryItems) || []).length < (subUserInfo.limits || {category:3}).category
                ?
                <div>
                    <Modal.Body style={{ fontSize: '13px', borderRadius:'10px', padding:'30px' }}>
                        {imageConst}
                        {categoryTitleConst}
                    </Modal.Body>
                    <Modal.Footer>
                        <div className='center' style={{ width: '100%' }}>
                            <Button variant={imageArray[0] ? "success" : "light"} style={{minWidth:'100px'}} onClick={onSave}>{action ? loader : setLT.save}</Button>
                        </div>
                        <span className='invalid-feedback' style={{ textAlign: 'center', display: formatErr ? 'block' : 'none' }}>
                            {formatErr}
                        </span>
                    </Modal.Footer>
                </div>
                :
                <Modal.Body style={{ fontSize: '13px', borderRadius:'10px', padding:'30px' }}>
                    <div className="alert alert-danger" role="alert" style={{width:'100%', margin:'0px', textAlign:rtl ? 'right' : 'left', fontSize:'15px', }}>
                        {setLT.limitReached}&nbsp;
                        ({(filterCategory(subUserInfo.categoryItems) || []).length + '/' + (subUserInfo.limits || {category:3}).category})
                    </div>
                </Modal.Body>
            }
        </Modal>
    );
}

export default ModalNewCategory;
