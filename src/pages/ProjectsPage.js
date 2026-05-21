import React, { Component } from 'react';
import axios from 'axios';
import { Container, Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setAddress, setCountry, setSubject, setPageTitle,
    setPageName, setPage, setUserInfo, setAuth, setFullAccess} from '../dataStore/actions';
import siteView from '../modules/siteView';
import male from '../assets/images/other/man2.png';
import female from '../assets/images/other/woman2.png';
import toFarsi from '../modules/toFarsi';
import jalaali from 'jalaali-js';
import Resizer from 'react-image-file-resizer';
import { FaPercent, FaFolderPlus } from 'react-icons/fa';
import { MdDashboardCustomize, MdClose } from 'react-icons/md';
import { BsFillCaretLeftFill, BsThreeDots } from 'react-icons/bs';
import { RiAlertFill, RiUserAddFill, RiImageAddFill, RiSave3Fill } from 'react-icons/ri';
import { BiChevronsRight, } from 'react-icons/bi';
import { AiOutlineCodeSandbox } from 'react-icons/ai';
import { FcAddRow } from 'react-icons/fc';
import { ImUndo2 } from 'react-icons/im';
import { IoMdSearch, IoMdReturnLeft } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import { GiTrophiesShelf } from 'react-icons/gi';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import pixSave from '../modules/pixSave';
import pixDelete from '../modules/pixDelete';
import pixHandler from '../modules/pixHandler';
import pixResizer from '../modules/pixResizer';
import { exist } from '../helper';
import { serverURL, s, listRefreshQty, googleAds } from '../srcSet';
import { AdsHorizontal, AdsHorizontalSmall } from '../components/GoogleAds'

var destB = "../pix.shiningpage.com/project/big"
var destS = "../pix.shiningpage.com/project/small"

class ProjectManagement extends Component {

  state = {
    n: 0,
    w: window.innerWidth,
    h: window.innerHeight,
    pageName: 'Projects',
    pjQTY: 0,
    projects: [],
    userProjects: [],
    accessProjects: [],
    allProjects: [],
    pDays: [],
    projectAction: false,
    wbsAction: '',
    searchUsers: '',
    searchData: [],
    gantScale: 12,
    appAccess: false,
    sz: 150,
    szx: 1000,
    imageCommentVxl: 0,
    imageCommentTotal: 500,
    pImageData: null,
    pImageDataX: null,
    imgArray : [],
    imageArray : [],
    fileSArr : [],
    fileBArr : [],
    taskWidth: 300,
    enteringQ2Target:false,
  }

  async componentDidMount() {
    window.scrollTo(0, 0)
    window.addEventListener("resize", this.onResize)
    await this.props.dispatch(setPageTitle(`${this.state.pageName} | ShiningPage`))
    await this.props.dispatch(setPage('projects'))
    await this.props.dispatch(setSubject('projects'))
    await this.props.dispatch(setAddress({ content:[], fix:this.state.pageName }))
    // if(this.props.auth && this.props.mainUser.ruby) checkSeen('ruby', this.props.seenStatus, this.props.dispatch)
    siteView(this.props)
    this.checkAppAccess()
    this.getProjects()
  }

  onTaskWidth = async (pDays, n) => {
    const {projects, taskWidth} = this.state
    if(taskWidth>120 && taskWidth<500) {
      await this.setState({
        taskWidth: taskWidth + n
      })
      this.projectsHeaderMap(projects[0], pDays)
      // console.log(this.state.taskWidth)
    }

    if(n=-10 && taskWidth===500) {
      await this.setState({taskWidth:490})
      this.projectsHeaderMap(projects[0], pDays)
      // console.log(this.state.taskWidth)
    }

    if(n=10 && taskWidth===120) {
      await this.setState({taskWidth:130})
      this.projectsHeaderMap(projects[0], pDays)
      // console.log(this.state.taskWidth)
    }

    this.setState({ saveNeed: true })

  }

  checkAppAccess = async () => {
    const {mainUser, lang} = this.props
    var application = mainUser.application
    console.log(111, application)
    if( application && application.includes(4) ) this.setState({ appAccess: true })
  }

  getProjects = async () => {
    const {mainUser, lang} = this.props
    this.setState({
      gettingProjects:true,
      todayN: this.today().dateN
    })

    var data = {
      userId: mainUser._id
    }

    const userRes = await axios.post(`${serverURL}/project/findUserId`, data)
    const accessRes = await axios.post(`${serverURL}/project/findAccessId`, data)

    const userProjects = userRes.data
    const accessProjects = accessRes.data

    var allProjectsX = [...userProjects, ...accessProjects]
    console.log(44, allProjectsX)

    await allProjectsX.sort((a, b) => (a._id > b._id) ? -1 : 1)

    // console.log(allProjectsX)

    var allProjects=[]
    for(var i=0; i<allProjectsX.length; i++) {
      var access = allProjectsX[i].access

      if(allProjectsX[i].userId===mainUser._id) {

        for(var a=0; a<access.length; a++) {
          var _id = access[a].userId
          await axios.post(`${serverURL}/user/getUserInfo`, {_id}).then( async res => {
            delete res.data.password
            // console.log('nnn', res.data)

            access[a].user = res.data
          })
        }

      } else {

        for(var a=0; a<access.length; a++) {
          if(access[a].userId===mainUser._id) {
            allProjectsX[i].view = access[a].view
            allProjectsX[i].edit = access[a].edit
          }
        }
        var _id = allProjectsX[i].userId
        await axios.post(`${serverURL}/user/getUserInfo`, {_id}).then( async res => {
          delete res.data.password
          // console.log('nnn', res.data)

          allProjectsX[i].user = res.data
        })

      }

      allProjects.push(allProjectsX[i])
      await this.setState({ allProjects })
      await this.projectsMap(allProjects)
      // console.log(allProjects)

    }

    this.setState({ gettingProjects:false })

  }

  trueTable = async (data, i) => {
    var run = true
    for(var x=i; x<data.length && run; x++) {
        if(!data[x].checkSub) {
          // console.log(data[x])
          // data[x].duration = '1'
          var d = {
            target: {
              value: data[x].duration
            }
          }
          await this.changeDuration(d, data, x)
          run = false
        }
    }
    this.setState({ saveNeed: true })
  }

  changeHandler = e => {
    var tx = toFarsi(e.target.value)
    this.setState({ ...this.state, [e.target.name]: tx });
  };

  onCheckFix = async (data, i, pDays) => {
    data[i].checkFix = !data[i].checkFix
    var q2Target = this.state.q2Target.replaceAll(',','')
    data[i].target = data[i].checkFix===true ? Number(q2Target) : data[i].target
    // console.log(data[i].checkFix, data[i].target)
    
    this.changeTarget(data[i].target, data, i, pDays)
    this.changePerformance(data[i].performance, data, i, pDays)

    // await this.setState({projects: data, pDays})
    // this.projectsBodyMap(this.state.projects, pDays)

    // this.setState({saveNeed: true})
  }

  collapse = async (data, i, pDays) => {
    // console.log(data, i)
    data[i].collapse = !data[i].collapse

    for(var a=i+1; a<data.length; a++) {
      var wt = data[i].wbs+'.'
      var wtx = data[a].wbs.substring(0, wt.length)

      if(wt===wtx) { // چک زیرمجموعه

        if (!data[i].collapse) {
            data[a].hidden = true
        } else {
            if(data[a].level - data[i].level === 1) { // چک یک سطح پایین تر
              data[a].hidden = !data[i].collapse
            } else {
              // ساخت یک سطح بالاتر
              var wArr = data[a].wbs.split('.')
              wArr.pop()
              var wbsUp = wArr.toString().replaceAll(',','.')

              // 
              var wbsArray = data.map(({ wbs }) => wbs)
              var ix = wbsArray.indexOf(wbsUp)
              data[a].hidden = !data[ix].collapse
            }
        }
        
      }
    }
    
    await this.setState({projects: data, pDays})
    this.projectsBodyMap(this.state.projects, pDays)
  }

  changeProjectComment = (e) => {
    if(this.state.pEdit) {
      var tx = e.target.value
      this.setState({
        projectComment: tx,
        saveNeed: true
      })
    } else {
      this.setState({
        toggleUnAccess: true
      })
    }
  }

  focusTaskName = async (e, data, i, pDays) => {
    var fx = e.target.selectionStart
    var tx = e.target.value

    data[i].taskName = tx
    
    let text = document.getElementById(`taskName${i}`).value;
    let h1 = document.getElementById(`taskName${i}`).scrollHeight;
    data[i].height = h1

    this.projectsBodyMap(this.state.projects, pDays)
  }

  changeTaskName = async (e, data, i, pDays) => {
    var fx = e.target.selectionStart
    var tx = e.target.value

    data[i].taskName = tx

    let text = document.getElementById(`taskName${i}`).value;
    let h1 = document.getElementById(`taskName${i}`).scrollHeight;
    let lines = text.split(/\r|\r\n|\n/);
    let count = lines.length;
    // console.log(count);
    // console.log(h1);

    data[i].height = h1

    this.setState({
      itemFx: `taskName${i}`,
      fx: e.target.selectionStart,
    })

    await this.setState({projects: data, pDays})
    this.projectsBodyMap(this.state.projects, pDays)
    
    const textarea = document.getElementById(`taskName${i}`);
    if(textarea) textarea.setSelectionRange(fx, fx);
    
    this.setState({saveNeed: true})
  }

  changeDuration = async (e, data, i) => {
    var fx = e.target.selectionStart
    var d = e.target ? e.target.value : 0
    // console.log(d)

    if(d<1000) {// && data[i].finish
        // console.log(d, e)
        var dx = parseFloat(d)
        if (isNaN(dx)) dx = ''
        data[i].duration = dx
        if(data[i].start) {
          // data[i].startN = this.getDateDays(data[i].start)
          data[i].finish = this.finishDate(data[i].start, dx)
          data[i].finishN = this.getDateDays(data[i].finish)
          data = await this.updateUpperDates(data, i, data[i].start)
        }
        
        // console.log(data)
        var pDays = this.projectDays(data[0])
        await this.projectsHeaderMap(data[0], pDays)
        // console.log(data, pDays)
        var typeX = this.state.typeX
        if(typeX==='percentage') {
          await this.changeComplete(data[i].complete, data, i, pDays)
        } else {
          if(typeX==='quantity1') {
            await this.changeTarget(data[i].target, data, i, pDays)
          }
          await this.changePerformance(data[i].performance, data, i, pDays)
        }

        await this.setState({projects: data, pDays})
        await this.projectsBodyMap(this.state.projects, pDays)
        await this.setTaskHeight(this.state.projects, this.state.pDays)

        const textarea = document.getElementById(`duration${i}`);
        if(textarea) textarea.setSelectionRange(fx, fx);

        this.setState({saveNeed: true})
    }

  }

  xTask = async (data, i) => {
      data[i].duration = 1
      data[i].complete = 0
      return data
  }

  updateUpperDates = async (data, i, start) => {
    // console.log(i, data)

    var wbsArray = data.map(({ wbs }) => wbs)
    var lx = data[i].wbs.split('.')

    data[i].start = start
    data[i].finish = start ? this.finishDate(start, data[i].duration) : ''
    data[i].finishN = this.getDateDays(data[i].finish)
    // console.log(123, lx, data[i].start, data[i].finish)
    var lxl = lx.length
    for(var z=0; z<lxl; z++) {
        lx.pop()
        var wArrX = lx.toString().replaceAll(',','.')
        
        var ix = wbsArray.indexOf(wArrX)
        // console.log(333, lx, wArrX, ix)

        if(ix!==-1 && start) {
          // console.log(222, ix, wArrX, wbsArray)
          var start = await this.updateUpperStart(wArrX, data)
          
          var finish = this.updateUpperFinish(wArrX, data)
          data[ix].start = start.date
          data[ix].startN = this.getDateDays(data[ix].start)
          data[ix].finish = finish.date
          data[ix].finishN = this.getDateDays(data[ix].finish)
  
          if(start.date!=='' && finish.date!=='') {
            var startDaysN = this.props.lang==='fa' ? jalaali.j2d(Number(start.yy), Number(start.mm), Number(start.dd)) : jalaali.g2d(Number(start.yy), Number(start.mm), Number(start.dd))
            var finishDaysN = this.props.lang==='fa' ? jalaali.j2d(Number(finish.yy), Number(finish.mm), Number(finish.dd)) : jalaali.g2d(Number(finish.yy), Number(finish.mm), Number(finish.dd))
            data[ix].duration = finishDaysN - startDaysN + 1
          } else {
            data[ix].duration = 0
          }
        }
    }
    return data
  }

  getDateDays = (nx) => {

    var lang = this.props.lang
    if(lang==='fa') {
      var sd = nx.split('/')
      var yy = sd[0]
      var mm = sd[1]
      var dd = sd[2]
      if(jalaali.isValidJalaaliDate(yy, mm, dd)) {
          var days = jalaali.j2d(Number(yy), Number(mm), Number(dd))
      } else {
        var days = 0
      }
    } else {
        var sd = nx.split('-')
        var nx = new Date(nx)
        var yy = sd[0]
        var mm = sd[1]
        var dd = sd[2]
        if(nx.toString()!=='Invalid Date') {
            var days = jalaali.g2d( Number(yy), Number(mm), Number(dd) )
        } else {
          var days = 0
        }
    }

    return days
  }

  getDateText = (days) => {
    var lang = this.props.lang
    if(lang==='fa') {
        var end = jalaali.d2j(days)
        var yy = end.jy
        var mm = end.jm
        var dd = end.jd
        if(mm.toString().length<2) mm = '0' + mm
        if(dd.toString().length<2) dd = '0' + dd
        var nx = yy + "/" + mm + "/" + dd

    } else {
        var end = jalaali.d2g(days)
        var yy = end.gy
        var mm = end.gm
        var dd = end.gd
        if(mm.toString().length<2) mm = '0' + mm
        if(dd.toString().length<2) dd = '0' + dd
        var nx = yy + '-' + mm + '-' + dd
    }

    return nx
  }

  changeQ2Target = async (e) => {
    var nx = parseFloat(e.target.value.replace(/,/g, ''))
    if (isNaN(nx)) nx = 0
    nx = nx.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

    this.setState({
      q2Target: nx,
      chengQ2Target:true
    })
  }

  enterQ2Target = async (nx) => {
    this.setState({ enteringQ2Target: true })
    setTimeout(async () => {
      const {projects, pDays, q2Target} = this.state
      var nx = parseFloat(q2Target.replace(/,/g, ''))
      if (isNaN(nx)) nx = 0
  
      for(var i=0; i<projects.length; i++) {
        if(i===0 || projects[i].checkFix===true) projects[i].target = nx
        projects[i].complete = this.setProgress(projects[i].target, projects[i].performance)
        await this.changeComplete(projects[i].complete, projects, i, pDays)
      }
  
      this.setState({
        chengQ2Target:false,
        enteringQ2Target: false,
        projects,
      })
    }, 500);

  }

  changeTarget = async (e, data, i, pDays) => {
    var typeX = this.state.typeX
    var preValue = data[i].target
    var fx = exist(e) && exist(e.target) ? e.target.selectionStart : 0
    var nx = parseFloat(exist(e) && exist(e.target) ? e.target.value.replace(/,/g, '') : e)
    if((preValue===0 || preValue===undefined) && nx.toString().length===2) nx = nx/10
    if (isNaN(nx)) nx = ''
    var tl = nx.toString().length
    if(tl%3===1) fx++

    data[i].target = nx
    data[i].complete = this.setProgress(data[i].target, data[i].performance)

    if(typeX!=='quantity2') {
      data = await this.updateTarget(data, i, typeX)
      await this.setState({projects: data})
    }
    if(typeX==='quantity2') await this.changeComplete(data[i].complete, data, i, pDays)

    this.projectsBodyMap(this.state.projects, pDays)

    if(exist(e) && exist(e.target)) {
      const textarea = document.getElementById(`target${i}`);
      if(textarea) textarea.setSelectionRange(fx, fx);
    }

    this.setState({saveNeed: true})
  }

  updateTarget = async (data, i, typeX) => {
    var wbsArray = data.map(({ wbs }) => wbs)
    var lx = data[i].wbs.split('.')

    var lxl = lx.length
    for(var z=0; z<lxl; z++) {
        lx.pop()
        var wArrX = lx.toString().replaceAll(',','.')
        var ix = wbsArray.indexOf(wArrX)
        if(ix!==-1) {
          var level = data[ix].level
          data[ix].target = await this.getSubSumTarget(wArrX, data, level)
          data[ix].complete = await this.setProgress(data[ix].target, data[ix].performance)
        }
    }
    return data
  }

  getSubSumTarget = (wbs, data, level) => { // یافتن زیر سطح ها و جمع اعداد
    var wbsDot  = wbs + '.'
    var subNumArray = []
    for(var a=0; a<data.length; a++) {
        if(data[a].target && data[a].wbs.substring(0, wbsDot.length) === wbsDot && data[a].level === level+1) {
            subNumArray.push( data[a].target )
        }
    }
    // console.log(subNumArray)
    var sum = subNumArray.reduce((a, b) => a + b, 0)
    return sum
  }

  changePerformance = async (e, data, i, pDays) => {
    var typeX = this.state.typeX
    var preValue = data[i].performance
    var fx = exist(e) && exist(e.target) ? e.target.selectionStart : 0
    var nx = parseFloat(exist(e) && exist(e.target) ? e.target.value.replace(/,/g, '') : e)
    if((preValue===0 || preValue===undefined) && nx.toString().length===2) nx = nx/10
    if (isNaN(nx)) nx = ''
    var tl = nx.toString().length
    if(tl%3===1) fx++

    data[i].performance = nx
    data[i].complete = this.setProgress(data[i].target, data[i].performance)

    data = await this.updatePerformance(data, i, typeX)
    if(typeX==='quantity2') await this.changeComplete(data[i].complete, data, i, pDays)

    await this.setState({projects: data})

    this.projectsBodyMap(this.state.projects, pDays)

    if(exist(e) && exist(e.target)) {
      const textarea = document.getElementById(`performance${i}`);
      if(textarea) textarea.setSelectionRange(fx, fx);
    }

    this.setState({saveNeed: true})
  }

  updatePerformance = async (data, i, typeX) => {
    var wbsArray = data.map(({ wbs }) => wbs)
    var lx = data[i].wbs.split('.')
    var lxl = lx.length
    for(var z=0; z<lxl; z++) {
        lx.pop()
        var wArrX = lx.toString().replaceAll(',','.')
        var ix = wbsArray.indexOf(wArrX)
        if(ix!==-1) {
          var level = data[ix].level
          var pfc = await this.getSubSumPerformance(wArrX, data, level, typeX)
          data[ix].performance = pfc!==Infinity ? pfc : data[ix].performance
          if(typeX==='quantity1') data[ix].complete = await this.setProgress(data[ix].target, data[ix].performance)
          // console.log(data[ix].target, data[ix].performance, data[ix].complete)
        }
    }
    return data
  }

  getSubSumPerformance = (wbs, data, level, typeX) => { // یافتن زیر سطح ها و جمع اعداد
    var typeX = this.state.typeX
    var wbsDot  = wbs + '.'
    var subNumArray = []
    for(var a=0; a<data.length; a++) {
        // console.log(data[a].performance)
        if(data[a].wbs.substring(0, wbsDot.length) === wbsDot && data[a].level === level+1) {
            var dp = data[a].performance
            var dpx = dp===undefined || dp==='' || dp===null ? 0 : dp
            if(!(typeX==='quantity2' && data[a].checkFix!==true)) subNumArray.push( dpx )
        }
    }
    if(typeX==='quantity1') var sum = subNumArray.reduce((a, b) => a + b, 0)
    if(typeX==='quantity2') var sum = Math.min(...subNumArray)
    // console.log(subNumArray, sum)
    return sum
  }

  setRemaining = (target, performance) => {
    if (isNaN(target)) target = 0
    if (isNaN(performance)) performance = 0
    return target-performance
  }

  setProgress = (target, performance) => {
    if (isNaN(target)) target = 0
    if (isNaN(performance)) performance = 0
    var progress = target===0 ? 0 : (performance*100/target).toFixed(1)
    return Number(progress)
  }

  sumDay = (data, i) => {
    var lx = data[i].wbs.split('.')
    lx.pop()
    var wbsMDot = lx + '.'
    var sumDay = 0
    for(var a=0; a<data.length; a++) { // sum
        if(!data[a].checkSub) {
            var la = data[a].wbs.split('.')
            la.pop()
            var wbsADot = la + '.'
            if(wbsADot===wbsMDot) {
                sumDay = sumDay + data[a].duration
            }
        }
    }

    return sumDay

  }

  changeComplete = async (e, data, i, pDays) => {
    var typeX = this.state.typeX
    var preValue = data[i].complete
    var preValue = Number(preValue)
    
    var fx = e.target ? e.target.selectionStart : 0
    
    var nx = e.target ? e.target.value.replace(' %' , '') : e
    var nx = Number(nx)
    
    if(typeX==='percentage' && (preValue===0 || preValue===undefined) && nx.toString().length===2) nx = nx/10
    var ixn = typeX==='percentage' ? 1000 : 1000000

    if(nx<ixn) {
      // var nx = parseFloat(n)
      // if (isNaN(nx)) nx = 0
      // data[i].complete = nx
      data[i].complete = nx
      var wbsArray = data.map(({ wbs }) => wbs)
      if(e.target) {
        // console.log(111)
          this.setState({
            itemFx: `complete${i}`,
            fx: e.target.selectionStart
          })
      }

      var pDays = this.projectDays(data[0])
      await this.projectsHeaderMap(data[0], pDays)

      data = await this.updateUpperComplete(data, i, wbsArray)
      await this.setState({projects: data, pDays})
      await this.projectsBodyMap(this.state.projects, pDays)
      const textarea = document.getElementById(`complete${i}`);
      if(textarea) textarea.setSelectionRange(fx, fx);
      
      this.setState({saveNeed: true})
    }

  }

  updateUpperComplete = async (data, i, wbsArray) => {
      var lx = data[i].wbs.split('.')
      var lxl = lx.length
      for(var z=0; z<lxl; z++) {
          lx.pop()
          var wArrX = lx.toString().replaceAll(',','.')
          var ix = wbsArray.indexOf(wArrX)
          // console.log(wArrX)
          // console.log(ix)
          if(ix!==-1) {
            var level = data[ix].level
            // console.log(888888, level)

            data[ix].complete = await this.getSubSumComplete(wArrX, data, level, i, ix)
          }
      }

      return data
  }

  getSubSumComplete = (wbs, data, level, i, ix) => { // یافتن زیر سطح ها و جمع اعداد
    var wbsDot  = wbs + '.'
    var subNumArray = []
    var sumDay = 0
    var items = []
    for(var a=0; a<data.length; a++) {
        if(data[a].wbs.substring(0, wbsDot.length) === wbsDot && data[a].level === level+1) {
            sumDay = sumDay + data[a].duration
            items.push( {duration: data[a].duration, complete: data[a].complete} )
            // console.log(items)
        }
    }

    for(var x=0; x<items.length; x++) {
      var dayWeight = items[x].duration / sumDay
      var pw = dayWeight * items[x].complete
      if (isNaN(pw)) pw = 0
      subNumArray.push( pw )
    }
    // console.log(subNumArray)

    var sum = subNumArray.reduce((a, b) => a + b, 0)
    // console.log(sum)
    
    var sumX = Number(sum.toFixed(1)) //< 1 ? Number(sum.toFixed(1)) : Number(sum.toFixed(1))
    // console.log(sumX,  Number(sum.toFixed(1)), sum.toFixed())
    return sumX.toString()
  }

  changeStart = async (e, data, i) => {
    var nx = e.target ? e.target.value : e
    // console.log(e.target.selectionStart)
    var fx = e.target.selectionStart

    if(nx.length===10) {
        if(this.props.lang==='fa') {
            var sd = nx.split('/')
            var yy = sd[0]
            var mm = sd[1]
            var dd = sd[2]
            if(!jalaali.isValidJalaaliDate(yy, mm, dd)) {
              if(Number(yy)>=1300 && Number(yy)<=1450) {
                var days = jalaali.j2d(Number(yy), Number(mm), Number(dd))
                var end = jalaali.d2j(days)
                var yy = end.jy
                var mm = end.jm
                var dd = end.jd
                if(mm.toString().length<2) mm = '0' + mm
                if(dd.toString().length<2) dd = '0' + dd
                nx = yy + "/" + mm + "/" + dd
              } else {
                nx = '1400/01/01'
              }
          }
        } else {
            var sd = nx.split('-')
            var nx = new Date(nx)
            var yy = sd[0]
            var mm = sd[1]
            var dd = sd[2]
            if(nx.toString()==='Invalid Date') {
                if(Number(yy)>=1900 && Number(yy)<=2100) {
                  var days = jalaali.g2d( Number(yy), Number(mm), Number(dd) )
                  var end = jalaali.d2g(days)
                  var yy = end.gy
                  var mm = end.gm
                  var dd = end.gd
                } else {
                  var yy = '2020'
                  var mm = '01'
                  var dd = '01'
                }
            }
            if(mm.toString().length<2) mm = '0' + mm
            if(dd.toString().length<2) dd = '0' + dd
            nx = yy + '-' + mm + '-' + dd
        }

        data = await this.updateUpperDates(data, i, nx)

    } else {
        data[i].finish = ''
        data = await this.updateUpperDates(data, i, '')
    }

    data[i].start = nx
    data[i].startN = this.getDateDays(data[i].start)

    var pDays = this.projectDays(data[0])
    // console.log(pDays)
    await this.projectsHeaderMap(data[0], pDays)

    await this.changeComplete(data[i].complete, data, i, pDays)
    await this.setState({projects: data, pDays})
    this.projectsBodyMap(this.state.projects, pDays)
    // console.log(this.state.projects)

    const textarea = document.getElementById(`start${i}`);
    if(textarea) textarea.setSelectionRange(fx, fx);

    this.setState({saveNeed: true})
  }

  updateUpperStart = async (wbs, data) => {
      var minDate = this.getSubLevelMinDate(wbs, data)
      if(minDate!==Infinity) {
          var yy = minDate.toString().substring(0, 4)
          var mm = minDate.toString().substring(4, 6)
          var dd = minDate.toString().substring(6, 8)
          if(this.props.lang==='fa') {
              var date = yy + '/' + mm + '/' + dd
          } else {
              var date = yy + '-' + mm + '-' + dd
          }
      } else {
          var date = ''
          var yy = ''
          var mm = ''
          var dd = ''
      }
      return { date, yy, mm, dd }
  }
  
  updateUpperFinish = (wbs, data) => {
      var maxDate = this.getSubLevelMaxDate(wbs, data)
      if(maxDate!==-Infinity) {
          var yy = maxDate.toString().substring(0, 4)
          var mm = maxDate.toString().substring(4, 6)
          var dd = maxDate.toString().substring(6, 8)
          if(this.props.lang==='fa') {
              var date = yy + '/' + mm + '/' + dd
          } else {
              var date = yy + '-' + mm + '-' + dd
          }
        } else {
          var date = ''
          var yy = ''
          var mm = ''
          var dd = ''
        }

      return { date, yy, mm, dd }
  }
  
  getSubLevelMinDate = (wbs, data) => { // یافتن زیر سطح ها و مینیمم تاریخ شروع
      var wbsDot  = wbs + '.'
      var subDateArray = []
      for(var a=0; a<data.length; a++) {
          if(data[a].start && data[a].wbs.substring(0, wbsDot.length) === wbsDot) {
              if(this.props.lang==='fa') {
                  subDateArray.push( Number( data[a].start.toString().replaceAll('/','') ) )
              } else {
                  var sx = data[a].start.split('-')
                  var yyx = sx[0]
                  var mmx = sx[1]
                  var ddx = sx[2]
                  subDateArray.push( Number( yyx + mmx + ddx ) )
              }
          }
      }
      var min = Math.min(...subDateArray)
      return min
  }

  getSubLevelMaxDate = (wbs, data) => { // یافتن زیر سطح ها و ماکسیمم تاریخ پایان
      var wbsDot  = wbs + '.'
      var subDateArray = []
      for(var a=0; a<data.length; a++) {
          if(data[a].finish && data[a].wbs.substring(0, wbsDot.length) === wbsDot) {
              if(this.props.lang==='fa') {
                  subDateArray.push( Number( data[a].finish.toString().replaceAll('/','') ) )
              } else {
                  var sx = data[a].finish.split('-')
                  var yyx = sx[0]
                  var mmx = sx[1]
                  var ddx = sx[2]
                  subDateArray.push( Number( yyx + mmx + ddx ) )
              }
          }
      }
      var max = Math.max(...subDateArray)
      return max
  }

  finishDate = (start, day) => {
    if(day>0) {
      if(this.props.lang==='fa') start = this.toMiladi(start)
      var date = new Date(start)
      date.setDate(date.getDate() + day - 1)
  
      var yy = date.getFullYear()
      var mm = date.getMonth() + 1
      var dd = date.getDate()
  
      if(mm.toString().length<2) mm = '0' + mm
      if(dd.toString().length<2) dd = '0' + dd
  
      if(this.props.lang==='fa') {
        date = this.toShamsi( yy + '-' + mm + '-' +  dd )
      } else {
        date = yy + '-' + mm + '-' +  dd
      }
    } else {
      var date = ''
    }

    return date
  }

  toShamsi = (MDate) => {
    var sd = MDate.split('-')
    if(sd.length!==3) sd=['2020', '01', '01']
    var yy = sd[0]>2050 || sd[0]<1900  || sd[0]==='' ? '2020' : sd[0]
    var mm = sd[1] - 1
    var dd = sd[2]
    // console.log(sd.length)
    var shd = jalaali.toJalaali(new Date(Number(yy), Number(mm), Number(dd)))
    if(shd.jm.toString().length<2) shd.jm = '0' + shd.jm
    if(shd.jd.toString().length<2) shd.jd = '0' + shd.jd
    var shDate = shd.jy + "/" + shd.jm + "/" + shd.jd

    return shDate
  }

  toMiladi = (shDate) => {
    var syy = shDate.substring(0, 4)
    var smm = shDate.substring(5, 7)
    var sdd = shDate.substring(8, 10)

    var mb = jalaali.toGregorian(Number(syy), Number(smm), Number(sdd))
    
    if(mb.gm.toString().length<2) mb.gm = '0' + mb.gm
    if(mb.gd.toString().length<2) mb.gd = '0' + mb.gd

    var MiDate = mb.gy + "-" + mb.gm + "-" + mb.gd

    return MiDate
  }

  onToggleDeleteTask = async (projects, i) => {
    if(projects) {
      this.setState({
        toggleDeleteTask: !this.state.toggleDeleteTask,
        projectX: projects,
        taskX: projects[i],
        tIndex: i
      })
    } else {
      this.setState({
        toggleDeleteTask: !this.state.toggleDeleteTask,
      })
    }
  }

  onToggleNewImage = async (task, i) => {
    const {projects, allProjects, pIndex} = this.state
    console.log(projects, allProjects, pIndex, task, i)

    if(task) {
      this.setState({
        toggleNewImage: !this.state.toggleNewImage,
        taskX: task,
        tIndex: i,
        imgArray : [],
        imageArray : [],
        selectImgErr:'',
        savingImage:false,
        editingImage:false,
        imageComment: '',
        imgNull: true,
      })
    } else {
      this.setState({
        toggleNewImage: !this.state.toggleNewImage,
        pImageData:null,
        pImageDataX:null,
        imgArray : [],
        imageArray : [],
        imageComment: '',
        imgNull: false,
      })
    }
  }

  // getImage = async (image, im, projects, i) => {
  //   this.setState({ gettingImages:true })
  //   await axios.post(`${serverURL}/image/getProjectImage`, { id: image.id })
  //   .then(async res => {
  //       // console.log(1818, res.data)
  //       // this.state.imageArray.push(res.data)
  //       projects[i].image[im].imageDataX = res.data.xImageData ? res.data.xImageData : ''
  //       this.setState({
  //         projects,
  //         imageX : projects[i].image[im],
  //         pImageDataX: projects[i].image[im].imageDataX,
  //         gettingImages: false
  //       })
  //       // console.log(1212 ,projects[i].image[im].imageDataX )
  //       if(res.data !== 'item not found') this.mapImg([projects[i].image[im].imageDataX])
  //   })
  // }

  onImg = async (task, im, projects, i) => {
    var imgList = this.imgMap(task, im, projects, i)
    var image = projects[i].image[im]

    await this.setState({
      dateNX: task.image[im].dateN,
      imageX: '',
      pImageData: image.imageData,
      pImageId: image.id,
      pImageIndex: im,
      imgListX: imgList,
    })

    var img = image.imageDataX ? image.imageDataX : image.imageData
    this.mapImg([img])
    // if(!image.imageDataX) this.getImage(image, im, projects, i)

    this.setState({
      imageX: task.image[im],
      imageComment: task.image[im].comment
    })
    // console.log(this.state.imageX)

  }

  imgMap = (task, im, projects, i) => {
    // console.log('task: ', task)
    // console.log('im: ', im)
    // console.log('projects: ', projects)
    // console.log('i: ', i)
    // var dateNX = task.image[im].dateN
    var imgList = task.image.map (
      (item, ix) => (
        <img key={ix}
            className={`btnShadow`}
            style={{objectFit: 'cover', width:'50px', height:'50px', borderRadius:'3px', margin:'8px', border:im===ix ? '2px solid red' : '', padding:'0px'}}
            // src={ itemImgX.imageData }
            src={`https://www.pix.shiningpage.com/project/small/${projects[0]._id}-${item.dateN}.jpeg`}
            alt={`image ${ix}`}
            onClick={() => this.onImg(task, ix, projects, i)}
        />
      )
    )
    return imgList
  }

  onToggleImageShow = async (task, im, projects, i) => {
    if(task) {
      // console.log(this.state)
      // console.log(projects)
      var imgList = this.imgMap(task, im, projects, i)
      // console.log(task, im)
      this.setState({
        toggleImageShow: !this.state.toggleImageShow,
        dateNX: task.image[im].dateN,
        imgListX: imgList,
        taskX: task,
        tIndex: i,
      })
      this.onImg(task, im, projects, i)
    } else {
      this.setState({
        toggleImageShow: !this.state.toggleImageShow,
      })
    }

  }

  onToggleEditImage = async () => {
    console.log(this.state)
    this.setState({
      toggleEditImage: !this.state.toggleEditImage,
      imgArray: [this.state.imageX],
      imageArray: [this.state.imageX.imageData],
      selectImgErr:'',
      savingImage:false,
      editingImage:false,
      imageComment: '',
      isFile: true,
    })
    const {projects, tIndex, pImageIndex, pImageId, pImageData, pImageDataX, imageComment} = this.state
    await this.onImg(projects[tIndex], pImageIndex, projects, tIndex)
    this.setState({ isFile: false })
    console.log(1000, projects[tIndex])
  }

  onToggleDeleteImage = async () => {
    this.setState({
      toggleDeleteImage: !this.state.toggleDeleteImage,
    })
  }

  onDeleteImage = async () => {
    this.setState({
      deletingImage: true,
    })
    // console.log(this.state.pImageData)
    
    // await axios.post(`${serverURL}/image/deleteProjectImage`, { id: this.state.pImageId })
    
    const {projects, tIndex, pImageIndex, dateNX, pImageId, pImageData, pImageDataX, imageComment} = this.state
    projects[tIndex].image.splice(pImageIndex, 1)
    
    pixDelete({dest: destB + "/" + projects[0]._id + "-" + dateNX + ".jpeg"})
    pixDelete({dest: destS + "/" + projects[0]._id + "-" + dateNX + ".jpeg"})
    // var imgList = this.imgMap(projects[tIndex], pImageIndex, projects, tIndex)
    this.setState({
      deletingImage: false,
      toggleDeleteImage: false,
      toggleImageShow: false,
    })
    // this.onImg(projects[tIndex], pImageIndex, projects, tIndex)
    await this.setState({ projects })
    await this.onSave()
  }

  onToggleUnAccess = async () => {
    this.setState({
      toggleUnAccess: !this.state.toggleUnAccess
    })
  }

  onToggleAccess = async (data, i) => {
    if(data) {
        // data[i].dxId = i
        this.setState({
          toggleAccess: !this.state.toggleAccess,
          allProjects: data,
          projectDX: data[i],
          pIndex: i
        })
        this.userAccessMap(data, i)
    } else {
        this.setState({
          toggleAccess: !this.state.toggleAccess,
          userAccessList: []
        })
        // this.userAccessMap([])
        this.searchMemberMap([])
    }

  }

  onAddUser = async (user) => {
    // console.log(user)
    const {projectDX, allProjects, pIndex} = this.state
    await this.searchMemberMap([])
    this.setState({
      n:0,
      searchData: [],
      searchMember: [],
    })

    var project = allProjects[pIndex]
    // console.log(project)
    var pAccess = project.access
    var pUserArr = []
    for(var i=0; i<pAccess.length; i++) {
      pUserArr.push(pAccess[i].userId)
    }
    // console.log(555, pUserArr)

    if(!pUserArr.includes(user._id)) {
      var newUser = {
        userId: user._id,
        user,
        view: true,
        edit: false
      }
      project.access.push(newUser)

      var userAccess = []
      for(var a=0; a<project.access.length; a++) {
        var ur = {
          userId: project.access[a].userId,
          view: project.access[a].view,
          edit: project.access[a].edit,
        }
        userAccess.push(ur)
      }

      var data = {
        projectId: project._id,
        access: userAccess,
      }

      // console.log(111, data)
      await axios.post(`${serverURL}/project/updateAccess`, data)
      this.setState({allProjects})
      this.userAccessMap(allProjects, pIndex)
      this.projectsMap(allProjects)
    }

  }

  onToggleDeleteProject = async (data, i) => {
    // console.log(data)
    if(data) {
        // data[i].dxId = i
        this.setState({
          toggleDeleteProject: !this.state.toggleDeleteProject,
          projectDX: data[i],
          pIndex: i,
        })
    } else {
        this.setState({
          toggleDeleteProject: !this.state.toggleDeleteProject,  
        })
    }

  }

  onDeleteProject = async (projectDX) => {
    this.setState({ deletingProject: true })
    console.log(88, projectDX)

    var projects = this.dataUncompress([projectDX])
    // console.log(projects)

    for(var i=0; i<projects.length; i++) {
      var imageArray = projects[i].image
      for(var x=0; x<imageArray.length; x++) {
        var dateNX = imageArray[x].dateN
        console.log(dateNX)
        pixDelete({dest: destB + "/" + projectDX._id + "-" + dateNX + ".jpeg"})
        pixDelete({dest: destS + "/" + projectDX._id + "-" + dateNX + ".jpeg"})
      }
    }

    var info = {
      projectId: projectDX._id,
    }
    await axios.post(`${serverURL}/project/deleteProject`, info).then( async res => {});
    const { allProjects, pIndex } = this.state
    allProjects.splice(pIndex, 1)

    this.setState({ deletingProject: false })
    this.onToggleDeleteProject()

    this.setState({allProjects})
    this.projectsMap(allProjects)
  }

  onDeleteTask = async (data, i) => {
    this.setState({ deletingTask: true })

    // console.log(data[i])
    var imageArray = data[i].image
    for(var x=0; x<imageArray.length; x++) {
      var imageId = imageArray[x].id
      // console.log(imageId)
      await axios.post(`${serverURL}/image/deleteProjectImage`, { id: imageId })
    }

    var wy = data[i].wbs.split('.')

    var itemX = {}
    itemX.duration = data[i].duration
    itemX.complete = data[i].complete

    var d = {
      target: {
        value: 0
      }
    }
    await this.changeDuration(d, data, i)

    var dataCompress = this.dataCompress(data)
    
    var subX = this.getSub(wy, dataCompress) // آرایه فعالیتهای همسطج
    var array = subX.array // آرایه همسطح ها
    var sx = subX.sx // ایندکس انتخاب شده در آرایه
    var item = array.splice(sx, 1) // انتخاب شده

    var dataUncompress = this.dataUncompress(dataCompress)
    
    // console.log(sx, itemX, dataUncompress[i-1])

    if(array.length===0) {
      dataUncompress[i-1].duration = itemX.duration
      dataUncompress[i-1].complete = itemX.complete
      var dx = {
        target: {
          value: itemX.duration
        }
      }
      await this.changeDuration(dx, dataUncompress, i-1)
    }

    if(i===dataUncompress.length) {
      var pDays = this.projectDays(dataUncompress[0])
      await this.setState({projects: dataUncompress, pDays})
      this.projectsBodyMap(this.state.projects, pDays)  
      this.setState({ saveNeed: true })
      // console.log(1)
    } else {
      await this.trueTable(dataUncompress, i)
      // console.log(2)

    }

    await this.onSave()

    this.setState({
      deletingTask: false,
      toggleDeleteTask: false,
    })

  }

  onNewTask = async (data, i) => {

    // console.log(data[i])
    for(var a=i; a<data[i].iLast+1; a++) {
      data[a].action=false
    }

    var dataCompress = this.dataCompress(data)

    var item = [{
      taskName: '',
      duration: 1,
      start: data[i].start,
      startN: data[i].startN,
      finish: data[i].start,
      finishN: data[i].startN,
      target: this.state.typeX==='quantity2' ? data[i].target : 0,
      checkFix: this.state.typeX==='quantity2' ? true : false,
      checkSub: true,
      collapse: true,
      hidden: false,
      action: true,
      complete:'0',
      image: [],
      sub: []
    }]

    if(data[i].checkSub) {
        var wy = data[i+1].wbs.split('.')
        var subX = this.getSub(wy, dataCompress) // آرایه فعالیتهای همسطج
        var array = subX.array // آرایه همسطح ها
        var sx = 0 // ایندکس انتخاب شده در آرایه
    } else {
        var wy = data[i].wbs.split('.')
        var subX = this.getSub(wy, dataCompress) // آرایه فعالیتهای همسطج
        var array = subX.array // آرایه همسطح ها
        var sx = subX.sx+1 // ایندکس انتخاب شده در آرایه
    }

    if(wy.length===1) {}
    else if(wy.length===2) dataCompress[Number(wy[0])-1].sub.splice(sx, 0, item[0])
    else if(wy.length===3) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub.splice(sx, 0, item[0])
    else if(wy.length===4) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub.splice(sx, 0, item[0])
    else if(wy.length===5) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub.splice(sx, 0, item[0])
    else if(wy.length===6) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub.splice(sx, 0, item[0])
    else if(wy.length===7) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-1].sub.splice(sx, 0, item[0])
    else if(wy.length===8) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-1].sub[Number(wy[6])-1].sub.splice(sx, 0, item[0])
    else if(wy.length===9) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-1].sub[Number(wy[6])-1].sub[Number(wy[7])-1].sub.splice(sx, 0, item[0])
    else if(wy.length===10)dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-1].sub[Number(wy[6])-1].sub[Number(wy[7])-1].sub[Number(wy[8])-1].sub.splice(sx, 0, item[0])

    var dataUncompress = this.dataUncompress(dataCompress)

    await this.trueTable(dataUncompress, i)
  }

  onNewProject = async (type, item) => {
    var today = this.today()
    var todayT = today.dateT
    var todayN = today.dateN
    // console.log(item)

    if(type==='copy') {

      var dataUncompress = this.dataUncompress([item])

      for(var a=0; a<dataUncompress.length; a++) {
          if(a===0) {
            dataUncompress[a]._id = undefined
            dataUncompress[a].taskWidth = item.taskWidth
            dataUncompress[a].comment = ''
            dataUncompress[a].access = []
            dataUncompress[a].type = item.type
            dataUncompress[a].taskName = item.taskName + ' (Copy)'
          }
          dataUncompress[a].complete = '0'
          dataUncompress[a].duration = 1
          dataUncompress[a].start = todayT
          dataUncompress[a].finish = todayT
          dataUncompress[a].checkSub = true
          dataUncompress[a].collapse = true
          dataUncompress[a].hidden = false
          dataUncompress[a].action = false
          dataUncompress[a].image = []
          dataUncompress[a].sub = []
          if(item.type!=='percentage') {
            dataUncompress[a].target = 0
            dataUncompress[a].performance = 0
          }
      }

      var dataCompress = this.dataCompress(dataUncompress)
      var project = dataCompress[0]

      this.onGoTo(0)

    } else {
  
      var project = {
        userId: this.props.mainUser._id,
        type,
        taskName: '',
        comment: '',
        duration: 1,
        start: todayT,
        // startN: todayN,
        finish: todayT,
        // finishN: todayN,
        checkSub: true,
        collapse: true,
        hidden: false,
        action: false,
        complete:'0',
        access:[],
        image: [],
        sub:[{
          taskName: '',
          checkFix: type==='quantity2' ? true : false,
          duration: 1,
          start: todayT,
          // startN: todayN,
          finish: todayT,
          // finishN: todayN,
          checkSub: true,
          collapse: true,
          hidden: false,
          action: false,
          complete:'0',
          image: [],
          sub: []
        }],
      }

    }

    var allProjects = this.state.allProjects
    allProjects.unshift(project)
    var dataUncompress = this.dataUncompress([project])
    await this.setState({
      projects: dataUncompress,
      pIndex: 0,
      projectComment:''
    })
    await this.onSave()//'new'
  }

  today = () => {
    var isoDateTime = new Date()
    var localDate = isoDateTime.toLocaleDateString()
    var localDateArray = localDate.split('/')

    if(this.props.lang==='fa') {
      var shd = jalaali.toJalaali(Number(localDateArray[2]), Number(localDateArray[0]), Number(localDateArray[1]))
      if(shd.jm.toString().length<2) shd.jm = '0' + shd.jm
      if(shd.jd.toString().length<2) shd.jd = '0' + shd.jd
      var dateT = shd.jy+'/'+shd.jm+'/'+shd.jd
      var dateN = jalaali.j2d(Number(shd.jy), Number(shd.jm), Number(shd.jd))

    } else {
      // console.log(localDateArray)
      var yy = localDateArray[2]
      var mm = localDateArray[0]
      var dd = localDateArray[1]

      if(mm.length<2) mm = '0' + mm
      if(dd.length<2) dd = '0' + dd
      var dateT = yy + '-' + mm + '-' + dd
      var dateN = jalaali.g2d(Number(yy), Number(mm), Number(dd))
    }

    return {dateT, dateN}
  }

  actionCheck = async () => {
      var data = this.state.projects
      if(this.state.projectAction) {
          for(var a=0; a<data.length; a++) {
            data[a].action=false
            data[a].toggleSelect=false
            data[a].lastSelectedId=null
            data[a].toggleDelete=false
          }
          await this.setState({
              projects: data,
              projectAction: false,
              wbsAction: ''
          })
          var pDays = this.projectDays(data[0])
          this.projectsBodyMap(this.state.projects, pDays)
      }
  }

  onMore =  async (data, i) => { // یافتن زیر سطح ها و عملیات دیگر
      console.log(data)
      data[i].toggleDelete=false
      var wbsDot  = data[i].wbs + '.'

      for(var a=0; a<data.length; a++) {
          // console.log(wbsDot)
          if(data[a].wbs.substring(0, wbsDot.length) === wbsDot) {
              data[a].action=true
              var last = a
          } else {
              data[a].action=false
          }

          data[a].toggleSelect=false
      }

      data[i].toggleSelect=true
      data[i].action=true

      var iLast = last ? last : i
      if(iLast<data.length) {
        if(data[iLast+1] && data[iLast+1].level!==1) {
          data[i].downAllow = true
          data[i].iNext = iLast + 1
        }
      }
      data[i].iLast = iLast

      if(data[i].level === 1) {
        if(data[i-1]) data[i].upAllow = true
        if(data[iLast+1]) data[i].downAllow = true
      } else {
        if(data[i].level <= data[i-1].level) data[i].forwardAllow = true
        if(data[i].level > 2) data[i].backwardAllow = true
        if(data[i-1].level !== 1) data[i].upAllow = true
      }

      if(i > 1) {
        data[i].deleteAllow = true
      } else {
        data[i].deleteAllow = false
      }

      await this.setState({
          projects: data,
          projectAction: true,
          wbsAction: data[i].wbs
      })
      var pDays = this.projectDays(this.state.projects[0])
      this.projectsBodyMap(this.state.projects, pDays)
  }

  getSub = (wy, dataCompress) => {
    // console.log(wy)
    // console.log(dataCompress)
    var wl = wy.length
    if(wl===1) {
      var array = dataCompress
      var sx = Number(wy[0])-1
    } else if(wl===2) {
      var array = dataCompress[Number(wy[0])-1].sub
      var sx = Number(wy[1])-1
    } else if(wl===3) {
      var array = dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub
      var sx = Number(wy[2])-1
    } else if(wl===4) {
      var array = dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub
      var sx = Number(wy[3])-1
    } else if(wl===5) {
      var array = dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub
      var sx = Number(wy[4])-1
    } else if(wl===6) {
      var array = dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub
      var sx = Number(wy[5])-1
    } else if(wl===7) {
      var array = dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-1].sub
      var sx = Number(wy[6])-1
    } else if(wl===8) {
      var array = dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-1].sub[Number(wy[6])-1].sub
      var sx = Number(wy[7])-1
    } else if(wl===9) {
      var array = dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-1].sub[Number(wy[6])-1].sub[Number(wy[7])-1].sub
      var sx = Number(wy[8])-1
    } else if(wl===10) {
      var array = dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-1].sub[Number(wy[6])-1].sub[Number(wy[7])-1].sub[Number(wy[8])-1].sub
      var sx = Number(wy[9])-1
    }

    return {array, sx}

  }

  onMoveForward = async (data, i) => {
    var dataCompress = this.dataCompress(data)
    
    var wy = data[i].wbs.split('.')
    var subX = this.getSub(wy, dataCompress) // آرایه فعالیتهای همسطج
    var array = subX.array // آرایه همسطح ها
    var sx = subX.sx // ایندکس انتخاب شده در آرایه
    var item = array.splice(sx, 1) // انتخاب شده
    var px = array[sx-1].sub.length // item position

    if(wy.length===1) {}
    else if(wy.length===2) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-2].sub.splice(px, 0, item[0])
    else if(wy.length===3) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-2].sub.splice(px, 0, item[0])
    else if(wy.length===4) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-2].sub.splice(px, 0, item[0])
    else if(wy.length===5) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-2].sub.splice(px, 0, item[0])
    else if(wy.length===6) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-2].sub.splice(px, 0, item[0])
    else if(wy.length===7) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-1].sub[Number(wy[6])-2].sub.splice(px, 0, item[0])
    else if(wy.length===8) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-1].sub[Number(wy[6])-1].sub[Number(wy[7])-2].sub.splice(px, 0, item[0])
    else if(wy.length===9) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-1].sub[Number(wy[6])-1].sub[Number(wy[7])-1].sub[Number(wy[8])-2].sub.splice(px, 0, item[0])
    else if(wy.length===10)dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-1].sub[Number(wy[6])-1].sub[Number(wy[7])-1].sub[Number(wy[8])-1].sub[Number(wy[9])-2].sub.splice(px, 0, item[0])

    var dataUncompress = this.dataUncompress(dataCompress)

    this.trueTable(dataUncompress, i)
  }

  onMoveBackward = async (data, i) => {
    var dataCompress = this.dataCompress(data)
    
    var wy = data[i].wbs.split('.')
    var subX = this.getSub(wy, dataCompress) // آرایه فعالیتهای همسطج
    var array = subX.array // آرایه همسطح ها
    var sx = subX.sx // ایندکس انتخاب شده در آرایه
    var item = array.splice(sx, 1) // انتخاب شده

    var al = array.length
    for(var a=sx; a<al; a++) {
      var subItem = subX.array.splice(sx, 1)
      item[0].sub.push(subItem[0])
    }

    if(wy.length===1) {}
    else if(wy.length===2) {}
    else if(wy.length===3) dataCompress[Number(wy[0])-1].sub.splice(Number(wy[1]), 0, item[0])
    else if(wy.length===4) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub.splice(Number(wy[2]), 0, item[0])
    else if(wy.length===5) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub.splice(Number(wy[3]), 0, item[0])
    else if(wy.length===6) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub.splice(Number(wy[4]), 0, item[0])
    else if(wy.length===7) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub.splice(Number(wy[5]), 0, item[0])
    else if(wy.length===8) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-1].sub.splice(Number(wy[6]), 0, item[0])
    else if(wy.length===9) dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-1].sub[Number(wy[6])-1].sub.splice(Number(wy[7]), 0, item[0])
    else if(wy.length===10)dataCompress[Number(wy[0])-1].sub[Number(wy[1])-1].sub[Number(wy[2])-1].sub[Number(wy[3])-1].sub[Number(wy[4])-1].sub[Number(wy[5])-1].sub[Number(wy[6])-1].sub[Number(wy[7])-1].sub.splice(Number(wy[8]), 0, item[0])

    var dataUncompress = this.dataUncompress(dataCompress)

    this.trueTable(dataUncompress, i)
  }

  onMoveUp = async (data, i) => {
    var dataCompress = this.dataCompress(data)

    var wy = data[i].wbs.split('.')
    var subX = this.getSub(wy, dataCompress) // آرایه فعالیتهای همسطج
    var array = subX.array // آرایه همسطح ها
    var sx = subX.sx // ایندکس انتخاب شده در آرایه
    var item = array.splice(sx, 1) // انتخاب شده

    var run = true
    for(var a=i; a>0 && run; a--) {
      if(!data[a-1].hidden) {
        var wyUp = data[a-1].wbs.split('.')
        run = false
      }
    }

    var subXUp = this.getSub(wyUp, dataCompress) // آرایه فعالیتهای همسطج
    var sxUp = subXUp.sx // ایندکس انتخاب شده در آرایه

    // console.log(dataCompress, sx, item[0], wyUp.length)
    if     (wy.length===1) dataCompress.splice(sx-1, 0, item[0])

    else if(wyUp.length===2) dataCompress[Number(wyUp[0])-1].sub.splice(sxUp, 0, item[0])
    else if(wyUp.length===3) dataCompress[Number(wyUp[0])-1].sub[Number(wyUp[1])-1].sub.splice(sxUp, 0, item[0])
    else if(wyUp.length===4) dataCompress[Number(wyUp[0])-1].sub[Number(wyUp[1])-1].sub[Number(wyUp[2])-1].sub.splice(sxUp, 0, item[0])
    else if(wyUp.length===5) dataCompress[Number(wyUp[0])-1].sub[Number(wyUp[1])-1].sub[Number(wyUp[2])-1].sub[Number(wyUp[3])-1].sub.splice(sxUp, 0, item[0])
    else if(wyUp.length===6) dataCompress[Number(wyUp[0])-1].sub[Number(wyUp[1])-1].sub[Number(wyUp[2])-1].sub[Number(wyUp[3])-1].sub[Number(wyUp[4])-1].sub.splice(sxUp, 0, item[0])
    else if(wyUp.length===7) dataCompress[Number(wyUp[0])-1].sub[Number(wyUp[1])-1].sub[Number(wyUp[2])-1].sub[Number(wyUp[3])-1].sub[Number(wyUp[4])-1].sub[Number(wyUp[5])-1].sub.splice(sxUp, 0, item[0])
    else if(wyUp.length===8) dataCompress[Number(wyUp[0])-1].sub[Number(wyUp[1])-1].sub[Number(wyUp[2])-1].sub[Number(wyUp[3])-1].sub[Number(wyUp[4])-1].sub[Number(wyUp[5])-1].sub[Number(wyUp[6])-1].sub.splice(sxUp, 0, item[0])
    else if(wyUp.length===9) dataCompress[Number(wyUp[0])-1].sub[Number(wyUp[1])-1].sub[Number(wyUp[2])-1].sub[Number(wyUp[3])-1].sub[Number(wyUp[4])-1].sub[Number(wyUp[5])-1].sub[Number(wyUp[6])-1].sub[Number(wyUp[7])-1].sub.splice(sxUp, 0, item[0])
    else if(wyUp.length===10)dataCompress[Number(wyUp[0])-1].sub[Number(wyUp[1])-1].sub[Number(wyUp[2])-1].sub[Number(wyUp[3])-1].sub[Number(wyUp[4])-1].sub[Number(wyUp[5])-1].sub[Number(wyUp[6])-1].sub[Number(wyUp[7])-1].sub[Number(wyUp[8])-1].sub.splice(sxUp, 0, item[0])

    var dataUncompress = this.dataUncompress(dataCompress)

    this.trueTable(dataUncompress, i)
  }

  onMoveDown = async (data, i) => {
    var dataCompress = this.dataCompress(data)

    var wy = data[i].wbs.split('.')
    var subX = this.getSub(wy, dataCompress) // آرایه فعالیتهای همسطج
    var array = subX.array // آرایه همسطح ها
    var sx = subX.sx // ایندکس انتخاب شده در آرایه
    var item = [array[sx]] // انتخاب شده

    var last = data[i].iLast
    var next = data[last+1]
    var nextPlus = data[last+2]



    if(next.checkSub) {
        if(next.collapse) {
          var wyDown = nextPlus.wbs.split('.')
          var subXDown = this.getSub(wyDown, dataCompress) // آرایه فعالیتهای همسطج
          var sxDown = subXDown.sx // ایندکس انتخاب شده در آرایه
   
          // var l = nextPlus.level-2
          // var correct = wyDown.splice(l, 1, `${Number(wyDown[l])-1}`)
        } else {
          var wyDown = next.wbs.split('.')
          var subXDown = this.getSub(wyDown, dataCompress) // آرایه فعالیتهای همسطج
          var sxDown = subXDown.sx+1 // ایندکس انتخاب شده در آرایه
        }
    } else {
       var wyDown = next.wbs.split('.')
       var subXDown = this.getSub(wyDown, dataCompress) // آرایه فعالیتهای همسطج
       var sxDown = subXDown.sx+1 // ایندکس انتخاب شده در آرایه

    }

    if     (wy.length===1) dataCompress.splice(sx+2, 0, item[0])
    else if(wyDown.length===2) dataCompress[Number(wyDown[0])-1].sub.splice(sxDown, 0, item[0])
    else if(wyDown.length===3) dataCompress[Number(wyDown[0])-1].sub[Number(wyDown[1])-1].sub.splice(sxDown, 0, item[0])
    else if(wyDown.length===4) dataCompress[Number(wyDown[0])-1].sub[Number(wyDown[1])-1].sub[Number(wyDown[2])-1].sub.splice(sxDown, 0, item[0])
    else if(wyDown.length===5) dataCompress[Number(wyDown[0])-1].sub[Number(wyDown[1])-1].sub[Number(wyDown[2])-1].sub[Number(wyDown[3])-1].sub.splice(sxDown, 0, item[0])
    else if(wyDown.length===6) dataCompress[Number(wyDown[0])-1].sub[Number(wyDown[1])-1].sub[Number(wyDown[2])-1].sub[Number(wyDown[3])-1].sub[Number(wyDown[4])-1].sub.splice(sxDown, 0, item[0])
    else if(wyDown.length===7) dataCompress[Number(wyDown[0])-1].sub[Number(wyDown[1])-1].sub[Number(wyDown[2])-1].sub[Number(wyDown[3])-1].sub[Number(wyDown[4])-1].sub[Number(wyDown[5])-1].sub.splice(sxDown, 0, item[0])
    else if(wyDown.length===8) dataCompress[Number(wyDown[0])-1].sub[Number(wyDown[1])-1].sub[Number(wyDown[2])-1].sub[Number(wyDown[3])-1].sub[Number(wyDown[4])-1].sub[Number(wyDown[5])-1].sub[Number(wyDown[6])-1].sub.splice(sxDown, 0, item[0])
    else if(wyDown.length===9) dataCompress[Number(wyDown[0])-1].sub[Number(wyDown[1])-1].sub[Number(wyDown[2])-1].sub[Number(wyDown[3])-1].sub[Number(wyDown[4])-1].sub[Number(wyDown[5])-1].sub[Number(wyDown[6])-1].sub[Number(wyDown[7])-1].sub.splice(sxDown, 0, item[0])
    else if(wyDown.length===10)dataCompress[Number(wyDown[0])-1].sub[Number(wyDown[1])-1].sub[Number(wyDown[2])-1].sub[Number(wyDown[3])-1].sub[Number(wyDown[4])-1].sub[Number(wyDown[5])-1].sub[Number(wyDown[6])-1].sub[Number(wyDown[7])-1].sub[Number(wyDown[8])-1].sub.splice(sxDown, 0, item[0])

    var item = array.splice(sx, 1) // انتخاب شده

    var dataUncompress = this.dataUncompress(dataCompress)

    this.trueTable(dataUncompress, i)
  }

  onSave = async (type) => {
    const { mainUser, lang } = this.props
    this.setState({
      savingProjects : true
    })

    var data = this.state.projects

    for(var i=0; i<data.length; i++) {
      var mx = data[i].image
      for(var m=0; m<mx.length; m++) {
        mx[m].imageDataX = undefined
      }
    }

    if(lang==='fa') {
      for(var a=0; a<data.length; a++) {
        data[a].start = await this.toMiladi(data[a].start)
        data[a].finish = await this.toMiladi(data[a].finish)
      }
    }

    var dataCompress = this.dataCompress(data)[0]
    var userAccess = []
    var access = dataCompress.access
    for(var x=0; x<access.length; x++) {
      var ur = {
        userId: access[x].userId,
        view: access[x].view,
        edit: access[x].edit,
      }
      userAccess.push(ur)
    }

    var userProject = dataCompress.userId === mainUser._id ? true : false
    var info = {
      userId: userProject ? mainUser._id : dataCompress.userId,
      projectId: dataCompress._id,
      type: dataCompress.type,
      taskName: dataCompress.taskName,
      taskWidth: this.state.taskWidth,
      comment: this.state.projectComment,
      target: dataCompress.target,
      performance: dataCompress.performance,
      duration: dataCompress.duration,
      start: dataCompress.start,
      finish: dataCompress.finish,
      complete: dataCompress.complete,
      collapse: dataCompress.collapse,
      sub: dataCompress.sub,
      image: dataCompress.image,
      access: userAccess,
    }

    // if(type==='new') info.userId = mainUser._id
    await axios.post(`${serverURL}/project/saveProject`, info).then( async res => {
      var px = res.data
      const { allProjects, pIndex } = this.state

      allProjects[pIndex]._id = px._id
      allProjects[pIndex].userId = px.userId
      allProjects[pIndex].taskName = px.taskName
      allProjects[pIndex].taskWidth = px.taskWidth
      allProjects[pIndex].checkFix = px.checkFix
      allProjects[pIndex].comment = px.comment
      allProjects[pIndex].target = px.target
      allProjects[pIndex].performance = px.performance
      allProjects[pIndex].duration = px.duration
      allProjects[pIndex].start = px.start
      allProjects[pIndex].finish = px.finish
      allProjects[pIndex].complete = px.complete
      allProjects[pIndex].collapse = px.collapse
      allProjects[pIndex].sub = px.sub
      allProjects[pIndex].image = px.image
      allProjects[pIndex].access = type!=='new' ? dataCompress.access : []

      this.setState({allProjects})
      this.projectsMap(allProjects)

      this.setState({ saveNeed: false })

    });

    var dataUncompress = this.dataUncompress([dataCompress])

    if(lang==='fa') {
      for(var a=0; a<dataUncompress.length; a++) {
        dataUncompress[a].start = await this.toShamsi(dataUncompress[a].start)
        dataUncompress[a].finish = await this.toShamsi(dataUncompress[a].finish)
      }
    }

    var pDays = this.projectDays(dataUncompress[0])
    await this.setState({ projects: dataUncompress })
    await this.projectsBodyMap(this.state.projects, pDays)
    await this.setTaskHeight(this.state.projects, pDays)

    this.setState({ savingProjects : false })
  }

  makeTask = (p, task, i, l) => {
    var task = {
        _id: task._id,
        userId: task.userId,
        level: l,
        wbs: i ? `${p + '.' + i}` : `${p}`,
        wx: i,

        type: task.type,
        target: task.target,
        performance: task.performance,

        taskName: task.taskName,
        checkFix: task.checkFix,
        duration: task.duration,
        start: task.start,
        startN: task.startN,
        finish: task.finish,
        finishN: task.finishN,
        // startDay: task.startDay,
        // finishDay: task.finishDay,
        checkSub: task.sub.length>0 ? true : false,
        collapse: task.collapse,
        hidden: task.hidden,
        action: false,
        complete:task.complete,
        sub: [],
        image: task.image ? task.image : [],
        access: task.access,
    }
    return task
  }

  weekStart = (date, index, lang) => {
    // console.log(index, date)

    if(lang==='fa') {

      var sd = date.split('/')
      var yy = sd[0]
      var mm = sd[1]
      var dd = sd[2]
  
      var daysN = jalaali.j2d( Number(yy), Number(mm), Number(dd) )

      index = index===6 ? -1 : index
      var sn = index + 1
      var sx = daysN - sn
  
      var dx = jalaali.d2j(sx)
      var yy = dx.jy
      var mm = dx.jm
      var dd = dx.jd
      if(mm.toString().length<2) mm = '0' + mm
      if(dd.toString().length<2) dd = '0' + dd
      var nx = yy + "/" + mm + "/" + dd

    } else {

      var sd = date.split('-')
      var yy = sd[0]
      var mm = sd[1]
      var dd = sd[2]
  
      var daysN = jalaali.g2d( Number(yy), Number(mm), Number(dd) )

      index = index===0 ? 7 : index
      var sn = index - 1
      var sx = daysN - sn

      var dx = jalaali.d2g(sx)
      var yy = dx.gy
      var mm = dx.gm
      var dd = dx.gd
      if(mm.toString().length<2) mm = '0' + mm
      if(dd.toString().length<2) dd = '0' + dd
      var nx = yy + "-" + mm + "-" + dd

    }

    // console.log(date, index, nx)
    return {nx, sx}
  }

  weekFinish = (date, index, lang) => {
    // console.log(index, date)
    if(lang==='fa') {

      var sd = date.split('/')
      var yy = sd[0]
      var mm = sd[1]
      var dd = sd[2]
  
      var daysN = jalaali.j2d( Number(yy), Number(mm), Number(dd) )

      index = index===6 ? -1 : index
      var sn = 5 - index
      var sx = daysN + sn

      var dx = jalaali.d2j(sx)
      var yy = dx.jy
      var mm = dx.jm
      var dd = dx.jd
      if(mm.toString().length<2) mm = '0' + mm
      if(dd.toString().length<2) dd = '0' + dd
      var nx = yy + "/" + mm + "/" + dd

    } else {

      // index = index<3 ? index : index + 7
      var sd = date.split('-')
      var yy = sd[0]
      var mm = sd[1]
      var dd = sd[2]
  
      var daysN = jalaali.g2d( Number(yy), Number(mm), Number(dd) )

      index = index===0 ? 7 : index
      var sn = 7 - index
      var sx = daysN + sn

      var dx = jalaali.d2g(sx)
      var yy = dx.gy
      var mm = dx.gm
      var dd = dx.gd
      if(mm.toString().length<2) mm = '0' + mm
      if(dd.toString().length<2) dd = '0' + dd
      var nx = yy + "-" + mm + "-" + dd

    }

    // console.log(nx, sx)
    return {nx, sx}
  }

  getDay = (date, lang) => {
    if(lang==='fa') {
      var sd = date.split('/')
      var yy = sd[0]
      var mm = sd[1]
      var dd = sd[2]
      var md = jalaali.toGregorian(Number(yy), Number(mm), Number(dd))
      var mDate = new Date(md.gy, md.gm - 1, md.gd)
      // console.log(md, mDate)
    } else {
      var sd = date.split('-')
      var yy = sd[0]
      var mm = sd[1]
      var dd = sd[2]
      var mDate = new Date(yy, mm - 1, dd)
    }

    var dayIndex = mDate.getDay()
    var dayLetter = this.dayLetter(dayIndex, lang)
    // console.log(mDate, dayIndex, dayLetter)

    return { dayLetter, dayIndex }
  }

  dayLetter = (x, lang) => {
    switch(x){
      case 1: x = lang==='fa' ? 'د' : 'Mon'; break;
      case 2: x = lang==='fa' ? 'س' : 'Tue'; break;
      case 3: x = lang==='fa' ? 'چ' : 'Wed'; break;
      case 4: x = lang==='fa' ? 'پ' : 'Thu'; break;
      case 5: x = lang==='fa' ? 'ج' : 'Fri'; break;
      case 6: x = lang==='fa' ? 'ش' : 'Sat'; break;
      case 0: x = lang==='fa' ? 'ی' : 'Sun'; break;
      default: x = '';
    }
    return x
  }

  dataUncompress = (dataCompress) => {
    var p = []
    for(var i1=0; i1<dataCompress.length; i1++) {
        var task = this.makeTask(i1+1, dataCompress[i1], '', 1)
        p.push(task)
        var sub1 = dataCompress[i1].sub
        if(sub1.length>0) {
            for(var i2=0; i2<sub1.length; i2++) {
                var task = this.makeTask(i1+1, sub1[i2], `${i2+1}`, 2)
                p.push(task)
                var sub2 = sub1[i2].sub
                if(sub2.length>0) {
                    for(var i3=0; i3<sub2.length; i3++) {
                        var task = this.makeTask(i1+1, sub2[i3], `${i2+1}.${i3+1}`, 3)
                        p.push(task)
                        var sub3 = sub2[i3].sub
                        if(sub3.length>0) {
                            for(var i4=0; i4<sub3.length; i4++) {
                                var task = this.makeTask(i1+1, sub3[i4], `${i2+1}.${i3+1}.${i4+1}`, 4)
                                p.push(task)
                                var sub4 = sub3[i4].sub
                                if(sub4.length>0) {
                                    for(var i5=0; i5<sub4.length; i5++) {
                                        var task = this.makeTask(i1+1, sub4[i5], `${i2+1}.${i3+1}.${i4+1}.${i5+1}`, 5)
                                        p.push(task)
                                        var sub5 = sub4[i5].sub
                                        if(sub5.length>0) {
                                            for(var i6=0; i6<sub5.length; i6++) {
                                                var task = this.makeTask(i1+1, sub5[i6], `${i2+1}.${i3+1}.${i4+1}.${i5+1}.${i6+1}`, 6)
                                                p.push(task)
                                                var sub6 = sub5[i6].sub
                                                if(sub6.length>0) {
                                                    for(var i7=0; i7<sub6.length; i7++) {
                                                        var task = this.makeTask(i1+1, sub6[i7], `${i2+1}.${i3+1}.${i4+1}.${i5+1}.${i6+1}.${i7+1}`, 7)
                                                        p.push(task)
                                                        var sub7 = sub6[i7].sub
                                                        if(sub7.length>0) {
                                                            for(var i8=0; i8<sub7.length; i8++) {
                                                                var task = this.makeTask(i1+1, sub7[i8], `${i2+1}.${i3+1}.${i4+1}.${i5+1}.${i6+1}.${i7+1}.${i8+1}`, 8)
                                                                p.push(task)
                                                                var sub8 = sub7[i8].sub
                                                                if(sub8.length>0) {
                                                                    for(var i9=0; i9<sub8.length; i9++) {
                                                                        var task = this.makeTask(i1+1, sub8[i9], `${i2+1}.${i3+1}.${i4+1}.${i5+1}.${i6+1}.${i7+1}.${i8+1}.${i9+1}`, 9)
                                                                        p.push(task)
                                                                        var sub9 = sub8[i9].sub
                                                                        if(sub9.length>0) {
                                                                          for(var i10=0; i10<sub9.length; i10++) {
                                                                              var task = this.makeTask(i1+1, sub9[i10], `${i2+1}.${i3+1}.${i4+1}.${i5+1}.${i6+1}.${i7+1}.${i8+1}.${i9+1}.${i10+1}`, 10)
                                                                              p.push(task)
                                                                              // var sub9 = sub9[i10].sub
                                                                          }
                                                                      }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
    }

    return p
  }
  
  dataCompress = (data) => {
    // console.log(data)
    var p = []
    for(var i=0; i<data.length; i++) {
        var wbs = wbs
        var wy = data[i].wbs.split('.')
        
        if(wy.length===1) p.push(data[i])
        else if(wy.length===2) p[Number(wy[0]-1)].sub.push(data[i])
        else if(wy.length===3) p[Number(wy[0]-1)].sub[Number(wy[1]-1)].sub.push(data[i])
        else if(wy.length===4) p[Number(wy[0]-1)].sub[Number(wy[1]-1)].sub[Number(wy[2]-1)].sub.push(data[i])
        else if(wy.length===5) p[Number(wy[0]-1)].sub[Number(wy[1]-1)].sub[Number(wy[2]-1)].sub[Number(wy[3]-1)].sub.push(data[i])
        else if(wy.length===6) p[Number(wy[0]-1)].sub[Number(wy[1]-1)].sub[Number(wy[2]-1)].sub[Number(wy[3]-1)].sub[Number(wy[4]-1)].sub.push(data[i])
        else if(wy.length===7) p[Number(wy[0]-1)].sub[Number(wy[1]-1)].sub[Number(wy[2]-1)].sub[Number(wy[3]-1)].sub[Number(wy[4]-1)].sub[Number(wy[5]-1)].sub.push(data[i])
        else if(wy.length===8) p[Number(wy[0]-1)].sub[Number(wy[1]-1)].sub[Number(wy[2]-1)].sub[Number(wy[3]-1)].sub[Number(wy[4]-1)].sub[Number(wy[5]-1)].sub[Number(wy[6]-1)].sub.push(data[i])
        else if(wy.length===9) p[Number(wy[0]-1)].sub[Number(wy[1]-1)].sub[Number(wy[2]-1)].sub[Number(wy[3]-1)].sub[Number(wy[4]-1)].sub[Number(wy[5]-1)].sub[Number(wy[6]-1)].sub[Number(wy[7]-1)].sub.push(data[i])
        else if(wy.length===10)p[Number(wy[0]-1)].sub[Number(wy[1]-1)].sub[Number(wy[2]-1)].sub[Number(wy[3]-1)].sub[Number(wy[4]-1)].sub[Number(wy[5]-1)].sub[Number(wy[6]-1)].sub[Number(wy[7]-1)].sub[Number(wy[8]-1)].sub.push(data[i])
    }

    return p
  }

  getBackColor = (x) => {
    switch (x) {
        case 1: x = '#000000'; break;
        case 2: x = '#7a7a7a'; break;
        case 3: x = '#a8a8a8'; break;
        case 4: x = '#dddddd'; break;
        case 5: x = '#f2f2f2'; break;
        default: x = '';
    }
    return x
  }

  getSelectedBackColor = (x) => {
    switch (x) {
        case 1: x = '#006bb7'; break;
        case 2: x = '#0094ff'; break;
        case 3: x = '#5ebcff'; break;
        case 4: x = '#a8daff'; break;
        case 5: x = '#d8efff'; break;
        case 6: x = '#edf7ff'; break;
        default: x = '';
    }
    return x
  }

  getColor = (x) => {
    switch (x) {
        case 1: x = '#ffffff'; break;
        case 2: x = '#ffffff'; break;
        case 3: x = '#000000'; break;
        case 4: x = '#000000'; break;
        case 5: x = '#000000'; break;
        case 6: x = '#000000'; break;
        case 7: x = '#000000'; break;
        case 8: x = '#000000'; break;
        case 9: x = '#000000'; break;
        case 10: x = '#000000'; break;
        default: x = '';
    }
    return x
  }

  saveCheck = () => {
    if(this.state.saveNeed) {
      this.onToggleSaveCheck()
    } else {
      this.onToggleProjectView()
    }
  }

  onToggleSaveCheck = () => {
    this.setState({
      toggleSaveCheck: !this.state.toggleSaveCheck,
    })
  }

  onSaveAndClose = async () => {
    this.setState({
      toggleSaveAndClose: true,
    })
    await this.onSave()
    this.setState({
      toggleProjectView: false,
      toggleSaveCheck: false,
      toggleSaveAndClose: false,
    })
  }

  onToggleProjectView = async () => {
    this.setState({
      toggleProjectView: !this.state.toggleProjectView,
      toggleSaveCheck: false,
      saveNeed: false
    })
  }

  projectDays = (project) => {
    if(project.finish) {
        const {mainUser, lang} = this.props
        // console.log(project.start, project.startX)
        var startX = project.startX ? project.startX : project.start
        var finishX = project.finishX ? project.finishX : project.finish
        var startDay = this.getDay(startX, lang)
        var finishDay = this.getDay(finishX, lang)
        var pwStart = this.weekStart(startX, startDay.dayIndex, lang)
        var pwFinish = this.weekFinish(finishX, finishDay.dayIndex, lang)
        // console.log(startDay)
        var sn = pwStart.sx
        var fn = pwFinish.sx
        var difDate = fn - sn //(new Date(pwFinish)-new Date(pwStart))/60000/(60*24)
        // console.log(3333, pwStart, pwFinish, difDate)
        var pDays = []
        var d = 6
        var shd = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
        var mid = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
        for(var n=sn; n<fn+1; n++) {
          d++
          var z = d%7
          pDays.push({
            ws: z===0 ? this.getDateText(sn) : '',
            sn: sn++,
            dn: lang==='fa' ? shd[z] : mid[z],
            z: z,
          })
        }
    } else {
        pDays = []
    }
    // console.log(pDays)
    return pDays
  }

  onUndo = async () => {
    const {allProjects, pIndex} = this.state
    const {mainUser, lang} = this.props
    var project = allProjects[pIndex]
    var pDays = this.projectDays(project)
    await this.projectsHeaderMap(project, pDays)
    var dataUncompress = this.dataUncompress([project])
    // console.log(dataUncompress)

    for(var a=0; a<dataUncompress.length; a++) {
      if(lang==='fa') {
        dataUncompress[a].start = await this.toShamsi(dataUncompress[a].start)
        dataUncompress[a].finish = await this.toShamsi(dataUncompress[a].finish)
      }
      dataUncompress[a].startN = await this.getDateDays(dataUncompress[a].start)
      dataUncompress[a].finishN = await this.getDateDays(dataUncompress[a].finish)
    }

    await this.setState({
      projects: dataUncompress,
      projectComment: project.comment,
      pIndex,
      pDays
    })
    await this.projectsBodyMap(this.state.projects, pDays)
    await this.setTaskHeight(this.state.projects, pDays)
    this.setState({ saveNeed: false })

  }

  setTaskHeight = async () => {
    const {projects, pDays} = this.state
    for(var p=0; p<projects.length; p++) {
      var etask = document.getElementById(`taskName${p}`)
      if(etask) {
        let hx = etask.scrollHeight;
        projects[p].height = hx
      }
    }

    await this.setState({ projects })
    await this.projectsBodyMap(this.state.projects, pDays)
  }

  projectView = async (project, i) => {
    const { allProjects, pIndex } = this.state
    var pUser = allProjects[i].user
    const {mainUser, lang} = this.props
    var userProject = project[0].userId === mainUser._id ? true : false
    var pEdit = userProject ? true : project[0].edit
    var pDays = this.projectDays(project[0])
    await this.setState({
      projectsBody:[],
      taskWidth: project[0].taskWidth,
      projectComment: project[0].comment,
      toggleNote: exist(project[0].comment) ? true : false
    })
    this.onToggleProjectView()
    await this.projectsHeaderMap(project[0], pDays)
    var dataUncompress = this.dataUncompress(project)
    // console.log(dataUncompress)
    for(var a=0; a<dataUncompress.length; a++) {
      if(lang==='fa') {
        dataUncompress[a].start = await this.toShamsi(dataUncompress[a].start)
        dataUncompress[a].finish = await this.toShamsi(dataUncompress[a].finish)
      }
      dataUncompress[a].startN = await this.getDateDays(dataUncompress[a].start)
      dataUncompress[a].finishN = await this.getDateDays(dataUncompress[a].finish)
    }

    await this.setState({
      projectX: project[0],
      q2Target: project[0].target ? project[0].target.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '',
      projects: dataUncompress,
      typeX: project[0].type,
      pIndex: i,
      pDays,
      pEdit,
      pUser
    })
    await this.projectsBodyMap(this.state.projects, pDays)
    await this.setTaskHeight(this.state.projects, pDays)
  }

  projectsMap = async (x) => {
    // console.log(x)
    var moreBtn, bizType, typeP, typeQ1, typeQ2, userProject, user, accessUsers, accessBtn, userImage, mainGenderX, viewBtn, deleteBtn
    const {w, end} = this.state
    const {rtl, setLT, lang, mainUser} = this.props
    var dataRv = x.map (
        (item, i) => (
            // console.log(item.user),
            typeP = item.type==='percentage' ? true : false,
            typeQ1 = item.type==='quantity1' ? true : false,
            typeQ2 = item.type==='quantity2' ? true : false,
            userProject = item.userId===mainUser._id ? true : false,
            bizType = userProject ? mainUser.businessType : item.user.businessType,
            mainGenderX = userProject
              ? mainUser.genderValue===0 ? female : male
              : item.user.genderValue===0 ? female : male,
            userImage = (
              <img
                  className = {`C${userProject ? mainUser.fc : item.user.fc}`}//btnShadowX
                  style={{objectFit: 'contain', width:'30px', height:'30px', borderRadius:bizType>0 ? '3px' : '100px', border:`1px solid #ffffff40`, cursor: userProject ? '' : 'pointer'}}
                  src={userProject
                      ? exist(mainUser.profileIndex)
                            ? `https://www.pix.shiningpage.com/whoraly/profile/small/${mainUser._id}-${mainUser.profileIndex}.jpeg`
                            : mainGenderX
                      : exist(item.user.profileIndex)
                            ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item.user._id}-${item.user.profileIndex}.jpeg`
                            : mainGenderX
                  }
                  alt="user image"
                  onClick={() => item.userId===mainUser._id ? '' : this.onToggleProfile(item.user)}
              />
            ),
            accessBtn = (
              <div className='center btnShadow' onClick={() => this.onToggleAccess(x, i)}
                  style={{width:'', height:'30px', margin: '0px 20px', padding:'0px 10px', fontSize:'13px', fontWeight:450,
                        borderRadius:'100px', alignItems:'center', border:'2px solid #00CCFF', color:'#00CCFF'}}>
                  <img
                      style={{width:'20px', height:'20px'}}
                      src={require('../assets/images/other/login.png')}
                      alt="access image"
                  />&nbsp;
                  {setLT.access}
              </div>
            ),
            deleteBtn = (
              <div className='center btnShadow'
                  style={{margin:'0px 15px', fontSize:'13px', fontWeight:450, width:'70px', height:'30px', padding:'2px 5px 2px', borderRadius:'100px', border: '2px #ff0000 solid', color:'#ff0000', alignItems:'center'}}
                  onClick={() => this.onToggleDeleteProject(x, i)}
              >
                  {setLT.delete}
              </div>
            ),
            viewBtn = (
              <div className='center btnShadow'
                  style={{margin:'0px 15px', fontSize:'13px', fontWeight:450, width:'150px', height:'30px', padding:'2px 5px 2px', borderRadius:'100px', border: '2px #ffd400 solid', color:'#ffd400', alignItems:'center'}}
                  onClick = {() => this.projectView([item], i)}
              >
                  {setLT.showDetails}
              </div>
            ),
            accessUsers = userProject
              ? item.access.map (
                  (userX, i) => (
                    console.log(user),
                    user = userX.user,
                    <div key={i} className={`b${user.fc!==7 ? user.fc : 11} btnShadow`} style={{margin:'5px', borderWidth:userX.edit ? '2px' : '0px', borderRadius:user.businessType>0 ? '3px' : '100px'}}>
                        <img
                            className={`C${user.fc} btnShadow`}
                            style={{objectFit: 'contain', width:"35px", height:"35px", borderRadius:user.businessType>0 ? '3px' : '100px', border:user.fc!==7 ? '1px solid #ffffff40' : '1px solid #ffffff99', margin:'4px', padding:'1px'}}
                            src={ exist(user.profileIndex)
                              ? `https://www.pix.shiningpage.com/whoraly/profile/small/${user._id}-${user.profileIndex}.jpeg`
                              : user.genderValue===0 ? female : male
                            }
                            alt={user.username}
                            onClick={() => this.onToggleProfile(userX.user)}
                        />
                    </div>
                  )
                )
              : [],
            item.startX = lang==='fa' ? this.toShamsi(item.start) : item.start,
            item.finishX = lang==='fa' ? this.toShamsi(item.finish) : item.finish,
            moreBtn = (
              <div className={`dropdown ${rtl ? 'dropstart' : 'dropend'} sticky-top`} style={{alignItems:'center', margin:'-10px 0px 0px', visibility: userProject ? '' : 'hidden'}}>
                  <button className='center btnShadow waves-effect waves-light btn-large'
                      type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" data-bs-offset="-110,5" data-bs-auto-close="auto"
                      style={{width:'30px', height:'30px', padding:'0px', margin:'0px', color:'#000000', border: '2px solid #59b9ff99', backgroundColor:'', borderRadius:'100px'}}
                  >
                      <HiOutlineDotsHorizontal color='#ffffff' size={20}/>
                  </button>
                  <div className="dropdown-menu sticky-top" aria-labelledby="dropdownMenuButton" //data-bs-auto-close="inside"
                      style={{width:w<300 ? '170px' : '250px', fontSize:'13px', padding:'0px', margin:'-10px 0px 0px', backgroundColor:'#ffffff99', zIndex:'2'}}>
                      <div className='d-flex backBlur sticky-top' style={{fontWeight:450, padding:'0px', alignItems:'center', flexDirection:'column', backgroundColor:'#ffffff99'}}>
                          <div className='d-flex txt underline' onClick = {() => this.onNewProject('copy', item)}
                              style={{padding:'15px 10px', alignItems:'flex-start'}}>
                              <FaFolderPlus style={{width:'25px', fontSize:'22px', color:'#00a843', margin:'-5px 0px 0px'}}/>&nbsp;
                              Create a new project based on this project
                          </div>
                          <hr style={{width:'90%', margin:'0px 0px 20px'}}/>
                          {deleteBtn}
                          <br/>
                      </div>
                  </div>
              </div>
            ),
            <div key={i} className='animated fadeIn' style={{width:w<s ? '100%' : '400px', padding:'5px', margin:'5px', border: item.taskName ? '' : '4px solid #ffd400'}}>
                <div className="cardShadow"
                      style={{width:'100%', height:'100%', padding:'10px', backgroundColor:userProject ? (item.complete===100 ? '#058001' : '#000000') : (item.complete===100 ? '#05ad00' : '#00194c'), color:'#ffffff', borderRadius:'5px'}}>
                    <div className='d-flex' style={{width:'100%', justifyContent:'space-between'}}>
                        <div className='d-flex' style={{marginBottom:'10px'}}>
                            {userImage}&nbsp;&nbsp;
                            {item.taskName}
                        </div>
                        {typeP && <FaPercent/>}
                        {typeQ1 && <MdDashboardCustomize style={{fontSize:'20px'}}/>}
                        {typeQ2 && <AiOutlineCodeSandbox style={{fontSize:'20px'}}/>}
                    </div>
                    <div style={{marginBottom:'5px', textAlign:'center', direction:'ltr'}}>{item.startX} - {item.finishX}</div>
                    <div className='center' style={{direction:'ltr'}}>
                        <div style={{margin:'0px 30px', fontSize:typeP ? '18px' : '', fontWeight:typeP ? 500 : '', }}>{item.complete + ' %'}</div>
                        <div style={{margin:'0px 30px'}}>{item.duration + ' d'}</div>
                    </div>
                    {item.type!=='percentage' &&
                      <div style={{fontSize:'18px', fontWeight:500, margin:'10px 0px -5px', textAlign:'center', direction:'ltr'}}>
                        {item.target ? item.target.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0} - {item.performance ? item.performance.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0}
                      </div>
                    }
                    <div className='center' style={{margin:'20px 0px 0px'}}>
                        {viewBtn}
                    </div>
                    {userProject
                      ?
                      <div className='center' style={{margin:'30px 0px 20px', alignItems:'center'}}>
                          {accessBtn}
                          <div className='d-flex' style={{flexWrap:'wrap'}}>
                              {accessUsers.reverse()}
                          </div>
                      </div>
                      :
                      <div className='center' style={{margin:'30px 0px 20px', alignItems:'center'}}>
                          <div className='d-flex' style={{flexWrap:'wrap', color:'#00e5ff'}}>
                              {setLT.access} : &nbsp;&nbsp;&nbsp;
                              <span>✓ {setLT.view}</span>
                              {item.edit && <div style={{width:'15px'}}></div>}
                              {item.edit && <span>✓ {setLT.edit}</span>}
                          </div>
                      </div>
                    }
                </div>
                <div className='d-flex sticky-top' style={{width:'100%', marginTop:'-30px', color:'#ffffff', padding:'0px 10px', justifyContent:'space-between'}}>
                    {moreBtn}
                    {i+1}
                </div>
            </div>
        )
    )

    this.setState({
      projectsList: dataRv,
    })
  }
  
  projectsHeaderMap = (x, pDays) => {
    const {w, end, gantScale, taskWidth} = this.state
    const {rtl, setLT, lang, mainUser} = this.props
    // console.log(x)
    var typeP = x.type==='percentage' ? true : false
    const titleStyle = {height:'100%', padding:'0px 5px', marginBottom:'0px', fontSize:'14px', fontWeight:400, flexDirection:'column', position:'sticky', alignItems:'center'}
    var x = [
      // {
      //   C: '',
      //   WBS: '',
      //   taskName: '',
      //   duration: '',
      //   start: '',
      //   finish: '',
      //   complete: '',
      // },
      {
        C: 'C',
        WBS: 'WBS',
        taskName: setLT.taskName,
        target: setLT.orderQty,
        performance: setLT.performance,
        remaining: setLT.remaining,
        duration: setLT.duration,
        start: setLT.start,
        finish: setLT.finish,
        complete: setLT.complete,
        top:0
      },
      {
        C: '',
        WBS: '',
        taskName: '',
        target: '',
        performance: '',
        remaining: '',
        duration: `( ${setLT.day} )`,
        start: `${lang==='fa' ? 'yyyy/mm/dd' : 'yyyy-mm-dd'}`,
        finish: `${lang==='fa' ? 'yyyy/mm/dd' : 'yyyy-mm-dd'}`,
        complete: '( % )',
        top:21
      },
    ]
    var dataRv = x.map (
        (item, i) => (
            <tr key={i} className='' style={{width:'100%', fontWeight:400}}>
                <th rowSpan={i===0 ?'2' : ''} style={{top:item.top, minWidth:'50px', textAlign:'center', verticalAlign: 'middle', padding:'0px 4px', display: i===0 ? '' : 'none'}}><div className='center disable-select' style={titleStyle}>{item.C}</div></th>
                <th rowSpan={i===0 ?'2' : ''} style={{top:item.top, minWidth:'80px', textAlign:'center', verticalAlign: 'middle',  padding:'0px 4px', display: i===0 ? '' : 'none'}}><div className='center disable-select' style={titleStyle}>{item.WBS}</div></th>
                <th rowSpan={i===0 ?'2' : ''} style={{top:item.top, minWidth:`${taskWidth}px`, textAlign:'center', verticalAlign: 'middle', padding:'0px 4px', display: i===0 ? '' : 'none'}}>
                    <div className='d-flex disable-select' style={{height:'100%', padding:'0px 5px', marginBottom:'0px', fontSize:'14px', fontWeight:400, position:'sticky', alignItems:'center', justifyContent:''}}>
                        {item.taskName}&nbsp;&nbsp;
                        <div className='d-flex' style={{direction:'ltr'}}>
                            <BsFillCaretLeftFill style={{width:'30px', transform:'rotate(0deg)', cursor:'pointer'}}
                                onClick={() => this.onTaskWidth(pDays, rtl ? 10 : -10)}/>
                            <BsFillCaretLeftFill style={{width:'30px', transform:'rotate(180deg)', cursor:'pointer'}}
                                onClick={() => this.onTaskWidth(pDays, rtl ? -10 : 10)}/>
                        </div>
                    </div>
                </th>

                <th rowSpan={i===0 ?'2' : ''} style={{top:item.top, minWidth:'100px', textAlign:'center', verticalAlign: 'middle', padding:'0px 4px', display: typeP ? 'none' : (i===0 ? '' : 'none')}}><div className='center disable-select' style={titleStyle}>{item.target}</div></th>
                <th rowSpan={i===0 ?'2' : ''} style={{top:item.top, minWidth:'100px', textAlign:'center', verticalAlign: 'middle', padding:'0px 4px', display: typeP ? 'none' : (i===0 ? '' : 'none')}}><div className='center disable-select' style={titleStyle}>{item.performance}</div></th>
                <th rowSpan={i===0 ?'2' : ''} style={{top:item.top, minWidth:'100px', textAlign:'center', verticalAlign: 'middle', padding:'0px 4px', display: typeP ? 'none' : (i===0 ? '' : 'none')}}><div className='center disable-select' style={titleStyle}>{item.remaining}</div></th>

                <th style={{minWidth:'60px', textAlign:'center', padding:'0px 4px', top:item.top}}><div className='center disable-select' style={titleStyle}>{item.duration}</div></th>
                <th style={{minWidth:'140px', textAlign:'center', padding:'0px 4px', top:item.top}}><div className='center disable-select' style={titleStyle}>{item.start}</div></th>
                <th style={{minWidth:'140px', textAlign:'center', padding:'0px 4px', top:item.top}}><div className='center disable-select' style={titleStyle}>{item.finish}</div></th>
                <th style={{minWidth:'100px', textAlign:'center', padding:rtl ? '0px 4px 0px 15px' : '0px 15px 0px 4px', top:item.top}}><div className='center disable-select' style={titleStyle}>{item.complete}</div></th>
                { i===0 &&
                  pDays.map (
                    (itemX, ia) => (
                      <th key={ia} colSpan="7" style={{top:item.top, width:'100%', padding:'0px', border:'1px solid #999999', display: itemX.ws ? '' : 'none'}}><div className='' style={{fontSize:'12px', fontWeight:450, textAlign:'center'}}>{itemX.ws}</div></th>
                    )
                  )
                }
                { i===1 &&
                  pDays.map (
                    (itemX, iX, {length, lastIndex = length - 1}) => (
                      <th key={iX} style={{top:item.top, width:'100%', textAlign:'center', padding:'0px', borderRight: lang==='fa' ? (itemX.z===0 ? '1px solid #999999' : '') : (iX === lastIndex ? '1px solid #999999' : ''), borderLeft: lang==='fa' ? (iX === lastIndex ? '1px solid #999999' : '') : (itemX.z===0 ? '1px solid #999999' : '')}}><div className='center' style={{minWidth:gantScale, maxWidth:gantScale, fontSize:'9px'}}>{itemX.dn}</div></th>
                    )
                  )
                }
            </tr>
        )
    )

    this.setState({
      projectsHeader: dataRv,
    })
  }

  projectsBodyMap = async (x, pDays) => {
    const {w, todayN, pEdit, pUser, projectX, q2Target} = this.state
    const {rtl, setLT, lang, mainUser} = this.props
    var comperf, checkFix, remaining, performance, target, imgList, docx, docBox, today, dayOff, bx, cxF, cxUp, cxd, cx, inX, weekStart, startDay, finishDay, addImage, addTask, moveForward, moveBackward, moveUp, moveDown, bColor, fColor, caret, sp, spx, lx, userImage, mainGenderX, moreBtn, deleteBtn, deleteYesBtn, deleteNoBtn
    var typeP = x[0].type==='percentage' ? true : false
    var typeQ1 = x[0].type==='quantity1' ? true : false
    var typeQ2 = x[0].type==='quantity2' ? true : false
    var ic = 0
    var imgH = 50
    var userProject = x[0].userId===mainUser._id ? true : false
    const loaderX = <div className='loader-02' style={{margin: '2px 0px 0px', color:'', transform: rtl ? 'rotate(180deg)' : ''}}></div>
    var dataRv = x.map (
        (item, i) => (
            item.height = item.height ? item.height : "",
            comperf = typeP ? item.complete : this.setProgress(item.target, item.performance),
            remaining = typeP ? '' : this.setRemaining(item.target, item.performance).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
            target = typeP ? '' : item.target ? item.target.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0,
            performance = typeP ? '' : item.performance ? item.performance.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0,
            docx = item.image && item.image.length>0 ? true : false,
            startDay = exist(item.start) ? this.getDay(item.start, lang) : '',
            finishDay = exist(item.finish) ? this.getDay(item.finish, lang) : '',
            weekStart = item.level===1 ? this.weekStart(item.start, startDay.dayIndex, lang) : '',
            bColor = item.action 
                        ? this.getSelectedBackColor(item.level)
                        : (item.checkSub ? this.getBackColor(item.level) : ''),
            fColor = item.checkSub ? this.getColor(item.level) : '',
            sp = item.level===1 ? 20*item.level : 20*(item.level-1),
            spx = sp-20,
            lx = item.level===1 ? 30 : 20,
            caret = (
              <BsFillCaretLeftFill style={{width:'25px', transform: rtl ? `rotate(${item.collapse ? -45 : 0}deg)` : `rotate(${item.collapse ? 225 : 180}deg)`, color:fColor, transition: '0s', cursor:'pointer', backgroundColor:''}}
                                  onClick={() => this.collapse(x, i, pDays)}/>//, display: item.checkSub ? '' : 'none'
            ),
            checkFix = (
              <input checked={item.checkFix} type="checkbox" className='sticky-top' style={{cursor:'pointer', zIndex:'2000'}} onClick={() => this.onCheckFix(x, i, pDays)}/>
            ),
            mainGenderX = userProject
              ? mainUser.genderValue===0 ? female : male
              : pUser.genderValue===0 ? female : male,
            userImage = (
              <div>
                  <img
                      className = {`C${userProject ? mainUser.fc : pUser.fc}`}//btnShadowX
                      style={{objectFit: 'contain', width:'30px', height:'30px', borderRadius:userProject ? (mainUser.businessType>0 ? '3px' : '100px') : (pUser.businessType>0 ? '3px' : '100px'), border:`1px solid #ffffff40`, marginTop:'-5px'}}
                      src={userProject
                        ? exist(mainUser.profileIndex)
                              ? `https://www.pix.shiningpage.com/whoraly/profile/small/${mainUser._id}-${mainUser.profileIndex}.jpeg`
                              : mainGenderX
                        : exist(pUser.profileIndex)
                              ? `https://www.pix.shiningpage.com/whoraly/profile/small/${pUser._id}-${pUser.profileIndex}.jpeg`
                              : mainGenderX
                      }
                      alt="user image"
                      // onClick={() => this.toggleZoomProfileImage()}
                  />
              </div>
            ),
            addTask = (
              <div className='center' style={{width:'100%', marginTop:'0px', cursor:'pointer'}} onClick={() => this.onNewTask(x, i)}>
                  <FcAddRow style={{fontSize:'35px'}}/>
              </div>
            ),
            addImage = (
              <div className='center' style={{width:'100%', marginTop:'-10px', cursor:'pointer'}} onClick={() => this.onToggleNewImage(item, i)}>
                  <RiImageAddFill style={{fontSize:'35px', color:'#59b9ff'}}/>
              </div>
            ),
            moveForward = (
                <button disabled={item.forwardAllow ? false : true}
                    className={`center ${item.forwardAllow ? 'btnShadow' : ''}`}
                    style={{width:'30px', height:'30px', padding:'0px', marginBottom:'15px',
                            color: item.forwardAllow ? '#000000' : '#99999999',
                            border: item.forwardAllow ? '2px solid #59b9ff99' : '2px solid #99999950',
                            borderRadius:'100px', alignItems:'center'}}
                    onClick={() => this.onMoveForward(x, i)}
                >
                    <BiChevronsRight style={{fontSize:'20px', lineHeight:'20px', transform: rtl ? 'rotate(180deg)' : ''}}/>
                </button>
            ),
            moveBackward = (
                <button disabled={item.backwardAllow ? false : true}
                    className={`center ${item.backwardAllow ? 'btnShadow' : ''}`}
                    style={{width:'30px', height:'30px', padding:'0px', marginBottom:'15px',
                            color: item.backwardAllow ? '#000000' : '#99999999',
                            border: item.backwardAllow ? '2px solid #59b9ff99' : '2px solid #99999950',
                            borderRadius:'100px', alignItems:'center'}}
                    onClick={() => this.onMoveBackward(x, i)}
                >
                    <BiChevronsRight style={{fontSize:'20px', lineHeight:'20px', transform: rtl ? '' : 'rotate(180deg)'}}/>
                </button>
            ),
            moveUp = (
                <button disabled={item.upAllow ? false : true}
                    className={`center ${item.upAllow ? 'btnShadow' : ''}`}
                    style={{width:'30px', height:'30px', padding:'0px', marginBottom:'15px',
                            color: item.upAllow ? '#000000' : '#99999999',
                            border: item.upAllow ? '2px solid #59b9ff99' : '2px solid #99999950',
                            borderRadius:'100px', alignItems:'center'}}
                    onClick={() => this.onMoveUp(x, i)}
                >
                    <BiChevronsRight style={{fontSize:'20px', lineHeight:'20px', transform: 'rotate(-90deg)'}}/>
                </button>
            ),
            moveDown = (
                <button disabled={item.downAllow ? false : true}
                    className={`center ${item.downAllow ? 'btnShadow' : ''}`}
                    style={{width:'30px', height:'30px', padding:'0px', marginBottom:'15px',
                            color: item.downAllow ? '#000000' : '#99999999',
                            border: item.downAllow ? '2px solid #59b9ff99' : '2px solid #99999950',
                            borderRadius:'100px', alignItems:'center'}}
                    onClick={() => this.onMoveDown(x, i)}
                >
                    <BiChevronsRight style={{fontSize:'20px', lineHeight:'20px', transform: 'rotate(90deg)'}}/>
                </button>
            ),
            deleteBtn = (
              <button className='center' disabled={item.deleteAllow ? false : true}
                  style={{color: item.deleteAllow ? '#000000' : '#99999999', fontSize:'13px', fontWeight:450, width:'70px', height:'25px', padding:'5px 5px 2px', borderRadius:'3px', border: item.deleteAllow ? '2px solid #FB042F' : '2px solid #99999950', alignItems:'center', cursor:'pointer'}}
                  onClick={() => this.onToggleDeleteTask(x, i)}
              >
                  {setLT.delete}
              </button>
            ),
            moreBtn = (
                <div className='dropdown dropend' style={{paddingTop:'5px'}}>
                    <button disabled={pEdit ? false : true} className='center btnShadow waves-effect waves-light btn-large'
                        type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" data-bs-offset={w<s ? "-5,5" : "-5,5"}
                        style={{width:'30px', height:'30px', padding:'0px', margin:'0px', color:'#000000', border: pEdit ? '2px solid #59b9ff99' : '2px solid #99999999', backgroundColor: item.toggleSelect ? '#59b9ff50' : '', borderRadius:'100px'}}
                        onClick={() => this.onMore(x, i)}>
                        <HiOutlineDotsHorizontal color='' size={20}/>
                    </button>
                    <div className="dropdown-menu sticky-top" aria-labelledby="dropdownMenuButton" //data-bs-auto-close="inside"
                          style={{fontSize:'13px', padding:'0px', margin:'-10px 0px 0px', backgroundColor:'#ffffff99', zIndex:'2'}}>
                        <div className='d-flex backBlur' style={{padding:'10px', alignItems:'center', flexDirection:'column', backgroundColor:'#ffffff99'}}>
                            {addTask}
                            <hr style={{width:'90%', margin:'20px 0px 30px'}}/>
                            <div className='center' style={{width:'120px', height:'120px', alignItems:'center', flexDirection:'column'}}>
                                <div className='center' style={{width:'100%'}}>{moveUp}</div>
                                <div className='center' style={{width:'100%'}}>
                                    {moveBackward}
                                    <div style={{width:'40px', height:'40px'}}></div>
                                    {moveForward}
                                </div>
                                <div className='center' style={{width:'100%'}}>{moveDown}</div>
                            </div>
                            
                            <hr style={{width:'90%', margin:'20px 0px 30px'}}/>
                            {addImage}
                            <hr style={{width:'90%', margin:'30px 0px 10px'}}/>
                            {deleteBtn}
                        </div>
                    </div>
                </div>
            ),//console.log(item.finish),
            imgList = docx
            ? item.image.map (
              (itemImg, im) => (
                <img key={im}
                    className={`btnShadow`}
                    style={{objectFit: 'cover', width:'40px', height:'40px', borderRadius:'3px', margin:'5px 5px 0px', border:'0px solid #99999999', padding:'0px'}}
                    // src={ itemImg.imageData }
                    src={`https://www.pix.shiningpage.com/project/small/${projectX._id}-${itemImg.dateN}.jpeg`}
                    alt={`image ${im}`}
                    onClick={() => this.onToggleImageShow(item, im, x, i)}
                />
              )
            )
            : [],
            docBox = (
              <div className='d-flex' style={{width:i===0 ? '830px' : '750px', height:'50px', marginTop:-imgH, padding:'0px', backgroundColor:'#59b9ff00', position:'absolute', overflow:'scroll'}}>
                {imgList}
              </div>
            ),
            !item.hidden && //////////////////////////////////////////////////////////////
                <tr key={i} className={item.level===1 ? 'sticky-top' : ''} style={{top:'42px'}}>
                    <td className='center' style={{padding:'4px', verticalAlign:'top'}}>
                        {moreBtn}
                    </td>

                    { item.level===1 &&
                      <td colSpan="2" style={{position:'relative', padding:'4px', verticalAlign: 'middle', direction:lang==='fa' ? 'rtl' : ''}} onClick={() => this.actionCheck()}>
                          <div style={{position:'', margin: rtl ? `9px ${spx+4}px -35px 10px` : `9px 10px -35px ${spx+4}px`}}>{userImage}</div>
                          { item.checkSub && <div style={{position:'', margin: rtl ? `9px ${spx+lx}px -30px 10px` : `9px 10px -30px ${spx+lx}px`}}>{caret}</div> }
                          <textarea
                              id={`taskName${i}`}
                              type="text"
                              rows="1"
                              placeholder={setLT.enterProjectName}
                              value={item.taskName}
                              className="form-control"
                              style={{width:'100%', height:item.height, resize: 'none', marginBottom: docx ? imgH : '', padding: rtl ? `6px ${sp+lx}px 6px 12px` : `6px 12px 6px ${sp+lx}px`, backgroundColor:bColor, color:fColor}}
                              onChange={(e) => pEdit ? this.changeTaskName(e, x, i, pDays) : this.onToggleUnAccess()}
                              onFocus={(e) => this.focusTaskName(e, x, i, pDays)}
                          />
                          {docx && docBox}
                      </td>
                    }

                    { item.level!==1 &&
                      <td style={{position:'relative', padding:'4px', verticalAlign: 'middle', direction:'ltr', position:'sticky', right:-4, left:-4, zIndex:'1'}}>
                          { typeQ2 && pEdit && <div style={{position:'', margin: rtl ? `9px 0px -30px 50px` : `9px 0px -30px 50px`}}>{checkFix}</div> }
                          <textarea type="text" rows="1" defaultValue={item.wx} autoComplete="off" disabled={item.checkSub ? true : false}
                            className="form-control sticky-top"
                            style={{width:'100%', height:docx ? item?.height + imgH : item?.height, minHeight: docx ? 40 + imgH : 40, resize: 'none', padding:'6px', textAlign:'left', backgroundColor:bColor, color:fColor, whiteSpace:'nowrap', fontSize: item.level>5 ? '12px' : ''}}
                            onClick={() => this.actionCheck()}
                          />
                      </td>
                    }

                    { item.level!==1 &&
                      <td style={{position:'relative', padding:'4px', verticalAlign: 'middle', direction:lang==='fa' ? 'rtl' : ''}} onClick={() => this.actionCheck()}>
                          { item.checkSub && <div style={{position:'', margin: rtl ? `9px ${spx}px -30px 10px` : `9px 10px -30px ${spx}px`}}>{caret}</div> }
                          <textarea
                              id={`taskName${i}`}
                              type="text"
                              rows="1"
                              value={item.taskName}
                              className="form-control"
                              style={{width:'100%', height:item.height, resize: 'none', marginBottom: docx ? imgH : '', padding: rtl ? `6px ${sp}px 6px 12px` : `6px 12px 6px ${sp}px`, backgroundColor:bColor, color:fColor}}
                              onChange={(e) => pEdit ? this.changeTaskName(e, x, i, pDays) : this.onToggleUnAccess()}
                              onFocus={(e) => this.focusTaskName(e, x, i, pDays)}
                          />
                          {docx && docBox}
                      </td>
                    }

                    <td style={{padding:'4px', verticalAlign: 'middle', direction:'ltr', display: typeP ? 'none' : ''}} onClick={() => this.actionCheck()}>
                        <textarea id={`target${i}`} type="text" rows="1" value={target} autoComplete="off" disabled={typeQ2 ? (item.checkFix ? true : false) : (item.checkSub ? true : false)}
                          className="form-control"
                          style={{width:'100%', height:item.height, resize: 'none', marginBottom: docx ? imgH : '', padding:'6px 3px', textAlign:'center', backgroundColor:item.checkSub ? bColor : item.action ? bColor : '#ffffff', color:fColor, border: !item.checkSub && !item.target && !typeQ2 ? '1px solid red' : ''}}
                          onChange={(e) => pEdit ? this.changeTarget(e, x, i, pDays) : this.onToggleUnAccess()}
                        />
                    </td>
                    <td style={{position:'relative', padding:'4px', verticalAlign: 'middle', display: typeP ? 'none' : ''}} onClick={() => this.actionCheck()}>
                        <textarea id={`performance${i}`} type="text" rows="1" value={performance} autoComplete="off" disabled={typeQ2 ? (item.checkSub && item.checkFix ? true : false) : (item.checkSub ? true : false)}
                          className="form-control"
                          style={{width:'100%', height:item.height, resize: 'none', marginBottom: docx ? imgH : '', padding:'6px 3px', textAlign:'center', backgroundColor:bColor, color:fColor, border: '', direction:'ltr'}}
                          onChange={(e) => pEdit ? this.changePerformance(e, x, i, pDays) : this.onToggleUnAccess()}
                        />
                        <div style={{position:'absolute', width:'90px'}}>
                            <hr className={rtl ? 'right' : 'left'} style={{margin:`-${docx ? 6+imgH : 6}px 1px 0px`, width: `calc(${comperf>=100 ? 100 : comperf}%)`, height:'5px', backgroundColor:comperf>=100 ? '#1ddd00' : '#00CCFF', borderRadius:'0px 0px 3px 3px', transition: '.3s', opacity:'1'}}/>
                        </div>
                    </td>
                    <td style={{padding:'4px', verticalAlign: 'middle', direction:'ltr', display: typeP ? 'none' : ''}} onClick={() => this.actionCheck()}>
                        <textarea id={`remaining${i}`} type="text" rows="1" value={remaining} autoComplete="off" disabled={true}
                          className="form-control"
                          style={{width:'100%', height:item.height, resize: 'none', marginBottom: docx ? imgH : '', padding:'6px 3px', textAlign:'center', backgroundColor:item.checkSub ? bColor : item.action ? bColor : '#ffffff', color:fColor, border: ''}}
                        />
                    </td>


                    <td style={{padding:'4px', verticalAlign: 'middle', direction:'ltr'}} onClick={() => this.actionCheck()}>
                        <textarea id={`duration${i}`} type="text" rows="1" value={item.duration} autoComplete="off" disabled={item.checkSub ? true : false}
                          className="form-control"
                          style={{width:'100%', height:item.height, resize: 'none', marginBottom: docx ? imgH : '', padding:'6px 3px', textAlign:'center', backgroundColor:bColor, color:fColor, border: !item.checkSub ? (!item.duration ? '1px solid red' : '') : ''}}
                          onChange={(e) => pEdit ? this.changeDuration(e, x, i) : this.onToggleUnAccess()}
                        />
                    </td>
                    <td style={{padding:'4px', verticalAlign: 'middle'}} onClick={() => this.actionCheck()}>
                        {<div className='disable-select' style={{position:'', margin: startDay ? '9px 10px -30px 7px' : '', color:fColor}}>{startDay.dayLetter}</div>}
                        <textarea id={`start${i}`} type='text' rows="1" value={item.start} autoComplete="off" disabled={item.checkSub ? true : false}
                          className="form-control"
                          style={{direction:'ltr', width:'100%', height:item.height, resize: 'none', marginBottom: docx ? imgH : '', padding:'6px', textAlign:'right', backgroundColor:bColor, color:fColor, border: !item.checkSub ? (!item.start || !item.finish ? '1px solid red' : '') : ''}}
                          onChange={(e) => pEdit ? this.changeStart(e, x, i) : this.onToggleUnAccess()}
                        />
                    </td>
                    <td style={{padding:'4px', verticalAlign: 'middle'}}>
                        {<div className='disable-select' style={{margin: finishDay ? '9px 10px -30px 7px' : '', color: item.checkSub ? fColor : '#666666'}}>{finishDay.dayLetter}</div>}
                        <textarea type="text" rows="1" value={item.finish} autoComplete="off" disabled={true}
                          className="form-control"
                          style={{direction:'ltr', width:'100%', height:item.height, resize: 'none', marginBottom: docx ? imgH : '', padding:'6px', textAlign:'right', backgroundColor:item.checkSub ? bColor : item.action ? bColor : '#ffffff', color: item.checkSub ? fColor : '#666666'}}
                        />
                    </td>
                    <td style={{position:'relative', padding:'4px 15px 4px 4px', verticalAlign: 'middle', overflow:'hidden'}} onClick={() => this.actionCheck()}>
                        <textarea id={`complete${i}`} type="text" rows="1" value={Number(item.complete) + ' %'} autoComplete="off" disabled={!typeP || item.checkSub ? true : false}
                          className="form-control"
                          style={{width:'100%', height:item.height, resize: 'none', marginBottom: docx ? imgH : '', padding:'6px 3px', textAlign:'center', backgroundColor:item.checkSub ? bColor : item.action ? bColor : '#ffffff', color:fColor, border: item.complete>100 ? '1px solid red' : '', direction:'ltr'}}
                          onChange={(e) => pEdit ? this.changeComplete(e, x, i) : this.onToggleUnAccess()}
                        />
                        <div style={{position:'absolute', width:'79px', height: '5px', bottom:'0px'}}>
                            <hr className='left' style={{margin:`-${docx ? 6+imgH : 6}px 1px 0px`, width: `calc(${item.complete>=100 ? 100 : item.complete}%)`, height:'5px', backgroundColor:item.complete>=100 ? '#1ddd00' : '#00CCFF', color:item.complete>=100 ? '#1ddd00' : '#00CCFF', borderRadius:'0px 0px 20px 20px', transition: '.3s', opacity:'1'}}/>
                        </div>
                    </td>
                    {pDays.map (
                      (itemX, ix) => (
                          dayOff = ['پ', 'ج', 'S'].includes(itemX.dn) ? true : false,
                          today = itemX.sn===todayN ? true : false,
                          inX = itemX.sn>=item.startN && itemX.sn<=item.finishN ? true : false,
                          cx = item.duration * Number(item.complete)/100,
                          cxd = cx.toString().split('.'),
                          cxUp = Math.ceil(cx),
                          cxF = Math.floor(cx),
                          cxd = Number('.' + cxd[1]),
                          ic = inX ? ic + 1 : 0,
                          bx = ic>cxF && ic<=cxUp ? true : false,
                          //console.log(i, ix, inX),
                          <td key={ix} style={{padding:'0px', verticalAlign: 'top', backgroundColor: today ? '#04b80350' : (dayOff ? '#00194C10' : '')}}>
                              <div className="form-control" style={{width:'100%', height:'20px', padding:'0px', marginTop:'13px', backgroundColor: inX ? '' : 'transparent', borderRadius:'2px', border: inX ? (bColor ? '1px solid #000000' : '1px solid #2181DE') : '1px solid #99999900'}}>
                                  <div style={{width:bx ? `${cxd*100}%` : '100%', height:'100%', backgroundColor: inX && ic<=cxUp ? (bColor ? bColor : '#CEE7FA') : '', borderRadius: !bx ? '1px' : '1px 0px 0px 1px'}}></div>
                              </div>
                          </td>
                        )
                      )
                    }
                </tr>
        )
    )

    this.setState({
      projectsBody: dataRv,
    })
  }

  changeUsername = (e) => {
    var tx = toFarsi(e.target.value)
    this.setState({
      searchUsers: e.target ? tx.toLowerCase() : e,
      n:0,
    })
  }

  scrollSearch = async () => {
    this.setState({
        loadingData: true,
    })

    var data = {
        username: this.state.searchUsers,
        n:this.state.n,
        q:listRefreshQty //this.state.w<s ? listRefreshQtySmall : listRefreshQtyBig
    }

    // console.log(res.data)
    await axios.post(`${serverURL}/user/findUser`, data).then( async res => {
      delete res.data.password
      // console.log('nnn', res.data)
      var x2 = res.data
      this.setState(
        (prevState) => ({
          searchData: [...prevState.searchData, ...x2], // اضافه کردن x2 به searchData
          finishData: res.data.length < listRefreshQty, // شرط ساده‌تر
          n: prevState.n + 1, // افزایش مقدار n
        }),
        () => {
          // انجام عملیات وابسته به searchData در callback
          this.searchMemberMap(this.state.searchData);
        }
      );
    });

  }

  searchMemberMap = async (x) => {
    var addUser, countryCode, userCountry, userImage, tableInfo
    const {w, n,} = this.state
    const {rtl, setLT} = this.props
    var dataRv = x.map (
        (item, i) => (
            //console.log(55555555, item),
            userImage = (
                <div>
                    <img
                        className={`C${item.fc>=0 ? item.fc : ''} btnShadow`}
                        style={{objectFit: 'contain', width:"50px", height:"50px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px', cursor:'pointer'}}
                        src={ exist(item.profileIndex)
                            ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item._id}-${item.profileIndex}.jpeg`
                            : item.genderValue===0 ? female : male
                        }
                        alt="user"
                        onClick={() => this.onToggleProfile(item)}
                    />
                </div>
            ),
            countryCode = item.countryCode ? item.countryCode.toLowerCase() : '',
            userCountry = (
              <div className='d-flex' style={{flexDirection:'column', textAlign:rtl ? 'right' : 'left'}}>
                  <div className='d-flex' style={{margin: '0px 0px 5px', alignItems:'center', direction:rtl ? 'rtl' : 'ltr'}}>
                      <span className={`flag-icon flag-icon-${countryCode}`}></span> &nbsp;
                      <div className='d-flex ' style={{fontSize:'12px'}}>{item.country}{item.city && ( ' - ' + item.city)}</div>
                  </div>
                  <div className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap'}}>
                      {item.username
                          ? (
                          <div>
                              <span style={{color:'#bb00f9', fontWeight:'bold'}}>{item.username}</span>&nbsp;
                          </div>
                          )
                          : <span style={{color:'#999999', fontWeight:450}}>{setLT.unknown} ({item.view})</span>
                      }
                  </div>
              </div>
            ),
            addUser = (
              <div className='center btnShadow' onClick={() => this.onAddUser(item)}
                  style={{width:'', height:'25px', margin: w<300 ? '0px' : '0px 20px', padding:'0px 10px', fontSize:'13px', fontWeight:450,
                        borderRadius:'100px', alignItems:'center', border:'2px solid #00CCFF', color:'#00CCFF'}}>
                  <RiUserAddFill style={{fontSize:w<300 ? '25px' : '30px', marginTop:'-10px', color:'#59b9ff', cursor:'pointer'}}/>
              </div>
            ),
            tableInfo = (
                <div className='' style={{backgroundColor:'#ffffff99', textDecoration:'none', padding:'10px', width:'100%'}}>
                    <table className="table table-borderless" style={{margin:'0px'}}>
                        <tbody>
                            <tr>
                                <td style={{padding:'0px', verticalAlign:'middle', width:'50px'}}>{userImage}</td>
                                <td style={{padding:'0px 10px', verticalAlign:'middle', width:'100%'}}>{userCountry}</td>
                                <td align='left' style={{padding:'0px', verticalAlign:'middle'}}>{addUser}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ),
            <div key={i}
                className={`d-flex animated fadeInUpX`}
                style={{backgroundColor:'#ffffff99', textDecoration: "none", width:'800px', padding:'0px', borderRadius:'5px', margin:'2px', border: '1px #7b5cff40 solid'}}
            >
                {tableInfo}
            </div>
        )
    )

    this.setState({
      searchMember: dataRv,
      loadingData:false,
    })
  }

  startSearch = async (e) => {
    if (e.keyCode === 13 || e.keyCode === undefined || e.which === 13 || e.which === undefined) {
      this.setState({
        n:1,
        searchData: [],
        searchMember: [],
        loadingData:true,
      })
      await this.searchMemberMap([])
      await this.scrollSearch()
    }
  }

  userAccessMap = async (allProjects, ix) => {
    var editAccess, btns, toggleDeleteUserBtn, deleteYesBtn, deleteNoBtn, accessItems, view, edit, item, addUser, countryCode, userCountry, userImage, tableInfo
    const {w, n,} = this.state
    const {rtl, setLT} = this.props
    const loaderX = <div className='loader-02' style={{margin: '2px 0px 0px', color:'', transform: rtl ? 'rotate(180deg)' : ''}}></div>
    // console.log(55555555, allProjects[ix])
    var user = allProjects[ix].access
    var dataRv = user.map (
        (itemX, i) => (
            // console.log(55555555, item),
            item = itemX.user,
            countryCode = item.countryCode ? item.countryCode.toLowerCase() : '',
            userImage = (
              <div className='center' onClick={() => this.onToggleProfile(itemX.user)}
                  style={{flexDirection:'column', justifyContent:'flex-start', marginTop:'-15px', alignItems:'center'}}
              >
                  <span className={`flag-icon flag-icon-${countryCode} sticky-top`} style={{right: !rtl ? 20 : '', left: rtl ? 20 : '', top:9}}></span>
                  <img
                      className={`C${item.fc} btnShadowX waves-effect waves-light btn-large`}
                      style={{objectFit: 'contain', width:"50px", height:"50px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px'}}
                      src={ exist(item.profileIndex)
                        ? `https://www.pix.shiningpage.com/whoraly/profile/small/${item._id}-${item.profileIndex}.jpeg`
                        : item.genderValue===0 ? female : male
                      }
                      alt="user"
                  />
                  <span style={{color:'#bb00f9', fontWeight:'bold'}}>{item.username}</span>
              </div>
            ),
            userCountry = (
              <div className='d-flex' style={{flexDirection:'column', textAlign:rtl ? 'right' : 'left'}}>
                  <div className='d-flex' style={{margin: '0px 0px 5px', alignItems:'center', direction:rtl ? 'rtl' : 'ltr'}}>
                      <span className={`flag-icon flag-icon-${countryCode}`}></span> &nbsp;
                      <div className='d-flex ' style={{fontSize:'12px'}}>{item.country}{item.city && ( ' - ' + item.city)}</div>
                  </div>
                  <div className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap'}}>
                      {item.username
                          ? (
                          <div>
                              <span style={{color:'#bb00f9', fontWeight:'bold'}}>{item.username}</span>&nbsp;
                          </div>
                          )
                          : <span style={{color:'#999999', fontWeight:450}}>{setLT.unknown} ({item.view})</span>
                      }
                  </div>
              </div>
            ),
            addUser = (
              <div className='center btnShadow' onClick={() => this.onAddUser(item)}
                  style={{width:'', height:'25px', margin: w<300 ? '0px' : '0px 20px', padding:'0px 10px', fontSize:'13px', fontWeight:450,
                        borderRadius:'100px', alignItems:'center', border:'2px solid #00CCFF', color:'#00CCFF'}}>
                  <RiUserAddFill style={{fontSize:w<300 ? '25px' : '30px', marginTop:'-10px', color:'#59b9ff', cursor:'pointer'}}/>
              </div>
            ),
            view = (
              <div className='d-flex disable-select' style={{margin:'15px', alignItems:'center'}}>
                  <input checked={true} type="checkbox" style={{textAlign:'center'}}/>&nbsp;
                  <span className="" style={{}}>{setLT.view}</span>
              </div>
            ),
            edit = (
              <div className='d-flex disable-select' style={{margin:'15px', alignItems:'center', cursor:'pointer'}} onClick = {() => item.loading ? '' : this.onToggleUserEditAccess(allProjects, ix, item, i, itemX.edit)}>
                  { item.toggleEdit
                    ? loaderX
                    : <input checked={itemX.edit} type="checkbox" style={{textAlign:'center'}}/>
                  }
                  &nbsp;<span className="" style={{}}>{setLT.edit}</span>
              </div>
            ),
            accessItems = (
              <div className='center' style={{width:'100%', marginBottom:'15px', alignItems:'center'}}>
                  {view}
                  {edit}
              </div>
            ),
            toggleDeleteUserBtn = (
              <div className='center' style={{width:'100%', alignItems:'center'}}>
                  <Button variant="" onClick = {() => item.loading ? '' : this.onToggleDeleteUserAccess(allProjects, ix, item, i, true)}
                      style={{backgroundColor:"#fe0202", color:'#ffffff', width:'100px', height:'30px', fontSize:'12px', padding:'0px', margin:'5px' }}>
                      <span style={{fontSize:'15px'}}>{item.loading ? loaderX : 'Delete'}</span>
                  </Button>
              </div>
            ),
            deleteYesBtn = (
                <div className='center' style={{width:'50%', alignItems:'center', margin:'0px'}}>
                    <Button variant="" onClick = {() => item.deletingUser ? '' : this.onDeleteUserAccess(allProjects, ix, item, i)}
                        style={{backgroundColor:"#fe0202", color:'#ffffff', width:'100px', height:'30px', fontSize:'12px', padding:'0px', margin:'5px' }}>
                        <span style={{fontSize:'15px'}}>{item.deletingUser ? loaderX : 'Delete'}</span>
                    </Button>
                </div>
            ),
            deleteNoBtn = (
                <div className='center' style={{width:'50%', alignItems:'center', margin:'0px'}}>
                    <Button variant="" onClick = {() => item.loading ? '' : this.onToggleDeleteUserAccess(allProjects, ix, item, i, false)}
                        style={{backgroundColor:"#4285f4", color:'#ffffff', width:'100px', height:'30px', fontSize:'12px', padding:'0px', margin:'5px'}}>
                        <span style={{fontSize:'15px'}}>{item.loading ? loaderX : 'Cancel'}</span>
                    </Button>
                </div>
            ),
            btns = (
                <div style={{margin:'10px 0px'}}>
                    <div className='d-flex' style={{width:'100%', justifyContent:'space-between'}}>
                        {!item.toggleDelete && toggleDeleteUserBtn}
                    </div>
                    { item.toggleDelete &&
                        <div className='d-flex' style={{width:'100%', justifyContent:'center'}}>
                            {deleteNoBtn}
                            {deleteYesBtn}
                        </div>
                    }
                </div>
            ),
            tableInfo = (
              <div className='center' style={{width:w<300 ? '200px' : '250px', fontSize:'14px', alignItems:'center', flexDirection:'column'}}>
                  {userImage}
                  {accessItems}
                  {btns}
              </div>
            ),
            <div key={i}
                className={`center animated fadeInUpX`}
                style={{backgroundColor:'#ffffff99', textDecoration: "none", width:'', padding:'15px 10px 10px', borderRadius:'5px', margin:'10px', border: '1px #7b5cff40 solid'}}
            >
                {tableInfo}
            </div>
        )
    )

    this.setState({
      userAccessList: dataRv.reverse(),
    })
  }

  onToggleProfile = async (user) => {
    const root = user.businessType>0 ? 'publisher' : 'user'
    window.open(`https://www.ShiningPage.com/${root}/${user.username}`);
  }

  onToggleDeleteUserAccess = async (allProjects, ix, item, i, status) => {
    allProjects[ix].access[i].user.toggleDelete = status
    this.userAccessMap(allProjects, ix)
  }

  onDeleteUserAccess = async (allProjects, ix, item, i) => {
    allProjects[ix].access[i].user.deletingUser = true
    this.userAccessMap(allProjects, ix)
    allProjects[ix].access.splice(i, 1)

    var project = allProjects[ix]    
    var userAccess = []
    for(var a=0; a<project.access.length; a++) {
      var ur = {
        userId: project.access[a].userId,
        view: project.access[a].view,
        edit: project.access[a].edit,
      }
      userAccess.push(ur)
    }

    var data = {
      projectId: project._id,
      access: userAccess,
    }

    await axios.post(`${serverURL}/project/updateAccess`, data)
    this.setState({allProjects})
    this.userAccessMap(allProjects, ix)
    this.projectsMap(allProjects)
  }

  onToggleUserEditAccess = async (allProjects, ix, item, i, status) => {
    // console.log(status)
    allProjects[ix].access[i].user.toggleEdit = true
    allProjects[ix].access[i].edit = !status
    this.userAccessMap(allProjects, ix)

    var project = allProjects[ix]
    var userAccess = []
    for(var a=0; a<project.access.length; a++) {
      var ur = {
        userId: project.access[a].userId,
        view: project.access[a].view,
        edit: project.access[a].edit,
      }
      userAccess.push(ur)
    }

    var data = {
      projectId: project._id,
      access: userAccess,
    }

    await axios.post(`${serverURL}/project/updateAccess`, data)
    this.setState({allProjects})
    allProjects[ix].access[i].user.toggleEdit = false
    this.userAccessMap(allProjects, ix)
    this.projectsMap(allProjects)
  }

  commentHandler = e => {
    const {lang} = this.props
    var tx = lang==='fa' ? toFarsi(e.target.value) : e.target.value
    var vx = tx.trim()==="" ?  null : tx
    var vxl = vx ? vx.length : 0
    this.setState({
        imageComment: vx ? vx.substr(0, this.state.imageCommentTotal) : '',
        imageCommentVxl: vxl > this.state.imageCommentTotal ? this.state.imageCommentTotal : vxl,
        status : 0
    });
  };

  pixChangeHandler = (e) => {
    if(e.target.files[0]) {
        pixHandler(e, this.state.szx).then(res => {
            if(res) {
                this.setState({
                  imageArray: [],
                })
                var a = res.file.size
                var b = res.fileResized.size
                this.state.imageArray.push(res.base64)
                var selectedFileB = a > b ? res.fileResized : res.file
                this.state.fileBArr.push(selectedFileB)
                this.mapImg(this.state.imageArray)
                pixResizer(selectedFileB, this.state.sz).then(res => {
                    if(res) {
                        var a = res.file.size
                        var b = res.fileResized.size
                        var selectedFileS = a > b ? res.fileResized : res.file
                        this.state.fileSArr.push(selectedFileS)
                        this.setState({
                          imgNull: false,
                          selectImgErr: '',
                          formatErr:'',
                          uploadComment:this.props.setLT.uploadComment
                        })
                    }
                })
            } else {
                this.setState({
                    imgNull: true,
                    formatErr:this.props.setLT.formatErr,
                    uploadComment:''
                })
            }
        })
    }
  }

  // addImage0 = async (e) => {
  //     var { sz, szx } = this.state
  //     var fileInput = false
  //     if(e.target.files[0]) {
  //         fileInput = true
  //         this.setState({
  //             adsFile: e.target.files[0]
  //         })
  //         var mime = e.target.files[0].type;
  //         var tx = mime.split('/')[0];
  //         var txz = mime.split('/')[1];

  //         if(tx==='image' && (txz!=='tiff' && txz!=='vnd.adobe.photoshop')) {
  //             if(fileInput) {
  //                 // var fSize = e.target.files[0].size / 1024;
  //                 // console.log(22222, fSize)
  //                 Resizer.imageFileResizer(
  //                     e.target.files[0], // is the file of the new image that can now be uploaded...
  //                     sz, // is the maxWidth of the  new image
  //                     sz, // is the maxHeight of the  new image
  //                     txz==='png' ? 'png' : 'JPEG', // is the compressFormat of the  new image
  //                     100, // is the quality of the new image
  //                     0, // is the degree of clockwise rotation to apply to the image.
  //                     uri => { // is the callBack function of the new image URI
  //                         this.setState({
  //                             pImageData:uri
  //                         })
  //                         this.state.imgArray.push(uri)
  //                     },
  //                     'base64' // is the output type of the new image
  //                 );

  //                 Resizer.imageFileResizer(
  //                     e.target.files[0], // is the file of the new image that can now be uploaded...
  //                     szx, // is the maxWidth of the  new image
  //                     szx, // is the maxHeight of the  new image
  //                     txz==='png' ? 'png' : 'JPEG', // is the compressFormat of the  new image
  //                     100, // is the quality of the new image
  //                     0, // is the degree of clockwise rotation to apply to the image.
  //                     uri => { // is the callBack function of the new image URI
  //                         this.setState({
  //                             pImageDataX:uri
  //                         })
  //                         this.state.imageArray.push(uri)
  //                         this.mapImg(this.state.imageArray)
  //                         //console.log(4444444, uri.length)
  //                     },
  //                     'base64' // is the output type of the new image
  //                 );

  //                 this.setState({
  //                     selectedFile: e.target.files[0],
  //                     formatImgErr:'',
  //                     selectImgErr: '',
  //                     formatErr:'',
  //                     uploadComment:this.props.setLT.uploadComment
  //                 })

  //             }

  //         } else {
  //             this.setState({
  //                 selectedFile: null,
  //                 formatErr:this.props.setLT.formatErr,
  //                 pImageData: null,
  //                 pImageDataX: null,
  //                 selectImgErr: '',
  //                 uploadComment:''
  //             })
  //         }

  //     }
  // }

  mapImg = (x) => {
    const { isFile, projectX, dateNX} = this.state
    var imgList = x.map (
        (item, i) => (
            <div key={i}>
                <img
                    className={``}
                    style={{objectFit: 'contain', width:'150px', height:'150px', borderRadius:'3px', margin:'5px', border:'1px solid #99999999', padding:'0px'}}//`${50-(3*i)}px`
                    src={ isFile ? `https://www.pix.shiningpage.com/project/big/${projectX._id}-${dateNX}.jpeg` : item }
                    alt={`image ${i}`}
                    // onClick={() => this.likerList(x)}
                />
                <div className="center btnShadow disable-select" onClick = {() => this.deleteImg(i)}
                    style={{color:'', height:'30px', width:'150px', borderRadius:'0px', border:'1px solid #99999999', borderRadius:'3px', fontSize:'40px', fontWeight:10, alignItems:'center', margin:'5px', padding:'5px 0px 0px'}}>
                    -
                </div>
    
            </div>
        )
    )
    this.setState({imgList})
  }

  deleteImg = (i) => {
    const {imgArray, imageArray} = this.state
    imgArray.splice(i, 1);
    imageArray.splice(i, 1);
    this.mapImg(this.state.imageArray)
    this.setState({
      goldenAccess: false,
      fileBArr: [],
      fileSArr: [],
      imgNull: true,
    })
  }

  checkNull = () => {
    const {imgNull} = this.state
    var infoErr = {}
    if(imgNull) infoErr.selectImgErr = this.props.setLT.selectImgErr
    return infoErr
  }

  onSaveImage = async (type) => {
    var infoErr = this.checkNull()
    if(Object.keys(infoErr).length>0) {
      this.setState({
        selectedFile: null,
        formatErr:'',
        selectImgErr: infoErr.selectImgErr,
      })
    } else {
      const {projects, tIndex, pImageIndex, dateNX, imageX, pImageId, pImageData, pImageDataX, imageComment, fileBArr, fileSArr, szx, sz} = this.state
      const { mainUser, lang } = this.props
      const d1 = new Date();
      const dateN = d1.getTime();

      if(type==='new') {
        this.setState({savingImage:true})

        pixSave(fileBArr[0], `${szx}|${projects[0]._id + "-" + dateN}|${destB.replaceAll("/", "@")}`)
        pixSave(fileSArr[0], `${sz}|${projects[0]._id + "-" + dateN}|${destS.replaceAll("/", "@")}`)

        // var imageInfo = {
        //   xImageData: pImageDataX
        // }
        // await axios.post(`${serverURL}/image/saveProjectImage`, imageInfo).then(async res => {
          var imgInfo = {
            // id: res.data._id,
            // imageData: pImageData,
            dateN,
            comment: imageComment
          }
          projects[tIndex].image.push(imgInfo) 
          if(this.state.toggleImageShow) {
            var imgList = this.imgMap(projects[tIndex], projects[tIndex].image.length-1, projects, tIndex)
            this.setState({
              imgListX: imgList,
            })
            this.onImg(projects[tIndex], projects[tIndex].image.length-1, projects, tIndex)
          }

        // })
      }

      if(type==='edit') {
        this.setState({editingImage:true})

        var imgInfo = {
          // id: res.data._id,
          // imageData: pImageData,
          dateN: dateNX,
          comment: imageComment
        }
        projects[tIndex].image.splice(pImageIndex, 1, imgInfo)
        imageX.comment = imageComment

        console.log(fileBArr)
        if(fileBArr.length>0) {
          imgInfo.dateN = dateN
          var imgList = this.imgMap(projects[tIndex], pImageIndex, projects, tIndex)
          this.setState({
            imgListX: imgList,
          })
          this.onImg(projects[tIndex], pImageIndex, projects, tIndex)

          pixDelete({dest: destB + "/" + projects[0]._id + "-" + dateNX + ".jpeg"})
          pixDelete({dest: destS + "/" + projects[0]._id + "-" + dateNX + ".jpeg"})
          pixSave(fileBArr[0], `${szx}|${projects[0]._id + "-" + dateN}|${destB.replaceAll("/", "@")}`)
          pixSave(fileSArr[0], `${sz}|${projects[0]._id + "-" + dateN}|${destS.replaceAll("/", "@")}`)
        }

        // var imageInfo = {
        //   id: pImageId,
        //   xImageData: pImageDataX
        // }
        // await axios.post(`${serverURL}/image/updateProjectImage`, imageInfo).then(async res => {

        // })
      }

      await this.setState({ projects })
      // console.log(projects)
      await this.onSave('image')

      this.setState({
        toggleNewImage: false,
        toggleEditImage: false,
        // toggleImageShow: false,
        selectImgErr: null,
        formatErr:null,
        adsFile: null,
        savingImage:false,
        editingImage:false,
        pImageData:null,
        pImageDataX:null,
        imgArray : [],
        imageArray : [],
        fileBArr: [],
        fileSArr: [],
        imageComment: ''
      })
    }
  }

  onNote = () => {
    this.setState({
      toggleNote: !this.state.toggleNote
    })

  }

  onResize = () => {
    this.setState({
      w: window.innerWidth,
      h: window.innerHeight,
    })
    this.projectsMap(this.state.allProjects)
  }

  onGoTo = async (x) => {
    window.scrollTo({
        top: x,
        left: 0,
        behavior: 'smooth'
    })
  }

  render() {
    const { w, h, dateNX, formatErr, toggleNote, chengQ2Target, enteringQ2Target, projectComment,q2Target,
      toggleSaveAndClose, toggleDeleteTask, deletingTask, toggleSaveCheck, taskWidth, tIndex, projectX,
      deletingImage, editingImage, pEdit, toggleDeleteImage, toggleEditImage, toggleImageShow,
      gettingImages, imageX, imgListX, imageArray, savingImage, imageCommentVxl,
      imageCommentTotal, imageComment, selectImgErr, imgList, taskX, toggleNewImage,
      toggleUnAccess, appAccess, searchUsers, searchMember, userAccessList, toggleAccess,
      gantScale, pDays, saveNeed, projectsHeader, projectsBody, projectDX, toggleDeleteProject,
      toggleProjectView, deletingProject, projectsList, gettingProjects, savingProjects,
    } = this.state
    const {auth, mainUser, rtl, lang, setLT, page} = this.props
    const profileTitleStyle = {fontSize:'14px', fontWeight:'bold', margin:'15px 0px 0px 0px', textAlign: rtl ? 'right' : 'left'}
    const loaderX = <div className='loader-13' style={{margin: rtl ? '35px 20px -25px' : '0px 20px 0px', color:'#ffffff', transform: rtl ? 'rotate(180deg)' : ''}}></div>
    const loaderZ = <div className='loader-02' style={{margin: '0px', color:'#00CCFF', transform: rtl ? 'rotate(180deg)' : ''}}></div>
    const loaderZWhite = <div className='loader-02' style={{margin: '0px', color:'#ffffff', transform: rtl ? 'rotate(180deg)' : ''}}></div>
    const loaderImg = <div className='loader-40' style={{position:'absolute', width:'100px', height:'100px', margin: '0px', color:'#000000', transform: rtl ? 'rotate(180deg)' : '', backgroundColor:'#ffffff50'}}></div>

    const projectManagementTitle = (
      <div className='d-flex' style={{marginBottom:'20px'}}>
        <div className='backProject' style={{width:"50px", height:"50px", borderRadius:'3px'}}></div>&nbsp;&nbsp;
        <div style={{fontSize:'22px', fontWeight:'bold', color:'#ffffff'}}>Project Management</div>
      </div>
    )

    const allProjectsList = (
      <div className={'d-flex center'} style={{flexWrap: 'wrap', marginBottom:'20px', alignItems:'stretch'}}>
          {projectsList}
          <div className='center' style={{width:'100%', height: gettingProjects ? '100px' : '0px', alignItems:'center'}}>
              {gettingProjects && 'Loading ...'}
          </div>
      </div>
    )

    const enterQ2TargetBtn = (
      <div className='center' style={{alignItems:'center', margin:'0px'}}>
          <div className={`center ${chengQ2Target ? 'btnShadow waves-effect waves-light btn-large' : 'disable-select'}`}
              style={{animationDelay:'0s', filter: chengQ2Target ? '' : 'grayscale(100%)', width:'40px', height:'37px', padding:'7px', margin:'0px', textDecoration:'none', color:'#000000',
              fontSize:'16px', flexDirection:'', alignItems:'center', border:'2px solid #00CCFF',
              backgroundColor: '#ffffff', borderRadius:'4px'}}
              onClick = {() => chengQ2Target ? this.enterQ2Target(q2Target)  : ''}>
              {enteringQ2Target===true ? loaderZ : <IoMdReturnLeft style={{fontSize:'30px', color:'#0090d3'}}/>}
          </div>
      </div>
    )

    const projectTarget = (
      <table className='' style={{maxWidth:`${350+taskWidth+(pDays.length*gantScale)}px`, margin:'-50px -100px 0px -100px'}}>
        <thead style={{visibility:'hidden'}}>
            {projectsHeader}
        </thead>
        {w>s && <div style={{width:'90%', height:'10px'}}></div>}
        <tbody>
          <tr style={{}}>
            <td style={{width:'100%', position:'relative', position:'sticky', right:0, left:0}}>
              <div className='d-flex' style={{margin:w<s ? '10px' : '0px 0px 10px', alignItems:'center'}}>
                  {setLT.orderQty}
                  <textarea type="text" rows="1" value={q2Target} autoComplete="off"
                    className="form-control sticky-top"
                    style={{width:'100px', height:'30px', resize: 'none', margin:'0px 10px', padding:'6px 3px', fontWeight:450, textAlign:'center', direction:'ltr', border:'2px solid #A4A4A4'}}
                    onChange={(e) => pEdit ? this.changeQ2Target(e) : this.onToggleUnAccess()}
                  />
                  {enterQ2TargetBtn}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    )
    const projects = (
      <div className='mostly-customized-scrollbar'
          style={{height: toggleNote ? (w<s ? h-150 : h-230) : (w<s ? h-75 : h-160), paddingBottom:'50px', minHeight:w<s ? '300px' : '400px', position:'relative', opacity: savingProjects ? '.4' : '', pointerEvents: savingProjects ? 'none' : '', transition: '.3s'}}>
          { projectX && projectX.type==='quantity2' && projectTarget}
          <table className='tableFixHead' style={{width:`${550+taskWidth+(pDays.length*gantScale)}px`, opacity: enteringQ2Target ? '.4' : ''}}>
              <thead>
                  {projectsHeader}
              </thead>
              <tbody>
                  {projectsBody}
              </tbody>
          </table>
      </div>
    )

    const newProject = (//dropend
      <div className='dropdown' data-bs-toggle="tooltip" data-bs-placement="bottom" title='Create New Project' style={{alignItems:'center', margin:'0px'}}>
          <button className={`center animated fadeInDown btnShadow`}
              type="button" id="dropdownMenuButton" data-bs-toggle={appAccess ? 'dropdown' : ''} data-bs-offset="0,5" //data-bs-auto-close="inside"
            style={{animationDelay:'0s', width:'', height:'', padding:'3px 6px', marginBottom:'20px', textDecoration:'none', color:'#000000',
              fontSize:'16px', alignItems:'flex-end', border:'2px solid #00CCFF',
              backgroundColor: '#ffffff', borderRadius:'5px'
            }}
          >
            <div className='center underline'>
                {savingProjects ? loaderZ : <FaFolderPlus style={{fontSize:'25px', color:'#00a843', marginRight:'5px'}}/>}
                <span className='' style={{fontSize:'12px', marginTop:'5px'}}>Create New Project</span>
                {!appAccess && <span className='' style={{fontSize:'10px', color:'brown', margin:'5px 0px 0px 5px'}}>(You have no access.)</span>}
            </div>
          </button>
          <div className="dropdown-menu sticky-top" aria-labelledby="dropdownMenuButton" //data-bs-auto-close="inside"
              style={{width:w<300 ? '170px' : '200px', fontSize:'13px', padding:'0px', margin:'-10px 0px 0px', backgroundColor:'#ffffff99', zIndex:'2'}}>
              <div className='d-flex backBlur sticky-top' style={{fontWeight:450, padding:'0px', alignItems:'center', flexDirection:'column', backgroundColor:'#ffffff99'}}>
                  <div style={{padding:'10px'}}>Create New Project</div>
                  <hr style={{width:'100%', margin:'0px', height:'2px'}}/>
                  <div className='d-flex txt underline' onClick = {() => this.onNewProject('percentage')}
                      style={{padding:'15px 10px', alignItems:'flex-start'}}>
                    <FaPercent style={{width:'25px', marginTop:'2px'}}/>&nbsp;
                    {setLT.percentageBased}
                  </div>
                  <hr style={{width:'90%', margin:'0px'}}/>
                  <div className='d-flex txt underline' onClick = {() => this.onNewProject('quantity1')}
                      style={{padding:'15px 10px', alignItems:'flex-start'}}>
                    <MdDashboardCustomize style={{width:'25px', fontSize:'17px'}}/>&nbsp;
                    {setLT.quantityBased} (1)
                  </div>
                  <hr style={{width:'90%', margin:'0px'}}/>
                  <div className='d-flex txt underline' onClick = {() => this.onNewProject('quantity2')}
                      style={{padding:'15px 10px', alignItems:'flex-start'}}>
                    <AiOutlineCodeSandbox style={{width:'25px', fontSize:'17px'}}/>&nbsp;
                    {setLT.quantityBased} (2)
                  </div>
              </div>
          </div>
      </div>
    )

    const undo = (
      <div className='center' style={{alignItems:'center', margin:w<s ? '0px 7px' : '0px 10px'}}>
          <div className={`center ${saveNeed ? 'btnShadow waves-effect waves-light btn-large' : 'disable-select'}`}
              style={{animationDelay:'0s', filter: saveNeed ? '' : 'grayscale(100%)', width:'40px', height:'30px', padding:'9px', margin:'0px', textDecoration:'none', color:'#000000',
              fontSize:'16px', flexDirection:'', alignItems:'center', border:'2px solid #00CCFF',
              backgroundColor: '#ffffff', borderRadius:'5px'}}
              onClick = {() => saveNeed ? this.onUndo()  : ''}>
              {gettingProjects ? loaderZ : <ImUndo2 style={{fontSize:'20px', color:'#0090d3'}}/>}
          </div>
      </div>
    )

    const saveProject = (
      <div className='center' style={{alignItems:'center', margin:w<s ? '0px 7px' : '0px 10px'}}>
          <div className={`center ${saveNeed ? 'btnShadow waves-effect waves-light btn-large' : 'disable-select'}`}
              style={{animationDelay:'0s', filter: saveNeed ? '' : 'grayscale(100%)', width:'40px', height:'30px', padding:'7px', margin:'0px', textDecoration:'none', color:'#000000',
              fontSize:'16px', flexDirection:'', alignItems:'center', border:'2px solid #00CCFF',
              backgroundColor: '#ffffff', borderRadius:'5px'}}
              onClick = {() => saveNeed ? this.onSave()  : ''}>
              {savingProjects ? loaderZ : <RiSave3Fill style={{fontSize:'30px', color:'#0090d3'}}/>}
          </div>
      </div>
    )

    const note = (
      <div className='center' style={{alignItems:'center', margin:w<s ? '0px 7px' : '0px 10px'}}>
          <div className='center btnShadow waves-effect waves-light btn-large'
              style={{animationDelay:'0s', width:'40px', height:'30px', padding:'7px', margin:'0px', textDecoration:'none', color:'#000000',
              fontSize:'16px', flexDirection:'', alignItems:'center', border: toggleNote ? '2px solid #fff200' : '2px solid #00CCFF',
              backgroundColor: '#ffffff', borderRadius:'5px'}}
              onClick = {() => this.onNote()}>
              <FiEdit style={{fontSize:'30px', color: toggleNote ? '#ffa502' : '#0090d3'}}/>
          </div>
      </div>
    )

    const searchTape = (
      <div className='center' style={{width:'100%', zIndex:'1'}}>
          <div style={{margin: (searchUsers && w<s) ? '0px 0px 10px' : '0px 0px 20px', borderRadius:'3px',
                width:w<s ? '100%' : '800px', padding:'10px',
                fontWeight:'', fontSize:'15px', 
                backgroundColor:'#ffffff99'}}>

              <input type="text" value={searchUsers} placeholder='Search members ...' name='searchUsers' autoComplete="off"
                    className="form-control"
                    style={{textAlign:'center', margin:'0px 0px -33px', width:'100%', height:'35px'}}
                    onChange={this.changeUsername} onKeyPress={this.startSearch} onFocus={this.startSearch}/>
              <div className='btnShadow center' style={{margin: "0px 2px 0px 0px", width:'35px', height:'31px', borderRadius:'3px', alignItems:'center'}} onClick={this.startSearch}>{/* */}
                <IoMdSearch color="#623CEA" size="1.6em"/>
              </div>
  
          </div>
      </div>
    )

    const modalDeleteProject =  (
      <Modal show={toggleDeleteProject} onHide={() => this.onToggleDeleteProject()}>
        <div className='d-flex sticky-top' style={{width:'100%', padding:'5px', alignItems:'center', justifyContent:'space-between', direction:'rtl', backgroundColor:'#ffffff'}}>
          <div className={`center`} onClick={() => this.onToggleDeleteProject()}
              style={{width:'30px', height:'30px', padding:'2px', margin:'0px', borderRadius:'100px', border: '3px solid #00000020'}}>
              <MdClose className='sidebarIcon' style={{marginTop:'0px', width:'20px', fontSize:'20px', fontWeight:'bold', cursor:'pointer', position:'absolute'}}/>
          </div>
        </div>
        <Modal.Body className='' style={{backgroundColor:'#ffffff99', padding: '5px 15px 15px'}}>
          <div style={{backgroundColor:'', padding:w<s ? '0px' : '10px', borderRadius:'5px', border:w<s ? '' : '1px solid #999999'}}>
              <div style={{fontWeight:'bold', marginBottom:'20px'}}>{projectDX ? projectDX.taskName : ''}</div>
              <div style={{marginBottom:'10px'}}>Would you like to permanently delete the project and its documentation?</div>
              <div className='center' style={{width:'100%', alignItems:'center', margin:'0px 0px 60px'}}>
                  <Button variant="" onClick = {() => deletingProject ? '' : this.onDeleteProject(projectDX)}
                      style={{backgroundColor:"#fe0202", color:'#ffffff', width:'100px', height:'30px', fontSize:'12px', margin:'5px', padding:'0px', }}>
                      <span style={{fontSize:'15px'}}>{deletingProject ? loaderX : 'delete'}</span>
                  </Button>
                  <Button variant="" onClick = {() => this.onToggleDeleteProject()}
                      style={{backgroundColor:"#4285f4", color:'#ffffff', width:'100px', height:'30px', fontSize:'12px', margin:'5px', padding:'0px', }}>
                      <span style={{fontSize:'15px'}}>Cancel</span>
                  </Button>
              </div>
          </div>
        </Modal.Body>
      </Modal>
    )

    const modalDeleteTask =  (
      <Modal show={toggleDeleteTask} onHide={() => this.onToggleDeleteTask()}>
        <div className='d-flex sticky-top' style={{width:'100%', padding:'5px', alignItems:'center', justifyContent:'space-between', direction:'rtl', backgroundColor:'#ffffff'}}>
          <div className={`center`} onClick={() => this.onToggleDeleteTask()}
              style={{width:'30px', height:'30px', padding:'2px', margin:'0px', borderRadius:'100px', border: '3px solid #00000020'}}>
              <MdClose className='sidebarIcon' style={{marginTop:'0px', width:'20px', fontSize:'20px', fontWeight:'bold', cursor:'pointer', position:'absolute'}}/>
          </div>
        </div>
        <Modal.Body className='' style={{backgroundColor:'#ffffff99', padding: '5px 15px 15px'}}>
          <div style={{backgroundColor:'', padding:w<s ? '0px' : '10px', borderRadius:'5px', border:w<s ? '' : '1px solid #999999'}}>
              <div style={{fontWeight:'bold', marginBottom:'20px'}}>{taskX ? taskX.taskName : ''}</div>
              <div style={{marginBottom:'10px'}}>Would you like to permanently delete the task and its documentation?</div>
              <div className='center' style={{width:'100%', alignItems:'center', margin:'0px 0px 60px'}}>
                  <Button variant="" onClick = {() => deletingTask ? '' : this.onDeleteTask(projectX, tIndex)}
                      style={{backgroundColor:"#fe0202", color:'#ffffff', width:'100px', height:'30px', fontSize:'12px', padding:'0px', margin:'5px'}}>
                      <span style={{fontSize:'15px'}}>{deletingTask ? loaderX : 'Delete'}</span>
                  </Button>
                  <Button variant="" onClick = {() => this.onToggleDeleteTask()}
                      style={{backgroundColor:"#4285f4", color:'#ffffff', width:'100px', height:'30px', fontSize:'12px', padding:'0px', margin:'5px' }}>
                      <span style={{fontSize:'15px'}}>Cancel</span>
                  </Button>
              </div>
          </div>
        </Modal.Body>
      </Modal>
    )

    const modalAccess =  (
      <Modal show={toggleAccess} onHide={() => this.onToggleAccess()}>
        <div className='d-flex sticky-top' style={{width:'100%', padding:'5px', alignItems:'center', justifyContent:'space-between', direction:'rtl', backgroundColor:'#ffffff'}}>
          <div className={`center`} onClick={() => this.onToggleAccess()}
              style={{width:'30px', height:'30px', padding:'2px', margin:'0px', borderRadius:'100px', border: '3px solid #00000020'}}>
              <MdClose className='sidebarIcon' style={{marginTop:'0px', width:'20px', fontSize:'20px', fontWeight:'bold', cursor:'pointer', position:'absolute'}}/>
          </div>
          <div>{setLT.defineProjectAccess}</div>
          <div style={{width:'30px', height:'30px'}}></div>
        </div>
        <Modal.Body className='' style={{backgroundColor:'#ffffff99', padding: w<300 ? '5px' : '5px 15px 15px'}}>
          <div style={{backgroundColor:'', padding:w<s ? '0px' : '10px', borderRadius:'5px', border:w<s ? '' : '1px solid #999999'}}>
              <div style={{fontWeight:'bold', marginBottom:'0px'}}>{projectDX ? projectDX.taskName : ''}</div>
              {searchTape}
              <div className="center" style={{flexWrap: 'wrap' }}>
                  {searchMember}
                  <hr style={{width:'70%', margin:'30px 0px', backgroundColor: '#000000', border: '1px solid #000000'}}/>
              </div>
              <div className="center" style={{flexWrap: 'wrap' }}>
                  {userAccessList}
              </div>
          </div>
        </Modal.Body>
      </Modal>
    )

    const modalUnAccess =  (
      <Modal show={toggleUnAccess} onHide={() => this.onToggleUnAccess()}>
        <Modal.Body style={{padding: '10px'}}>
          <div style={{padding: '20px'}}>
              <RiAlertFill style={{fontSize:'40px', color:'#ffa502'}}/>
              <div style={{marginBottom:'15px', textAlign:'center'}}>You are not allowed to edit this project.</div>
              <div className='center' style={{width:'100%', alignItems:'center', margin:'20px 0px 0px'}}>
                  <Button variant="" onClick = {() => this.onToggleUnAccess()}
                      style={{backgroundColor:"#59b9ff", color:'#ffffff', width:'100px', height:'30px', fontSize:'12px', padding:'0px', }}>
                      <span style={{fontSize:'15px'}}>OK</span>
                  </Button>
              </div>
          </div>
        </Modal.Body>
      </Modal>
    )

    const modalSaveCheck =  (
      <Modal show={toggleSaveCheck} onHide={() => this.onToggleSaveCheck()}>
        <Modal.Body style={{padding:'10px'}}>
          <div style={{padding:'20px'}}>
              <RiAlertFill style={{fontSize:'40px', color:'#ffa502'}}/>
              <div style={{marginBottom:'15px', textAlign:'center'}}>Do you want to save the changes?</div>
              <div className='center' style={{width:'100%', alignItems:'center', margin:'20px 0px 0px'}}>
                  <Button variant="success" onClick = {() => this.onSaveAndClose()}
                      style={{backgroundColor:"", color:'#ffffff', width:'100px', height:'30px', fontSize:'12px', padding:'0px', margin:'5px'}}>
                      <span style={{fontSize:'15px'}}>{toggleSaveAndClose ? loaderZWhite : 'Save'}</span>
                  </Button>
                  <Button variant="primary" onClick = {() => this.onToggleProjectView()}
                      style={{backgroundColor:"", color:'#ffffff', width:'100px', height:'30px', fontSize:'12px', padding:'0px', margin:'5px'}}>
                      <span style={{fontSize:'15px'}}>No</span>
                  </Button>
              </div>
          </div>
        </Modal.Body>
      </Modal>
    )

    const closeProjectView = (
      <div className='center' style={{alignItems:'center', margin:w<s ? '0px 7px' : '0px 10px'}}>
          <div className={`center btnShadow waves-effect waves-light btn-large`}
              style={{animationDelay:'0s', width:'40px', height:'30px', padding:'10px', margin:'0px', textDecoration:'none', color:'#0090d3',
              fontSize:'16px', flexDirection:'', alignItems:'center', border:'2px solid #00CCFF',
              borderRadius:'5px'}}
              onClick={() => this.saveCheck()}>
              <MdClose className='' style={{marginTop:'0px', width:'25px', fontSize:'25px', fontWeight:'bold', cursor:'pointer', position:'absolute'}}/>
          </div>
      </div>
    )

    const projectCommentConst = (
      <div style={{width:'100%', padding:w<s ? '0px 10px' : '', }}>
        <textarea
            type="text"
            rows="2"
            value={projectComment}
            placeholder={setLT.description}
            className="form-control"
            style={{width:'100%', height:'', border:'1px solid #fe9341', color:'', backgroundColor:'#fff20030'}}
            onChange={(e) => this.changeProjectComment(e)}
        />
      </div>
    )

    const modalProjectView =  (
      <Modal show={toggleProjectView} onHide={() => this.setState({toggleProjectView : true})} size='xl' fullscreen={false}>
        <div className='d-flex sticky-top' style={{width:'100%', padding:w<s ? (projectX && projectX.type==='quantity2' ? '5px 0px' : '5px 0px 0px') : '15px 5px 10px', alignItems:'center', direction:'rtl', backgroundColor:'#ffffff', borderBottom: w<s && projectX && projectX.type==='quantity2' ? '1px solid' : ''}}>
          {closeProjectView}
          {undo}
          {saveProject}
          {note}
        </div>
        <Modal.Body className='mostly-customized-scrollbar' style={{backgroundColor:'#ffffff99', padding: w<s ? '5px 0px 10px' : '5px 15px 15px', transition:'.3s'}}>
          <div style={{padding:w<s ? '0px' : '10px', borderRadius:'5px', border:w<s ? '' : '1px solid #999999', margin: toggleNote ? '0px 0px 10px' : '0px'}}>
            {projects}
          </div>
          {toggleNote && projectCommentConst}
        </Modal.Body>
      </Modal>
    )

    const imageConst = (
      <div style={{margin:'0px 0px', padding:'15px', border:'0px solid gray', borderRadius:'5px', width:'100%'}}>
          <div className='center' style={{width:'100%', flexWrap:'wrap', direction:rtl ? 'rtl' : 'ltr'}}>
              { imageArray.length===0
                ?
                <span className="btn btn-file center btnShadowX disable-select"
                  style={{color:'', height:'70px', width:'70px', border:'1px solid #99999999', borderRadius:'3px', fontSize:'40px', fontWeight:10, alignItems:'center', margin:'5px', padding:'5px 0px 0px'}}>
                  + <input type="file" onChange={this.pixChangeHandler}></input>
                </span>
                : imgList
              }
          </div>
          <span className='invalid-feedback' style={{fontSize:'12px', textAlign:'center', display: selectImgErr ? 'block' : 'none'}}>{selectImgErr}</span>
          <span className='invalid-feedback' style={{fontSize:'12px', textAlign:'center', display: formatErr ? 'block' : 'none'}}>{formatErr}</span>
      </div>
    )

    const imageCommentConst = (
      <div className='center' style={{flexDirection:'column'}}>
          <div style={profileTitleStyle}>{setLT.adsDescription}</div>
          <textarea
              style={{fontSize:'14px', border:'1px solid gray', borderRadius:'5px'}}
              name='imageComment'
              onChange={this.commentHandler}
              value={imageComment}
              type="text"
              className="form-control"
              rows="5"
          />
          <div style={{margin:'5px 0px -10px', textAlign: rtl ? 'left' : 'right'}}>{imageCommentVxl}/{imageCommentTotal}</div>
      </div>
    )

    const addImageBtn = (
      <div className='center' style={{width:'100%', alignItems:'center', margin:'20px 0px'}}>
        <Button variant="" onClick = {() => savingImage ? '' : this.onSaveImage('new')}
            style={{backgroundColor:"#00CCFF", color:'#ffffff', width:'100px', height:'30px', fontSize:'12px', padding:'0px', }}>
            <span style={{fontSize:'15px'}}>{savingImage ? loaderX : setLT.save}</span>
        </Button>
      </div>
    )

    const onEditImageBtn = (
      <div className='center' style={{width:'100%', alignItems:'center', margin:'20px 0px'}}>
        <Button variant="" onClick = {() => editingImage ? '' : this.onSaveImage('edit')}
            style={{backgroundColor:"#00CCFF", color:'#ffffff', width:'100px', height:'30px', fontSize:'12px', padding:'0px', }}>
            <span style={{fontSize:'15px'}}>{editingImage ? loaderX : setLT.edit}</span>
        </Button>
      </div>
    )

    const modalAddImage =  (
      <Modal show={toggleNewImage} onHide={() => this.setState({toggleNewImage : true})}>
        <div className='d-flex sticky-top' style={{width:'100%', padding:'5px', alignItems:'center', justifyContent:'space-between', direction:'rtl', backgroundColor:'#ffffff', borderBottom:'1px solid #dddddd'}}>
          <div className={`center`} onClick={() => this.onToggleNewImage()}
              style={{width:'30px', height:'30px', padding:'2px', margin:'0px', borderRadius:'100px', border: '3px solid #00000020'}}>
              <MdClose className='sidebarIcon' style={{marginTop:'0px', width:'20px', fontSize:'20px', fontWeight:'bold', cursor:'pointer', position:'absolute'}}/>
          </div>
          <div>{setLT.addImage}</div>
          <div style={{width:'30px', height:'30px'}}></div>
        </div>
        <Modal.Body className='' style={{backgroundColor:'#ffffff99', padding: w<300 ? '5px' : '5px 15px 15px'}}>
          <div style={{fontWeight: 450, margin: '10px 0px', overflow: 'scroll', whiteSpace:'noWrap'}}>{taskX && taskX.taskName}</div>
          {imageConst}
          {imageCommentConst}
          {addImageBtn}
        </Modal.Body>
      </Modal>
    )

    const pImageX = (
      <div className='center animated fadeIn' style={{height:'', width:'100%', flexDirection:'column', alignItems:'center'}}>
          <img
              className=''
              style={{objectFit: 'contain', height:w<s ? '350px' : '600px', width:w<s ? '100%' : '600px', borderRadius:'5px', border:'1px solid #99999999'}}
              src={`https://www.pix.shiningpage.com/project/big/${projectX?._id}-${dateNX}.jpeg`}
              alt='advertising'
          />
          {gettingImages && loaderImg}
      </div>
    )

    const imgListXConst = (
      <div className='center' style={{width:'100%', flexWrap:'wrap', margin:'20px 0px'}}>
          {imgListX}
      </div>
    )

    const editImageBtn = (
      <Button className='' variant={toggleEditImage ? "primary" : "outline-primary"} onClick={() => this.onToggleEditImage()}
              style={{minWidth:'50px', height:'25px', fontSize:'12px', margin:'5px', padding:'0px 5px', display: pEdit ? '' : 'none'}}>
          {setLT.edit}
      </Button>
    )

    const deleteImageBtn = (
      <Button className='' variant="outline-danger" onClick={() => this.onToggleDeleteImage()}
              style={{minWidth:'50px', height:'25px', fontSize:'12px', margin:'5px', padding:'0px 5px', display: pEdit ? '' : 'none'}}>
          {setLT.delete}
      </Button>
    )

    const deleteImageYesBtn = (
      <div className='center' style={{width:'70px', alignItems:'center', margin:'0px'}}>
          <Button variant="" onClick = {() => deletingImage ? '' : this.onDeleteImage()}
              style={{backgroundColor:"#fe0202", color:'#ffffff', width:'100px', height:'25px', fontSize:'12px', padding:'0px', margin:'10px'}}>
              <span style={{fontSize:'13px'}}>{deletingImage ? loaderZWhite : setLT.delete}</span>
          </Button>
      </div>
    )

    const deleteImageNoBtn = (
      <div className='center' style={{width:'70px', alignItems:'center', margin:'0px'}}>
          <Button variant="" onClick = {() => this.onToggleDeleteImage()}
              style={{backgroundColor:"#4285f4", color:'#ffffff', width:'100px', height:'25px', fontSize:'12px', padding:'0px', margin:w<s ? '10px' : '10px 20px 10px 10px' }}>
              <span style={{fontSize:'13px'}}>{setLT.cancel}</span>
          </Button>
      </div>
    )

    const moreBtn = (
      <div className='dropdown dropend' style={{}}>
          <button disabled={pEdit ? false : true} className='center btnShadow waves-effect waves-light btn-large'
              type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" data-bs-offset="-5,5" data-bs-auto-close="outside"
              style={{width:'30px', height:'30px', padding:'0px', margin:'0px', color:'#000000', border: pEdit ? '2px solid #59b9ff99' : '2px solid #99999999', backgroundColor:'', borderRadius:'100px'}}
          >
              <HiOutlineDotsHorizontal color='' size={20}/>
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" //data-bs-auto-close="inside"
                style={{fontSize:'13px', padding:'0px', margin:'-10px 0px 0px', backgroundColor:'#ffffff99', zIndex:'2'}}>
                <div className='d-flex backBlur' style={{padding:'10px', alignItems:'center', flexDirection:'column', backgroundColor:'#ffffff99'}}>
                    <RiImageAddFill style={{fontSize:'35px', color:'#59b9ff', cursor:'pointer'}} onClick={() => this.onToggleNewImage(projects[tIndex], tIndex)}/>
                    <hr style={{width:'90%', margin:'10px 0px'}}/>
                    {editImageBtn}
                    <hr style={{width:'90%', margin:'10px 0px'}}/>
                    {!toggleDeleteImage
                      ? deleteImageBtn
                      : <div className='d-flex' style={{justifyContent:'center'}}>
                          {deleteImageNoBtn}
                          {deleteImageYesBtn}
                        </div>
                    }
                </div>
          </div>
      </div>
    )

    const modalImageShow =  (
      <Modal show={toggleImageShow} onHide={() => this.onToggleImageShow()} size='lg'>
        <div className='d-flex sticky-top' style={{width:'100%', padding: w<s ? '5px' : '10px', alignItems:'center', justifyContent:'space-between', direction:'rtl', backgroundColor:'#ffffff', borderBottom:'0px solid #dddddd'}}>
            <div className={`center`} onClick={() => this.onToggleImageShow()}
                style={{width:'30px', height:'30px', minWidth:'30px', padding:'2px', margin:'0px', borderRadius:'100px', border: '3px solid #00000020'}}>
                <MdClose className='sidebarIcon' style={{marginTop:'0px', width:'20px', fontSize:'20px', fontWeight:'bold', cursor:'pointer', position:'absolute'}}/>
            </div>
            <div style={{margin:'0px 10px', padding:'5px 0px', width:'', overflow:'scroll', whiteSpace:'noWrap'}}>{taskX && taskX.taskName}</div>
            {moreBtn}
        </div>
        <div className='center' style={{padding:w<s ? '5px' : '10px 50px', width:'100%', flexDirection: 'column'}}>
          {dateNX && pImageX}
          {imgListXConst}
          <div style={{width:'100%', marginBottom:'20px'}}>{imageX && imageX.comment}</div>
        </div>
      </Modal>
    )

    const modalEditImage = (
      <Modal show={toggleEditImage} onHide={() => this.setState({toggleEditImage : true})}>
        <div className='d-flex sticky-top' style={{width:'100%', padding:'5px', alignItems:'center', justifyContent:'space-between', direction:'rtl', backgroundColor:'#ffffff', borderBottom:'1px solid #dddddd'}}>
          <div className={`center`} onClick={() => this.onToggleEditImage()}
              style={{width:'30px', height:'30px', padding:'2px', margin:'0px', borderRadius:'100px', border: '3px solid #00000020'}}>
              <MdClose className='sidebarIcon' style={{marginTop:'0px', width:'20px', fontSize:'20px', fontWeight:'bold', cursor:'pointer', position:'absolute'}}/>
          </div>
          <div>{setLT.edit}</div>
          <div style={{width:'30px', height:'30px'}}></div>
        </div>
        <Modal.Body className='' style={{backgroundColor:'#ffffff99', padding: w<300 ? '5px' : '5px 15px 15px'}}>
          <div style={{fontWeight: 450, margin: '10px 0px', overflow: 'scroll', whiteSpace:'noWrap'}}>{taskX && taskX.taskName}</div>
          {imageConst}
          {imageCommentConst}
          {onEditImageBtn}
        </Modal.Body>
      </Modal>
    )

    const adsBox = <div className='adsbox'><AdsHorizontal id='adsProject' /></div>

    return (
      <div>
        <Container>
          <div style={{marginTop:'20px'}}>
            {projectManagementTitle}
            {newProject}
            {allProjectsList}
            {/* projects */}
          </div>
          {modalProjectView}
          {modalDeleteProject}
          {modalDeleteTask}
          {modalAccess}
          {modalUnAccess}
          {modalSaveCheck}
          {modalImageShow}
          {modalAddImage}
          {modalEditImage}
        </Container>
        {googleAds && adsBox}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mainUserId: state.userInfo._id,
    mainUser: state.userInfo,
    access: state.userInfo.access,
    auth: state.auth,
    rtl: state.rtl,
    page: state.page,
    subject: state.subject,
    pageName: state.pageName,
    lang: state.lang,
    geo: state.geo,
    access: state.userInfo.access,
    setLT: state.setLT,

  }
}

export default connect (mapStateToProps)(ProjectManagement);
