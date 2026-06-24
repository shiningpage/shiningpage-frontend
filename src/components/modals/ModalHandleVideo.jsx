import React, { Component } from "react";
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { setCategoryX } from '../../dataStore/actions';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaLinkedin, FaYoutube } from 'react-icons/fa';
import date from 'date-and-time';
import toFarsi from '../../modules/toFarsi';
import CategorySelector from '../CategorySelector';
import { serverURL, s } from '../../srcSet';
import aparatImage from "../../assets/images/other/aparat.png";

class ModalHandleVideo extends Component {

    state = {
        w: window.innerWidth,
        commentTotal: 1000,
    }

    componentDidMount = async () => {}

    componentDidUpdate(prevProps) {
        if (prevProps.toggleVideo !== this.props.toggleVideo) {
            const { videoInfo, toggleVideo } = this.props;
            const { vType, vCode, title, comment, } = videoInfo;
            const isNew = toggleVideo.type === 'new';
            const videoCommentLength = videoInfo.videoComment ? videoInfo.videoComment.length : 0;

            this.setState({
                videoId: isNew ? '' : videoInfo._id,
                commentVxl: isNew ? 0 : videoCommentLength,
                videoType: isNew ? undefined : vType,
                videoCode: isNew ? '' : vCode,
                title: isNew ? '' : title,
                comment: isNew ? '' : comment,
                loader: false,
                titleErr: false,
                videoTypeErr: false,
                videoCodeErr: false,
            });

            if(toggleVideo.type==='new') this.props.dispatch(setCategoryX({}))

            // console.log('categoryX', this.props.categoryX)
            // console.log('toggleVideo.type', toggleVideo.type)
            if(toggleVideo.type==='edit') {
                this.setVideoValue(vType)
            }

        }
    }

    setVideoValue = (x) => {
        switch (x) {
            case 'Youtube': this.setState({videoType: 1}); break;
            case 'Aparat': this.setState({videoType: 2}); break;
            case 'Linkedin': this.setState({videoType: 3}); break;
            default: x = '';
        }
    }

    commentHandler = e => {
        const {lang} = this.props
        var tx = lang==='fa' ? toFarsi(e.target.value) : e.target.value
        var vx = tx.trim()==="" ?  null : tx
        var vxl = vx ? vx.length : 0
        this.setState({
            comment: vx ? vx.substr(0, this.state.commentTotal) : '',
            commentVxl: vxl > this.state.commentTotal ? this.state.commentTotal : vxl,
            status : 0
        });
    };

    changeHandler = event => {
        const name = event.target.name
        this.setState({ ...this.state, [event.target.name]: event.target.value });
        if(name==='title') this.setState({ titleErr: false });
        if(name==='videoCode') this.setState({ videoCodeErr: false });
    };

    onVideoType = (x) => {
        this.setState({
            videoType: x,
            videoTypeErr: false,
        })
    }

    setVideoType = (x) => {
        switch (x) {
            case 1: x = 'Youtube'; break;
            case 2: x = 'Aparat'; break;
            case 3: x = 'Linkedin'; break;
            default: x = '';
        }
        return x
    }

    checkNull = () => {
        const { title, videoType, videoCode } = this.state;
        console.log(videoType)
        var infoErr = {}
        if(title.trim()==='') infoErr.titleErr = true
        if(videoType===undefined) infoErr.videoTypeErr = true
        if(videoCode.trim()==='') infoErr.videoCodeErr = true
        return infoErr
    }

    onSave = async () => {
        var infoErr = this.checkNull()
        if(Object.keys(infoErr).length>0) {
            this.setState({
                titleErr: infoErr.titleErr,
                videoTypeErr: infoErr.videoTypeErr,
                videoCodeErr: infoErr.videoCodeErr,
            })
        } else {
            this.setState({loader:true})
            const { videoId, title, comment, videoType, videoCode } = this.state
            const videoTypeText = this.setVideoType(videoType)
            const { mainUserId, categoryX, onToggle, resetVideo } = this.props

            const data = {
                userId: mainUserId,
                title,
                comment,
                status: 1,
                vType: videoTypeText,
                vCode: videoCode,
                userCategoryId: categoryX.id ? categoryX.id : "",
                userSubCategoryId: categoryX.subId ? categoryX.subId : "",
            }

            const actionType = this.props.toggleVideo.type
            if(actionType==='edit') data.videoId = videoId
            // console.log(data)
            await axios.post(`${serverURL}/video/${actionType==='new' ? 'saveVideo' : 'editVideo'}`, data)
            resetVideo()
            onToggle(false)
        }
    }

    render() {
        const { w, videoCode, videoType, loader, title, comment, titleErr, commentErr, videoTypeErr, videoCodeErr,
            commentTotal, commentVxl } = this.state
        const {rtl, lang, setLT, toggleVideo, onToggle, videoN, subUserInfo, } = this.props;
        const inputStyle = {width: '100%', fontSize:'14px', height:'30px', borderRadius:'5px', textAlign:'center', direction:'ltr'}
        const titleStyle = {fontSize:'14px', fontWeight:'bold', margin:'15px 0px 0px', textAlign: rtl ? 'right' : 'left'}
        const loaderX = <div className='loader-13' style={{margin: rtl ? '35px 20px -25px' : '0px 20px 0px', color:'#ffffff', transform: rtl ? 'rotate(180deg)' : ''}}></div>

        const youtubeRadio = (
            <div className="radio" style={{margin:'0px 10px'}} onClick={() => this.onVideoType(1)}>
                <label className='center' style={{margin:'0px', alignItems:'center', cursor:'pointer', flexWrap:'wrap'}}>
                    <FaYoutube style={{fontSize:'30px', margin:'0px', color:'#c4302b'}}/>
                    <div className='d-flex' style={{alignItems:'center'}}>
                    <input type="radio" value="option2" checked={videoType===1 ? true : false} style={{margin:'0px 5px', cursor:'pointer'}}/>
                    </div>
                </label>
            </div>
        )

        const aparatRadio = (
            <div className="radio" style={{margin:'0px 10px'}} onClick={() => this.onVideoType(2)}>
                <label className='center' style={{margin:'0px', alignItems:'center', cursor:'pointer', flexWrap:'wrap'}}>
                    <img style={{width:'30px', height:'25px'}} src={aparatImage} alt="aparat"/>
                    <div className='d-flex' style={{alignItems:'center'}}>
                    <input type="radio" value="option3" checked={videoType===2 ? true : false} style={{margin:'0px 5px', cursor:'pointer'}}/>
                    </div>
                </label>
            </div>
        )

        const linkedinRadio = (
            <div className="radio" style={{margin:'0px 10px'}} onClick={() => this.onVideoType(3)}>
                <label className='center' style={{margin:'0px', alignItems:'center', cursor:'pointer', flexWrap:'wrap'}}>
                    <FaLinkedin className='' style={{fontSize:'25px', margin:'0px', color:'#0e76a8'}}/>
                    <div className='d-flex' style={{alignItems:'center'}}>
                    <input type="radio" value="option3" checked={videoType===3 ? true : false} style={{margin:'0px 5px', cursor:'pointer'}}/>
                    </div>
                </label>
            </div>
        )

        const videoL = <div style={{...titleStyle, marginTop:'0px'}}>{setLT.videoType}*</div>
        const videoTypeSection = (
            <div className='center' style={{marginBottom:'20px', alignItems:'center', border: videoTypeErr ? '1px solid red' : '', borderRadius:'5px'}}>
                {youtubeRadio}
                {aparatRadio}
                {linkedinRadio}
            </div>
        )

        const videoCodeInput = <input className='form-control' value={videoCode} style={{...inputStyle, border: videoCodeErr ? '1px solid red' : ''}} name="videoCode" onChange={this.changeHandler}/>

        const YouTubeCode = (
            <div style = {{fontSize:'14px', marginBottom:'10px'}}>
                <div className='d-flex' style={{alignItems:'center', margin:'0px 0px 5px', direction:'rtl'}}>
                    <FaYoutube style={{fontSize:'30px', margin:'0px', color:'#c4302b'}}/>&nbsp;&nbsp;
                    {videoCodeInput}
                </div>
                <div>E.g.: youtube.com/watch?v=<span style={{color:'green', fontWeight:450}}>mJmyiHdJ5OU</span></div>
                <div>Video Code = <span style={{color:'green', fontWeight:450}}>mJmyiHdJ5OU</span></div>
            </div>
        )

        const AparatCode = (
            <div style = {{fontSize:'14px', marginBottom:'10px'}}>
                <div className='d-flex' style={{alignItems:'center', margin:'0px 0px 5px', direction:'rtl'}}>
                    <img
                        style={{width:'30px', height:'25px'}}
                        src={aparatImage}
                        alt="aparat"
                    />&nbsp;&nbsp;
                    {videoCodeInput}
                </div>
                <div>E.g.: aparat.com/v/<span style={{color:'green', fontWeight:450}}>eQmwb</span></div>
                <div>Video Code = <span style={{color:'green', fontWeight:450}}>eQmwb</span></div>
            </div>
        )

        const LinkedinCode = (
            <div style = {{fontSize:'14px', marginBottom:'10px'}}>
                <div className='d-flex' style={{alignItems:'center', margin:'0px 0px 5px', direction:'rtl'}}>
                    <FaLinkedin className='' style={{fontSize:'25px', margin:'0px', color:'#0e76a8'}}/>&nbsp;&nbsp;
                    {videoCodeInput}
                </div>
                <div>E.g.: ugcPost:<span style={{color:'green', fontWeight:450}}>6864356786414075904</span></div>
                <div>Video Code = <span style={{color:'green', fontWeight:450}}>6864356786414075904</span></div>
            </div>
        )

        const videoSection = (
            <div style={{marginBottom:'30px'}}>
                <div>
                    {videoL}
                    {videoTypeSection}
                    <div style={{marginTop: videoType>0 ? '20px' : ''}}>
                        {videoType > 0 && <div style={{...titleStyle, marginTop:'0px'}}>{setLT.videoCode}*</div>}
                        {videoType===1 && YouTubeCode}
                        {videoType===2 && AparatCode}
                        {videoType===3 && LinkedinCode}
                    </div>
                </div>
                <span className='invalid-feedback' style={{fontSize:'12px', display: videoCodeErr ? 'block' : 'none', textAlign: rtl ? 'right' : 'left'}}>{videoCodeErr}</span>
            </div>
        )

        const titleL = <div style={titleStyle}>{setLT.title}*</div>
        const titleSection = (
            <div>
                <div>
                    {titleL}
                    <input className='form-control' placeholder='' value={title} style={{...inputStyle, border: titleErr ? '1px solid red' : ''}} name="title" onChange={this.changeHandler}/>
                </div>
                <span className='invalid-feedback' style={{fontSize:'12px', display: titleErr ? 'block' : 'none', textAlign: rtl ? 'right' : 'left'}}>{titleErr}</span>
            </div>
        )

        const commentL = <div style={titleStyle}>{setLT.adsDescription}</div>
        const commentSection = (
            <div>
                <div>
                    {commentL}
                    <textarea
                        style={{fontSize:'14px', border: commentErr ? '1px solid red' : ''}}
                        name='comment'
                        onChange={this.commentHandler}
                        value={comment}
                        type="text"
                        className="form-control"
                        rows="5"
                    />
                    <div style={{margin:'5px 0px -10px', textAlign: rtl ? 'left' : 'right'}}>{commentVxl}/{commentTotal}</div>
                </div>
                <span className='invalid-feedback' style={{fontSize:'12px', display: commentErr ? 'block' : 'none', textAlign: rtl ? 'right' : 'left', marginTop:'-10px'}}>{commentErr}</span>
            </div>
        )

        const videoModalInfo = (
            <div className='center' style={{alignItems:'center', flexDirection:'column', direction: rtl ? 'rtl' : 'ltr'}}>
                <div style={{borderRadius:'3px', padding:'0px', width:'100%', direction: rtl ? 'rtl' : 'ltr'}}>
                    {videoSection}
                    {titleSection}
                    {commentSection}
                    <CategorySelector/>
                </div>
            </div>
        )

        const saveNewVideoBtn = (
            <div className='center' style={{width:'100%', alignItems:'center'}}>
                <Button variant="success" onClick = {() => loader ? null : this.onSave()}
                    style={{minWidth:'100px', height:'30px', fontSize:'12px', padding:'0px', }}>
                    <span style={{fontSize:'15px'}}>{loader ? loaderX : setLT.save}</span>
                </Button>
            </div>
        )

        return (
            <Modal show={toggleVideo.type!==false} onHide={() => onToggle(false)}>
                <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                    <Modal.Title>
                        {setLT.videos}&nbsp;
                        <span style={{fontSize:'12px'}}>Limit({videoN + '/' + (subUserInfo.limits || {video:10}).video})</span>
                    </Modal.Title>
                    <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={() => onToggle(false)} />
                </Modal.Header>
                { toggleVideo.type==='edit' || videoN < (subUserInfo.limits || {video:10}).video
                    ?
                    <div>
                        <Modal.Body style={{padding:'20px'}}>
                            {videoModalInfo}
                        </Modal.Body>
                        <Modal.Footer>
                            {saveNewVideoBtn}
                        </Modal.Footer>
                    </div>
                    :
                    <Modal.Body style={{ fontSize: '13px', borderRadius:'10px', padding:'30px' }}>
                        <div className="alert alert-danger" role="alert" style={{width:'100%', margin:'0px', textAlign:rtl ? 'right' : 'left', fontSize:'15px', }}>
                            {setLT.limitReached}&nbsp;
                            ({videoN + '/' + (subUserInfo.limits || {video:10}).video})
                        </div>
                    </Modal.Body>
                }
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        userInfo: state.userInfo,
        subUserInfo: state.subUserInfo,
        rtl: state.rtl,
        lang: state.lang,
        auth: state.auth,
        page: state.page,
        videoInfo: state.videoInfo,
        setLT: state.setLT,
        toggleVideo: state.toggleVideo,
        categoryX: state.categoryX,

    }
}

export default connect (mapStateToProps)(ModalHandleVideo);
