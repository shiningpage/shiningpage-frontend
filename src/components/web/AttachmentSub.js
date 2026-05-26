import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditBtn from '../EditBtn';
import { Container, Modal, Button } from 'react-bootstrap';
import { setSubUserInfo, setUserInfo } from '../../dataStore/actions';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { GrAttachment } from 'react-icons/gr';
import { TbTrashXFilled } from "react-icons/tb";
import fileSave from '../../modules/fileSave';
import pixDelete from '../../modules/pixDelete';
import pdfIco from '../../assets/images/file/pdfIco.png';
import wordIco from '../../assets/images/file/wordIco.png';
import excelIco from '../../assets/images/file/excelIco.png';
import pptIco from '../../assets/images/file/pptIco.png';
import imageIco from '../../assets/images/file/imageIco.png';
import audioIco from '../../assets/images/file/audioIco.png';
import videoIco from '../../assets/images/file/videoIco.png';
import attachIco from '../../assets/images/file/attachIco.png';
import RubyCollector from '../RubyCollector';
import { setId, formatFileSize, totalFileSize, attachmentLimitRemain } from '../../helper';
import { s, serverURL, lightColors } from '../../srcSet';

const path = require('path')
const destX = "../pix.shiningpage.com/whoraly/attachment"

const pdfType = ['pdf'];
const wordType = ['doc', 'docx', 'docm', 'dot', 'dotm', 'dotx'];
const excelType = ['csv', 'xla', 'xlam', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx', 'xml'];
const pptType = ['ppt', 'pptx', 'pptm', 'potm', 'ppam', 'pps', 'ppsm', 'ppsx'];
const imageType = ['tif', 'tiff', 'bmp', 'jpg', 'jpeg', 'gif', 'png', 'eps', 'raw', 'cr2', 'nef', 'orf', 'sr2', 'psd', 'xcf', 'al', 'cdr'];
const audioType = ['mp3', 'wav', 'ogg', 'aac'];
const videoType = ['mp4', 'mkv', 'flv', 'avi'];

const AttachmentSub = (props) => {
    const [w, setW] = useState(document.body.clientWidth);
    const [attachmentList, setAttachmentList] = useState([]);
    const [toggleAttachment, setToggleAttachment] = useState(false);
    const [action, setAction] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [extname, setExtname] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [fileType, setFileType] = useState('');
    const [fileSizeLimitErr, setFileSizeLimitErr] = useState(false);

    const { me, fc, titleStyle, mapStateToProps } = props;
    const { mainUser, subUserInfo, rtl, setLT } = mapStateToProps;

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if(props.index) {
            mapAttachment(subUserInfo.attachmentItems);
        }
    }, [props.index]);

    useEffect(() => {
        setFile(null)
        setFileName('')
        setExtname('')
        setFileType('')
        setFileSizeLimitErr(false)
    }, [toggleAttachment]);

    useEffect(() => {
        subUserInfo.attachmentsTotalSize = totalFileSize(subUserInfo.attachmentItems)
    }, [mainUser]);

    const setType = (ext) => {
        if (pdfType.includes(ext)) return pdfIco;
        if (wordType.includes(ext)) return wordIco;
        if (excelType.includes(ext)) return excelIco;
        if (pptType.includes(ext)) return pptIco;
        if (imageType.includes(ext)) return imageIco;
        if (audioType.includes(ext)) return audioIco;
        if (videoType.includes(ext)) return videoIco;
        return attachIco;
    };

    const mapAttachment = (data) => {
        if (!data) return;
        const attachments = data.map((item, i) => {
            const fileType = setType(item.extname);
            const deleteBtn = (
                <div className={rtl ? 'dropdown' : 'dropleft'} style={{padding:'0px'}}>
                    <div className='center bin2' id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="" aria-expanded="false"
                        style={{width:'40px', height:'40px', alignItems:'center', borderRadius:'100px'}}>
                        <TbTrashXFilled style={{fontSize:'18px'}}/>
                    </div>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton"
                        style={{fontSize:'13px', cursor:'pointer', padding:'0px', backgroundColor:''}}>
                        <div className="underline" style={{color:'red', padding:'5px 10px'}} onClick={() => onDelete(data, i)}>
                            {setLT.delete}
                        </div>
                    </div>
                </div>
            )
            return (
                <div key={i} className="d-flex"
                    style={{ maxWidth: '250px', margin: '20px 5px', borderRadius: '10px', backgroundColor: '#ffffff99' }}
                >
                    <div className="d-flex"
                        style={{ width: '100%', padding: '2px', borderRadius: '10px', backgroundColor: '#ffffff99', color: '#000000' }}
                    >
                        <div className="d-flex underline" style={{ alignItems: 'center' }} onClick={() => download(item)}>
                            <img
                                style={{ objectFit: 'cover', width: '40px', height: '40px', borderRadius: '10px' }}
                                src={fileType}
                                alt={item.title}
                            />
                            <div style={{margin: '0px 10px'}}>
                                <div style={{ fontSize: '14px', fontWeight: w < s ? 'bold' : 450 }}>{item.fileName}</div>
                                <div style={{fontSize:'13px'}}>{formatFileSize(item.fileSize)}</div>
                            </div>
                            
                        </div>
                        {me && (item.deleting ? loader02 : deleteBtn)}
                    </div>
                </div>
            );
        });
        setAttachmentList(attachments);
    };

    const fileHandler = (e) => {
        const file = e.target.files[0];
        if(file) {
            const extname = path.extname(file.name).replace('.', '').toLowerCase()
            const fileType = setType(extname)
            setFile(file)
            setFileName(file.name)
            setFileSize(file.size)
            setExtname(extname)
            setFileType(fileType)
        }
    }

    const onSave = async () => {
        const currentAttachments = mainUser.attachmentItems
        const newAttachment = {
            id: await setId(currentAttachments),
            fileName,
            extname,
            fileSize,
        }

        if(subUserInfo.attachmentsTotalSize + fileSize > subUserInfo.limits.attachment * 1024) {
            setFileSizeLimitErr(true)
        } else {
            try {
                setAction(true);
    
                const info = {
                    userId: mainUser._id,
                    attachmentItems: [...[newAttachment], ...currentAttachments]
                }
    
                await axios.post(`${serverURL}/userPanel/update`, info).then(async res => {
                    delete res.data.password
                    fileSave(file, `${mainUser.username + "-" + fileName}|${destX.replaceAll("/", "@")}`, fileName, mainUser.username, destX)
                    res.data.attachmentsTotalSize = totalFileSize(res.data.attachmentItems)
                    // console.log(55, res.data)
                    props.dispatch(setUserInfo(res.data))
                    props.dispatch(setSubUserInfo(res.data))
                    setAction(false);
                    mapAttachment(res.data.attachmentItems);
                    toggleModal();
    
                })
    
            } catch (error) {
                console.error(error);
            }
        }
    };

    const onDelete = async (data, i) => {
        // console.log('i: ', i)
        // console.log('data: ', data)
        var itemX = data[i]
        // console.log('itemX: ', itemX)
        itemX.deleting = !itemX.deleting
        // console.log('itemX2: ', itemX)
        mapAttachment(data, true)
        var idX = itemX.id
        var item = data.splice(i, 1)

        await updateAttachment(data)
        pixDelete({dest: destX + "/" + mainUser.username + "-" + itemX.fileName})

        mapAttachment(data, false)
    }

    const updateAttachment = async (attachment) => {
        for(var i=0; i<attachment.length; i++) {
            attachment[i].deleting = undefined
        }

        var info = {
            userId: mainUser._id,
            attachmentItems: attachment
        }
        await axios.post(`${serverURL}/userPanel/update`, info).then(async res => {
            delete res.data.password
            res.data.attachmentsTotalSize = totalFileSize(res.data.attachmentItems)

            props.dispatch(setUserInfo(res.data))
            props.dispatch(setSubUserInfo(res.data))
        })
    }

    const download = (item) => {
        window.open(`https://www.pix.shiningpage.com/whoraly/attachment/${subUserInfo.username}-${item.fileName}`);
    };

    const toggleModal = () => {
        setToggleAttachment(!toggleAttachment);
    };

    const attachmentExist = subUserInfo.attachmentItems && subUserInfo.attachmentItems.length !== 0;
    const loader02 = <div className='loader-02' style={{minWidth:'20px', margin:'10px', color:'red', fontSize:'20px'}}></div>
    const loaderAlert = <div className='loader-07' style={{margin: '', color:'#00CCFF', width:'100px', height:'100px', position:'absolute'}}></div>
    const loader13 = (
        <span
            className='loader-13'
            style={{ fontSize: '10px', margin: rtl ? '20px 10px -20px' : '0px 10px', color: '', transform: rtl ? 'rotate(180deg)' : '' }}
        ></span>
    );

    const newAttachmentBtn = (
        <div className='center' style={{width:'100%', alignItems:'center', margin:'15px 0px'}}>
            <div className='d-flex btn-file btnShadow waves-effect waves-light btn-large'
                style={{width:'', height:'40px', padding:'10px', textDecoration:'none', color:'#000000',
                fontSize:'16px', flexDirection:'', alignItems:'center', border:'2px solid #00CCFF',
                backgroundColor: '#ffffff', borderRadius:'5px'}}>
                {loaderAlert}
                <GrAttachment style={{fontSize:'20px'}}/>&nbsp;&nbsp;
                <span style={{textDecoration:'none', fontSize:''}}>{setLT.new} + </span>
                <input type="file" name="file" onChange={fileHandler}/>
            </div>
        </div>
    )

    const fileSizeLimitAlert = (
        <div className="alert alert-danger animated fadeInDown" role="alert" style={{width:'100%', margin: '10px 0px 0px', textAlign:rtl ? 'right' : 'left', fontSize:'15px', }}>
            {setLT.fileSizeLimitExceeded}
        </div>
    )

    const setNewAttachment = (
        <div>
            <div className='d-flex justify-content-between' style={{width:'100%', alignItems:'center'}}>
                <div className='d-flex' style={{alignItems:'center'}}>
                    <img
                        className=''
                        style={{objectFit: 'contain', width:"40px", height:"40px", margin:'0px 10px', padding:'0px'}}
                        src={ fileType }
                        alt={ fileName }
                    />
                    <div>
                        <div>{fileName}</div>
                        <div style={{fontSize:'13px'}}>{formatFileSize(fileSize)}</div>
                    </div>
                </div>
                <Button className='btnShadow' variant="" onClick = {onSave}
                    style={{backgroundColor:"#00CCFF", color:'#ffffff', width:'100px', height:'30px', fontSize:'12px', margin:'0px 10px' }}>
                    <span style={{fontSize:'14px', lineHeight:'10px'}}>{action ? loader13 : setLT.attach}</span>
                </Button>
            </div>
            {fileSizeLimitErr && fileSizeLimitAlert}
        </div>
    )

    const modalAttachment = (
        <Modal show={toggleAttachment} onHide={toggleModal}>
            <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                <Modal.Title>
                    <span>Attachments</span>&nbsp;
                    <span style={{fontSize:'12px'}}>Limit {attachmentLimitRemain(subUserInfo.attachmentsTotalSize, (subUserInfo.limits || {attachment:100}).attachment)}</span>
                </Modal.Title>
                <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={toggleModal} />
            </Modal.Header>
            <Modal.Body style={{ fontSize: '14px', borderRadius: '10px' }}>
                <div style={{margin:'15px 0px'}}>
                    {!fileName ? newAttachmentBtn : setNewAttachment}
                </div>
            </Modal.Body>
        </Modal>
    )

    return (
        <div id="attachmentsSub" className={`C${fc}`}
            style={{ width: '100%', color: lightColors.includes(fc) ? '#000000' : '#ffffff', position: 'relative', display: me || attachmentExist ? '' : 'none' }}
        >
            {me && <EditBtn rtl={rtl} type="add" onClick={toggleModal} />}
            <div style={{ width: '100%', padding: '70px 0px', backgroundColor: '#ffffff00' }}>
                <Container>
                    <div className={w < s ? 'center' : 'd-flex'} style={{...titleStyle, flexDirection: w<400 ? 'column' : ''}}>
                        {setLT.attachments}
                    </div>
                    {/* me && <div style={{ marginTop: '-25px' }}>{setLT.attachmentT1}</div> */}
                    <div className="d-flex" style={{ margin: '10px 0px 0px', borderRadius: '10px', flexWrap: 'wrap' }}>
                        {attachmentExist
                            ? attachmentList
                            : <div style={{ fontSize: '15px', textAlign: 'center' }}>{setLT.attachmentNA}</div>
                        }
                    </div>
                </Container>
                {/* <RubyCollector id='adsH3' bottom={30} left={rtl ? 30 : ''} right={rtl ? '' : 30}/> */}
            </div>
            {modalAttachment}
        </div>
    );
};

export default AttachmentSub;
