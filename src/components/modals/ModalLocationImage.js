import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { setSubUserInfo, setUserInfo } from '../../dataStore/actions';
import { AiOutlineCloseCircle } from "react-icons/ai";
import locationImg from '../../assets/images/other/location.jpg';
import { getUserInfo } from '../../helper';

const destBLocation = "../pix.shiningpage.com/whoraly/location/big"
const destSLocation = "../pix.shiningpage.com/whoraly/location/small"


const ModalLocationImage = (props) => {
    const { mainUser, subUserInfo, serverURL, setLT, rtl, fc, titleStyle, txBlack, index, onToggle, pixSave, pixDelete, pixResizer, pixHandler, toggleLocationImage, exist, EditBtn, dispatch } = props;
    const [w, setW] = useState(document.body.clientWidth);
    const [sz] = useState(150);
    const [szx] = useState(1000);
    const [imageArray, setImageArray] = useState([]);
    const [fileSArr, setFileSArr] = useState([]);
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
        if (toggleLocationImage) {
            setImageArray([]);
        }
    }, [toggleLocationImage]);

    const locationPictureHandler = (e) => {
        if (e.target.files[0]) {
            pixHandler(e, szx).then(res => {
                if (res) {
                    setImageArray([res.base64]);
                    const selectedFileB = res.file.size > res.fileResized.size ? res.fileResized : res.file;
                    setFileBArr(prev => [...prev, selectedFileB]);
                    pixResizer(selectedFileB, sz).then(res => {
                        if (res) {
                            const selectedFileS = res.file.size > res.fileResized.size ? res.fileResized : res.file;
                            setFileSArr(prev => [...prev, selectedFileS]);
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

    const onSaveLocationPicture = async () => {
        setAction(true);
        const dateN = new Date().getTime().toString();

        const data = {
            userId: mainUser._id,
            locationIndex: dateN
        };

        try {
            await axios.post(`${serverURL}/userPanel/saveLocationIndex`, data);
            await locationDeleteAction(mainUser);
            await locationSaveNewAction(mainUser, dateN);
            setTimeout(async () => {
                getUserInfo(mainUser._id, dispatch);
                setImageArray([]);
                setFileBArr([]);
                setFileSArr([]);
                setAction(false);
                onToggle();
            }, 1000);
        } catch (error) {
            console.error(error);
        }
    };

    const locationDeleteAction = async (mainUser) => {
        const fileName = `${mainUser._id}-${mainUser.locationIndex}.jpeg`;
        await pixDelete({ dest: `${destBLocation}/${fileName}` });
        await pixDelete({ dest: `${destSLocation}/${fileName}` });
    };

    const locationSaveNewAction = async (mainUser, dateN) => {
        pixSave(fileBArr[0], `${szx}|${mainUser._id}-${dateN}|${destBLocation.replaceAll("/", "@")}`);
        pixSave(fileSArr[0], `${sz}|${mainUser._id}-${dateN}|${destSLocation.replaceAll("/", "@")}`);
    };

    const onDeleteLocationImage = async () => {
        setAction(true);
        const { mainUser, serverURL } = props;
        const data = {
            userId: mainUser._id,
            locationIndex: ''
        };

        try {
            await axios.post(`${serverURL}/userPanel/saveLocationIndex`, data);
            const fileName = `${mainUser._id}-${mainUser.locationIndex}.jpeg`;
            await pixDelete({ dest: `${destBLocation}/${fileName}` });
            await pixDelete({ dest: `${destSLocation}/${fileName}` });
            setTimeout(async () => {
                const user = await getUserInfo(mainUser._id);
                dispatch(setUserInfo(user));
                dispatch(setSubUserInfo(user));
                setImageArray([]);
                setAction(false);
                onToggle();
            }, 1000);
        } catch (error) {
            console.error(error);
        }
    };

    const loader13 = (
        <span
            className='loader-13'
            style={{ fontSize: '10px', margin: rtl ? '20px 10px -20px' : '0px 10px', color: '', transform: rtl ? 'rotate(180deg)' : '' }}
        ></span>
    );

    // console.log('imageArray: ', mainUser.locationIndex)
    return (
        <Modal show={toggleLocationImage} onHide={onToggle}>
            <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                <Modal.Title>{setLT.locationPhoto}</Modal.Title>
                <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={onToggle} />
            </Modal.Header>
            <Modal.Body style={{ fontSize: '13px', borderRadius: '10px' }}>
                <div className='center'>
                    <img
                        className=''
                        style={{ objectFit: 'contain', width: '280px', height: '280px', borderRadius:'3px', border: '1px solid #E1E1E1' }}
                        src={imageArray[0]
                            ? imageArray[0]
                            : exist(subUserInfo.locationIndex)
                                    ? `https://www.pix.shiningpage.com/whoraly/location/big/${subUserInfo._id}-${subUserInfo.locationIndex}.jpeg`
                                    : locationImg
                        }
                        alt="location photo"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='center justify-content-between' style={{ width: '100%' }}>
                    <div className={rtl ? 'dropdown' : 'dropleft'} style={{ padding: '0px' }}>
                        <div id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="" aria-expanded="false">
                            <EditBtn position={''} type='delete' onClick={() => null} />
                        </div>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton"
                            style={{ fontSize: '13px', cursor: 'pointer', padding: '0px', backgroundColor: '' }}>
                            <div className="dropdown-item" style={{ color: 'red' }} onClick={onDeleteLocationImage}>
                                {setLT.delete}
                            </div>
                        </div>
                    </div>
                    <Button variant={imageArray[0] ? "success" : "light"} style={{minWidth:'100px'}} onClick={imageArray[0] ? onSaveLocationPicture : null}>{action ? loader13 : setLT.save}</Button>
                    <EditBtn position={''} type={mainUser.locationIndex ? 'edit' : 'add'} file onClick={() => null} onChange={locationPictureHandler} />
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
        rtl: state.rtl,
        lang: state.lang,
        geo: state.geo,
        page: state.page,
        setLT: state.setLT,
        fullAccess: state.fullAccess,
    };
};

export default connect(mapStateToProps)(ModalLocationImage);
