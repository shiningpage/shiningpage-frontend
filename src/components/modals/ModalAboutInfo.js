import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { setSubUserInfo, setUserInfo } from '../../dataStore/actions';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { serverURL, s } from '../../srcSet';
import { cleanEditorHtml } from '../../helper';
import TextEditor from '../../components/TextEditor';

const ModalAboutInfo = (props) => {
    const {mainUser, setLT, rtl, fullAccess} = props.mapStateToProps
    const [w, setW] = useState(document.body.clientWidth);
    const [action, setAction] = useState(false);
    const [biography, setAbout] = useState(mainUser.biography);
    const [status, setStatus] = useState();

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (props.toggleAboutInfo) {
            setAbout(mainUser.biography);
        }
    }, [props.toggleAboutInfo]);

    const onSave = async () => {
        try {
            setAction(true);
            const cleanBiography = cleanEditorHtml(biography);
            const user = {
                userId: mainUser._id,
                biography: cleanBiography
            }
            await axios.post(`${serverURL}/userPanel/update`, user)
            .then(async (res) => {
                delete res.data.password
                props.dispatch(setUserInfo(res.data))
                props.dispatch(setSubUserInfo(res.data))
                setAction(false);
                props.onToggle();
            })
        } catch (error) {
            console.error(error);
        }
    };

    const loader13 = (
        <span
            className='loader-13'
            style={{ fontSize: '10px', margin:'0px 10px', color: '' }}
        ></span>
    );

    const biographyConst = (
        <div style={{marginBottom:'10px'}}>
            <TextEditor
                value={biography}
                onChange={(html) =>
                    setAbout(html.trim() === '' ? null : html)
                }
                maxChars={fullAccess ? 10000 : 2000}
                placeholder="Write your about text ..."
            />
        </div>
    )

    const saveBtn = (
        <div className='d-flex' style={{justifyContent:'flex-end'}}>
            <Button variant="success" style={{minWidth:'100px'}} onClick={onSave}>{action ? loader13 : setLT.save}</Button>
        </div>

    )

    return (
        <Modal size="lg" show={props.toggleAboutInfo} onHide={props.onToggle}>
            <Modal.Header className="d-flex justify-content-between" style={{ padding:'10px' }}>
                <Modal.Title>About</Modal.Title>
                <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={props.onToggle} />
            </Modal.Header>
            <Modal.Body style={{ fontSize:'13px', padding:w<s ? '5px' : '', borderRadius:'10px' }}>
                {biographyConst}
                {saveBtn}
            </Modal.Body>
        </Modal>
    );
};

export default ModalAboutInfo;
