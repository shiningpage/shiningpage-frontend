import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Carousel } from 'react-bootstrap';
import EditBtn from './EditBtn';
import { GiGlobe } from 'react-icons/gi';
import '../assets/css/carousel.css';
import ModalAboutImage from '../components/modals/ModalAboutImage';
import pixSave from '../modules/pixSave';
import pixDelete from '../modules/pixDelete';
import pixHandler from '../modules/pixHandler';
import pixResizer from '../modules/pixResizer';
import { s, serverURL, lightColors } from '../srcSet';
import { exist } from '../helper';

class WebCarousel extends Component{

    state = {
        w: window.innerWidth,
        selectedIndex:0,
        timeoutId: null,
        carouselItems: [],
        animatedText: <div></div>,
        interval: 9000,
        nextIcon: <GiGlobe/>,
        prevIcon: <GiGlobe/>,
        toggleAboutImage: false,

    }

    componentDidMount = async () => {
        window.addEventListener("resize", this.onResize)

        var data=[ {} ]
        const { bizName, username, jobSummary, aboutIndex, profileIndex, categoryItems=[] } = this.props.subUserInfo
        data[0].id = 'aboutInfo'
        data[0].type = 'about'
        data[0].folder = aboutIndex ? 'about' : 'profile'
        data[0].title = bizName ? bizName : username
        data[0].subTitle = jobSummary ? jobSummary : ''
        data[0].source = aboutIndex ? aboutIndex : profileIndex

        // for(var i=0; i<categoryItems.length; i++) {
        //     var obj = {}
        //     obj.id = 'psSub'
        //     obj.type = 'cat'
        //     obj.folder = 'category'
        //     obj.title = categoryItems[i].title
        //     obj.subTitle = ''//data[0].title
        //     obj.source = categoryItems[i].pixId
        //     data.push(obj)
        // }

        await this.setState({
            carouselItems: data
        })

        await this.handleSelect(0)
    }

    componentDidUpdate = async(prevProps) => {
        if (this.props.fc !== prevProps.fc) {
            this.setState({ animatedText: this.textCarousel(this.state.selectedIndex) })
        }
        if (this.props.mainUser !== prevProps.mainUser) {
            this.componentDidMount()
        }

    }

    scrollTo = async (name) => {
        const elem = document.getElementById(name);
        if (!elem) return;

        const yOffset = this.state.w<s ? -48 : -60; // پایین‌تر (منفی یعنی بالاتر از المان)
        const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
            top: y,
            behavior: 'smooth'
        });
    };

    textCarousel = (i, type) => {
        const { w, carouselItems } = this.state
        const { subUserInfo, rtl, setLT, adsInfo } = this.props
        const fc = subUserInfo.fc
        const txBlack = lightColors.includes(fc) ? true : false
        const textSection = (
            <div id='textCarousel'
                className={`${ type==='out' ? 'fadeOut' : 'animated fadeIn' } backBlur`}
                style={{ minWidth:w<500 ? `${w-40}px` : '250px', margin:w<s ? '50px 20px 20px' : '100px 50px 50px',
                    padding:'20px', borderRadius:'10px', backgroundColor:'#ffffff20',
                    animationDelay:type==='out' ? '2.5s' : '1s', position:'absolute'
                }}
            >
                <div className={`${ type==='out' ? 'fadeOutDown' : 'animated fadeInDown' } txWhiteThin tx f7`}
                    style={{fontSize:'25px', fontWeight:'bold', margin:'10px',
                        animationDelay:type==='out' ? '2s' : '1.5s'
                    }}
                >
                    {carouselItems[i].title ? carouselItems[i].title.toUpperCase() : ''}
                </div>
                <div className={`${ type==='out' ? 'fadeOutDown' : 'animated fadeInDown' } wtx txWhiteThin tx`}
                    style={{whiteSpace:'pre-wrap', fontSize:'20px', fontWeight:'bold', margin:'10px 10px 30px',
                        animationDelay:type==='out' ? '1.5s' : '2s'
                    }}
                >
                    {adsInfo.adsTitle}
                </div>
                <div className={`${ type==='out' ? 'fadeOutDown' : 'animated fadeIn' } center C${fc} underline`}
                    style={{width: carouselItems[i].id === 'aboutInfo' ? '60px' : '200px', minWidth:'100px', height: '', animationDelay:type==='out' ? '1s' : '2.5s',
                            textAlign:'center', fontWeight:400,
                            margin: '0px',
                            border: `3px solid ${[11].includes(fc) ? '#00000050' : '#ffffff80'}`,
                            padding: '5px',
                            color: `${lightColors.includes(fc) ? '#000000' : '#ffffff'}`,
                            borderRadius: '100px'}}
                    onClick={() => this.scrollTo(carouselItems[i].id)}
                >
                    <div className='d-flex'
                        style={{textDecoration:'none', cursor:'pointer', margin:rtl ? '0px' : '2px 0px 0px'}}>
                        { carouselItems[i].id === 'aboutInfo'
                            ?
                            setLT.about ? setLT.about.toUpperCase() : ''
                            :
                            setLT.ProductsServices
                        }
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
        this.setState(
            () => ({ animatedText: '' }),
            () => {
                this.setState({
                    animatedText: this.textCarousel(selectedIndex),
                    selectedIndex
                })
                if(carouselItems.length>1) {
                    const newTimeoutId = setTimeout(() => {
                        this.setState({ animatedText: this.textCarousel(selectedIndex, 'out') })
                    }, 6000);
                    this.setState({ timeoutId: newTimeoutId })
                }
            }
        )
    }

    toggleAboutImage = () => {
        this.setState({
            toggleAboutImage: !this.state.toggleAboutImage,
            aboutImageArray: [],
        });
    }

    onResize = async () => {
        this.setState({ w: window.innerWidth })
    }

    render () {
        const { w, toggleAboutImage, animatedText, interval, nextIcon, prevIcon, carouselItems, } = this.state
        const { rtl, mainUser, subUserInfo, pageYOffset, adsInfo } = this.props
        const me = mainUser._id===subUserInfo._id ? true : false
        const pIndx = adsInfo.pictureType===2 ? 1 : 0
        const modalAboutImage = (
            <ModalAboutImage
                pixDelete={pixDelete}
                pixSave={pixSave}
                pixHandler={pixHandler}
                pixResizer={pixResizer}
                EditBtn={EditBtn}
                exist={exist}
                serverURL={serverURL}
                toggleAboutImage={toggleAboutImage}
                onToggle={this.toggleAboutImage}
            />
        )

        return (
            <div style={{ position:'relative' }}>
                {/* me && <EditBtn top={w<s ? 20 : 70} rtl={rtl} onClick={() => this.toggleAboutImage()}/> */}
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
                    { adsInfo.pictures &&
                        carouselItems.map (
                            (item, i) => {
                                const imageUrl = `https://www.pix.shiningpage.com/whoraly/ads/big/${adsInfo._id}-${adsInfo.pictures[pIndx]}.jpeg`;
                                // console.log(i)
                                return (
                                    <Carousel.Item key={i} className="fadeIn" interval={item.type==='about' ? interval+1000 : interval}>
                                        <div className='d-flex' style={{height:'', width:'100%', flexDirection:'column', alignItems:'flex-start', overflow:'hidden'}}>
                                            <img className={pageYOffset>200 ? '' : 'headerImgA'}
                                                style={{objectFit: w<s ? 'cover' : 'cover', height: w<s ? '600px' : '600px', width:'100%', borderRadius:'0px', filter:w<s ? 'blur(5px)' : 'blur(0px)', transition:'.3s'}}
                                                src={imageUrl}
                                                alt={`${adsInfo.adsTitle} blur`}
                                            />
                                            <div style={{height:w<s ? '550px' : '600px', width:'100%', position:'absolute', overflow:'hidden'}}>
                                                <img className={pageYOffset>200 ? '' : 'headerImgB'}
                                                    style={{objectFit:'contain', height:'100%', width:'100%', borderRadius:'5px', transition:'.3s'}}
                                                    src={imageUrl}
                                                    alt={`${adsInfo.adsTitle}`}
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
                {modalAboutImage}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUser: state.userInfo,
        subUserInfo: state.subUserInfo,
        adsInfo: state.adsInfo,
        lang: state.lang,
        rtl: state.rtl,
        page: state.page,
        setLT: state.setLT,
        toggleSidebar: state.toggleSidebar,
        pageYOffset: state.pageYOffset,
    }
}

export default connect (mapStateToProps)(WebCarousel);
