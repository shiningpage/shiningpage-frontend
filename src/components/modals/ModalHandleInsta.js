import React, { Component } from "react";
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { setCategoryX } from '../../dataStore/actions';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaInstagram } from 'react-icons/fa';
import toFarsi from '../../modules/toFarsi';
import CategorySelector from '../../components/CategorySelector';
import { serverURL, s, } from '../../srcSet';

class ModalHandleInsta extends Component {

    state = {
        w: window.innerWidth,
        commentTotal: 1000,
    }

    componentDidMount = async () => {}

    componentDidUpdate(prevProps) {
        if (prevProps.toggleInsta !== this.props.toggleInsta) {
            const { instaInfo, toggleInsta } = this.props;
            const { title, comment, code} = instaInfo;
            const isNew = toggleInsta.type === 'new';
            const InstaCommentLength = instaInfo.InstaComment ? instaInfo.InstaComment.length : 0;

            this.setState({
                instaId: isNew ? '' : instaInfo._id,
                commentVxl: isNew ? 0 : InstaCommentLength,
                postLink: isNew ? '' : code,
                title: isNew ? '' : title,
                comment: isNew ? '' : comment,
                loader: false,
                titleErr: false,
                postLinkErr: false,
            });
            if(toggleInsta.type==='new') this.props.dispatch(setCategoryX({}))

            if(toggleInsta.type==='edit') {

            }

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
        if(name==='postLink') this.setState({ postLinkErr: false });
    };

    checkNull = () => {
        var infoErr = {}
        // if(this.state.title.trim()==='') infoErr.titleErr = this.props.setLT.titleErr
        if(this.state.postLink.trim()==='') infoErr.postLinkErr = true
        return infoErr
    }

    onSave = async () => {
        var infoErr = this.checkNull()
        if(Object.keys(infoErr).length>0) {
            this.setState({
                titleErr: infoErr.titleErr,
                postLinkErr: infoErr.postLinkErr,
            })
        } else {
            this.setState({loader:true})

            var cx = this.state.postLink
            if(cx.includes('/p/')) cx = cx.split('/p/')[1]
            if(cx.includes('/tv/')) cx = cx.split('/tv/')[1]
            if(cx.includes('/reel/')) cx = cx.split('/reel/')[1]
            
            if(cx.includes('/?')) cx = cx.split('/?')[0]
            const { instaId, title, comment } = this.state
            const { mainUserId, categoryX, onToggle, resetInsta } = this.props

            const data = {
                userId: mainUserId,
                title,
                comment,
                status: 1,
                code: cx,
                userCategoryId: categoryX.id ? categoryX.id : "",
                userSubCategoryId: categoryX.subId ? categoryX.subId : "",
            }

            const actionType = this.props.toggleInsta.type
            if(actionType==='edit') data.instaId = instaId

            await axios.post(`${serverURL}/instagram/${actionType==='new' ? 'saveInsta' : 'editInsta'}`, data)
            resetInsta()
            onToggle(false)
            // .then(async res => {
            // })
        }
    }

    render() {
        const {w, loader, title, comment, postLink, titleErr, commentErr, postLinkErr, commentTotal, commentVxl } = this.state
        const {rtl, lang, setLT, toggleInsta, onToggle, instaN, subUserInfo} = this.props;
        const inputStyle = {width: '100%', fontSize:'14px', height:'30px', borderRadius:'5px', textAlign:'center'}
        const titleStyle = {fontSize:'14px', fontWeight:'bold', margin:'15px 0px 0px', textAlign: rtl ? 'right' : 'left'}
        const loaderX = <div className='loader-13' style={{margin: rtl ? '35px 20px -25px' : '0px 20px 0px', color:'#ffffff', transform: rtl ? 'rotate(180deg)' : ''}}></div>

        const titleL = <div style={titleStyle}>{setLT.title}</div>
        const titleConst = (
            <div>
                <div>
                    {titleL}
                    <input className='form-control' value={title} style={inputStyle} name="title" onChange={this.changeHandler}/>
                </div>
                <span className='invalid-feedback' style={{fontSize:'12px', display: titleErr ? 'block' : 'none', textAlign: rtl ? 'right' : 'left'}}>{titleErr}</span>
            </div>
        )

        const commentL = <div style={titleStyle}>{setLT.adsDescription}</div>
        const commentConst = (
            <div>
                <div>
                    {commentL}
                    <textarea
                        style={{fontSize:'14px'}}
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

        const InstagramBoxL = <div style={titleStyle}>{setLT.postLink}*</div>
        const InstagramBox = (
            <div style = {{marginBottom:'40px'}}>
                {InstagramBoxL}
                <div className='d-flex' style={{alignItems:'center', margin:'0px 0px 5px', direction:'rtl'}}>
                    <FaInstagram className='' style={{fontSize:'28px', borderRadius:'8px', color:'#ffffff', backgroundImage: 'linear-gradient(to right top, #fcac0f, #fd9522, #fa7f30, #f36a3c, #e85647, #e44751, #dd395b, #d42d65, #d12174, #ca1b85, #be1e96, #ae27a8)'}}/>&nbsp;
                    <input className='form-control' placeholder='Paste link here' autoComplete="off" value={postLink} style={{...inputStyle, borderColor: postLinkErr ? 'red' : ''}} name="postLink" onChange={this.changeHandler}/>
                </div>
                <div style={{fontSize:'13px', fontWeight:450, margin:'0px 0px 20px', textAlign: rtl ? 'right' : 'left'}}>{setLT.instaHelp1}</div>
                <div>E.g.: <span style={{color:'green', fontWeight:450}}>https://www.instagram.com/p/CXLbyhkjJIr/?utm_source=ig_web_copy_link</span></div>
            </div>
        )

        const instaModalInfo = (
            <div className='center' style={{fontSize:'14px', alignItems:'center', flexDirection:'column', direction: rtl ? 'rtl' : 'ltr'}}>
                <div style={{backgroundColor:'#ffffff00', borderRadius:'3px', padding:'0px', width:'100%', direction: rtl ? 'rtl' : 'ltr'}}>
                    {InstagramBox}
                    {titleConst}
                    {commentConst}
                    <CategorySelector/>
                </div>
            </div>
        )

        const saveNewInstaBtn = (
            <div className='center' style={{width:'100%', alignItems:'center'}}>
                <Button variant="success" onClick = {() => loader ? null : this.onSave()}
                    style={{minWidth:'100px', height:'30px', fontSize:'12px', padding:'0px', }}>
                    <span style={{fontSize:'15px'}}>{loader ? loaderX : setLT.save}</span>
                </Button>
            </div>
        )

        return (
            <Modal show={toggleInsta.type!==false} onHide={() => onToggle(false)}>
                <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                    <Modal.Title>
                        {setLT.instagram}&nbsp;
                        <span style={{fontSize:'12px'}}>Limit({instaN + '/' + (subUserInfo.limits || {instagram:20}).instagram})</span>
                    </Modal.Title>
                    <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={() => onToggle(false)} />
                </Modal.Header>
                { toggleInsta.type==='edit' || instaN < (subUserInfo.limits || {instagram:20}).instagram
                    ?
                    <div>
                        <Modal.Body style={{padding:'20px'}}>
                            {instaModalInfo}
                        </Modal.Body>
                        <Modal.Footer>
                            {saveNewInstaBtn}
                        </Modal.Footer>
                    </div>
                    :
                    <Modal.Body style={{ fontSize: '13px', borderRadius:'10px', padding:'30px' }}>
                        <div className="alert alert-danger" role="alert" style={{width:'100%', margin:'0px', textAlign:rtl ? 'right' : 'left', fontSize:'15px', }}>
                            {setLT.limitReached}&nbsp;
                            ({instaN + '/' + (subUserInfo.limits || {instagram:20}).instagram})
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
        instaInfo: state.instaInfo,
        setLT: state.setLT,
        toggleInsta: state.toggleInsta,
        categoryX: state.categoryX,
    }
}

export default connect (mapStateToProps)(ModalHandleInsta);
