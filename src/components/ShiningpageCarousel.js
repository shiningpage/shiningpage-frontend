import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import aboutUsImg from '../assets/images/other/international.jpg';
import { s } from '../srcSet';
import { GiGlobe } from 'react-icons/gi';

import '../assets/css/carousel.css';
const checkmark = <span style={{color:'green'}}>✓</span>

class ShiningpageCarousel extends Component{

    state = {
        w: window.innerWidth,
        timeoutId: null,
        animatedText: <div></div>,
        interval: 10000,
        nextIcon: <GiGlobe/>,
        prevIcon: <GiGlobe/>,
        carouselItems: [
            {
                id: 'aboutInfo',
                type: 'about',
                logo: (
                    <div className='center'
                        style={{margin: '0px', padding:'0px', borderRadius:'6px', alignItems:'center', padding:'5px'}}>
                        <img
                            style={{width:'50px', height:'50px'}}
                            src='https://www.pix.shiningpage.com/whoraly/site/logo.png'
                            alt="logo"
                        />
                    </div>
                ),
                title: 'Shining Page',
                subTitle: <div>{this.props.setLT.globalLocalReach}</div>,
                comment: (
                    <h2 style={{fontSize:'18px', fontWeight:'bold'}}>
                        <span style={{fontSize:'20px'}}>{checkmark}</span>&nbsp;
                        {this.props.setLT.digitalPresencePlatform}
                    </h2>
                ),
                source: aboutUsImg,
            },
        ]
    }

    componentDidMount = async () => {
        await this.handleSelect(0)
    }

    scrollTo  = async (name) => {
        let elem = document.getElementById(name);
        if(elem) {
            // اسکرول به المان با استفاده از ref
            elem.scrollIntoView({
                // behavior: 'smooth',
                block: 'start',
            });
        }
        // window.scrollTo(0, elem.offsetTop)
    }
  
    textCarousel = (i, type) => {
        const { w, carouselItems } = this.state
        const { subUserInfo, rtl, setLT, lang } = this.props
        const fc = subUserInfo.fc
        const header = (
            <div className={`animated fadeIn`} style={{animationDelay:'.5s', width:'100%', padding:'10px', margin:'0px'}}>
              <h1 className='animated fadeInDown txWhite tx' style={{animationDelay:'0s', fontWeight:450, fontSize: w<s ? '30px' : '40px', textAlign:'center', margin: '70px 0px 50px'}}>{setLT.globalLocalReach}</h1>
            </div>
        )    
        const versionConst = (
            <div className='center' style={{color:'#00b3e0', fontWeight:450, fontSize: w<s ? '' : '', margin: '0px 0px 20px', alignItems:'flex-end', whiteSpace:'nowrap', direction:'ltr' }}>
                <span style={{}}>Version-</span>
                <span style={{}}>{import.meta.env.VITE_VERSION}</span>
            </div>
        )
        const logo = (
            <div className='center'
              style={{margin: '0px 5px 15px', padding:'0px', borderRadius:'6px', alignItems:'center', padding:'5px'}}>
              <img
                style={{width:'80px', height:'80px'}}
                src='https://www.pix.shiningpage.com/whoraly/site/logo.png'
                alt="logo"
              />
            </div>
        )
        // const intro = (
        //     <div className='animated fadeIn' style={{animationDelay:'.5s', width:'100%', padding:'10px', margin:'0px', backgroundColor:''}}>
        //       <div className='center ' style={{width:'100%', padding:'0px', marginBottom:'0px'}}>
        //         <Link to='/' className='center animated fadeIn btnShadow' style={{textDecoration:'none', animationDelay:'1.5s', width:'', padding:'20px', flexDirection:'column', alignItems:'center', backgroundColor:'#ffffff99', borderRadius:'10px'}}>
        //             {logo}
        //             <h1 className='txWhiteThin tx' style={{color:'#00c1f2', fontWeight:'bold', fontSize: w<s ? '40px' : '', textAlign:'center', margin:'0px'}}>Whoraly</h1>
        //             {versionConst}
        //             <h2 className='goldenText' style={{fontWeight:'bold', fontSize: w<s ? '30px' : '', textAlign:'center', margin: '0px'}}>Marketing Platform</h2>
        //         </Link>
        //       </div>
        //     </div>
        // )
    
        const textSection = (
            <div id='textCarousel'
                className={`animated ${ type==='out' ? 'fadeOut' : 'fadeIn' } backBlur`}
                style={{ minWidth:'250px', margin:w<s ? '20px' : '50px',
                    padding:'20px', borderRadius:'10px', backgroundColor:'#ffffff30',
                    animationDelay:type==='out' ? '2.5s' : '1s', position:'absolute'
                }}
            >
                <div>
                    <div className={`animated ${ type==='out' ? 'fadeOutDown' : 'fadeIn' } txWhiteThin tx f7`}
                        style={{fontSize:'25px', fontWeight:'bold', margin:'10px',
                            animationDelay:type==='out' ? '2s' : '1.5s'
                        }}
                    >
                        <div className='d-flex' style={{alignItems:'flex-end', direction:'ltr'}}>
                            {<span>{carouselItems[i].logo}</span>}
                            {carouselItems[i].logo && <div style={{width:'10px'}}></div>}
                            {carouselItems[i].title ? carouselItems[i].title.toUpperCase() : ''}
                        </div>
                    </div>
                    <div className={`animated ${ type==='out' ? 'fadeOutDown' : 'fadeIn' } wtx txWhiteThin tx`}
                        style={{fontSize:'20px', fontWeight:'bold', margin:'10px 10px 20px',
                            animationDelay:type==='out' ? '1.5s' : '2s'
                        }}
                    >
                        {carouselItems[i].comment}
                    </div>
                    <div className={`animated ${ type==='out' ? 'fadeOutDown' : 'fadeInDown' } wtx txWhiteThin tx`}
                        style={{fontSize:'20px', fontWeight:'bold', margin:'10px',
                            animationDelay:type==='out' ? '0.5s' : '2.5s'
                        }}
                    >
                        {carouselItems[i].subTitle}
                    </div>
                </div>
            </div>
        )
        return textSection
    }

    handleSelect = async (selectedIndex, e) => {
        const { timeoutId, carouselItems } = this.state
        // console.log(carouselItems)
        if(timeoutId) {
            clearTimeout(timeoutId);
        }
        await this.setState({ animatedText: '' })
        this.setState({ animatedText: this.textCarousel(selectedIndex) })
        if(carouselItems.length>1) {
            const newTimeoutId = setTimeout(() => {
                this.setState({ animatedText: this.textCarousel(selectedIndex, 'out') })
            }, 6000);
            this.setState({ timeoutId: newTimeoutId })
        }
    }

    render () {
        const { w, animatedText, interval, nextIcon, prevIcon, carouselItems, } = this.state
        const { subUserInfo, pageYOffset } = this.props
        // console.log(pageYOffset)
        return (
            <Carousel
                fade
                interval={10000}
                autoPlay={true}
                controls={false}
                indicators={carouselItems.length>1 ? true : false}
                pause={false}
                nextIcon ={nextIcon}
                prevIcon={prevIcon}
                onSelect={carouselItems.length>1 ? this.handleSelect : null}
            >
            {
                carouselItems.map (
                    (item, i) => {
                        return (
                            <Carousel.Item key={i} interval={interval}>
                                <div className='d-flex' style={{height:'', width:'100%', flexDirection:'column', alignItems:'flex-start', overflow:'hidden', direction:'ltr'}}>
                                    <img className={pageYOffset>200 ? '' : 'headerImgA'}
                                        style={{objectFit: w<s ? 'cover' : 'cover', height: w<s ? '600px' : '600px', width:'100%', borderRadius:'0px', filter:w<s ? 'blur(5px)' : 'blur(0px)', transition:'.3s'}}
                                        src={item.source}
                                        alt={`${item.title} about blur`}
                                    />
                                    <div style={{height:w<s ? '550px' : '600px', width:'100%', position:'absolute', overflow:'hidden'}}>
                                        <img className={pageYOffset>200 ? '' : 'headerImgB'}
                                            style={{objectFit:'contain', height:'100%', width:'100%', borderRadius:'5px', transition:'.3s'}}
                                            src={item.source}
                                            alt={`${item.title} about`}
                                        />
                                    </div>
                                    {animatedText}
                                </div>
                            </Carousel.Item>
                        )
                    }
                )
            }
        </Carousel>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        subUserInfo: state.subUserInfo,
        lang: state.lang,
        rtl: state.rtl,
        page: state.page,
        setLT: state.setLT,
        toggleSidebar: state.toggleSidebar,
        pageYOffset: state.pageYOffset,
    }
}

export default connect (mapStateToProps)(ShiningpageCarousel);
