import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { setSubUserInfo, setUserInfo } from '../../dataStore/actions';
import { AiOutlineCloseCircle } from "react-icons/ai";
import aboutImg from '../../assets/images/other/aboutUs.jpeg';

const destBAbout = "../pix.shiningpage.com/whoraly/about/big"
const destSAbout = "../pix.shiningpage.com/whoraly/about/small"

const ModalAboutImage = (props) => {
    const [w, setW] = useState(document.body.clientWidth);
    const [sz] = useState(150);
    const [szx] = useState(1000);
    const [aboutImageArray, setAboutImageArray] = useState([]);
    const [aboutFileSArr, setAboutFileSArr] = useState([]);
    const [aboutFileBArr, setAboutFileBArr] = useState([]);
    const [aboutformatErr, setAboutFormatErr] = useState('');
    const [action, setAction] = useState(false);

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (props.toggleAboutImage) {
            setAboutImageArray([]);
        }
    }, [props.toggleAboutImage]);

    const aboutPictureHandler = (e) => {
        if (e.target.files[0]) {
            props.pixHandler(e, szx).then(res => {
                if (res) {
                    setAboutImageArray([res.base64]);
                    const selectedFileB = res.file.size > res.fileResized.size ? res.fileResized : res.file;
                    setAboutFileBArr(prev => [...prev, selectedFileB]);
                    props.pixResizer(selectedFileB, sz).then(res => {
                        if (res) {
                            const selectedFileS = res.file.size > res.fileResized.size ? res.fileResized : res.file;
                            setAboutFileSArr(prev => [...prev, selectedFileS]);
                            setAboutFormatErr('');
                        }
                    });
                } else {
                    setAboutFormatErr(props.setLT.formatErr);
                    setAboutImageArray([]);
                }
            });
        }
    };

    const onSaveAboutPicture = async () => {
        setAction(true);
        const { mainUser, serverURL } = props;
        const dateN = new Date().getTime().toString();

        const data = {
            userId: mainUser._id,
            aboutIndex: dateN
        };

        try {
            await axios.post(`${serverURL}/userPanel/saveAboutIndex`, data);
            await aboutDeleteAction(mainUser);
            await aboutSaveNewAction(mainUser, dateN);
            setTimeout(async () => {
                await getUserInfo(mainUser._id);
                setAboutImageArray([]);
                setAboutFileBArr([]);
                setAboutFileSArr([]);
                setAction(false);
                props.onToggle();
            }, 1000);
        } catch (error) {
            console.error(error);
        }
    };

    const aboutDeleteAction = async (mainUser) => {
        const fileName = `${mainUser._id}-${mainUser.aboutIndex}.jpeg`;
        await props.pixDelete({ dest: `${destBAbout}/${fileName}` });
        await props.pixDelete({ dest: `${destSAbout}/${fileName}` });
    };

    const aboutSaveNewAction = async (mainUser, dateN) => {
        props.pixSave(aboutFileBArr[0], `${szx}|${mainUser._id}-${dateN}|${destBAbout.replaceAll("/", "@")}`);
        props.pixSave(aboutFileSArr[0], `${sz}|${mainUser._id}-${dateN}|${destSAbout.replaceAll("/", "@")}`);
    };

    const getUserInfo = async (userId) => {
        const { serverURL } = props;
        try {
            const res = await axios.post(`${serverURL}/user/getUserInfo`, { _id: userId });
            if (res.data) {
                delete res.data.password;
                props.dispatch(setUserInfo(res.data));
                props.dispatch(setSubUserInfo(res.data));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onDeleteAboutImage = async () => {
        setAction(true);
        const { mainUser, serverURL } = props;
        const data = {
            userId: mainUser._id,
            aboutIndex: ''
        };

        try {
            await axios.post(`${serverURL}/userPanel/saveAboutIndex`, data);
            const fileName = `${mainUser._id}-${mainUser.aboutIndex}.jpeg`;
            await props.pixDelete({ dest: `${destBAbout}/${fileName}` });
            await props.pixDelete({ dest: `${destSAbout}/${fileName}` });
            setTimeout(async () => {
                await getUserInfo(mainUser._id);
                setAboutImageArray([]);
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
        <Modal show={props.toggleAboutImage} onHide={props.onToggle}>
            <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                <Modal.Title>{props.setLT.aboutPhoto}</Modal.Title>
                <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={props.onToggle} />
            </Modal.Header>
            <Modal.Body style={{ fontSize: '13px', borderRadius: '10px' }}>
                <div className='center'>
                    <img
                        className=''
                        style={{ objectFit: 'contain', width: '280px', height: '280px', borderRadius:'3px', border: '1px solid #E1E1E1' }}
                        src={aboutImageArray[0]
                            ? aboutImageArray[0]
                            : props.exist(props.subUserInfo.aboutIndex)
                                    ? `https://www.pix.shiningpage.com/whoraly/about/big/${props.subUserInfo._id}-${props.subUserInfo.aboutIndex}.jpeg`
                                    : aboutImg
                        }
                        alt="about photo"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='center justify-content-between' style={{ width: '100%' }}>
                    <div className={props.rtl ? 'dropdown' : 'dropleft'} style={{ padding: '0px' }}>
                        <div id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="" aria-expanded="false">
                            <props.EditBtn position={''} type='delete' onClick={() => null} />
                        </div>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton"
                            style={{ fontSize: '13px', cursor: 'pointer', padding: '0px', backgroundColor: '' }}>
                            <div className="dropdown-item" style={{ color: 'red' }} onClick={onDeleteAboutImage}>
                                {props.setLT.delete}
                            </div>
                        </div>
                    </div>
                    <Button variant={aboutImageArray[0] ? "success" : "light"} style={{minWidth:'100px'}} onClick={aboutImageArray[0] ? onSaveAboutPicture : null}>{action ? loader13 : props.setLT.save}</Button>
                    <props.EditBtn position={''} file onClick={() => null} onChange={aboutPictureHandler} />
                </div>
                <span className='invalid-feedback' style={{ textAlign: 'center', display: aboutformatErr ? 'block' : 'none' }}>
                    {aboutformatErr}
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

export default connect(mapStateToProps)(ModalAboutImage);
