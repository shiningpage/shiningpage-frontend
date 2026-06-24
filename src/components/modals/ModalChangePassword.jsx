import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { setSubUserInfo, setUserInfo } from '../../dataStore/actions';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { serverURL, s } from '../../srcSet';

const ModalChangePassword = (props) => {
    const {mainUser, setLT, rtl, lang} = props.mapStateToProps
    const [w, setW] = useState(document.body.clientWidth);
    const [action, setAction] = useState(false);
    const [currentPassword, setCurrentPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [currentPasswordErr, setCurrentPasswordErr] = useState(false);
    const [newPasswordErr, setNewPasswordErr] = useState(false);
    const [incorrectPasswordErr, setIncorrectPasswordErr] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null);

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        setCurrentPassword(null)
        setNewPassword(null)
        setCurrentPasswordErr(false)
        setNewPasswordErr(false)
        setIncorrectPasswordErr(null)
        setPasswordSuccess(null)
    }, [props.toggleChangePassword]);

    const changeHandler = (event) => {
        const { name, value } = event.target;
        const stateUpdaters = {
            currentPassword: setCurrentPassword,
            newPassword: setNewPassword,
        };

        if (stateUpdaters[name]) {
            stateUpdaters[name](value.trim() === "" ? null : value);
        }
    };

    const checkNull = () => {
        var infoErr = {}
        if(!currentPassword) infoErr.currentPasswordErr = true
        if(!newPassword) infoErr.newPasswordErr = true
        return infoErr
    }

    const onSave = async () => {
        const infoErr = checkNull()
        if(Object.keys(infoErr).length>0) {
            setCurrentPasswordErr(infoErr.currentPasswordErr)
            setNewPasswordErr(infoErr.newPasswordErr)
            setIncorrectPasswordErr(null)
        } else {
            try {
                setAction(true);
                setCurrentPasswordErr(false)
                setNewPasswordErr(false)

                const user = {
                    userId: mainUser._id,
                    currentPassword,
                    newPassword
                }

                await axios.post(`${serverURL}/login/updatePassword`, user)
                .then(async (res) => {
                    const result = res.data
                    if(result==='Password is incorrect') {
                        setIncorrectPasswordErr(setLT.incorrectPassword)
                        setAction(false);
                    } else {
                        setIncorrectPasswordErr(null)
                        setPasswordSuccess(setLT.passwordSuccess)
                        setAction(false);
                    }
                })
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

    const profileTitleStyle = {fontWeight:450, textAlign: rtl ? 'right' : 'left'}

    const currentPasswordInput = (
        <div style={{marginBottom:'20px'}}>
            <div style={profileTitleStyle}>{setLT.currentPassword}*</div>
            <input
                className="form-control" autoComplete="off"
                style={{fontSize:'14px', width:'100%', textAlign:'center', borderColor: currentPasswordErr ? 'red' : ''}}
                name='currentPassword'
                onChange={changeHandler}
                value={currentPassword}
            />
            <span className='invalid-feedback' style={{ margin: '5px 0px 10px', display: incorrectPasswordErr ? 'block' : 'none', textAlign: rtl ? 'right' : 'left'}}>
                {incorrectPasswordErr}
            </span>
        </div>
    )

    const newPasswordInput = (
        <div style={{marginBottom:'20px'}}>
            <div style={profileTitleStyle}>{setLT.newPassword}*</div>
            <input
                className="form-control" autoComplete="off"
                style={{fontSize:'14px', width:'100%', textAlign:'center', borderColor: newPasswordErr ? 'red' : ''}}
                name='newPassword'
                onChange={changeHandler}
                value={newPassword}
            />
        </div>
    )

    const successSavePassword = (
        <div className="alert alert-success animated fadeInDown" role="alert" style={{width:'100%', marginBottom: '10px', textAlign:rtl ? 'right' : 'left', fontSize:'15px', }}>
            {setLT.passwordSuccess}
        </div>
    )

    return (
        <Modal show={props.toggleChangePassword} onHide={props.onToggle}>
            <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                <Modal.Title>{setLT.changePassword}</Modal.Title>
                <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={props.onToggle} />
            </Modal.Header>
            <Modal.Body style={{ fontSize: '13px', borderRadius: '10px' }}>
                <div style={{padding:'10px'}}>
                    {currentPasswordInput}
                    {newPasswordInput}
                </div>
            </Modal.Body>
            <Modal.Footer>
                {passwordSuccess 
                    ? successSavePassword
                    :
                    <div className='center' style={{ width: '100%', transition:'.3s'}}>
                        <Button variant="success" style={{minWidth:'100px'}} onClick={onSave}>{action ? loader13 : setLT.save}</Button>
                    </div>
                }
            </Modal.Footer>
        </Modal>
    );
};

export default ModalChangePassword;
