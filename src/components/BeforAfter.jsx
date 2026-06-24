import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BsFillCaretLeftFill } from 'react-icons/bs';
import { s } from '../srcSet';

class BeforAfter extends Component {

  state = {
    w: window.innerWidth,
    circleSize: window.innerWidth<s ? 35 : 45,
    beforAfterHeight: 30,
    borderWidth: window.innerWidth<s ? 2 : 2,
    moveObjColor: '#ffffff',
    width:this.props.width,
    height:this.props.height==='100%' ? this.props.height : '400px',
    id:this.props.id
  }

  componentDidMount = async () => {
    const { id, width, height } = this.props
    // console.log(typeof(width)==='number', typeof(height)==='number')
    if(typeof(width)==='string' || typeof(height)==='string') {
      const component = document.getElementById(`component-${id}`)
      // component.style.border = '3px solid red'
      this.setState({
        width: component.offsetWidth,
        height: component.offsetHeight!==0 ? component.offsetHeight : 400,
      })
      // console.log('offsetHeight: ', component.offsetHeight)
    }
  }

  onComponent = (id) => {
    const cover = document.getElementById(`cover-${id}`)
    cover.style.display = ''
  }

  onMoveObject = (type, id) => {
    const component = document.getElementById(`component-${id}`)
    if(component) {
      if(type==='enter') {
        component.classList.remove('cover-parent');
        component.classList.remove('option-parent');
      } else {
        component.classList.add('cover-parent');
        component.classList.add('option-parent');
      }
    }
  }

  onStart = (e, id, touch) => {
    const { circleSize } = this.state

    const component = document.getElementById(`component-${id}`)
    const cover = document.getElementById(`cover-${id}`)
    const lineTop = document.getElementById(`lineTop-${id}`)
    const lineBottom = document.getElementById(`lineBottom-${id}`)
    const circle = document.getElementById(`circle-${id}`)
    const img = document.getElementById(id)

    const rectComponent = component.getBoundingClientRect();
    const componentL = rectComponent.left
    const lineTopL = lineTop.offsetLeft
    const lineBottomL = lineBottom.offsetLeft
    const circleL = circle.offsetLeft
    const imgW = img.offsetWidth

    const xz = touch ? e.touches[0].clientX : e.clientX
    const rectCircle = circle.getBoundingClientRect();
    const circleCenter = rectCircle.left + circleSize/2
    const diffXZ = xz - circleCenter + .5

    lineTop.style.left = lineTopL + "px"
    lineBottom.style.left = lineBottomL + "px"
    circle.style.left = circleL + "px"
    img.style.width = imgW + "px"

    this.setState({
      component, lineTop, lineBottom, circle, cover, img, componentL, xz,
      lineTopL: lineTopL + diffXZ,
      lineBottomL: lineBottomL + diffXZ,
      circleL: circleL + diffXZ,
      imgW: imgW - diffXZ,
      pressing: true
    })
  }

  onMove = (e, touch) => {
    const { circleSize, pressing, xz, img, imgW, lineTop, componentL, lineTopL, lineBottom, lineBottomL, circle, circleL, cover, borderWidth } = this.state
    const { width } = this.state

    const x = touch ? e.touches[0].clientX : e.clientX

    if (pressing) {
      if(x >= componentL && x < componentL + width - 1) {
        cover.style.display = 'none'
        const difX = x - xz
        lineTop.style.left = lineTopL + difX + "px"
        lineBottom.style.left = lineBottomL + difX + "px"
        circle.style.left = circleL + difX + "px"
        img.style.width = imgW - difX + "px"
        this.setState({ cover })
      } else {
        if(x < componentL) {
          lineTop.style.left = '0px'
          lineBottom.style.left = '0px'
          circle.style.left = `-${circleSize/2}px`
          img.style.width = '100%'
        } else {
          lineTop.style.left = `${width-borderWidth}px`
          lineBottom.style.left = `${width-borderWidth}px`
          circle.style.left = `${width-(circleSize/2)}px`
          img.style.width = '0%'
        }
      }
    }
  }

  onEnd = (touch) => {
    var { pressing, cover } = this.state
    if(pressing){
      if(!touch) cover.style.display = ''
      this.setState({ pressing: false })
    }
  }

  toggleMoveObject = (e, id) => {
    // console.log(id)

    this.onStart(e, id)

    document.addEventListener('mousemove', (e) => {
      this.onMove(e)
    })

    document.addEventListener('mouseup', async () => {
      this.onEnd()
    })
  }

  render() {
    const { w, width, height, circleSize, beforAfterHeight, borderWidth, moveObjColor } = this.state
    const { setLT, id, title, beforUrl, afterUrl, borderRadius } = this.props
    const beforAfterCenter = `calc(50% - ${beforAfterHeight/2}px)`
    const lineStyle = {width:borderWidth, height:height/2, margin:'0px', backgroundColor: moveObjColor, position:'absolute', left:(width-borderWidth)/2}
    const lineTop = <div id={`lineTop-${id}`} style={{ ...lineStyle, top:-circleSize/2 }}></div>
    const lineBottom = <div id={`lineBottom-${id}`} style={{ ...lineStyle, bottom:-circleSize/2 }}></div>

    const beforAfterStyle = { width:'90px', height:beforAfterHeight, margin:'0px 10px', fontWeight:450, color:'#ffffff', backgroundColor:'#ffffff40', borderRadius:'2px' }
    const beforAfter = (
      <div className='d-flex justify-content-between option-child' style={{ width:'100%', position:'absolute', top:beforAfterCenter }}>
        <div className='center disable-select' style={beforAfterStyle}>BEFORE</div>
        <div className='center disable-select' style={beforAfterStyle}>AFTER</div>
      </div>
    )
    const circle = (
      <div id={`circle-${id}`} className='center'
        style={{ width:circleSize, height:circleSize, border:`${w<s ? '2' : '2'}px solid ${moveObjColor}`,
          borderRadius:'50%', position:'absolute',
          left:(width-circleSize)/2, top:(height-circleSize)/2
        }}
      >
        <div>
          <BsFillCaretLeftFill style={{color:moveObjColor, transform:'rotate(0deg)'}}/>
          <BsFillCaretLeftFill style={{color:moveObjColor, transform:'rotate(180deg)'}}/>
        </div>
      </div>
    )
    const cover = (
      <div id={`cover-${id}`} className='cover-child' style={{width, height, position:'absolute'}}>
        {beforAfter}
      </div>
    )

    const moveObject = (
      <div id={`moveObject-${id}`} className='' style={{ cursor:'ew-resize' }}
        onMouseEnter={() => this.onMoveObject('enter', id)}
        onMouseLeave={() => this.onMoveObject('leave', id)}
        onMouseDown={(e) => this.toggleMoveObject(e, id)}

        onTouchStart={(e) => this.onStart(e, id, true)}
        onTouchMove={(e) => this.onMove(e, true)}
        onTouchEnd={(e) => this.onEnd(true)}
      >
        {lineTop}
        {circle}
        {lineBottom}
      </div>
    )

    // console.log('height: ', height)
    // console.log('propsHeight: ', this.props.height)
    return (
      <div id={`component-${id}`} className='d-flex cover-parent option-parent'
        style={{width, height, borderRadius, position:'relative', overflow:'hidden', justifyContent:'flex-end', direction:'ltr'}}
        onClick={() => {this.onComponent(id)}}>
        <div id={id} className='d-flex disable-select cardShadow'
          style={{ height:'100%', width:'50%', justifyContent:'flex-end', position:'absolute', overflow:'hidden' }}>
          <div style={{ height, width }}>
            <img className='d-flex'
              style={{ objectFit:'fill', objectPosition:'right', height, width }}
              src={afterUrl}
              alt={`${title}-after`}
            />
          </div>
        </div>
        {cover}
        <img className='disable-select'
          style={{ objectFit:'fill', height:'100%', width:'100%' }}
          src={beforUrl}
          alt={`${title}-befor`}
        />
        {moveObject}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    rtl: state.rtl,
    lang: state.lang,
    auth: state.auth,
    setLT: state.setLT,
  }
}

export default connect (mapStateToProps)(BeforAfter);
