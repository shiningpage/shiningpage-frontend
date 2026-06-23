import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Container, Button, Modal, Form } from 'react-bootstrap';
import { setBalance, setSubject, setAddress, setPageTitle, setPage } from '../dataStore/actions';
import LocalTable from './LocalTable';
import siteView from '../modules/siteView';
import SocialMediaHelp from './SocialMediaHelp';
import toFarsi from '../modules/toFarsi';
import { MdHelp, MdClose } from 'react-icons/md';
import { FaTwitch, FaSnapchatGhost, FaDiscord, FaSpotify, FaGlobe, FaTelegram, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa';
import { ImFacebook2 } from "react-icons/im";
import { FaSquareXTwitter } from "react-icons/fa6";
import { AiFillTikTok } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { serverURL, s, colors, socialTopics } from '../srcSet';
import { dig3, isoDateToNormal, serviceIdName, background, 
    countTopicsAndCategories, getBalance, } from '../helper';

const underReview = <span style={{margin:'', padding:'0px 5px', fontSize:'14px', fontWeight:400, color:'#ffffff', backgroundColor:'#000000', borderRadius:'5px'}}>Under Review</span>
const netAPIKey = process.env.REACT_APP_NETAPIKey

class SocialMediaPage extends Component{

    state = {
        w: window.innerWidth,
        pageName: this.props.setLT.socialMedia,
        serverServices:[],
        updatedServerServices:[],
        whoralyServices:[],
        activeWhoralyServices:[],
        targetTopics: [],
        targetCategories: [],
        targetServices: [],
        SMRecords : [],
        statistics: {},
        smIcon: '',
        topic: '',
        topicKey: '',
        category: '',
        service: '',
        link: '',
        quantity: 0,
        quantityDig3: '',
        charge: 0,
        chargeDig3: '£ 0',
        categoryErr: false,
        serviceErr: false,
        linkErr: false,
        quantityErr: false,
        minErr: false,
        maxErr: false,
        balanceErr: '',
        orderSuccess: '',
        description:'',
        publicDescription:'',
        updatingServices: '',
        instagramTotal: 0,
        youtubeTotal: 0,
        facebookTotal: 0,
        twitterTotal: 0,
        tiktokTotal: 0,
        linkedinTotal: 0,
        telegramTotal: 0,
        trafficTotal: 0,
        discordTotal: 0,
        snapchatTotal: 0,
        twitchTotal: 0,
        googleTotal: 0,
        spotifyTotal: 0,
        instagramDisabled: 0,
        youtubeDisabled: 0,
        facebookDisabled: 0,
        twitterDisabled: 0,
        tiktokDisabled: 0,
        linkedinDisabled: 0,
        telegramDisabled: 0,
        trafficDisabled: 0,
        discordDisabled: 0,
        snapchatDisabled: 0,
        twitchDisabled: 0,
        googleDisabled: 0,
        spotifyDisabled: 0,
        socialMediaIndex: false,
        instagramIcon: <FaInstagram style={{minWidth:'27px', minHeight:'27px', fontSize:'27px', margin:'0px', borderRadius:'6px', color:'#ffffff', backgroundImage: 'linear-gradient(to right top, #fcac0f, #fd9522, #fa7f30, #f36a3c, #e85647, #e44751, #dd395b, #d42d65, #d12174, #ca1b85, #be1e96, #ae27a8)'}}/>,
        youtubeIcon: <FaYoutube style={{minWidth:'25px', minHeight:'25px', fontSize:'29px', color:'#c4302b'}}/>,
        facebookIcon: <ImFacebook2 style={{minWidth:'25px', minHeight:'25px', fontSize:'27px', margin:'0px', color:'#3b5998'}}/>,
        twitterIcon: <FaSquareXTwitter style={{minWidth:'30px', minHeight:'30px', fontSize:'29px', margin:'0px', color:'#000000'}}/>,
        tikTokIcon: <AiFillTikTok style={{minWidth:'34px', minHeight:'34px', fontSize:'34px', margin:'0px', color:'#35141C'}}/>,
        linkedinIcon: <FaLinkedin style={{minWidth:'30px', minHeight:'30px', fontSize:'29px', margin:'0px', color:'#0077B5'}}/>,
        telegramIcon: <FaTelegram style={{minWidth:'30px', minHeight:'30px', fontSize:'29px', margin:'0px', color:'#24A1DE'}}/>,
        websiteTrafficIcon: <FaGlobe style={{minWidth:'25px', minHeight:'25px', fontSize:'26px', margin:'0px', color:'brown'}}/>,
        googleIcon: <FcGoogle style={{minWidth:'25px', minHeight:'25px', fontSize:'26px', margin:'0px'}}/>,
        spotifyIcon: <FaSpotify style={{minWidth:'25px', minHeight:'25px', fontSize:'26px', margin:'0px', color:'#21D05D'}}/>,
        snapchatIcon: <FaSnapchatGhost style={{minWidth:'25px', minHeight:'25px', fontSize:'26px', margin:'0px', color:'#F7F050'}}/>,
        discordIcon: <FaDiscord style={{minWidth:'25px', minHeight:'25px', fontSize:'26px', margin:'0px', color:'#5662EB'}}/>,
        twitchIcon: <FaTwitch style={{minWidth:'25px', minHeight:'25px', fontSize:'26px', margin:'0px'}}/>,
    }

    componentDidMount = async () => {
        window.scrollTo(0, 0)
        window.addEventListener("resize", this.onResize)
        // await this.props.dispatch(setPageTitle(`${this.state.pageName} | ShiningPage`))
        // await this.props.dispatch(setPage('social-media'))
        // await this.props.dispatch(setSubject('social-media'))
        // await this.props.dispatch(setAddress({ content:[], fix:this.state.pageName }))
        // siteView(this.props)
        if(this.props.mainUser?.access?.includes('socialMedia')) {
            this.setState({ socialMediaIndex: true })
            this.getOrders(true, false)
            this.updateServices()
        }
    }

    updateServices = async () => {
        this.setState({
            updatingServices: 'Loading services'
        })

        await this.getWhoralyServices()
        await this.getServerServices()

        this.setState({
            updatingServices: 'Checking services ...'
        })

        await new Promise(resolve => this.setState({}, resolve));

        const { whoralyServices, serverServices } = this.state
        // console.log('whoraly: ', whoralyServices)
        // console.log('server: ', serverServices)
        // console.log('updateServices')

        const missingInWhoralyItems = await this.missingInWhoraly(whoralyServices, serverServices)
        // console.log('missingInWhoralyItems: ', missingInWhoralyItems)

        if(missingInWhoralyItems.length>0) {
            this.setState({
                updatingServices: 'Updating services ...'
            })

            const updatedMissingInWhoralyItems = await this.updateServerServices(missingInWhoralyItems)
            // console.log(2, updatedMissingInWhoralyItems)
            await this.onSaveServerServices(updatedMissingInWhoralyItems)
            await this.getWhoralyServices()
        }

        // check duplicates
        await this.getDuplicateServices(this.state.whoralyServices)

        const missingInServiceItems = await this.missingInServer(whoralyServices, serverServices)
        // console.log("Services missing in ServerServices:", missingInServiceItems);

        if(missingInServiceItems.length>0) {
            this.setState({
                updatingServices: 'Updating services ...'
            })

            await this.deactivateServices(missingInServiceItems)
            await this.getWhoralyServices()
        }

        this.setState({
            updatingServices: 'Checking Changes ...'
        })
        const serviceChanges = await this.serviceChanges(whoralyServices, serverServices)
        // console.log('changes: ', serviceChanges)

        if(serviceChanges.length>0) {
            this.setState({
                updatingServices: 'Updating services ...'
            })

            await this.updateWhoralyPrices(serviceChanges)
            await this.getWhoralyServices()
        }

        this.setState({
            updatingServices: ''
        })
    }

    serviceChanges = async (whoralyServices, serverServices) => {
        var type, wChange = [], wObjChange = []
        for(let i=0; i<whoralyServices.length; i++) {
            var W = whoralyServices[i]
            for(let x=0; x<serverServices.length; x++) {
                var S = serverServices[x]
                if(W.service === S.service) {
                    if(W.rate !== S.rate) {
                        type = W.rate<S.rate ? 'increase' : 'decrease'
                        W.rate = S.rate
                        var SRate = parseFloat(S.rate)
                        var WRate = this.transformNumbers(SRate);
                        W.SRate = SRate
                        W.WRate = WRate
                        wChange.push({serviceObj:W, service:W.service, rate:S.rate, WRate, SRate, type})
                        wObjChange.push(W)
                        // console.log('W:', W)
                        // console.log(W.service, W.rate, S.rate)
                        // console.log(W)
                        break;
                    }
                }
            }
        }
        // if(this.props.fullAccess) console.log('shortChanges: ', wChange)
        return wObjChange
    }

    missingInWhoraly = async (whoralyServices, serverServices) => {
        // تبدیل آرایه ServerServices به یک آبجکت برای دسترسی سریع‌تر به سرویس‌ها
        const whoralyServicesSet = new Set(whoralyServices.map(service => service.service));

        // console.log(4455, whoralyServicesSet)
        // حالا بررسی سرویس‌های WhoralyServices و پیدا کردن سرویس‌هایی که در ServerServices نیستند
        const WMissingServices = [];

        serverServices.forEach(serverService => {
            if (!whoralyServicesSet.has(serverService.service)) {
                WMissingServices.push(serverService);
            }
        });

        // نمایش سرویس‌هایی که در ServerServices وجود ندارند
        // console.log("Services missing in WhoralyServices:", WMissingServices);
        return WMissingServices
    }

    missingInServer = async (whoralyServices, serverServices) => {
        // فیلتر کردن آبجکت‌هایی که active آنها true است
        const activeWhoralyServices = whoralyServices.filter(service => service.active === true);
        // console.log(666, whoralyServices, activeWhoralyServices)
        // تبدیل آرایه ServerServices به یک آبجکت برای دسترسی سریع‌تر به سرویس‌ها
        const serverServicesSet = new Set(serverServices.map(service => service.service));

        // حالا بررسی سرویس‌های WhoralyServices و پیدا کردن سرویس‌هایی که در ServerServices نیستند
        const SMissingServices = [];

        activeWhoralyServices.forEach(service => {
            if (!serverServicesSet.has(service.service)) {
                SMissingServices.push(service);
            }
        });

        // نمایش سرویس‌هایی که در ServerServices وجود ندارند
        // console.log("Services missing in ServerServices:", SMissingServices);
        return SMissingServices
    }

    deactivateServices = async (services) => {
        for(let i=0; i<services.length; i++) {
            const service = {
                service: services[i]
            }
            await axios.post(`${serverURL}/socialMedia/deactivateService`, service).then(async res => {
                const data = res.data;
                if(this.props.fullAccess) console.log('deactivated: ', data);
            });
        }
    }

    updateWhoralyPrices = async (services) => {
        for(let i=0; i<services.length; i++) {
            const service = {
                service: services[i]
            }
            // console.log(service.service)
            await axios.post(`${serverURL}/socialMedia/updateServicePrice`, service).then(async res => {
                const data = res.data;
                if(this.props.fullAccess) console.log('price changed: ', data);
            });
        }
    }

    getWhoralyServices = async () => {
        this.setState({
            whoralyServicesLoading: true
        })
        const newState = {}
        const services = await axios.get(`${serverURL}/socialMedia/getWhoralyServices/`)
        var whoralyServices = services.data
     // console.log('whoralyServices: ', whoralyServices.length)
        // const activeWhoralyServices = whoralyServices.filter(service => service.active === true);

     // console.log('whoralyServices: ', whoralyServices)
        const activeWhoralyServices = whoralyServices.filter(service => 
            service.active === true && 
            Object.values(socialTopics).includes(service.topic)
        );
        // console.log('Whoraly services: ', whoralyServices)
        // for(let i=0; i<whoralyServices.length; i++) {
        //     if(whoralyServices[i].service === '8790') {
        //         console.log(1, whoralyServices[i])
        //         break;
        //     }
        // }

        const statistics = await countTopicsAndCategories(activeWhoralyServices)
     // console.log('statistics: ', statistics)

        // بروزرسانی state از تعداد سرویسها
        Object.keys(socialTopics).forEach(key => {
            const topic = socialTopics[key];
            newState[`${key}Total`] = statistics[topic] ? dig3(statistics[topic].total) : 0;
            newState[`${key}Disabled`] = statistics[topic] ? dig3(statistics[topic].disabledCount) : 0;
        });
        this.setState(newState);

        this.setState({
            whoralyServices,
            activeWhoralyServices,
            statistics,
            whoralyServicesLoading: false
        })
    }

    getDuplicateServices = async (services) => {
        // فرض می‌کنیم آرایه whoralyServices از قبل تعریف شده است

        // Set برای ردیابی سرویس‌های منحصربه‌فرد
        const seenServices = new Set();
        // آرایه‌ای برای ذخیره سرویس‌های تکراری
        const duplicateServices = [];

        services.forEach(serviceObj => {
            const service = serviceObj.service;
            
            if (seenServices.has(service)) {
                duplicateServices.push(service);
            } else {
                seenServices.add(service);
            }
        });

        // نمایش سرویس‌های تکراری
     // console.log("Duplicate services:", duplicateServices);
    }

    getServerServices = async () => {
        const info = {
            key: netAPIKey,
            // service: 7582,
            // // link: 'mahmoud.sadollahi',
            // link: 'ariana_2010_sa',
            // quantity: 10,
            // action: 'add'
            // action: 'status',
            action: 'services',
            // action: 'balance',
            // order: '615698702',
            // orders: '615698702, 615145964'
        }
        await axios.post(`${serverURL}/socialMedia/getServerServices`, info).then(async res => {
            const data = res.data;
            this.setState({
                serverServices: data
            })
            // data.forEach(item => {
             // console.log(11119911111, data);
            // })
        });
    }

    updateServerServices = async (data) => {
        var priceArray = []
        // const data = this.state.serverServices;
        // const data = this.state.whoralyServices;

        data.forEach(item => {
            const categoryLower = item.category.toLowerCase();
            const nameLower = item.name.toLowerCase();
            const typeLower = item.type.toLowerCase();
         // console.log('categoryLower: ', categoryLower);

            if(item.category) {
                let found = false;
                for (const [key, value] of Object.entries(socialTopics)) {
                    // console.log('key: ', key);
                    if (categoryLower.startsWith(key) || categoryLower.includes(key)) {
                     // console.log('value: ', value);
                        item.topic = value;
                        found = true;
                        break; // Once the topic is assigned, no need to check other keys
                    }
                }

                if (!found) {
                    item.topic = "Other";
                }
            } else {
                item.topic = "Other";
            }

            var price = parseFloat(item.rate)
            item.serverPrice = price;
            item.whoralyPrice = this.transformNumbers(price);

            // active false
            if(price>1000 || typeLower.includes('package') || categoryLower.includes('package') || nameLower.includes('package')) {
                item.active = false;
                // console.log(item)
            }

            priceArray.push(price)

            // Delete JAP
            if(categoryLower.includes('jap ')) {
                item.category = item.category.replace('JAP ', '')
                // console.log('jap category', item.category)
            }
            if(nameLower.includes('jap ')) {
                item.name = item.name.replace('JAP ', '')
                // console.log('jap name', item.name)
            }

            // if (item.service === "1165") {
            //     console.log(item);
            // }
            // if (item.serverPrice === 0.0001) {
            //     console.log(item);
            // }
        });

        // Sort the array
        priceArray.sort((a, b) => a - b);
        // Remove duplicates by converting to a Set and back to an array
        let uniquePriceArray = Array.from(new Set(priceArray));
        // console.log(uniquePriceArray)

        this.setState({
            updatedServerServices: data
        })
        // console.log(data);
        return data
    }

    transformNumbers = (num) => {
        // تعیین محدوده‌های ورودی و خروجی برای مقادیر بین 0.0001 تا 100
        let minInput = 0.0001;
        let maxInput = 100;
        let minOutput = 3;
        let maxOutput = 200;

        // محاسبه ضریب برای تبدیل عدد 0.0001 به 3 و عدد 100 به 200
        let multiplier = (maxOutput - minOutput) / (maxInput - minInput);
        
        if (num > 200) {
            // اگر عدد بزرگتر از 200 باشد، 50٪ به آن اضافه می‌شود
            return Math.round(num * 1.5);
        } else if (num > 100) {
            // اگر عدد بین 100 و 200 باشد، 70٪ به آن اضافه می‌شود
            return Math.round(num * 1.7);
        } else {
            // برای اعداد بین 0.0001 تا 100
            let result = minOutput + multiplier * (num - minInput);
            return Math.min(Math.round(result), maxOutput);
        }
    }

    onSaveServerServices = async (services) => {
        if(services.length>0) {
            axios.post(`${serverURL}/socialMedia/saveServices`, services).then(res => {
                // console.log(res.data)
            })
        } else {
            console.log('There is no service.')
        }
    }

    onToggleNewOrder = async (key, sm) => {
        var { toggleNewOrder, activeWhoralyServices, targetTopics, targetCategories, whoralyServicesLoading, orderSuccess } = this.state
        // console.log(sm)
        if(!whoralyServicesLoading) {
            if(toggleNewOrder) {
                this.setState({
                    targetCategories: [],
                    targetServices: [],
                    targetService: [],
                    smIcon: '',
                    topic: '',
                    topicKey: '',
                    category: '',
                    service: '',
                    link: '',
                    quantity: 0,
                    quantityDig3: '',
                    charge: 0,
                    chargeDig3: '£ 0',
                    categoryErr: false,
                    serviceErr: false,
                    linkErr: false,
                    quantityErr: false,
                    minErr: false,
                    maxErr: false,
                    balanceErr: '',
                })
            }

            if(sm) {
                this.setState({
                    orderSuccess: '',
                })
            }
            await this.getSmIcon(sm)
            if(activeWhoralyServices.length>0) {
                targetTopics = activeWhoralyServices.filter(service => service.topic === sm);
                // console.log(targetTopics)
                // make an array of categories
                const categories = targetTopics.map(service => service.category);
                targetCategories = [...new Set(categories)];
            }
            // console.log(targetCategories)
            // console.log(targetTopics)
            this.setState({
                topicKey: key,
                topic: sm,
                targetCategories,
                targetTopics,
                toggleNewOrder: !toggleNewOrder,
            })
        }
    }

    onCategoryBox = async () => {
        var { toggleCategory } = this.state
        if(!toggleCategory) {
            await this.mapCategories()
        }

        this.setState({
            toggleCategory: !toggleCategory,
        })
    }

    onCategory = async (item) => {
        var { targetTopics, targetServices } = this.state

        targetServices = targetTopics.filter(service => service.category === item);
        // console.log(111, targetServices)

        await this.setState({
            service:'',
            targetServices,
            category: item,
            toggleCategory: false,
            categoryErr: false,
        })
        this.onServiceBox()
    }

    mapCategories = async () => {
        const { w, targetCategories, topic, category, statistics } = this.state
        const {setLT, rtl, fullAccess} = this.props
        const myStyle = { width:'100%', marginBottom:'10px', padding:'10px', fontWeight:400, borderRadius:'8px', direction:rtl ? 'rtl' : 'ltr' }
        const selectedStyle = {...myStyle, backgroundColor:'#27d04450'}
        var categolyList = targetCategories.map(
            (item, i) => {
                // console.log(item)
                const itemST = statistics[topic].categories[item]
                const disabled = itemST.disabledCount
                // console.log(itemST)
                return (
                    <div key={i} className='d-flex justify-content-between btnShadow'
                        style={item===category ? selectedStyle : {...myStyle, backgroundColor: itemST.enabledCount>0 ? '#ffffff' : '#99999920'}}
                        onClick={() => this.onCategory(item)}
                    >
                        <div>{item}</div>
                        <div className='d-flex'>
                            {itemST.total}
                            {fullAccess && disabled!==0 && <span style={{color:'brown', margin:'0px 5px'}}>({disabled})</span>}
                        </div>
                    </div>
                )
            }
        )

        this.setState({
            categolyList
        })
    }

    onServiceBox = async () => {
        const { toggleService } = this.state
        if(!toggleService) {
            await this.mapServices()
        }

        this.setState({
            toggleService: !toggleService,
        })
    }

    onService = (e, item) => {
        if(item.enable) {
            // console.log(123)
            // console.log(e.target.id)
            this.setState({
                service: item,
                quantity: 0,
                quantityDig3: '',
                charge: 0,
                chargeDig3: '£ 0',
                toggleService: e.target.id==='editBtn' ? true : false,
                serviceErr: false,
            })
        }
    }

    mapServices = async () => {
        const { w, targetServices, service } = this.state
        // console.log(1000, targetServices)
        const { setLT, rtl, fullAccess } = this.props
        const myStyle = {width:'100%', marginBottom:'10px', padding:'10px', fontWeight:400, borderRadius:'8px', backgroundColor:'#ffffff', direction:rtl ? 'rtl' : 'ltr' }
        const selectedStyle = {...myStyle, backgroundColor:'#27d04450'}
        var serviceList = targetServices.map(
            (item, i) => {
                // console.log(i+1, item.enable)
                const edit = <span id='editBtn' className='underline' style={{margin:'0px 20px', color:'blue', display: fullAccess ? '' : 'none'}} onClick={() => this.onToggleEditService(item)}>Edit</span>
                return (
                    <div key={i} className={`${item.enable ? 'btnShadow' : ''}`}
                        style={item.name===service.name ? selectedStyle : (item.enable ? myStyle : {...myStyle, backgroundColor:'#99999920'})}
                        onClick={(e) => this.onService(e, item)}
                    >
                        <div className='d-flex'>
                            <span style={{width:'100%', }}>{item.service} - {item.name} - £{item.whoralyPrice}</span>
                            {fullAccess && edit}
                        </div>
                        {!item.enable && underReview}
                    </div>
                )
            }
                // console.log(item), - ${item.rate} - £{item.serverPrice*.78}

        )

        this.setState({
            serviceList
        })
    }

    onToggleEditService = (item) => {
        var { toggleEditService,  } = this.state
        if(item) {
            // console.log(item)
            this.setState({
                service: item,
                toggleEditService: !toggleEditService
            })

        } else {
            this.setState({
                targetService: [],
                toggleEditService: !toggleEditService
            })
        }

    }

    onSaveChanges = async () => {
        var { service, activeWhoralyServices, targetServices } = this.state
        // console.log(11111, service)
        this.setState({
            editingService: true
        })

        await axios.post(`${serverURL}/socialMedia/editService`, {service}).then(res => {
            // console.log(100, res.data)
            const updatedService = res.data

            // update activeWhoralyServices
            for(let i=0; i<activeWhoralyServices.length; i++) {
                if(activeWhoralyServices[i]._id === updatedService._id) {
                    // console.log(1, activeWhoralyServices[i])
                    // console.log(2, updatedService)
                    activeWhoralyServices[i] = updatedService
                    break;
                }
            }

            // update targetServices
            for(let i=0; i<targetServices.length; i++) {
                if(targetServices[i]._id === updatedService._id) {
                    // console.log(1, targetServices[i])
                    // console.log(2, updatedService)
                    targetServices[i] = updatedService
                    break;
                }
            }

        })
        // console.log(99, service)

        // console.log('save changes')

        this.setState({
            editingService: false
        })

        this.onToggleEditService()
        this.mapServices()
    }

    getSmIcon = async (sm) => {
        const { youtubeIcon, facebookIcon, twitterIcon, tikTokIcon,
            linkedinIcon, telegramIcon, websiteTrafficIcon, instagramIcon,
            googleIcon, spotifyIcon, snapchatIcon, discordIcon, twitchIcon
        } = this.state
        // console.log(sm)
        let smIcon
        switch(sm) {
            case 'Instagram': smIcon = instagramIcon; break;
            case 'Youtube': smIcon = youtubeIcon; break;
            case 'Facebook': smIcon = facebookIcon; break;
            case 'X (Twitter)': smIcon = twitterIcon; break;
            case 'TikTok': smIcon = tikTokIcon; break;
            case 'Linkedin': smIcon = linkedinIcon; break;
            case 'Telegram': smIcon = telegramIcon; break;
            case 'Traffic': smIcon = websiteTrafficIcon; break;
            case 'Discord': smIcon = discordIcon; break;
            case 'Snapchat': smIcon = snapchatIcon; break;
            case 'Twitch': smIcon = twitchIcon; break;
            case 'Google': smIcon = googleIcon; break;
            case 'Spotify': smIcon = spotifyIcon; break;
            default: smIcon = ''
        }
        this.setState({ smIcon })
    }

    changeHandler = async (e, type) => {
        const tx = toFarsi(e.target.value)
        const formattedValue = type === 'number' ? tx.replace(/\D/g, '') : tx;
        const name = e.target.name
        await this.setState({ [name]: formattedValue });

        var { quantity, service } = this.state
        if(name==='link') this.setState({ linkErr: false })
        if(name==='description') {
            this.setState(prevState => {
                let service = { ...prevState.service }; // کپی حالت فعلی
                service.description = this.state.description; // تغییرات در کپی اعمال می‌شود
                return { service }; // بازگشت حالت جدید
            });
        }
        if(name==='quantity') {
            if (quantity > 0) {
                this.setState({
                    quantityDig3: dig3(Number(quantity)),
                    quantityErr: false,
                });

                if(service!=='') {
                    // console.log(quantity)
                    const charge = (quantity * (service.whoralyPrice / 1000)).toFixed(2);
                    this.setState({
                        charge: parseFloat(charge),
                        chargeDig3: `£ ${dig3(charge)}`,
                    });
                }

                if (quantity >= service.min) {
                    this.setState({ minErr: false });
                }

                if (quantity < service.max) {
                    this.setState({ maxErr: false });
                }
            } else {
                this.setState({ quantityErr: true });
                if(quantity==='' || service==='') {
                    this.setState({
                        quantityDig3:'',
                        chargeDig3:'£ 0',
                        charge: 0,
                    });
                }
            }


        }
    }

    checkNull = () => {
        const { category, service, link, quantity } = this.state
        var infoErr = {}
        // console.log(service)
        // console.log(Number(quantity))
        if(category==='') infoErr.categoryErr = true
        if(service==='') infoErr.serviceErr = true
        if(link==='') infoErr.linkErr = true
        if(quantity <= 0) {
            infoErr.quantityErr = true
        } else {
            if(quantity < service.min) infoErr.minErr = `Quantity cannot be less than the ${dig3(service.min)}.`
            if(quantity > service.max) infoErr.maxErr = `Quantity cannot be greater than the ${dig3(service.max)}.`
        }
        return infoErr
    }

    onSubmitOrder = async () => {
        this.setState({
            sendingOrder: true 
        })
        await getBalance(this.props.mainUserId, this.props.dispatch)
        const { topic, category, service, link, quantity, charge } = this.state
        var infoErr = this.checkNull()
        if(Object.keys(infoErr).length>0) {
            // console.log(infoErr)
            this.setState({
                categoryErr: infoErr.categoryErr,
                serviceErr: infoErr.serviceErr,
                linkErr: infoErr.linkErr,
                quantityErr: infoErr.quantityErr,
                minErr: infoErr.minErr,
                maxErr: infoErr.maxErr,
                sendingOrder: false
            })
        } else {
            // console.log(this.props.balance, charge)
            if(this.props.balance>=charge) {
                const data = {
                    key: netAPIKey,
                    action: 'add',
                    topic,
                    service: service.service,
                    link,
                    quantity: Number(quantity),
                    charge
                }
                // console.log('true', data)
                axios.post(`${serverURL}/socialMedia/addOrder`, data).then(async res => {
                    const orderId = res.data.order
                    // const orderId = '615698702'
                    if(orderId) {
                        const orderData = {
                            userId: this.props.mainUserId,
                            category: 'Social Media',
                            subject: 'Social Media',
                            action: 'Order',
                            topic,
                            orderId,
                            link,
                            serviceId: service.service,
                            serviceName: service.name,
                            quantity,
                            amount: -charge,
                            status: 'Pending',
                        }
                        const payment = await axios.post(`${serverURL}/finance/payment`, orderData)
                        // console.log(1, payment.data)
    
                        const info = {
                            key: netAPIKey,
                            action: 'status',
                            orders: orderId
                        }
    
                        // console.log(info)
                        await axios.post(`${serverURL}/socialMedia/orderStatus`, info).then(async res => {
                            // console.log(res.data)
                            const orderStatus = res.data
    
                            // console.log(2, orderData)
                            await this.getOrders(false, false)
                            getBalance(this.props.mainUserId, this.props.dispatch)
                            this.updateOrders()
                            this.onToggleNewOrder()
                            this.setState({
                                sendingOrder: false,
                                orderSuccess: 'We received your order successfully.',
                            })
                        });
                    } else {
                        console.log('err')
                    }
                });
            } else {
                this.setState({
                    balanceErr: `Your balance is insufficient for this order.<br />Your current balance: £${this.props.balance}`,
                    sendingOrder: false,
                })
            }

        }
    }

    getOrders = async (updateStatus, updateOrders) => {
        this.setState({
            SMRecordsLoading: updateOrders ? false : true
        })
        const records = await axios.get(`${serverURL}/socialMedia/getOrders/` + this.props.mainUserId)
        var recordsData = records.data
        // console.log(recordsData)

        // update status
        if(updateStatus) {
            const orderIds = recordsData
                .filter(item => item.status !== 'Completed')  // فیلتر کردن آیتم‌هایی که status آن‌ها برابر با 'Completed' است
                .map(item => item.orderId)                  // استخراج orderId از آیتم‌های فیلتر شده
                .join(', ');                                // تبدیل آرایه به رشته با جداکننده‌ی ', '
    
            // console.log(orderIds)
            const info = {
                key: netAPIKey,
                action: 'status',
                orders: orderIds
            }
            const recordStatus = await axios.post(`${serverURL}/socialMedia/orderStatus`, info)
            var statusArray = recordStatus.data
            // console.log(statusArray)
    
            for (let i = 0; i < recordsData.length; i++) {
                const orderId = recordsData[i].orderId;
                if (statusArray.hasOwnProperty(orderId)) {
                    recordsData[i].status = statusArray[orderId].status;
                    recordsData[i].remains = statusArray[orderId].remains;
                    recordsData[i].start_count = statusArray[orderId].start_count;
                    // console.log(statusArray[orderId].status)
                    // if(statusArray[orderId].status==='Completed') {
                        axios.post(`${serverURL}/socialMedia/editOrder`, { order: recordsData[i] }).then(res => {
                            // console.log(100, res.data)
                        })
                    // }
                }
            }
        }

        const reorderedData = recordsData.map(item => ({
            _id: item._id,
            ID: background(item.orderId, item.status),
            Media: this.mediaIcone(item.topic),
            Date: isoDateToNormal(item.createdAt),
            Charge: '£' + dig3(-item.amount),
            Link: item.link,
            "Start Count": item.start_count,
            Quantity: dig3(item.quantity),
            Service: serviceIdName(item.serviceId, item.serviceName),
            Remains: item.remains,
            Status: background(item.status, item.status, 12),
        }));
        // console.log(123, reorderedData)

        this.setState({
            SMRecords: reorderedData,
            SMRecordsLoading: false
        })
    }

    mediaIcone = (topic) => {
        const iconMap = {
            Instagram: this.state.instagramIcon,
            Youtube: this.state.youtubeIcon,
            Facebook: this.state.facebookIcon,
            X: this.state.twitterIcon,
            TikTok: this.state.tikTokIcon,
            Linkedin: this.state.linkedinIcon,
            Telegram: this.state.telegramIcon,
            Traffic: this.state.websiteTrafficIcon,
            Discord: this.state.discordIcon,
            Snapchat: this.state.snapchatIcon,
            Twitch: this.state.twitchIcon,
            Spotify: this.state.spotifyIcon,
        };
    
        const icon = iconMap[topic];

        if (!icon) return null; // اگر آیکن پیدا نشد، مقدار `null` برمی‌گردد

        // استخراج اندازه‌ی فعلی از استایل‌های آیکن
        const currentSize = parseFloat(icon.props.style?.fontSize || 30); // مقدار پیش‌فرض ۳۰
        const newSize = currentSize * 0.8; // ۲۰٪ کوچک‌تر

        return React.cloneElement(icon, { 
            style: { 
                ...icon.props.style, 
                fontSize: newSize, 
                minWidth: newSize, 
                minHeight: newSize 
            }
        });
    };

    updateOrders = async () => {
        this.setState({ ordersUpdating: true})
        await this.getOrders(true, true)
        this.setState({ ordersUpdating: false })
    }

    onActiveAll = async () => {
        this.setState({ activingAll: true})
        await axios.get(`${serverURL}/socialMedia/activeAll`)
        this.setState({ activingAll: false })
    }

    toggleServiceOption = (x) => {
        this.setState(prevState => {
            let service = { ...prevState.service }; // کپی حالت فعلی
            service[x] = !service[x]; // تغییرات در کپی اعمال می‌شود
            return { service }; // بازگشت حالت جدید
        });
    }

    mapSocialBtns = (key, icon, label, total, disabled) => {
        const { w, whoralyServicesLoading, topic, statistics } = this.state
        const { rtl, fullAccess } = this.props
        // const disabledN = dig3(Number(disabled ? disabled.replace(',', '') : ''))
        const netBtnStyle = { width:'100%', maxHeight:'60px',
            margin:'0px', padding: w>s ? '10px' : '5px', borderRadius:'8px',
            backgroundColor: whoralyServicesLoading
                ? '#99999999'
                : statistics[label]?.enabledCount>0 ? '#ffffff' : '#99999999',
            direction:rtl ? 'rtl' : 'ltr', alignItems:'center', transition:'.3s',
            flexDirection: w < 450 ? 'column' : '' }
        return (
            <div key={key}
                className={`${w < 450 ? 'center' : 'd-flex'} btnShadow`} 
                style={netBtnStyle} 
                onClick={() => this.onToggleNewOrder(key, label)}
            >
                {icon}
                {w > 450 && <div style={{width:'10px'}}></div>}
                <div style={{fontSize:'14px'}}>
                    {w > 450 && <div>{label}</div>}

                    <div style={{fontSize:'12px', fontWeight:450}}>
                        {total}
                        {fullAccess && disabled!=='0' && <span style={{color:'brown', margin:'0px 5px'}}>({disabled})</span>}
                    </div>
                </div>
            </div>
        )
    }

    onToggleHelp = () => {
        this.setState({
            toggleHelp: !this.state.toggleHelp
        })
    }

    // important code
    autoResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    onResize = async () => {
        this.setState({ w:window.innerWidth })
    }

    render () {
        const { w, activingAll, toggleHelp, topic, topicKey, publicDescription, editingService, toggleEditService, orderSuccess,
            balanceErr, ordersUpdating, sendingOrder, SMRecordsLoading, SMRecords,
            categoryErr, serviceErr, linkErr, quantityErr, minErr, maxErr, serviceList,
            toggleService, categolyList, toggleCategory, charge, chargeDig3, quantity,
            quantityDig3, link, service, category, youtubeIcon, facebookIcon, twitterIcon,
            tikTokIcon, linkedinIcon, telegramIcon, websiteTrafficIcon, instagramIcon,
            googleIcon, spotifyIcon, snapchatIcon, discordIcon, twitchIcon,
            smIcon, toggleNewOrder, activeWhoralyServices, whoralyServicesLoading,
            instagramTotal, youtubeTotal, facebookTotal, twitterTotal, tiktokTotal,
            linkedinTotal, telegramTotal, trafficTotal, discordTotal,
            snapchatTotal, twitchTotal, googleTotal, spotifyTotal,
            instagramDisabled, youtubeDisabled, facebookDisabled, twitterDisabled, tiktokDisabled,
            linkedinDisabled, telegramDisabled, trafficDisabled, discordDisabled,
            snapchatDisabled, twitchDisabled, googleDisabled, spotifyDisabled,
            updatingServices, serverServices, updatedServerServices, socialMediaIndex,
        } = this.state
        const { rtl, fc, mainUser, page, setLT, fullAccess, balance } = this.props

        const titleStyle = {fontSize:'18px', fontWeight:450, margin:'15px 0px 0px 0px', textAlign: rtl ? 'right' : 'left', alignItems:'center'}
        const boxStyle = { width:'100%', marginBottom:'20px' }
        const itemStyle = { width:'100%', marginBottom:'10px', padding:'10px', backgroundColor:'#ffffff', border:'0px solid #CED4DA', borderRadius:'5px', direction:rtl ? 'rtl' : 'ltr', alignItems:'center'}
        const descriptionStyle = { color:'blue', marginBottom:'10px', padding:'5px', fontSize:'15px', fontWeight:400, whiteSpace:'break-spaces', display: service ? '' : 'none' }

        const loader13 = <div className='loader-13' style={{fontSize:'11px', margin: rtl ? '30px 20px -30px' : '-5px 20px -5px', color:'', transform: rtl ? 'rotate(180deg)' : ''}}></div>

        const updateServicesBtn = (
            <div className='d-flex center' style={{width:'100%', alignItems:'center', margin:'15px 0px'}}>
                <div className='d-flex animated fadeInDown btnShadow waves-effect waves-light btn-large backBlur'
                    style={{animationDelay:'0s', width:'', height:'40px', padding:'10px', textDecoration:'none', color:'#ffffff',
                    fontSize:'16px', flexDirection:'', alignItems:'center', border:'2px solid black',
                    backgroundColor: 'green', borderRadius:'5px'}}
                    onClick = {() => this.updateServices()}>
                    <span style={{textDecoration:'none', fontSize:''}}>{updatingServices ? loader13 : 'Update Services'}</span>
                </div>
            </div>
        )

        const getServerServicesBtn = (
            <div className='d-flex center' style={{width:'100%', alignItems:'center', margin:'15px 0px'}}>
                <div className='d-flex animated fadeInDown btnShadow waves-effect waves-light btn-large backBlur'
                    style={{animationDelay:'0s', width:'', height:'40px', padding:'10px', textDecoration:'none', color:'#000000',
                    fontSize:'16px', flexDirection:'', alignItems:'center', border:'2px solid black',
                    backgroundColor: '#ffffff', borderRadius:'5px'}}
                    onClick = {() => this.getServerServices()}>
                    <span style={{textDecoration:'none', fontSize:''}}>Get Server Services</span>
                </div>
            </div>
        )

        const updateServerServicesBtn = (
            <div className='d-flex center' style={{width:'100%', alignItems:'center', margin:'15px 0px'}}>
                <div className='d-flex animated fadeInDown btnShadow waves-effect waves-light btn-large backBlur'
                    style={{animationDelay:'0s', width:'', height:'40px', padding:'10px', textDecoration:'none', color:'#000000',
                    fontSize:'16px', flexDirection:'', alignItems:'center', border:'2px solid black',
                    backgroundColor: '#ffffff', borderRadius:'5px'}}
                    onClick = {() => this.updateServerServices(serverServices)}>
                    <span style={{textDecoration:'none', fontSize:''}}>Update Server Services</span>
                </div>
            </div>
        )

        const serverServicesSaveBtn = (
            <div className='d-flex center' style={{width:'100%', alignItems:'center', margin:'15px 0px'}}>
                <div className='d-flex animated fadeInDown btnShadow waves-effect waves-light btn-large backBlur'
                    style={{animationDelay:'0s', width:'', height:'40px', padding:'10px', textDecoration:'none', color:'#000000',
                    fontSize:'16px', flexDirection:'', alignItems:'center', border:'2px solid black',
                    backgroundColor: '#ffffff', borderRadius:'5px'}}
                    onClick = {() => this.onSaveServerServices(updatedServerServices)}>
                    <span style={{textDecoration:'none', fontSize:''}}>Save Services</span>
                </div>
            </div>
        )

        const buttons = [
            { key: 'instagram', icon: instagramIcon, label: 'Instagram', total: instagramTotal, disabled: instagramDisabled },
            { key: 'youtube', icon: youtubeIcon, label: 'Youtube', total: youtubeTotal, disabled: youtubeDisabled },
            { key: 'facebook', icon: facebookIcon, label: 'Facebook', total: facebookTotal, disabled: facebookDisabled },
            { key: 'twitter', icon: twitterIcon, label: 'X', total: twitterTotal, disabled: twitterDisabled },
            { key: 'tiktok', icon: tikTokIcon, label: 'TikTok', total: tiktokTotal, disabled: tiktokDisabled },
            { key: 'linkedin', icon: linkedinIcon, label: 'Linkedin', total: linkedinTotal, disabled: linkedinDisabled },
            { key: 'telegram', icon: telegramIcon, label: 'Telegram', total: telegramTotal, disabled: telegramDisabled },
            { key: 'snapchat', icon: snapchatIcon, label: 'Snapchat', total: snapchatTotal, disabled: snapchatDisabled },
            { key: 'twitch', icon: twitchIcon, label: 'Twitch', total: twitchTotal, disabled: twitchDisabled },
            { key: 'traffic', icon: websiteTrafficIcon, label: 'Traffic', total: trafficTotal, disabled: trafficDisabled },
            { key: 'discord', icon: discordIcon, label: 'Discord', total: discordTotal, disabled: discordDisabled },
            { key: 'spotify', icon: spotifyIcon, label: 'Spotify', total: spotifyTotal, disabled: spotifyDisabled },
        ];
            // { key: 'google', icon: googleIcon, label: 'Google', total: googleTotal, disabled: googleDisabled },

        const help = <span className='underline' style={{fontWeight:300, color:'blue', cursor:'pointer'}} onClick={() => this.onToggleHelp()}>Help</span>
        const activeAll = <span className='underline' style={{fontWeight:300, color:'blue', cursor:'pointer', margin:'0px 10px'}} onClick={() => this.onActiveAll()}>{activingAll ? loader13 : 'ActiveAll'}</span>
        const networkList = (
            <div style={{ width:'100%', marginBottom:'50px', borderRadius:'8px', overflow:'hidden', border:'2px solid #ffffff', backgroundColor:'#ffffff00' }}>
                <div style={{ fontSize:'15px', fontWeight:450, width:'100%', padding:'10px', backgroundColor:'#ffffff', }}>
                    {updatingServices
                        ? <span>{updatingServices} {loader13}</span>
                        : <div className={w<s ? '' : 'd-flex justify-content-between'}>
                            <div className='d-flex'>
                                <div>Select a Social Media</div>&nbsp;&nbsp;&nbsp;&nbsp;
                                {help}
                                {fullAccess && activeAll}
                            </div>
                            <div style={{fontWeight:400}}>Total Services: {dig3(activeWhoralyServices.length)}</div>
                        </div>
                    }
                </div>
                <div className='social-media-container'>
                    {buttons.map(({ key, icon, label, total, disabled }) =>
                        this.mapSocialBtns(key, icon, label, total, disabled)
                    )}
                </div>
            </div>
        )

        const orderList = (
            <div style={{ width:'100%', }}>
                <div className='d-flex'>
                    <div className='' style={{ fontWeight:'450', marginBottom:'10px' }}>Orders: {SMRecordsLoading ? loader13 : SMRecords.length}</div>
                    {SMRecords.length>0 && <span className='underline' style={{margin:'0px 20px', color:'blue', display: SMRecordsLoading ? 'none' : '', cursor:'pointer'}} onClick={() => this.updateOrders()}>{ ordersUpdating ? loader13 : 'Update' }</span>}
                </div>
                { SMRecords.length>0 &&
                    <LocalTable
                        data={SMRecords}
                        loading={SMRecordsLoading}
                        checkbox={false}
                        hiddenColumn={[1]}
                        searchBox={true}
                        controlColumn={true}
                        controls={false}
                        costomWidth={
                            {
                                Service: '400px',
                                Link: '400px',
                            }
                        }
                        alignCenterOff={
                            {
                                Service: true,
                                Link: true,
                            }
                        }
                        editUrl={'/crm/edit-record/'}
                    />
                }
                { !SMRecordsLoading && SMRecords.length===0 &&
                    <div>There is no Order.</div>
                }
            </div>
        )

//+ '$' + service.rate 
        const modalNewOrder = (
            <Modal show={toggleNewOrder} dialogClassName="border-radius-10" size='lg' onHide={() => this.onToggleNewOrder()}>
                <div className='d-flex sticky-top' style={{width:'100%', padding:'5px', alignItems:'center', justifyContent:'space-between', direction:'rtl', backgroundColor:'#ffffff', borderBottom:'1px solid #dddddd'}}>
                    <div className={`center`} onClick={() => this.onToggleNewOrder()}
                        style={{width:'30px', height:'30px', padding:'2px', margin:'0px', borderRadius:'100px', border: '3px solid #00000020'}}>
                        <MdClose className='sidebarIcon' style={{marginTop:'0px', width:'20px', fontSize:'20px', fontWeight:'bold', cursor:'pointer', position:'absolute'}}/>
                    </div>
                    <div style={{ fontWeight:400 }}>New Order</div>
                    <div style={{width:'30px', height:'30px'}}>{smIcon}</div>
                </div>
                <Modal.Body style={{backgroundColor:'#ffffff99', padding:'10px'}}>
                    <section className='btnShadow' style={{...itemStyle, fontWeight: category==='' ? '' : 400, border:categoryErr ? '1px solid red' : ''}} onClick={() => this.onCategoryBox()}>{category==='' ? 'Select a category ...' : category}</section>
                    {category && <section className='btnShadow' style={{...itemStyle, fontWeight: service==='' ? '' : 400, border:serviceErr ? '1px solid red' : ''}} onClick={() => this.onServiceBox()}>{service==='' ? 'Select a service ...' : service.service + ' - ' + service.name + ' - ' + '£' + service.whoralyPrice}</section>}
                    <div style={descriptionStyle}>{service.description}</div>
                    <div style={ titleStyle }>Link</div>
                    <input className='form-control' value={link} style={{...boxStyle, border:linkErr ? '1px solid red' : ''}} name="link" onChange={this.changeHandler}/>
                    <div style={ titleStyle }>Quantity</div>
                    <input className='form-control' value={quantityDig3} style={{...boxStyle, margin:'0px', border:quantityErr ? '1px solid red' : ''}} name="quantity" autoComplete='off' onChange={(e) => this.changeHandler(e, 'number')}/>
                    <span style={{ fontSize:'12px', fontWeight:400 }}>{service==='' ? 'Min: 0 - Max: 0' : `Min: ${dig3(service.min)} - Max: ${dig3(service.max)}`}</span>
                    <div style={{ fontSize:'12px', fontWeight:400, color:'red', display: minErr ? '' : 'none' }}>{minErr}</div>
                    <div style={{ fontSize:'12px', fontWeight:400, color:'red', display: maxErr ? '' : 'none' }}>{maxErr}</div>
                    <div style={ titleStyle }>Charge</div>
                    <input className='form-control' value={chargeDig3} style={boxStyle} placeholder='Charge' autoComplete='off' name="charge" onChange={this.changeHandler}/>
                    <div className='d-flex' style={{}}><MdHelp style={{marginTop:'1px', fontSize:'20px', color:'blue', alignItems:'center'}}/>&nbsp;{help}</div>
                    <Button className='' variant="primary" style={{ width:'100%', margin:'10px 0px', padding:'10px', fontSize:'16px', borderRadius:'5px' }} onClick={this.onSubmitOrder}>{sendingOrder ? loader13 : 'SUBMIT'}</Button>
                    <div className="alert alert-danger animated fadeInDown" role="alert" style={{textAlign:rtl ? 'right' : 'left', fontSize:'15px', borderRadius:'0px', display: balanceErr ? '' : 'none' }} dangerouslySetInnerHTML={{ __html: balanceErr }}></div>
                </Modal.Body>
            </Modal>
        )

        const modalCategories = (
            <Modal show={toggleCategory} dialogClassName="border-radius-10" size='lg' onHide={() => this.onCategoryBox()}>
                <div className='d-flex sticky-top' style={{width:'100%', padding:'5px', alignItems:'center', justifyContent:'space-between', direction:'rtl', backgroundColor:'#ffffff', borderBottom:'1px solid #dddddd'}}>
                    <div className={`center`} onClick={() => this.onCategoryBox()}
                        style={{width:'30px', height:'30px', padding:'2px', margin:'0px', borderRadius:'100px', border: '3px solid #00000020'}}>
                        <MdClose className='sidebarIcon' style={{marginTop:'0px', width:'20px', fontSize:'20px', fontWeight:'bold', cursor:'pointer', position:'absolute'}}/>
                    </div>
                    <div style={{ fontWeight:400 }}>Category List</div>
                    <div style={{width:'30px', height:'30px'}}>{smIcon}</div>
                </div>
                <Modal.Body className='d-flex' style={{backgroundColor:'#99999910', padding:'10px', flexWrap:'wrap'}}>
                    {categolyList}
                </Modal.Body>
            </Modal>
        )

        const modalServices = (
            <Modal show={toggleService} dialogClassName="border-radius-10" size='xl' onHide={() => this.onServiceBox()}>
                <div className='d-flex sticky-top' style={{width:'100%', padding:'5px', alignItems:'center', justifyContent:'space-between', direction:'rtl', backgroundColor:'#ffffff', borderBottom:'1px solid #dddddd'}}>
                    <div className={`center`} onClick={() => this.onServiceBox()}
                        style={{width:'30px', height:'30px', padding:'2px', margin:'0px', borderRadius:'100px', border: '3px solid #00000020'}}>
                        <MdClose className='sidebarIcon' style={{marginTop:'0px', width:'20px', fontSize:'20px', fontWeight:'bold', cursor:'pointer', position:'absolute'}}/>
                    </div>
                    <div style={{ fontWeight:400 }}>Service List</div>
                    <div style={{width:'30px', height:'30px'}}>{smIcon}</div>
                </div>
                <Modal.Body className='d-flex' style={{backgroundColor:'#99999910', padding:'10px', flexWrap:'wrap'}}>
                    <div style={{fontWeight:450, marginBottom:'15px'}}>{category}</div>
                    {serviceList}
                </Modal.Body>
            </Modal>
        )

        const modalEditService = (
            <Modal show={toggleEditService} dialogClassName="border-radius-10" size='xl' onHide={() => this.onToggleEditService()}>
                <div className='d-flex sticky-top' style={{width:'100%', padding:'5px', alignItems:'center', justifyContent:'space-between', direction:'rtl', backgroundColor:'#ffffff', borderBottom:'1px solid #dddddd'}}>
                    <div className={`center`} onClick={() => this.onToggleEditService()}
                        style={{width:'30px', height:'30px', padding:'2px', margin:'0px', borderRadius:'100px', border: '3px solid #00000020'}}>
                        <MdClose className='sidebarIcon' style={{marginTop:'0px', width:'20px', fontSize:'20px', fontWeight:'bold', cursor:'pointer', position:'absolute'}}/>
                    </div>
                    <div style={{ fontWeight:400 }}>Edit Service</div>
                    <div style={{width:'30px', height:'30px'}}>{smIcon}</div>
                </div>
                <Modal.Body style={{backgroundColor:'#ffffff99', padding:'10px'}}>
                    <section className='' style={{...itemStyle, fontWeight:400, border:'1px solid #CED4DA'}}>{category}</section>
                    <section className='' style={{...itemStyle, fontWeight:400, border:'1px solid #CED4DA'}}>{service.service + ' - ' + service.name + ' - ' + '£' + service.whoralyPrice}</section>
                    <div className="d-flex underline" onClick={() => this.toggleServiceOption('active')}
                        style={{marginBottom:'10px', alignItems:'center', justifyContent:'flex-end', flexDirection:'row-reverse'}}>
                        <Form.Label className='pointer' style={{margin:'0px 5px'}}>
                            Active
                        </Form.Label>
                        <Form.Check className='pointer' type="switch" checked={service.active ? true : false} onChange={() => null}/>
                    </div>
                    <div className="d-flex underline" onClick={() => this.toggleServiceOption('enable')}
                        style={{marginBottom:'10px', alignItems:'center', justifyContent:'flex-end', flexDirection:'row-reverse'}}>
                        <Form.Label className='pointer' style={{margin:'0px 5px'}}>
                            Enable
                        </Form.Label>
                        <Form.Check className='pointer' type="switch" checked={service.enable ? true : false} onChange={() => null}/>
                    </div>
                    <div style={ titleStyle }>Description</div>
                    <textarea className='form-control' value={service.description} style={boxStyle} name="description" rows="5" onChange={this.changeHandler}/>
                    <Button className='' variant="primary" style={{ width:'100%', margin:'10px 0px', padding:'10px', fontSize:'16px', borderRadius:'5px' }} onClick={this.onSaveChanges}>{editingService ? loader13 : 'Save Changes'}</Button>
                </Modal.Body>
            </Modal>
        )

        const modalHelp = (
            <Modal show={toggleHelp} dialogClassName="border-radius-10" size='xl' onHide={() => this.onToggleHelp()}>
                <div className='d-flex sticky-top' style={{width:'100%', padding:'5px', alignItems:'center', justifyContent:'space-between', direction:'rtl', backgroundColor:'#ffffff', borderBottom:'1px solid #dddddd'}}>
                    <div className={`center`} onClick={() => this.onToggleHelp()}
                        style={{width:'30px', height:'30px', padding:'2px', margin:'0px', borderRadius:'100px', border: '3px solid #00000020'}}>
                        <MdClose className='sidebarIcon' style={{marginTop:'0px', width:'20px', fontSize:'20px', fontWeight:'bold', cursor:'pointer', position:'absolute'}}/>
                    </div>
                    <div style={{ fontWeight:400 }}>Help</div>
                    <div style={{width:'30px', height:'30px'}}></div>
                </div>
                <Modal.Body style={{}}>
                    <SocialMediaHelp topic={topic} topicKey={topicKey} icons={{youtubeIcon, facebookIcon, twitterIcon,
                        tikTokIcon, linkedinIcon, telegramIcon, websiteTrafficIcon, instagramIcon,
                        googleIcon, spotifyIcon, snapchatIcon, discordIcon, twitchIcon}}/>
                </Modal.Body>
            </Modal>
        )

        const header = (
            <div className='center' style={{alignItems:'center', flexDirection:'column', padding: '0px 10px'}}>
                <div className='d-flex' style={{justifyContent:rtl ? 'space-between' : 'flex-end', alignItems:'center', width:'100%', direction:'rtl'}}>
                    <h1 className='animated fadeInLeft tx' style={{animationDelay:'.5s', color:'#ffffff', fontWeight:'bold', fontSize: w<s ? '30px' : '', textAlign:'center', margin:'30px 10px 30px'}}>{setLT.socialMedia}</h1>
                </div>
            </div>
        )

        return (
            <div className='' style= {{marginBottom:'50px'}}>
                { socialMediaIndex &&
                    <Container>
                        <div className='center' style={{flexDirection:'column', alignItems:'center'}}>
                            {header}
                        </div>
                        <div className='center' style={{width: '100%', flexDirection:'column', alignItems:'center'}}>
                            {networkList}
                            <div className="alert alert-success animated fadeInDown" role="alert" style={{width:'100%', textAlign:rtl ? 'right' : 'left', fontSize:'15px', display: orderSuccess ? '' : 'none', marginTop:'' }} dangerouslySetInnerHTML={{ __html: orderSuccess }}></div>
                            {/* fullAccess && updateServicesBtn */}
                            {orderList}
    
                            {/* fullAccess && getServerServicesBtn */}
                            {/* fullAccess && updateServerServicesBtn */}
                            {/* fullAccess && serverServicesSaveBtn */}
                        </div>
                        {/* <section style={{fontSize:'14px', marginBottom:'30px'}}>
                            {totalOrders}
                        </section> */}
                        {modalNewOrder}
                        {modalCategories}
                        {modalServices}
                        {modalEditService}
                        {modalHelp}
                    </Container>
                }
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        mainUser: state.userInfo,
        userInfo: state.userInfo,
        fc: state.userInfo.fc,
        rtl: state.rtl,
        lang: state.lang,
        auth: state.auth, 
        geo: state.geo, 
        page: state.page,
        setLT: state.setLT,
        balance: state.balance,
        fullAccess: state.fullAccess,

    }
}

export default connect (mapStateToProps)(SocialMediaPage);
