import React, { Component } from "react";
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { setCategoryX, setAdsInfo } from '../../dataStore/actions';
import { AiOutlineCloseCircle } from "react-icons/ai";
import date from 'date-and-time';
import toFarsi from '../../modules/toFarsi';
import CurrencyInput from 'react-currency-input-field';
import CategorySelector from '../CategorySelector';
import pixSave from '../../modules/pixSave';
import pixDelete from '../../modules/pixDelete';
import pixHandler from '../../modules/pixHandler';
import { serverURL, s } from '../../srcSet';
import { cleanEditorHtml } from '../../helper';
import TextEditor from '../../components/TextEditor';
import { FaPlus, FaMinus } from "react-icons/fa6";

var destB = "../pix.shiningpage.com/whoraly/ads/big"

class ModalHandleAds extends Component {

    state = {
        rx: 270,
        sz: 150,
        szx: 1000,
        w: window.innerWidth,
        adsCommentTotal: this.props.fullAccess ? 10000 : 2000,
        // negotiablePrice: true //toggleAds.type === 'new' ? false : undefined
    }

    componentDidMount = async () => {}

    componentDidUpdate(prevProps) {
        if (prevProps.toggleAds !== this.props.toggleAds) {
            const { adsInfo, toggleAds } = this.props;
            const { adsTitle, slug, adsComment, unitPrice, negotiablePrice, currency, unitMeasurement, pictureType, pictures } = adsInfo;
            const isNew = toggleAds.type === 'new';
            const adsCommentLength = adsInfo.adsComment ? adsInfo.adsComment.length : 0;

            this.setState({
                imgList : [],
                imgArr : [],
                deleteArray : [],
                fileBArr : [],
                pictureArr: [],
                pictureArrZ: [],
                pixName:[],
                adsCommentVxl: isNew ? 0 : adsCommentLength,
                adsTitle: isNew ? '' : adsTitle,
                slug: isNew ? '' : slug,
                adsComment: isNew ? '' : adsComment,
                unitPrice: isNew ? null : unitPrice,
                negotiablePrice: isNew ? false : negotiablePrice,
                currency: isNew ? '' : currency,
                unitMeasurement: isNew ? '' : unitMeasurement,
                pictureType: isNew ? 1 : pictureType,
                pictures: isNew ? [] : pictures,
                loader: false,
                formatErr:'',
                selectImgErr:'',
                adsTitleErr:'',
                slugErr:'',
                adsCommentErr:'',
                unitPriceErr:'',
                currencyErr:'',
                unitMeasurementErr:'',
            });

            if(toggleAds.type==='new') this.props.dispatch(setCategoryX({}))

            // console.log('toggleAdsType: ', toggleAds.type)
            // console.log('adsInfo: ', adsInfo)
            if(toggleAds.type==='edit') {
                const imgArr = Array.from(Array(adsInfo.pictures.length), (_,x) => x)
                const pictureArrZ = [...adsInfo.pictures]
                this.setState({
                    imgArr,
                    pictureArrZ,
                })
                setTimeout(() => {
                    this.mapImg(imgArr, pictureArrZ)
                }, 100);
            }

        }
    }

    mapImg = async (imgArr, pictureArrZ) => {
        if(!imgArr) imgArr = this.state.imgArr
        if(!pictureArrZ) pictureArrZ = this.state.pictureArrZ
        // console.log('imgArr: ', imgArr)
        // console.log('pictureArrZ: ', pictureArrZ)
        var { pictureType, pictureArr, pictures } = this.state
        const { setLT, adsInfo } = this.props

        switch (pictureType) {
            case 1:
                pictureArr = imgArr.length>0 ? [imgArr[0]] : imgArr;
                break;
            case 2:
                pictureArr = imgArr.length>1 ? [imgArr[0], imgArr[1]] : imgArr;
                break;
            case 3:
                pictureArr = imgArr;
                break;
            default:
                pictureArr = [];
        }

        var imgList = pictureArr.map (
            (item, i) => (
                // console.log(item),
                <div key={i} className="center" style={{flexDirection:'column', alignItems:'center'}}>
                    {pictureType===2 &&
                        <div style={{ width:'70px', textAlign:'center' }}>
                            {i===0 ? setLT.before : setLT.after}
                        </div>
                    }
                    <img
                        className={`cardShadow`}
                        style={{objectFit: 'contain', width:'70px', height:'70px', borderRadius:'3px', margin:'5px', border:'1px solid #ffffff40', padding:'0px'}}
                        src={ typeof item === "number"
                            ? `https://www.pix.shiningpage.com/whoraly/ads/big/${adsInfo._id}-${pictureArrZ[item]}.jpeg`
                            : item
                        }
                        alt={`image ${i}`}
                        // onClick={() => this.likerList(x)}
                    />
                    <div className="center btnShadow disable-select" onClick = {() => this.deleteImg(i, item)}
                        style={{color:'', height:'30px', width:'70px', borderRadius:'0px', borderRadius:'3px', fontSize:'20px', fontWeight:10, alignItems:'center', margin:'5px'}}>
                        <FaMinus />
                    </div>
                </div>
            )
        )
        this.setState({imgList})
    }

    addPicture = async (e) => {
        const { imgArr } = this.state;
        const { userInfo } = this.props;

        if (imgArr.length === 0 || userInfo.businessType >= 1) {
            await this.pixChangeHandler(e);
        } else {
            this.setState({ goldenAccess: true });
        }
    }

    deleteImg = async (i, item) => {
        const { imgArr, pictures, pictureArrZ, pixName, fileBArr, deleteArray } = this.state
        imgArr.splice(i, 1);
        pictures.splice(i, 1);
        pixName.splice(i, 1);
        fileBArr.splice(i, 1);
        if(typeof item === "number") deleteArray.push(pictureArrZ[item])
        await this.mapImg()
        this.setState({ goldenAccess: false })
        // console.log(pictureArrZ)
        // console.log(deleteArray)
    }

    commentHandler = e => {
        var tx = e.target.value
        var vx = tx.trim()==="" ?  null : tx
        var vxl = vx ? vx.length : 0
        this.setState({
            adsComment: vx ? vx.substr(0, this.state.adsCommentTotal) : '',
            adsCommentVxl: vxl > this.state.adsCommentTotal ? this.state.adsCommentTotal : vxl,
            status : 0,
            adsCommentErr: false,
        });
    };

    onNegotiable = () => {
        this.setState({
            negotiablePrice : !this.state.negotiablePrice,
            unitPrice: '',
            currency: '',
            unitMeasurement: '',
        })
    }

    changeHandler = event => {
        const name = event.target.name
        this.setState({ ...this.state, [name]: event.target.value });
        if(name==='adsTitle') this.setState({ adsTitleErr: false });
        if(name==='slug') this.setState({ slugErr: false });
        if(name==='currency') this.setState({ currencyErr: false });
        if(name==='unitMeasurement') this.setState({ unitMeasurementErr: false });
    };

    pixChangeHandler = async (e) => {
        if(e.target.files[0]) {
            await pixHandler(e, this.state.szx).then(res => {
                if(res) {
                    var a = res.file.size
                    var b = res.fileResized.size
                    const d1 = new Date();
                    const dateN = d1.getTime().toString();

                    this.state.pictures.push(dateN)
                    this.state.pixName.push(dateN)
                    this.state.imgArr.push(res.base64)
                    this.mapImg()
                    // console.log('fileResized: ', res.fileResized)
                    // console.log('file: ', res.file)

                    const selectedFileB = a > b ? res.fileResized : res.file
                    this.setState({ selectedFileB })
                    this.state.fileBArr.push(selectedFileB)
                    // console.log('selectedFileB: ', this.state.selectedFileB)
                    this.setState({
                        selectImgErr: '',
                        formatErr:'',
                        // uploadComment:this.props.setLT.uploadComment
                    })
                    // pixResizer(selectedFileB, this.state.sz).then(res => {
                    //     if(res) {
                    //     }
                    // })
                } else {
                    this.setState({
                        formatErr:this.props.setLT.formatErr,
                    })
                }
            })
            // console.log(99, this.state.pictures)

        }
    }

    deleteAction = async (adsId, deleteArray, destB) => {
        for(var i=0; i<deleteArray.length; i++) {
            var fileName = adsId + "-" + deleteArray[i] + ".jpeg"
            // console.log(fileName)
            await pixDelete({dest: destB + "/" + fileName})
        }
    }

    // renameAction = async (adsId, adsInfo, dateN, imgArr, destB, destS) => {
    //     for(var i=0; i<imgArr.length; i++) {
    //         const oldName = adsId + "-" + adsInfo.nameIndex + "-" + imgArr[i] + ".jpeg"
    //         const newName = adsId + "-" + dateN + "-" + i + ".jpeg"
    //         await pixRename({dest: destB, oldName, newName})
    //         await pixRename({dest: destS, oldName, newName})
    //     }
    // }

    saveNewAction = async (adsId, pixName, fileBArr, destB, szx) => {
        for(let i = 0; i<fileBArr.length; i++) {
            await pixSave(fileBArr[i], `${szx}|${adsId + "-" + pixName[i]}|${destB.replaceAll("/", "@")}`)
        }
        // for(let i = 0; i<fileSArr.length; i++) {
        //     await pixSave(fileSArr[i], `${sz}|${adsId + "-" + pixName[i]}|${destS.replaceAll("/", "@")}`)
        // }
    }

    checkNull = () => {
        const { imgList, adsTitle, slug, adsComment, unitPrice, negotiablePrice, currency, unitMeasurement } = this.state;
        const { selectImgErr, titleErr, adsCommentErr, unitPriceErr, currencyErr, unitMeasurementErr } = this.props.setLT;
        const infoErr = {};

        if (imgList.length === 0) infoErr.selectImgErr = selectImgErr;
        if (adsTitle.trim() === '') infoErr.adsTitleErr = true;
        if (slug.trim() === '') infoErr.slugErr = true;
        // if (adsComment.trim() === '') infoErr.adsCommentErr = true;
        if (Number(unitPrice) === 0 && !negotiablePrice) infoErr.unitPriceErr = true;
        if (currency.trim() === '' && !negotiablePrice) infoErr.currencyErr = true;
        // if (unitMeasurement.trim() === '' && !negotiablePrice) infoErr.unitMeasurementErr = true;

        return infoErr;
    }

    onSave = async () => {
        var infoErr = this.checkNull()
        if(Object.keys(infoErr).length>0) {
            this.setState({
                selectedFile: null,
                formatErr:'',
                selectImgErr: infoErr.selectImgErr,
                adsTitleErr: infoErr.adsTitleErr,
                slugErr: infoErr.slugErr,
                adsCommentErr: infoErr.adsCommentErr,
                unitPriceErr: infoErr.unitPriceErr,
                currencyErr: infoErr.currencyErr,
                unitMeasurementErr: infoErr.unitMeasurementErr,
            })
        } else {
            this.setState({loader:true})
            const { deleteArray, imgList, imgArray, imageArray, adsId, category, } = this.state
            const { sz, szx, pixName, fileBArr, imgArr, pictureType, pictures, adsTitle, slug, adsComment, negotiablePrice, unitPrice, currency, unitMeasurement} = this.state
            const { mainUserId, categoryX, adsInfo, onToggle, handleGetAllAds, resetAds, catQty, loc } = this.props

            const cleanAdsComment = cleanEditorHtml(adsComment);
            const data = {
                userId: mainUserId,
                pictureType,
                pictures,
                adsTitle,
                slug,
                adsComment: cleanAdsComment,
                negotiablePrice,
                unitPrice,
                currency,
                unitMeasurement,
                userCategoryId: categoryX.id ? categoryX.id : "",
                userSubCategoryId: categoryX.subId ? categoryX.subId : "",

                star:0,
                status:1,
                adsDate: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
            }

            // console.log('data: ', data)
            const adsType = this.props.toggleAds.type
            if(adsType==='edit') data.adsId = adsInfo._id
            // console.log(data)
            await axios.post(`${serverURL}/ads/${adsType==='new' ? 'new' : 'userEdit'}`, data)
            .then(async res => {
                var adsId = res.data._id
                if(adsType==='edit') await this.deleteAction(adsId, deleteArray, destB)
                await this.saveNewAction(adsId, pixName, fileBArr, destB, szx)
                // console.log("finished")
                if(loc==='PSPage') {
                    this.props.dispatch(setAdsInfo(res.data))
                } else {
                    resetAds()
                }
                // console.log('categoryX: ', categoryX)
                // console.log('catQty: ', catQty)
                onToggle(false)

                // برای بروزرسانی اعداد دسته بندی - مهم
                // for(let i=0; i<catQty.length; i++) {
                //     if(catQty[i].id === `cat${categoryX.id}`) {
                //         catQty[i].qty = catQty[i].qty + 1
                //         const elment = document.getElementById(catQty[i].id);
                //         if(elment) elment.innerHTML = catQty[i].qty
                //     }
                // }
            })
        }
    }

    onPictureType = async (x) => {
        await this.setState({
            pictureType: x
        })
        await this.mapImg()
    }

  render() {
    const {w, pictureType, loader, goldenAccess, imgList, imgArr, negotiablePrice, adsCommentTotal, adsCommentVxl, adsTitle, slug, adsComment, unitPrice, unitMeasurement, currency, selectImgErr,
      adsTitleErr, slugErr, adsCommentErr, unitPriceErr, unitMeasurementErr, currencyErr, formatErr, } = this.state
    const {rtl, setLT, toggleAds, onToggle, adsN, subUserInfo, fullAccess} = this.props;
    const inputStyle = {width: '100%', fontSize:'14px', height:'30px', borderRadius:'5px', textAlign:'center'}
    const titleStyle = {fontSize:'14px', fontWeight:'bold', margin:'15px 0px 0px', textAlign: rtl ? 'right' : 'left'}
    const priceStyle = {color: negotiablePrice ? '#999999' : '', fontSize:'14px', fontWeight:'bold', margin:'15px 0px 0px 0px', textAlign: rtl ? 'right' : 'left'}
    const loaderX = <div className='loader-13' style={{margin: rtl ? '35px 20px -25px' : '0px 20px 0px', color:'#ffffff', transform: rtl ? 'rotate(180deg)' : ''}}></div>

    const single = (
        <div className="radio" style={{margin:'0px 10px'}} onClick={() => this.onPictureType(1)}>
            <label className='center' style={{margin:'0px', alignItems:'center', cursor:'pointer', flexWrap:'wrap'}}>
                <div>Single</div>
                <div className='d-flex' style={{alignItems:'center'}}>
                <input type="radio" value="option2"
                    checked={pictureType===1 ? true : false}
                    style={{margin:'0px 5px', cursor:'pointer'}}
                    onChange={() => null}/>
                </div>
            </label>
        </div>
    )

    const beforAfter = (
        <div className="radio" style={{margin:'0px 10px'}} onClick={() => this.onPictureType(2)}>
            <label className='center' style={{margin:'0px', alignItems:'center', cursor:'pointer', flexWrap:'wrap'}}>
                <div>Before-After</div>
                <div className='d-flex' style={{alignItems:'center'}}>
                <input type="radio" value="option3"
                    checked={pictureType===2 ? true : false}
                    style={{margin:'0px 5px', cursor:'pointer'}}
                    onChange={() => null}/>
                </div>
            </label>
        </div>
    )

    const multi = (
        <div className="radio" style={{margin:'0px 10px'}} onClick={() => this.onPictureType(3)}>
            <label className='center' style={{margin:'0px', alignItems:'center', cursor:'pointer', flexWrap:'wrap'}}>
                <div>Multi</div>
                <div className='d-flex' style={{alignItems:'center'}}>
                <input type="radio" value="option3"
                    checked={pictureType===3 ? true : false}
                    style={{margin:'0px 5px', cursor:'pointer'}}
                    onChange={() => null}/>
                </div>
            </label>
        </div>
    )

    const pictureTypeL = <div style={titleStyle}>{setLT.pictureType}</div>
    const pictureTypes = (
        <div className='center' style={{margin:'0px 0px 50px', alignItems:'center'}}>
            {single}
            {beforAfter}
            {/* multi */}
        </div>
    )

    const typeConst = (
        <div style={{margin:'-20px 0px 30px'}}>
            <div style={{margin:'0px 0px -20px'}}>
                {pictureTypeL}
                {pictureTypes}
            </div>
        </div>
    )

    const adsTitleL = <div style={titleStyle}>{setLT.adsTitle}</div>
    const adsTitleConst = (
        <div>
            {adsTitleL}
            <input className='form-control' value={adsTitle} style={{...inputStyle, borderColor: adsTitleErr ? 'red' : ''}} name="adsTitle" onChange={this.changeHandler}/>
        </div>
    )

    const slugL = <div style={titleStyle}>Slug</div>
    const slugConst = (
        <div>
            {slugL}
            <input className='form-control' value={slug} style={{...inputStyle, borderColor: slugErr ? 'red' : ''}} name="slug" onChange={this.changeHandler}/>
        </div>
    )

    const adsCommentL = <div style={titleStyle}>{setLT.adsDescription}</div>
    const adsCommentConst = (
        <div>
            {adsCommentL}
            <TextEditor
                value={adsComment}
                onChange={(html) =>
                    // setAbout(html.trim() === '' ? null : html)
                    this.setState({adsComment: html.trim() === '' ? null : html})
                }
                maxChars={fullAccess ? 10000 : 1000}
                placeholder="Write your about text ..."
            />
        </div>
    )

    const unitPriceL = <div style={priceStyle}>{setLT.unitPrice}*</div>
    const unitPriceConst = (
        <div>
            {unitPriceL}
            <CurrencyInput
                disabled = {negotiablePrice}
                id="input-example"
                name="unitPrice"
                className='form-control'
                style={{...inputStyle, borderColor: !negotiablePrice && unitPriceErr ? 'red' : ''}}
                placeholder="0.00"
                value={unitPrice}
                decimalsLimit={2}
                prefix=''
                onValueChange={(value, name) => this.setState({
                    unitPrice:value,
                    unitPriceErr: false
                })}
            />
        </div>
    )

    const currencyL = <div style={priceStyle}>{setLT.currency}*</div>
    const currencyConst = (
        <div>
            {currencyL}
            <input disabled = {negotiablePrice} className='form-control' value={currency} style={{...inputStyle, borderColor: !negotiablePrice && currencyErr ? 'red' : ''}} name="currency" onChange={this.changeHandler}/>
        </div>
    )

    const unitMeasurementL = <div style={priceStyle}>{setLT.unitMeasurement}</div>
    const unitMeasurementConst = (
        <div>
            {unitMeasurementL}
            <input disabled = {negotiablePrice} className='form-control' value={unitMeasurement} style={{...inputStyle, borderColor: !negotiablePrice && unitMeasurementErr ? 'red' : ''}} name="unitMeasurement" onChange={this.changeHandler}/>
        </div>
    )

    const negotiableConst = (
        <div className='d-flex' style={{width:'100%', marginBottom:'15px', alignItems:'center', cursor:'pointer'}} onClick={() => this.onNegotiable()}>
            <input checked={negotiablePrice} type="checkbox"
                style={{textAlign:'center', fontSize:'14px'}}
                onChange={() => null}/>
            <span style={{fontSize:'15px', color:'', fontWeight:450, padding:'10px', marginTop:'5px'}}>No Price</span>&nbsp;
        </div>
    )
  
    const priceConst =  (
        <div style={{marginTop:'30px', padding:'20px', border:'1px solid gray', borderRadius:'5px'}}>
            <div style={{marginTop:'-31px', paddingTop: rtl ? '' : '3px', width:'100px', textAlign:'center', backgroundColor:'#ffffff', borderRadius:'3px', border:'1px solid gray'}}>{setLT.priceInfo}</div>
            {negotiableConst}
            {unitPriceConst}
            {currencyConst}
            {unitMeasurementConst}
        </div>
    )

    const pixAdd = (
        <div className="btn btn-file center btnShadowX disable-select"
            style={{color:'', height:'70px', width:'70px', borderRadius:'3px', fontSize:'20px', fontWeight:10, alignItems:'center', margin:pictureType===2 && imgArr.length>0? '25px 5px 5px' : '5px', paddingTop:'5px'}}>
            <div>
                {pictureType===2 &&
                    <div style={{fontSize:'12px', marginBottom:'-8px'}}>
                        {imgArr.length<1 ? 'Before' : 'After'}
                    </div>
                }
                <FaPlus />
            </div>
            <input type="file" name="file" onChange={this.addPicture}/>
        </div>
    )

    const goldenAccessAlert = (
        <div className='center animated fadeInUpX' style={{alignItems:'center', height:'', padding:'5px', margin: '0px 5px 0px', color:'brown', borderRadius:'5px', border:'2px solid brown'}}>
            {setLT.goldenAccess}
        </div>
    )

    const pictureConst = (
        <div style={{margin:'0px 0px 20px', padding:'15px', border:`1px solid ${selectImgErr || formatErr ? 'red' : 'gray'}`, borderRadius:'5px', width:'100%'}}>
            <div style={{margin:'-30px 0px 10px', paddingTop: rtl ? '' : '3px', width:'100px', textAlign:'center', backgroundColor:'#ffffff', borderRadius:'3px', border:'1px solid gray'}}>{setLT.pictures}</div>
            <div className='d-flex' style={{width:'100%', flexWrap:'wrap', direction:rtl ? 'rtl' : 'ltr'}}>
                {imgList}
                {pictureType===1 && imgArr.length<1 && pixAdd}
                {pictureType===2 && imgArr.length<2 && pixAdd}
                {pictureType===3 && pixAdd}
            </div>
            {goldenAccess && goldenAccessAlert}
            <span className='invalid-feedback' style={{fontSize:'12px', textAlign:'center', display: selectImgErr ? 'block' : 'none'}}>{selectImgErr}</span>
            <span className='invalid-feedback' style={{fontSize:'12px', textAlign:'center', display: formatErr ? 'block' : 'none'}}>{formatErr}</span>
        </div>
    )

    const adsModalInfo = (
        <div>
            {typeConst}
            {pictureConst}
            {adsTitleConst}
            {slugConst}
            {adsCommentConst}
            {priceConst}
            <CategorySelector/>
        </div>
    )

    const saveNewAdsBtn = (
        <div className='d-flex' style={{justifyContent:'flex-end'}}>
            <Button className='' variant="success" onClick = {() => loader ? null : this.onSave()}
                style={{minWidth:'100px', height:'30px', fontSize:'12px', padding:'0px', margin:'10px', position:'fixed', bottom:w<s ? 20 : 50, zIndex:10000}}>
                <span style={{fontSize:'15px'}}>{loader ? loaderX : setLT.save}</span>
            </Button>
        </div>
    )

    return (
        <Modal size="lg" show={toggleAds.type!==false} onHide={() => onToggle(false)}>
            <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                <Modal.Title>
                    Content&nbsp;
                    <span style={{ fontSize: '12px' }}>
                        {toggleAds.type === 'edit'
                            ? 'Edit mode'
                            : `Limit(${adsN}/${(subUserInfo.limits || { ads: 3 }).ads})`}
                    </span>
                </Modal.Title>
                <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={() => onToggle(false)} />
            </Modal.Header>
            { toggleAds.type==='edit' || adsN < (subUserInfo.limits || {ads:3}).ads
                ?
                <div className="rendered-content">
                    <Modal.Body style={{padding:w<s ? '10px 8px' : '20px'}}>
                        {adsModalInfo}
                        {saveNewAdsBtn}
                    </Modal.Body>
                </div>
                :
                <Modal.Body style={{ fontSize: '13px', borderRadius:'10px', padding:'30px' }}>
                    <div className="alert alert-danger" role="alert" style={{width:'100%', margin:'0px', textAlign:rtl ? 'right' : 'left', fontSize:'15px', }}>
                        {setLT.limitReached}&nbsp;
                        ({adsN + '/' + (subUserInfo.limits || {ads:3}).ads})
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
        adsInfo: state.adsInfo,
        setLT: state.setLT,
        toggleAds: state.toggleAds,
        categoryX: state.categoryX,
        fullAccess: state.fullAccess,
    }
}

export default connect (mapStateToProps)(ModalHandleAds);
