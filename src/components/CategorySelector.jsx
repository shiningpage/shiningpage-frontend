import React, { Component } from "react";
import axios from 'axios';
import { connect } from 'react-redux';
import { Form, Row, Col, Button } from 'react-bootstrap';
import setLangText from '../modules/setLangText';
import { BsChevronCompactDown } from 'react-icons/bs';
import { setCategoryX } from '../dataStore/actions';
import { filterCategory } from './web/psSub/psHelper';
import { serverURL, s } from '../srcSet';

class CategorySelector extends Component {

  state = {
    w: window.innerWidth,
  }

  async componentDidMount () {
    const items = filterCategory(this.props.subUserInfo.categoryItems)
    await this.mapCategory(items)
    this.setCurrentCategory()
  }

  setCurrentCategory = async () => {
    const { subUserInfo, adsInfo, toggleAds, toggleVideo, toggleInsta,
      videoInfo, toggleNewVideo, toggleEditVideo,
      instaInfo, toggleNewInsta, toggleEditInsta,
    } = this.props
    var categoryItems = subUserInfo.categoryItems
    var idX, subIdX, userSubCategoryId
    if(toggleAds.type!==false) {
      idX = adsInfo.userCategoryId
      subIdX = adsInfo.userSubCategoryId
    }
    if(toggleVideo.type==='edit') {
      idX = videoInfo.userCategoryId
      subIdX = videoInfo.userSubCategoryId
    }
    if(toggleInsta.type==='edit') {
      idX = instaInfo.userCategoryId
      subIdX = instaInfo.userSubCategoryId
    }

    if(idX) {
      for(var i=0; i<categoryItems.length; i++) {
        if(categoryItems[i].id===idX) {
          var idX = categoryItems[i].id
          var pixIdX = categoryItems[i].pixId
          var titleX = categoryItems[i].title
          var subX = categoryItems[i].sub
          this.setState({ idX, pixIdX, titleX, subX })
          const data = {
            id: idX,
            title: titleX,
            subId: subIdX
          }
          // console.log(999, adsInfo)
          // console.log(111, subX)
          for(let x=0; x<subX.length; x++) {
            // console.log(1, subX[x].id)
            // console.log(2, adsInfo.userSubCategoryId)
            subX[x].checked = undefined
            if(toggleAds.type!==false) userSubCategoryId = adsInfo.userSubCategoryId
            if(toggleVideo.type==='edit') userSubCategoryId = videoInfo.userSubCategoryId
            if(toggleInsta.type==='edit') userSubCategoryId = instaInfo.userSubCategoryId
            if(subX[x].id===userSubCategoryId) subX[x].checked = true
          }
      
          this.mapSubCategory(subX)
          this.props.dispatch(setCategoryX(data))
        }
      }
    }
  }

  // getCategories = async () => {
  //   this.setState({
  //     loadingData:true,
  //   })

  //   var data = {
  //       userId:this.props.mainUserId,
  //   }

  //   await axios.post(`${serverURL}/category/findUserCategory`, data).then(async res => {
  //       // console.log(res.data)
  //       var category = res.data.category ? res.data.category : []
  //       await this.mapCategory(category)
  //       this.props.dispatch(userCategories(category))
  //   })
  // }

  mapCategory = async (x) => {
    const {w} = this.state
    const {subUserInfo} = this.props
    var img, category
    var dataRv = x.map (
        (item, i) => (
            // console.log(55555555, item),
            img = (
              <img
                  className=''
                  style={{objectFit:'cover', width:'25px', height:'25px', borderRadius:'5px'}}//
                  // src={item.image}
                  src={`https://www.pix.shiningpage.com/whoraly/category/${subUserInfo._id}-${item.pixId}.jpeg`}
                  alt={item.title}
              />
            ),
            category = (
              <div className={`d-flex`}
                  style={{width:'200px', alignItems:'center'}}>
                  {img}
                  <div style={{fontSize: w<s ? '13px' : '14px', margin:'0px 10px', whiteSpace:'pre-wrap'}}>{item.title}</div>
              </div>
            ),
            <div key={i} className="dropdown-item" style={{padding:'3px 5px', minWidth:'150px'}}
                onClick={() => this.selectCategory(item)}>
                {category}
            </div>
        )
    )
    this.setState({
      categryList: dataRv,
      loadingData: false
    })
  }

  mapSubCategory = async (data) => {
    const {w} = this.state
    const {mainUser, setLT} = this.props
    var img, category
    var dataRv = data.map (
      (item, i) => (
        <div key={i} className="d-flex pointer" onClick={() => this.selectSubCategory(data, i)}
          style={{width:'100%', marginBottom:'10px', alignItems:'center', justifyContent:'flex-end', flexDirection:'row-reverse'}}>
          <Form.Label className='pointer' style={{margin:'0px 5px'}}>
            {item.title}
          </Form.Label>
          <Form.Check className='pointer' type="switch" checked={item.checked ? true : false} onChange={() => null}/>
        </div>
      )
    )
    this.setState({
      subCategryList: dataRv,
      // loadingData: false
    })
  }

  selectCategory = async (item) => {
    // console.log(item)
    var sub = item.sub
    for(let x=0; x<sub.length; x++) {
      sub[x].checked = undefined
    }

    this.setState({
      idX: item.id,
      pixIdX: item.pixId,
      titleX: item.title,
    })
    this.mapSubCategory(item.sub)
    this.props.dispatch(setCategoryX({id: item.id, title: item.title}))
    // console.log(this.props.categoryX)
  }

  selectSubCategory = async (data, i) => {
    for(let x=0; x<data.length; x++) {
      data[x].checked = undefined
    }
    data[i].checked = true
    var catX = this.props.categoryX
    catX.subId = data[i].id
    this.props.dispatch(setCategoryX(catX))

    this.mapSubCategory(data)
  }

  render() {
    const {w, idX, pixIdX, titleX, loadingData, categryList, subCategryList} = this.state
    const {lang, subUserInfo, setLT} = this.props
    const loaderZBlack = <div className='loader-13' style={{margin:'0px 20px 0px', color:'#000000'}}></div>

    const imgConst = (
      <img
          className=''
          style={{objectFit:'cover', width:'25px', height:'25px', borderRadius:'5px'}}
          src={`https://www.pix.shiningpage.com/whoraly/category/${subUserInfo._id}-${pixIdX}.jpeg`}
          alt={titleX}
      />
    )

    const categoryConst = (
      <div className={`d-flex`}
          style={{width:'200px', alignItems:'center'}}>
          {imgConst}
          <div style={{fontSize: w<s ? '13px' : '14px', margin:'0px 10px', whiteSpace:'pre-wrap'}}>{titleX}</div>
      </div>
    )

    const categoryBox = (
      <div className={`dropdown`} style={{padding:'0px', fontSize:'15px', margin:'3px 0px 0px', cursor:'pointer',}}>
        <div className='' color=''
            type="" id="dropdownMenuButton" data-bs-toggle="dropdown"
            aria-haspopup="false" aria-expanded="false"
            style={{margin:'0px', padding:'0px', borderRadius:'3px'}}>
            <div className='d-flex' style={{flexDirection:'column', alignItems:'center', fontSize:'15px'}}>
                {idX
                  ?
                  <div className='d-flex' style={{marginBottom:'0px', alignItems:'center'}}>
                      {idX && categoryConst}
                  </div>
                  :
                  <div className="center" style={{alignItems:'center', flexDirection:'column'}}>
                    <span>Select</span>
                    <BsChevronCompactDown/>
                  </div>
                }
            </div>
        </div>
        <div className="dropdown-menu animated fadeIn" aria-labelledby="dropdownMenuButton"
              style={{fontSize:'13px', cursor:'pointer', margin:'30px 0px 0px 0px', padding:'5px', maxHeight:'200px', overflow:'scroll'}}>
            {categryList}
        </div>
      </div>
    )

    return (
      <div className='sticky-top' style={{animationDelay:'.6s', margin:'20px 0px', }}>
          <div className='d-flex' style={{marginBottom:'0px', color:'', alignItems: idX ? 'flex-start' : 'center', flexDirection: idX ? 'column' : ''}}>
              <div style={{fontSize:'14px', fontWeight:'bold', margin:idX ? '0px 0px -20px' : '0px'}}>{setLT.category}</div>&nbsp;
              <div className='d-flex sticky-top' style={{ marginBottom:'15px'}}>
                  {loadingData ? loaderZBlack : categoryBox}
              </div>
              <Form>
                {idX && subCategryList}
              </Form>
          </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      mainUserId: state.userInfo['_id'],
      mainUser: state.userInfo,
      subUserInfo: state.subUserInfo,
      lang: state.lang,
      auth: state.auth, 
      page: state.page, 
      setLT: state.setLT,

      adsInfo: state.adsInfo,
      toggleAds: state.toggleAds,

      videoInfo: state.videoInfo,
      toggleNewVideo: state.toggleNewVideo,
      toggleEditVideo: state.toggleEditVideo,

      instaInfo: state.instaInfo,
      toggleNewInsta: state.toggleNewInsta,
      toggleEditInsta: state.toggleEditInsta,
      toggleVideo: state.toggleVideo,
      toggleInsta: state.toggleInsta,

      categoryX: state.categoryX,
  }
}

export default connect (mapStateToProps)(CategorySelector);
