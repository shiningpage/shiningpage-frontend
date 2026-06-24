import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { setSubUserInfo, setUserInfo } from '../../dataStore/actions';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { serverURL, s } from '../../srcSet';
import { cleanEditorHtml } from '../../helper';
import TextEditor from '../TextEditor';

const ModalActivitySummary = (props) => {
    const {mainUser, setLT, rtl, fullAccess} = props.mapStateToProps
    const [w, setW] = useState(document.body.clientWidth);
    const [action, setAction] = useState(false);
    const [jobSummary, setJobSummary] = useState(mainUser.jobSummary);
    const [jobSummaryVxl, setJobSummaryVxl] = useState(mainUser.jobSummary ? mainUser.jobSummary.length : 0);
    const [status, setStatus] = useState();
    const jobSummaryTotal = 100

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (props.toggleActivitySummary) {
            setJobSummary(mainUser.jobSummary);
        }
    }, [props.toggleActivitySummary]);

    const onSave = async () => {
        try {
            setAction(true);
            const user = {
                userId: mainUser._id,
                jobSummary,
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

    const jobSummaryHandler = e => {
        var tx = e.target.value
        var vx = tx.trim()==="" ?  null : tx
        var vxl = vx ? vx.length : 0
        setJobSummary(vx ? vx.substr(0, jobSummaryTotal) : '')
        setJobSummaryVxl(vxl > jobSummaryTotal ? jobSummaryTotal : vxl)
        setStatus(0)
    };

    const loader13 = (
        <span
            className='loader-13'
            style={{ fontSize: '10px', margin: rtl ? '20px 10px -20px' : '0px 10px', color: '', transform: rtl ? 'rotate(180deg)' : '' }}
        ></span>
    );

    const profileTitleStyle = {fontWeight:450, textAlign: rtl ? 'right' : 'left'}

    const jobSummaryConst = (
        <div style={{marginBottom:'50px'}}>
            <div style={profileTitleStyle}>{setLT.activitySummary}</div>
            <textarea
                className="form-control"
                style={{fontSize:'14px', width:'100%', borderRadius:'5px', padding:'5px'}}
                name='jobSummary'
                value={jobSummary}
                rows="2"
                onChange={jobSummaryHandler}
            />
            <div style={{margin:'5px 0px -30px', textAlign:'right'}}>{jobSummaryVxl}/{jobSummaryTotal}</div>
        </div>
    )

    const saveBtn = (
        <div className='d-flex' style={{justifyContent:'flex-end'}}>
            <Button variant="success" style={{minWidth:'100px'}} onClick={onSave}>{action ? loader13 : setLT.save}</Button>
        </div>

    )

    return (
        <Modal size="lg" show={props.toggleActivitySummary} onHide={props.onToggle}>
            <Modal.Header className="d-flex justify-content-between" style={{ padding:'10px' }}>
                <Modal.Title>Activity Summary</Modal.Title>
                <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={props.onToggle} />
            </Modal.Header>
            <Modal.Body style={{ fontSize:'13px', padding:w<s ? '5px' : '', borderRadius:'10px' }}>
                {jobSummaryConst}
                {saveBtn}
            </Modal.Body>
        </Modal>
    );
};

export default ModalActivitySummary;
