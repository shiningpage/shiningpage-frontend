import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { setSubUserInfo, setUserInfo } from '../../dataStore/actions';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { getUserInfo } from '../../helper';

const destBProfile = "../pix.shiningpage.com/whoraly/profile/big";
const destSProfile = "../pix.shiningpage.com/whoraly/profile/small";
// const destBProfile = "../pix";
// const destSProfile = "../pix";

const ModalZoomProfileImage = (props) => {
    const {dispatch} = props
    const {mainUser, setLT, rtl, lang} = props.mapStateToProps

    const [w, setW] = useState(document.body.clientWidth);
    const [sz] = useState(150);
    const [szx] = useState(1000);
    const [profileImageArray, setProfileImageArray] = useState([]);
    const [profileFileSArr, setProfileFileSArr] = useState([]);
    const [profileFileBArr, setProfileFileBArr] = useState([]);
    const [profileformatErr, setProfileFormatErr] = useState('');
    const [action, setAction] = useState(false);

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (props.toggleZoomProfileImage) {
            setProfileImageArray([]);
        }
    }, [props.toggleZoomProfileImage]);

    const profilePictureHandler = (e) => {
        if (e.target.files[0]) {
            props.pixHandler(e, szx).then(res => {
                if (res) {
                    setProfileImageArray([res.base64]);
                    const selectedFileB = res.file.size > res.fileResized.size ? res.fileResized : res.file;
                    setProfileFileBArr(prev => [...prev, selectedFileB]);
                    props.pixResizer(selectedFileB, sz).then(res => {
                        if (res) {
                            const selectedFileS = res.file.size > res.fileResized.size ? res.fileResized : res.file;
                            setProfileFileSArr(prev => [...prev, selectedFileS]);
                            setProfileFormatErr('');
                        }
                    });
                } else {
                    setProfileFormatErr(props.setLT.formatErr);
                    setProfileImageArray([]);
                }
            });
        }
    };

    const onSaveProfilePicture = async () => {
        setAction(true);
        const { mainUser, serverURL } = props;
        const dateN = new Date().getTime().toString();

        const data = {
            userId: mainUser._id,
            profileIndex: dateN
        };

        try {
            await axios.post(`${serverURL}/userPanel/saveProfileIndex`, data);
            await profileDeleteAction(mainUser);
            await profileSaveNewAction(mainUser, dateN);
            setTimeout(async () => {
                await getUserInfo(mainUser._id, dispatch);
                setProfileImageArray([]);
                setProfileFileBArr([]);
                setProfileFileSArr([]);
                setAction(false);
                props.onToggle();
            }, 1000);
        } catch (error) {
            console.error(error);
        }
    };

    const profileDeleteAction = async (mainUser) => {
        const fileName = `${mainUser._id}-${mainUser.profileIndex}.jpeg`;
        await props.pixDelete({ dest: `${destBProfile}/${fileName}` });
        await props.pixDelete({ dest: `${destSProfile}/${fileName}` });
    };

    const profileSaveNewAction = async (mainUser, dateN) => {
        props.pixSave(profileFileBArr[0], `${szx}|${mainUser._id}-${dateN}|${destBProfile.replaceAll("/", "@")}`);
        props.pixSave(profileFileSArr[0], `${sz}|${mainUser._id}-${dateN}|${destSProfile.replaceAll("/", "@")}`);
    };

    const onDeleteProfileImage = async () => {
        setAction(true);
        const { mainUser, serverURL } = props;
        const data = {
            userId: mainUser._id,
            profileIndex: ''
        };

        try {
            await axios.post(`${serverURL}/userPanel/saveProfileIndex`, data);
            const fileName = `${mainUser._id}-${mainUser.profileIndex}.jpeg`;
            await props.pixDelete({ dest: `${destBProfile}/${fileName}` });
            await props.pixDelete({ dest: `${destSProfile}/${fileName}` });
            setTimeout(async () => {
                await getUserInfo(mainUser._id, dispatch);
                setProfileImageArray([]);
                setAction(false);
                props.onToggle();
            }, 1000);
        } catch (error) {
            console.error(error);
        }
    };

    const loader13 = (
        <span
            className='loader-13'
            style={{ fontSize: '10px', margin: props.rtl ? '20px 10px -20px' : '0px 10px', color: '', transform: props.rtl ? 'rotate(180deg)' : '' }}
        ></span>
    );

    return (
        <Modal show={props.toggleZoomProfileImage} onHide={props.onToggle}>
            <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                <Modal.Title>{props.setLT.profilePicture}</Modal.Title>
                <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={props.onToggle} />
            </Modal.Header>
            <Modal.Body style={{ fontSize: '13px', borderRadius: '10px' }}>
                <div className='center'>
                    <img
                        className=''
                        style={{ objectFit: 'contain', width: '280px', height: '280px', borderRadius: props.subUserInfo.businessType > 0 ? '3px' : '100%', border: '1px solid #E1E1E1' }}
                        src={profileImageArray[0]
                            ? profileImageArray[0]
                            : props.exist(props.subUserInfo.profileIndex)
                                    ? `https://www.pix.shiningpage.com/whoraly/profile/big/${props.subUserInfo._id}-${props.subUserInfo.profileIndex}.jpeg`
                                    : props.subGenderX
                        }
                        alt="profile photo"
                    />
                </div>
            </Modal.Body>
            {props.me && (
                <Modal.Footer>
                    <div className='center justify-content-between' style={{ width: '100%' }}>
                        <div className={props.rtl ? 'dropdown' : 'dropleft'} style={{ padding: '0px' }}>
                            <div id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="" aria-expanded="false">
                                <props.EditBtn position={''} type='delete' onClick={() => null} />
                            </div>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton"
                                style={{ fontSize: '13px', cursor: 'pointer', padding: '0px', backgroundColor: '' }}>
                                <div className="dropdown-item" style={{ color: 'red' }} onClick={onDeleteProfileImage}>
                                    {props.setLT.delete}
                                </div>
                            </div>
                        </div>
                        <Button variant={profileImageArray[0] ? "success" : "light"} style={{minWidth:'100px'}} onClick={profileImageArray[0] ? onSaveProfilePicture : null}>{action ? loader13 : props.setLT.save}</Button>
                        <props.EditBtn position={''} file onClick={() => null} onChange={profilePictureHandler} />
                    </div>
                    <span className='invalid-feedback' style={{ textAlign: 'center', display: profileformatErr ? 'block' : 'none' }}>
                        {profileformatErr}
                    </span>
                </Modal.Footer>
            )}
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

export default connect(mapStateToProps)(ModalZoomProfileImage);
