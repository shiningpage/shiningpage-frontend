import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { setAdsInfo, setToggleAds } from '../../dataStore/actions';
import pixSave from '../../modules/pixSave';
import pixHandler from '../../modules/pixHandler';
import pixResizer from '../../modules/pixResizer';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { getUserInfo } from '../../helper';

const destB = "../pix.shiningpage.com/whoraly/ads/big"

const ModalAddImageToContent = (props) => {
    const { serverURL, adsInfo, toggleModalAddImage, onToggle, adsCommentArr, dispatch} = props
    // const {mainUser, setLT, rtl, lang} = props.mapStateToProps

    const [w, setW] = useState(document.body.clientWidth);
    const [sz] = useState(150);
    const [szx] = useState(800);
    const [imageArray, setImageArray] = useState([]);
    const [alt, setAlt] = useState('');
    const [altErr, setAltErr] = useState('');
    const [fileBArr, setFileBArr] = useState([]);
    const [formatErr, setFormatErr] = useState('');
    const [action, setAction] = useState(false);

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (toggleModalAddImage) {
            setImageArray([]);
            setFormatErr('')
        }
    }, [toggleModalAddImage]);

    const pictureHandler = (e) => {
        if (e.target.files[0]) {
            console.log(555, e.target.files[0])
            setAlt(e.target.files[0].name)
            pixHandler(e, szx).then(res => {
                if (res) {
                    setImageArray([res.base64]);
                    const selectedFileB = res.file.size > res.fileResized.size ? res.fileResized : res.file;
                    setFileBArr(prev => [...prev, selectedFileB]);
                } else {
                    setFormatErr(props.setLT.formatErr);
                    setImageArray([]);
                }
            });
        }
    };

    const onSavePicture = async () => {
        setAction(true);
        const dateN = new Date().getTime().toString();

        try {
            console.log(fileBArr[0])
            console.log(adsInfo._id)
            console.log(dateN)
            const imgName = adsInfo._id + "-" + dateN
            const imageHTML = 
            `
                <img
                    class="add-image"
                    src="https://www.pix.shiningpage.com/whoraly/ads/big/${imgName}.jpeg"
                    alt="${alt}"
                />
            `;

            const data = {
                adsId: adsInfo._id,
                adsComment: adsCommentArr[0]+imageHTML+adsCommentArr[1],
            }
            await axios.post(`${serverURL}/ads/userEditAdsComment`, data)
            .then(async res => {
                console.log(res.data)
                await pixSave(fileBArr[0], `${szx}|${imgName}|${destB.replaceAll("/", "@")}`)
                setTimeout(async () => {
                    dispatch(setAdsInfo(res.data))
                    dispatch(setToggleAds({type: false}))
                    setImageArray([]);
                    setFileBArr([]);
                    setAction(false);
                    onToggle();
                }, 1000);
            })

        } catch (error) {
            console.error(error);
        }
    };

    const loader13 = (
        <span
            className='loader-13'
            style={{ fontSize: '10px', margin: '0px 10px', color: '', transform: '' }}
        ></span>
    );

    const pixAdd = (
        <span className="btn btn-file center btnShadowX disable-select"
            style={{color:'', height:'100px', width:'100px', borderRadius:'0px', borderRadius:'3px', fontSize:'40px', fontWeight:10, alignItems:'center', margin:'0px', padding:'5px 0px 0px'}}>
            <div>
                +
            </div>
            <input type="file" name="file" onChange={pictureHandler}/>
        </span>
    )

    const titleStyle = {fontSize:'14px', fontWeight:'bold', marginTop:'15px'}
    const inputStyle = {width: '100%', fontSize:'14px', height:'30px', borderRadius:'5px', textAlign:'center'}
    const altL = <div style={titleStyle}>Alt</div>
    const altConst = (
        <div>
            {altL}
            <input className='form-control' value={alt} style={{...inputStyle, borderColor: altErr ? 'red' : ''}} name="alt" onChange={(e) => setAlt(e.target.value)}/>
        </div>
    )

    return (
        <Modal show={toggleModalAddImage} onHide={onToggle} backdropClassName="custom-backdrop">
            <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                <Modal.Title>Add image</Modal.Title>
                <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={onToggle} />
            </Modal.Header>
            <Modal.Body style={{ fontSize: '13px', borderRadius: '10px' }}>
                <div className='center'>
                    {imageArray[0]
                        ?<img
                            className=''
                            style={{ objectFit: 'contain', width: '280px', height: '280px', borderRadius:'3px', border: '1px solid #E1E1E1' }}
                            src={imageArray[0]}
                            alt="Content Image"
                        />
                        : pixAdd
                    }
                </div>
                {altConst}
            </Modal.Body>
            <Modal.Footer>
                <div className='center' style={{ width: '100%' }}>
                    <Button variant="success" style={{minWidth:'100px'}} onClick={onSavePicture}>{action ? loader13 : 'save'}</Button>
                </div>
                <span className='invalid-feedback' style={{ textAlign: 'center', display: formatErr ? 'block' : 'none' }}>
                    {formatErr}
                </span>
            </Modal.Footer>
        </Modal>
    );
};

const mapStateToProps = (state) => {
    return {
        mainUser: state.userInfo,
        subUserInfo: state.subUserInfo,
        userId: state.subUserInfo._id,
        auth: state.auth,
        lang: state.lang,
        geo: state.geo,
        page: state.page,
        setLT: state.setLT,
        fullAccess: state.fullAccess,
    };
};

export default connect(mapStateToProps)(ModalAddImageToContent);
