import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { setUserServiceSelected, setToggleAds, setToggleShowVideo, setAdsInfo, setVideoInfo, setInstaInfo, setToggleVideo, setToggleInsta } from '../../../dataStore/actions';
import { BsImages, BsFillCheckCircleFill } from 'react-icons/bs';
import More from '../../More';
import MoreX from '../../MoreX';
import SearchTapeSection from './SearchTapeSection';
import CategorySection from './CategorySection';
import AdsSection from './AdsSection';
import VideoSection from './VideoSection';
import InstaSection from './InstaSection';
import { scrollInModal, identifyObj, exist, getUserInfo } from '../../../helper';
import { getAllAds, getAllVideo, getAllInsta, getAllAdsSub, getAllVideoSub, getAllInstaSub,
    mapCategory, mapSubcategory, mapService, mapAllAds, mapAllPS, mapAllVideo, mapAllInsta, serviceErrs,
    onSearchAds, onSearchVideo, onSearchInsta,
    mapInModalCategory, updateCategory, hideInputEditBox, deleteAd, deleteVideo, deleteInsta, 
    hideInputServiceBox, showElement, hideElement, 
} from './psHelper';
import { serverURL, s, listRefreshQty } from '../../../srcSet';

const PsSub = (props) => {
    const { me, nx, fc, titleStyle, txBlack, index, adsN, videoN, instaN, EditBtn, mapStateToProps, dispatch } = props;
    const { mainUser, subUserInfo, setLT, lang, rtl, objects, userServiceSelected } = mapStateToProps;
    const [w, setW] = useState(document.body.clientWidth);
    const [action, setAction] = useState(false);
    const [saveService, setSaveService] = useState(false);
    const [saveServiceMode, setSaveServiceMode] = useState('');
    const [psList, setPsList] = useState([]);
    const [toggleShowPS, setToggleShowPS] = useState(false);
    const [toggleEditCategory, setToggleEditCategory] = useState(false);
    const [categoryItems, setCategoryItems] = useState([]);
    const [changeSearch, setChangeSearch] = useState([]);
    const [instaNSearch, setInstaNSearch] = useState('');
    const [videoNSearch, setVideoNSearch] = useState('');
    const [adsNSearch, setAdsNSearch] = useState('');
    const [activeType, setActiveType] = useState('');
    const [searchItems, setSearchItems] = useState('');
    const [searchAds, setSearchAds] = useState([]);
    const [searchVideo, setSearchVideo] = useState([]);
    const [searchInsta, setSearchInsta] = useState([]);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const [catQty, setCatQty] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [modalCategoryList, setModalCategoryList] = useState([]);
    const [subcategoryList, setSubcategoryList] = useState([]);
    const [serviceList, setServiceList] = useState([]);
    const [loadingAds, setLoadingAds] = useState(false);
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [loadingInsta, setLoadingInsta] = useState(false);
    const [finishDataAds, setFinishDataAds] = useState(false);
    const [finishDataVideo, setFinishDataVideo] = useState(false);
    const [finishDataInsta, setFinishDataInsta] = useState(false);
    const [nAds, setNAds] = useState(1);
    const [nVideo, setNVideo] = useState(1);
    const [nInsta, setNInsta] = useState(1);
    const [nAdsSub, setNAdsSub] = useState(1);
    const [nVideoSub, setNVideoSub] = useState(1);
    const [nInstaSub, setNInstaSub] = useState(1);
    const [nAdsSearch, setNAdsSearch] = useState(1);
    const [nVideoSearch, setNVideoSearch] = useState(1);
    const [nInstaSearch, setNInstaSearch] = useState(1);
    const [allAds, setAllAds] = useState([]);
    const [allVideo, setAllVideo] = useState([]);
    const [allInsta, setAllInsta] = useState([]);
    const [categorySubs, setCategorySubs] = useState('');
    const [categoryTitleX, setCategoryTitleX] = useState('');
    const [categoryTitleXSub, setCategoryTitleXSub] = useState('');
    const [userCategoryId, setUserCategoryId] = useState('All');
    const [userSubCategoryId, setUserSubCategoryId] = useState('All');
    const [catE, setCatE] = useState(null);
    const [catX, setCatX] = useState('All');
    const [catIX, setCatIX] = useState(null);
    const [catIndex, setCatIndex] = useState(null);
    const [subCatIndex, setSubCatIndex] = useState(null);
    const [serviceIndex, setServiceIndex] = useState(null);
    const [inputEditText, setInputEditText] = useState(null);
    const [serviceTitle, setServiceTitle] = useState(null);
    const [servicePrice, setServicePrice] = useState(null);
    const [serviceOffer, setServiceOffer] = useState(null);
    const [serviceDurationH, setServiceDurationH] = useState(null);
    const [serviceDurationMin, setServiceDurationMin] = useState(null);

    const searchAdsRef = useRef(searchAds);
    const searchVideoRef = useRef(searchVideo);
    const searchInstaRef = useRef(searchInsta);
    const nAdsRef = useRef(nAds);
    const nVideoRef = useRef(nVideo);
    const nInstaRef = useRef(nInsta);
    const totalAdsRef = useRef(adsN);
    const totalVideoRef = useRef(videoN);
    const totalInstaRef = useRef(instaN);
    const totalSubRef = useRef([]);
    
    const adsQtyRef = useRef('-');
    const videoQtyRef = useRef('-');
    const instagramQtyRef = useRef('-');

    const adsQtySubRef = useRef('-');
    const videoQtySubRef = useRef('-');
    const instagramQtySubRef = useRef('-');

    const catXRef = useRef('All');
    const catIXRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if(index) {
            const categoryItems = subUserInfo.categoryItems
            if(categoryItems) {
                setCategoryItems(categoryItems)
                mapCategoryFunction(categoryItems)
                setAllSubcategory(categoryItems)
            }
        }
    }, [index]);

    useEffect(() => {
        if(index) {
            psHandler()
        }
    }, [index]);

    useEffect(() => {
        totalAdsRef.current = adsN;
    }, [adsN]);

    useEffect(() => {
        totalVideoRef.current = videoN;
    }, [videoN]);

    useEffect(() => {
        totalInstaRef.current = instaN;
    }, [instaN]);

    useEffect(() => {
        if(searchAds.length>0 || nAds>1) {
            searchAdsRef.current = searchAds;
            nAdsRef.current = nAds;
        }
    }, [searchAds, nAds]);

    useEffect(() => {
        if(searchAds.length>0 || nAds>1) {
            searchAdsRef.current = searchAds;
            nAdsRef.current = nAds;
        }
    }, [searchAds, nAds]);

    useEffect(() => {
        if(searchVideo.length>0 || nVideo>1) {
            searchVideoRef.current = searchVideo;
            nVideoRef.current = nVideo;
        }
    }, [searchVideo, nVideo]);

    useEffect(() => {
        if(searchInsta.length>0 || nInsta>1) {
            searchInstaRef.current = searchInsta;
            nInstaRef.current = nInsta;
        }
    }, [searchInsta, nInsta]);

    useEffect(() => {
        if(catX==='search') {
            if(adsN>0) {
                handleGetAllSearchAds()
                countSearchAds()
            }
            if(videoN>0) {
                handleGetAllSearchVideo()
                countSearchVideo()
            }
            if(instaN>0) {
                handleGetAllSearchInsta()
                countSearchInsta()
            }

        } else if (catX==='changeSearch') {

        } else if (catX==='All') {
            if(adsN>0) {
                handleGetAllAds('All')
            }
            if(videoN>0) {
                handleGetAllVideo('All')
            }
            if(instaN>0) {
                handleGetAllInsta('All')
            }

        } else {
            handleGetAllAds()
            handleGetAllVideo()
            handleGetAllInsta()
        }
    }, [catX]);

    useEffect(() => {
        if(catIX!=='NA') {
            handleGetAllAdsSub()
            handleGetAllVideoSub();
            handleGetAllInstaSub();
        }
    }, [catIX]);

    const handleChangeSearchAds = async () => {
        setCatX('changeSearch');
        const mapItems = mapAllAds([], me, EditBtn, rtl, setLT, w, s, 
            onTogglePS, 
            onToggleEditAds,
            onToggleDeleteAds
        )
        setAllAds(mapItems)
    }

    const handleGetAllSearchAds = async () => {
        setLoadingAds(true)
        const findItems = await onSearchAds(subUserInfo, searchItems, nAdsSearch, searchAds)
        setSearchAds(findItems.updatedSearchAds)
        setFinishDataAds((findItems.x2.length<listRefreshQty || findItems.x2.length===adsN) ? true : false)
        setNAdsSearch(nAdsSearch + 1)
        if(toggleShowPS) {
            const psList = await mapAllPS(findItems.updatedSearchAds, me, EditBtn, setLT, lang, rtl, w, s, )
            setPsList(psList)
            setLoadingAds(false)
        }
        const mapItems = mapAllAds(findItems.updatedSearchAds, me, EditBtn, rtl, setLT, w, s, 
            onTogglePS, 
            onToggleEditAds,
            onToggleDeleteAds
        )
        setAllAds(mapItems)
        setLoadingAds(false)
    }

    const handleGetAllSearchVideo = async () => {
        setLoadingVideo(true)
        const findItems = await onSearchVideo(subUserInfo, searchItems, nVideoSearch, searchVideo)
        setSearchVideo(findItems.updatedSearchVideo)
        setFinishDataVideo((findItems.x2.length<listRefreshQty || findItems.x2.length===videoN) ? true : false)
        setNVideoSearch(nVideoSearch + 1)
        const mapItems = mapAllVideo(findItems.updatedSearchVideo, me, EditBtn, rtl, setLT, w, s, 
            onToggleShowVideo,
            onToggleEditVideo,
            onToggleDeleteVideo
        )
        setAllVideo(mapItems)
        setLoadingVideo(false)
    }

    const handleGetAllSearchInsta = async () => {
        setLoadingInsta(true)
        const findItems = await onSearchInsta(subUserInfo, searchItems, nInstaSearch, searchInsta)
        setSearchInsta(findItems.updatedSearchInsta)
        setFinishDataInsta((findItems.x2.length<listRefreshQty || findItems.x2.length===instaN) ? true : false)
        setNInstaSearch(nInstaSearch + 1)
        const mapItems = mapAllInsta(findItems.updatedSearchInsta, me, EditBtn, rtl, setLT, w, s, 
            onToggleEditInsta,
            onToggleDeleteInsta
        )
        setAllInsta(mapItems)
        setLoadingInsta(false)
    }

    const resetAds = async () => {
        setAllAds([])
        setSearchAds([])
        setUserCategoryId('All')
        const findItems = await getAllAds('All', subUserInfo, 'All', 1, [])
        setSearchAds(findItems.updatedSearchAds)
        setFinishDataAds((findItems.x2.length<listRefreshQty || findItems.x2.length===adsN) ? true : false)
        setNAds(2)
        const mapItems = await mapAllAds(findItems.updatedSearchAds, me, EditBtn, rtl, setLT, w, s, 
            onTogglePS, 
            onToggleEditAds,
            onToggleDeleteAds
        )
        setAllAds(mapItems)
    }

    const resetVideo = async () => {
        setAllVideo([])
        setSearchVideo([])
        setUserCategoryId('All')
        const findItems = await getAllVideo('All', subUserInfo, 'All', 1, [])
        setSearchVideo(findItems.updatedSearchVideo)
        setFinishDataVideo((findItems.x2.length<listRefreshQty || findItems.x2.length===videoN) ? true : false)
        setNVideo(2)
        const mapItems = await mapAllVideo(findItems.updatedSearchVideo, me, EditBtn, rtl, setLT, w, s, 
            onToggleShowVideo,
            onToggleEditVideo,
            onToggleDeleteVideo
        )
        setAllVideo(mapItems)
    }

    const resetInsta = async () => {
        setAllInsta([])
        setSearchInsta([])
        setUserCategoryId('All')
        const findItems = await getAllInsta('All', subUserInfo, 'All', 1, [])
        setSearchInsta(findItems.updatedSearchInsta)
        setFinishDataInsta((findItems.x2.length<listRefreshQty || findItems.x2.length===instaN) ? true : false)
        setNInsta(2)
        const mapItems = await mapAllInsta(findItems.updatedSearchInsta, me, EditBtn, rtl, setLT, w, s, 
            onToggleEditInsta,
            onToggleDeleteInsta
        )
        setAllInsta(mapItems)
    }

    const handleGetAllAds = async (type) => {
        setLoadingAds(true)
        const findItems = await getAllAds(type, subUserInfo, userCategoryId, nAds, searchAds)
        setSearchAds(findItems.updatedSearchAds)
        setFinishDataAds((findItems.x2.length<listRefreshQty || findItems.x2.length===adsN) ? true : false)
        setNAds(nAds + 1)
        if(toggleShowPS) {
            const psList = await mapAllPS(findItems.updatedSearchAds, me, EditBtn, setLT, lang, rtl, w, s, )
            setPsList(psList)
            setLoadingAds(false)
        }
        const mapItems = mapAllAds(findItems.updatedSearchAds, me, EditBtn, rtl, setLT, w, s, 
            onTogglePS, 
            onToggleEditAds,
            onToggleDeleteAds
        )
        setAllAds(mapItems)
        setLoadingAds(false)
    }

    const handleGetAllAdsSub = async () => {
        setLoadingAds(true)
        const findItems = await getAllAdsSub(subUserInfo, userCategoryId, userSubCategoryId, nAdsSub, searchAds)
        setSearchAds(findItems.updatedSearchAds)
        setFinishDataAds((findItems.x2.length<listRefreshQty) ? true : false)
        setNAdsSub(nAdsSub + 1)
        if(toggleShowPS) {
            const psList = await mapAllPS(findItems.updatedSearchAds, me, EditBtn, setLT, lang, rtl, w, s, )
            setPsList(psList)
            setLoadingAds(false)
        }
        const mapItems = mapAllAds(findItems.updatedSearchAds, me, EditBtn, rtl, setLT, w, s, 
            onTogglePS, 
            onToggleEditAds,
            onToggleDeleteAds
        )
        setAllAds(mapItems)
        setLoadingAds(false)
    }

    const handleGetAllVideo = async (type) => {
        setLoadingVideo(true)
        const findItems = await getAllVideo(type, subUserInfo, userCategoryId, nVideo, searchVideo)
        setSearchVideo(findItems.updatedSearchVideo)
        setFinishDataVideo((findItems.x2.length<listRefreshQty || findItems.x2.length===videoN) ? true : false)
        setNVideo(nVideo + 1)
        const mapItems = mapAllVideo(findItems.updatedSearchVideo, me, EditBtn, rtl, setLT, w, s, 
            onToggleShowVideo,
            onToggleEditVideo,
            onToggleDeleteVideo
        )
        setAllVideo(mapItems)
        setLoadingVideo(false)
    }

    const handleGetAllVideoSub = async () => {
        setLoadingVideo(true)
        const findItems = await getAllVideoSub(subUserInfo, userCategoryId, userSubCategoryId, nVideoSub, searchVideo)
        setSearchVideo(findItems.updatedSearchVideo)
        setFinishDataVideo((findItems.x2.length<listRefreshQty) ? true : false)
        setNVideoSub(nVideoSub + 1)
        const mapItems = mapAllVideo(findItems.updatedSearchVideo, me, EditBtn, rtl, setLT, w, s, 
            onToggleShowVideo,
            onToggleEditVideo,
            onToggleDeleteVideo
        )
        setAllVideo(mapItems)
        setLoadingVideo(false)
    }

    const handleGetAllInsta = async (type) => {
        setLoadingInsta(true)
        const findItems = await getAllInsta(type, subUserInfo, userCategoryId, nInsta, searchInsta)
        setSearchInsta(findItems.updatedSearchInsta)
        setFinishDataInsta((findItems.x2.length<listRefreshQty || findItems.x2.length===instaN) ? true : false)
        setNInsta(nInsta + 1)
        const mapItems = mapAllInsta(findItems.updatedSearchInsta, me, EditBtn, rtl, setLT, w, s, 
            onToggleEditInsta,
            onToggleDeleteInsta
        )
        setAllInsta(mapItems)
        setLoadingInsta(false)
    }

    const handleGetAllInstaSub = async () => {
        setLoadingVideo(true)
        const findItems = await getAllInstaSub(subUserInfo, userCategoryId, userSubCategoryId, nInstaSub, searchInsta)
        setSearchInsta(findItems.updatedSearchInsta)
        setFinishDataInsta((findItems.x2.length<listRefreshQty) ? true : false)
        setNInstaSub(nInstaSub + 1)
        const mapItems = mapAllInsta(findItems.updatedSearchInsta, me, EditBtn, rtl, setLT, w, s, 
            onToggleEditInsta,
            onToggleDeleteInsta
        )
        setAllInsta(mapItems)
        setLoadingInsta(false)
    }

    const onTogglePS = async (item) => {
        if(item.adsLink) {
            window.open(item.adsLink)
        } else {
            setToggleShowPS(true)
            setTimeout(async() => {
                const psList = await mapAllPS(searchAdsRef.current, me, EditBtn, setLT, lang, rtl, w, s, )
                setPsList(psList)
                setLoadingAds(false)
            }, 0);

            setTimeout(() => {
                scrollInModal(item._id)
            }, 100);
        }
    }

    const onToggleShowPS = async () => {
        setToggleShowPS(false)
    }

    const onToggleEditCategory = (data, i, index) => {
        setCatE(i)
        if(index) {
            setToggleEditCategory(true)
        } else {
            setToggleEditCategory(false)
        }
    }

    const onToggleEditAds = async (data, i) => {
        const adsInfoX = JSON.parse(JSON.stringify(data[i]));
        dispatch(setAdsInfo(adsInfoX))
        dispatch(setToggleAds({type:'edit'}))
    }

    const onToggleEditVideo = async (data, i) => {
        const videoInfoX = JSON.parse(JSON.stringify(data[i]));
        dispatch(setVideoInfo(videoInfoX))
        dispatch(setToggleVideo({type:'edit'}))
    }

    const onToggleEditInsta = async (data, i) => {
        const instaInfoX = JSON.parse(JSON.stringify(data[i]));
        dispatch(setInstaInfo(instaInfoX))
        dispatch(setToggleInsta({type:'edit'}))
    }

    const onToggleDeleteAds = async (data, i) => {
        await deleteAd(data, i)
        const searchAds = searchAdsRef.current
        searchAds.splice(i, 1);
        const mapItems = mapAllAds(searchAds, me, EditBtn, rtl, setLT, w, s, 
            onTogglePS, 
            onToggleEditAds,
            onToggleDeleteAds
        )
        setAllAds(mapItems)
    }

    const onToggleDeleteVideo = async (data, i) => {
        await deleteVideo(data, i)
        const searchVideo = searchVideoRef.current
        searchVideo.splice(i, 1);
        const mapItems = await mapAllVideo(searchVideo, me, EditBtn, rtl, setLT, w, s, 
            onToggleShowVideo,
            onToggleEditVideo,
            onToggleDeleteVideo
        )
        setAllVideo(mapItems)
    }

    const onToggleDeleteInsta = async (data, i) => {
        await deleteInsta(data, i)
        const searchInsta = searchInstaRef.current
        searchInsta.splice(i, 1);
        const mapItems = mapAllInsta(searchInsta, me, EditBtn, rtl, setLT, w, s, 
            onToggleEditInsta,
            onToggleDeleteInsta
        )
        setAllInsta(mapItems)
    }

    const psHandler = async () => {
        if(adsN>0) handleGetAllAds('All')
        if(videoN>0) handleGetAllVideo('All')
        if(instaN>0) handleGetAllInsta('All')
        identifyObj(dispatch, objects)
    }

    const mapCategoryFunction = async(data) => {
        setCategoryItems(data)
        const mapItems = await mapCategory(null, data, subUserInfo, txBlack, rtl, setLT, w, s, onCategory, me, EditBtn)
        setCategoryList(mapItems)
        setLoadingCategory(false)
        return mapItems
    }

    const mapModalCategoryFunction = async(data) => {
        setCategoryItems(data)
        setInputEditText('')
        hideInputEditBox()
        const modalItems = mapInModalCategory(
            data, subUserInfo, rtl, setLT, w, s,
            onToggleEditCategory,
            deleteCategoryFunction,
            moveDownCategoryFunction,
            moveUpCategoryFunction,
            toggleSubCategoryFunction,
            newSubcategoryFunction,
            deleteSubCategoryFunction,
            moveDownSubCategoryFunction,
            moveUpSubCategoryFunction,
            editSubCategoryFunction,
            showNewServiceFunction,
            requestDeleteServiceFunction,
            cancelDeleteServiceFunction,
            editServiceFunction,
            moveUpServiceFunction,
            moveDownServiceFunction,
            deleteServiceFunction,
        )
        setModalCategoryList(modalItems)
    }

    const createChangeHandler = (setter) => (e) => {
        const { value } = e.target;
        setter(value.trim() === "" ? null : value);
    };

    const inputEditChangeHandler = createChangeHandler(setInputEditText);
    const serviceTitleChangeHandler = createChangeHandler(setServiceTitle);
    const servicePriceChangeHandler = createChangeHandler(setServicePrice);
    const serviceOfferChangeHandler = createChangeHandler(setServiceOffer);
    const serviceDurationHChangeHandler = createChangeHandler(setServiceDurationH);
    const serviceDurationMinChangeHandler = createChangeHandler(setServiceDurationMin);

    const addSubCat = async() => {
        setAction(true)
        if(subCatIndex===null) {
            const item = categoryItems[catIndex]
            const sub = item.sub
            const dateN = new Date().getTime().toString();
            const newSubcat = {
                id: dateN,
                title: inputEditText,
                sub: [],
            }
            sub.push(newSubcat)
        } else {
            const item = categoryItems[catIndex].sub[subCatIndex]
            item.title = inputEditText
        }
        const user = await updateCategory(mainUser, categoryItems, dispatch)
        mapCategoryFunction(user.categoryItems)
        mapModalCategoryFunction(user.categoryItems)
        hideInputEditBox()
        onAllCategory()
        setAllSubcategory(categoryItems)
        setAction(false);
    }

    const checkNull = () => {
        var err = {}
        if(!exist(serviceTitle)) err.titleErr = true
        if(!exist(servicePrice)) err.priceErr = true
        // چک کن حداقل یکی پر باشه
        if(!exist(serviceDurationH) && !exist(serviceDurationMin)) err.durationErr = true
        return err
    }

    const addService = async() => {
        function ziroNull (x) {
            const value = x===0 ? null : x
            return value
        }
        var infoErr = checkNull()
        setSaveService(true)
        serviceErrs(infoErr)
        if(Object.keys(infoErr).length===0) {
            if(saveServiceMode==='new') {
                const item = categoryItems[catIndex].sub[subCatIndex]
                const sub = item.sub
                const dateN = new Date().getTime().toString();
                const newService = {
                    id: dateN,
                    service: serviceTitle,
                    price: ziroNull(Math.abs(servicePrice)),
                    offer: ziroNull(Math.abs(serviceOffer)),
                    h: ziroNull(Math.abs(serviceDurationH)),
                    min: ziroNull(Math.abs(serviceDurationMin)),
                    selected: false,
                }
                sub.push(newService)
            } else { // if saveServiceMode==='edit'
                const item = categoryItems[catIndex].sub[subCatIndex].sub[serviceIndex]
                item.service = serviceTitle
                item.price = servicePrice
                item.offer = serviceOffer
                item.h = serviceDurationH
                item.min = serviceDurationMin
            }


            const user = await updateCategory(mainUser, categoryItems, dispatch)
            
            mapCategoryFunction(user.categoryItems)
            mapModalCategoryFunction(user.categoryItems)
            hideInputServiceBox()

            setServiceTitle(null)
            setServicePrice(null)
            setServiceOffer(null)
            setServiceDurationH(null)
            setServiceDurationMin(null)

            onAllCategory()
            setAllSubcategory(categoryItems)

            setSaveService(false);
        }

    }

    const deleteCategoryFunction = async(data, i) => {
        setAction(true)
        var itemX = data[i]
        var idX = itemX.id
        var item = data.splice(i, 1)
        await setNull(data)
        setAction(false)
    }

    const moveDownCategoryFunction = async(data, i) => {
        setAction(true)
        var item = data.splice(i, 1)
        data.splice(i+1, 0, item[0])
        await setNull(data)
        setAction(false)
    }

    const moveUpCategoryFunction = async(data, i) => {
        setAction(true)
        var item = data.splice(i, 1)
        data.splice(i-1, 0, item[0])
        await setNull(data)
        setAction(false)
    }
    
    const deleteSubCategoryFunction = async(data, i, ix) => {
        setAction(true)
        var subX = data[i].sub
        var item = subX.splice(ix, 1)
        await setNull(data)
        setAction(false)
    }

    const moveDownSubCategoryFunction = async(data, i, ix) => {
        setAction(true)
        var item = data[i].sub.splice(ix, 1)
        data[i].sub.splice(ix+1, 0, item[0])
        await setNull(data)
        setAction(false)
    }

    const moveUpSubCategoryFunction = async(data, i, ix) => {
        setAction(true)
        var item = data[i].sub.splice(ix, 1)
        data[i].sub.splice(ix-1, 0, item[0])
        await setNull(data)
        setAction(false)
    }

    const setNull = async(categoryItems) => {
        const user = await updateCategory(mainUser, categoryItems, dispatch)
        setTimeout(async() => {
            setCategoryItems(user.categoryItems)
            await mapCategoryFunction(user.categoryItems)
            await mapModalCategoryFunction(user.categoryItems)
            setSubcategoryList([]);
            setCategoryTitleX('');
            setActiveType(null);
            catXRef.current = ''
        }, 100);

        onAllCategory()
        setAllSubcategory(categoryItems)
    }

    const toggleSubCategoryFunction = async(data, i) => {
        setAction(true)
        data[i].toggleSubCat = !data[i].toggleSubCat
        setCategoryItems(data)
        await mapModalCategoryFunction(data)
        setAction(false)
    }

    const newSubcategoryFunction = (i) => {
        setCatIndex(i)
        setSubCatIndex(null)
        const categorySection = document.getElementById('categorySection')
        const catSecRect = categorySection.getBoundingClientRect();
        const catSecLeft = catSecRect.left
        const catSecTop = catSecRect.top

        const newSub = document.getElementById(`newSub${i}`)
        const newSubRect = newSub.getBoundingClientRect();
        const newSubTop = newSubRect.top
        const newSubWidth = newSubRect.width
        const newSubLeft = newSubRect.left

        const inputEditBox = document.getElementById('inputEditBox')
        inputEditBox.style.display = '';
        inputEditBox.style.left = `${newSubLeft - catSecLeft + (rtl ? (newSubWidth - inputEditBox.offsetWidth) : 0) - 1}px`
        inputEditBox.style.top = `${newSubTop - catSecTop - 1}px`

        const inputEdit = document.getElementById('inputEdit')
        inputEdit.focus()
    }

    const showNewServiceFunction = (i, ix) => {
        setSaveServiceMode('new')
        setCatIndex(i)
        setSubCatIndex(ix)
        const categorySection = document.getElementById('categorySection')
        const catSecRect = categorySection.getBoundingClientRect();
        const catSecLeft = catSecRect.left
        const catSecTop = catSecRect.top

        const newService = document.getElementById(`newService-${i}-${ix}`)
        const newServiceRect = newService.getBoundingClientRect();
        const newServiceTop = newServiceRect.top
        const newServiceWidth = newServiceRect.width
        const newServiceLeft = newServiceRect.left

        const inputServiceBox = document.getElementById('inputServiceBox')
        inputServiceBox.style.display = '';
        inputServiceBox.style.left = `${newServiceLeft - catSecLeft + (rtl ? (newServiceWidth - inputServiceBox.offsetWidth) : 0) - 1}px`
        inputServiceBox.style.top = `${newServiceTop - catSecTop - 1}px`
    }

    const requestDeleteServiceFunction = async (i, ix, s) => {
        const target = document.getElementById(`deleteServiceBox-${i}-${ix}-${s}`)
        target.style.display = '';
        const service = document.getElementById(`service-${i}-${ix}-${s}`)
        service.style.border = '1px solid #ff7f7f';
    }

    const cancelDeleteServiceFunction = async (i, ix, s) => {
        const target = document.getElementById(`deleteServiceBox-${i}-${ix}-${s}`)
        target.style.display = 'none';
        const service = document.getElementById(`service-${i}-${ix}-${s}`)
        service.style.border = '';

    }

    const editServiceFunction = async (i, ix, s) => {
        setSaveServiceMode('edit')
        setCatIndex(i)
        setSubCatIndex(ix)
        setServiceIndex(s)
        const target = categoryItems[i].sub[ix].sub[s]
        setServiceTitle(target.service)
        setServicePrice(target.price)
        setServiceOffer(target.offer)
        setServiceDurationH(target.h)
        setServiceDurationMin(target.min)

        const categorySection = document.getElementById('categorySection')
        const catSecRect = categorySection.getBoundingClientRect();
        const catSecLeft = catSecRect.left
        const catSecTop = catSecRect.top

        const service = document.getElementById(`service-${i}-${ix}-${s}`)
        const serviceRect = service.getBoundingClientRect();
        const serviceTop = serviceRect.top
        const serviceWidth = serviceRect.width
        const serviceLeft = serviceRect.left

        const inputServiceBox = document.getElementById('inputServiceBox')
        inputServiceBox.style.display = '';
        inputServiceBox.style.left = `${serviceLeft - catSecLeft + (rtl ? (serviceWidth - inputServiceBox.offsetWidth) : 0) - 1}px`
        inputServiceBox.style.top = `${serviceTop - catSecTop - 1}px`

        const serviceTitleElm = document.getElementById('serviceTitle')
        const servicePriceElm = document.getElementById('servicePrice')
        const serviceOfferElm = document.getElementById('serviceOffer')
        const serviceDurationHElm = document.getElementById('serviceDurationH')
        const serviceDurationMinElm = document.getElementById('serviceDurationMin')
        serviceTitleElm.value = target.service
        servicePriceElm.value = target.price
        serviceOfferElm.value = target.offer
        serviceDurationHElm.value = target.h
        serviceDurationMinElm.value = target.min
    }

    const moveUpServiceFunction = async (i, ix, s) => {
        setAction(true)
        const item = categoryItems[i].sub[ix]
        const sub = item.sub
        const target = sub.splice(s, 1)
        sub.splice(s-1, 0, target[0])
        await setNull(categoryItems)
        setAction(false)
    }

    const moveDownServiceFunction = async (i, ix, s) => {
        setAction(true)
        const item = categoryItems[i].sub[ix]
        const sub = item.sub
        const target = sub.splice(s, 1)
        sub.splice(s+1, 0, target[0])
        await setNull(categoryItems)
        setAction(false)
    }

    const deleteServiceFunction = async (i, ix, s) => {
        setAction(true)
        const item = categoryItems[i].sub[ix]
        const sub = item.sub
        const target = sub[s]
        sub.splice(s, 1);
        const user = await updateCategory(mainUser, categoryItems, dispatch)

        cancelDeleteServiceFunction(i, ix, s)
        mapModalCategoryFunction(user.categoryItems)
        onAllCategory()
        setAllSubcategory(user.categoryItems)
        setAction(false);
    }

    const editSubCategoryFunction = (data, i, ix) => {
        setCatIndex(i)
        setSubCatIndex(ix)
        const title = data[i].sub[ix].title
        setInputEditText(title)
        const categorySection = document.getElementById('categorySection')
        const catSecRect = categorySection.getBoundingClientRect();
        const catSecLeft = catSecRect.left
        const catSecTop = catSecRect.top

        const newSub = document.getElementById(`subcatTitle-${i}-${ix}`)
        const newSubRect = newSub.getBoundingClientRect();
        const newSubTop = newSubRect.top
        const newSubWidth = newSubRect.width
        const newSubLeft = newSubRect.left

        const inputEditBox = document.getElementById('inputEditBox')
        inputEditBox.style.display = '';
        inputEditBox.style.left = `${newSubLeft - catSecLeft + (rtl ? (newSubWidth - inputEditBox.offsetWidth) : 0) - 1}px`
        inputEditBox.style.top = `${newSubTop - catSecTop - 1}px`

        const inputEdit = document.getElementById('inputEdit')
        inputEdit.value = title
        inputEdit.focus()
    }

    // const setAllSubN = async () => {
    //     let n = [];
    //     categoryItems.forEach(item => {
    //         totalSub = totalSub.concat(item.sub);
    //     });
    //     totalSubRef.current = totalSub
    //     const mapItems = await mapSubcategory(null, null, null, totalSub, subUserInfo, setLT, w, s, onSubcategory, onService)
    //     setSubcategoryList(mapItems);
    //     return totalSub
    // }

    const setAllSubcategory = async (data) => {
        let totalSub = [];
        data.forEach(item => {
            totalSub = totalSub.concat(item.sub);
        });
        totalSubRef.current = totalSub
        const mapItems = await mapSubcategory(null, null, null, totalSub, subUserInfo, setLT, w, s, onSubcategory, onService)
        setSubcategoryList(mapItems);
        setCategorySubs(mapItems);
        return totalSub
    }

    const onAllCategory = async () => {
        if (catXRef.current === 'All') return;
        catXRef.current = 'All';
        setAllSubcategory(categoryItems)
        const mapCategories = mapCategory(null, categoryItems, subUserInfo, txBlack, rtl, setLT, w, s, onCategory, me, EditBtn)
        setCategoryList(mapCategories)

        if(w<s) {
            setTimeout(() => {
                setContent(totalSubRef.current, '30px')
            }, 100);
        }

        setSearchItems('');
        setActiveType('');
        setCatX('All');
        setCategoryTitleX(setLT.all);
        setNAds(1);
        setNVideo(1);
        setNInsta(1);
        setSearchAds([]);
        setSearchVideo([]);
        setSearchInsta([]);
        setUserCategoryId('All');
        setFinishDataAds(false);
        setFinishDataVideo(false);
        setFinishDataInsta(false);
    }

    const onCategory = async (item, i) => {
        console.log('item: ', item)
        adsQtyRef.current = item.adsQty
        videoQtyRef.current = item.videoQty
        instagramQtyRef.current = item.instagramQty

        if (catXRef.current === i) return;

        const categoryItems = subUserInfo.categoryItems

        setServiceList([]);
        const mapCategories = mapCategory(i, categoryItems, subUserInfo, txBlack, rtl, setLT, w, s, onCategory, me, EditBtn)
        setCategoryList(mapCategories)

        catXRef.current = i;
        catIXRef.current = 'NA';

        var sub = item.sub
        totalSubRef.current = sub;
        let allSubs = [];
        categoryItems.forEach(item => {
            allSubs = allSubs.concat(item.sub);
        });

        if(allSubs.length>0 && sub.length===0) {
            const subNull = {
                "id": "000",
                "title": "THERE IS NO SUBCATEGORY",
                "sub": []
            }
            sub = [subNull]
        }

        const mapItems = mapSubcategory(null, item, i, totalSubRef.current, subUserInfo, setLT, w, s, onSubcategory, onService)
        setSubcategoryList(mapItems);
        if(w<s) {
            setTimeout(() => {
                setContent(totalSubRef.current, '30px')
            }, 100);
        }

        setSearchItems('');
        setActiveType('');
        setCatX(i);
        setCatIX('NA');
        setCategoryTitleX(item.title);
        setCategorySubs(item.sub);
        setNAds(1);
        setNVideo(1);
        setNInsta(1);
        // setAllAds([]);
        // setAllVideo([]);
        // setAllInsta([]);
        setSearchAds([]);
        setSearchVideo([]);
        setSearchInsta([]);
        setUserCategoryId(item.id);
        setFinishDataAds(false);
        setFinishDataVideo(false);
        setFinishDataInsta(false);
    }

    const onSubcategory = async (item, i, itemx, ix) => {
        adsQtySubRef.current = itemx.adsQty
        videoQtySubRef.current = itemx.videoQty
        instagramQtySubRef.current = itemx.instagramQty
        if(itemx) {
            if (ix === catIXRef.current) return;
            const mapSubcat = await mapSubcategory(ix, item, i, totalSubRef.current, subUserInfo, setLT, w, s, onSubcategory, onService)
            setSubcategoryList(mapSubcat);
            catIXRef.current = ix;
            var sub = itemx.sub ? itemx.sub : []
            const mapItems = mapService(item, i, sub, subUserInfo, setLT, w, s, onService)
            setServiceList(mapItems);
            if(w<s) setContent(ix)
    
            setSearchItems('');
            setActiveType('sub');
            setCatIX(ix);
            setCategoryTitleXSub(itemx.title);
            setNAdsSub(1);
            setNVideoSub(1);
            setNInstaSub(1);
            // setAllAds([]);
            // setAllVideo([]);
            // setAllInsta([]);
            setSearchAds([]);
            setSearchVideo([]);
            setSearchInsta([]);
            setUserSubCategoryId(itemx.id);
            setFinishDataAds(false);
            setFinishDataVideo(false);
            setFinishDataInsta(false);
        }
    }

    const setContent = (n, marginTop='0px') => {
        const container = document.getElementById("allSubcategories");
        const content = document.getElementById("content");
        if(container) {
            const children = container.children;
            if (container && content) {
                content.remove()
                container.insertBefore(content, children[n+1])
                content.style.marginTop = marginTop
            }
        }
    }

    const findService = (categoryItems, serviceId) => {
        for (let i = 0; i < categoryItems.length; i++) {
            const category = categoryItems[i];
            for (let x = 0; x < (category.sub || []).length; x++) {
                const sub = category.sub[x];
                for (let s = 0; s < (sub.sub || []).length; s++) {
                    const service = sub.sub[s];
                    if (service.id === serviceId) {
                        return {
                            userId: subUserInfo._id,
                            categoryId: category.id,
                            categoryIndex: i,
                            subcategoryId: sub.id,
                            subcategoryIndex: x,
                            serviceInfo: service,
                            serviceIndex: s
                        };
                    }
                }
            }
        }
        return null; // اگر پیدا نشد
    };

    const onService = async (data, i) => {
        const categoryItems = subUserInfo.categoryItems
        const info = findService(categoryItems, data[i].id)
        const index = userServiceSelected.findIndex(item => item.serviceInfo.id === info.serviceInfo.id);
        if (index === -1) {
            // اگر موجود نبود، اضافه کن
            userServiceSelected.push(info);
        } else {
            // اگر موجود بود، حذف کن
            userServiceSelected.splice(index, 1);
        }

        const newSelection = [...userServiceSelected];
        dispatch(setUserServiceSelected(newSelection))

        data[i].selected = data[i].selected ? undefined : true
        const mapItems = mapSubcategory(catIXRef.current, null, i, totalSubRef.current, subUserInfo, setLT, w, s, onSubcategory, onService)
        setSubcategoryList(mapItems);
        if(w>=s) {
            const mapServices = mapService(null, null, data, subUserInfo, setLT, w, s, onService)
            setServiceList(mapServices);
        }

        const mapCategories = mapCategory(null, categoryItems, subUserInfo, txBlack, rtl, setLT, w, s, onCategory, me, EditBtn)
        setCategoryList(mapCategories)
    }

    const countSearchAds = async () => {
        var data = {
            userId: subUserInfo._id,
            searchItems: searchItems,
        }
        await axios.post(`${serverURL}/ads/countUserSearchAds`, data).then(res => {
            setAdsNSearch(res.data)
        })
    }

    const countSearchVideo = async () => {
        var data = {
            userId: subUserInfo._id,
            searchItems: searchItems,
        }
        await axios.post(`${serverURL}/video/countUserSearchVideo`, data).then(res => {
            setVideoNSearch(res.data)
        })
    }

    const countSearchInsta = async () => {
        var data = {
            userId: subUserInfo._id,
            searchItems: searchItems,
        }
        await axios.post(`${serverURL}/instagram/countUserSearchInsta`, data).then(res => {
            setInstaNSearch(res.data)
        })
    }

    const handleSearchChange = (e) => {
        var tx = e.target.value
        setSearchItems(e.target ? tx.toLowerCase() : e)
        setChangeSearch(true)
        setNAdsSearch(1)
        setNVideoSearch(1)
        setNInstaSearch(1)
        handleChangeSearchAds()
    }

    const startSearch = async (e) => {
        if (e.keyCode === 13 || e.keyCode === undefined || e.which === 13 || e.which === undefined) {
            if(changeSearch) {
                setChangeSearch(false);
                setActiveType('search');
                setSubcategoryList([]);
                setCatX('search');
                setCategoryTitleX(setLT.all);
                setNAds(1);
                setNVideo(1);
                setNInsta(1);
                setNAdsSub(1);
                setNVideoSub(1);
                setNInstaSub(1);
                setAllAds([]);
                setAllVideo([]);
                setAllInsta([]);
                setSearchAds([]);
                setSearchVideo([]);
                setSearchInsta([]);
                setAdsNSearch('-');
                setVideoNSearch('-');
                setInstaNSearch('-');
                setUserCategoryId('All');
                setFinishDataAds(false);
                setFinishDataVideo(false);
                setFinishDataInsta(false);
            }
        }
    }

    const onToggleShowVideo = (item) => {
        dispatch(setToggleShowVideo(!mapStateToProps.toggleShowVideo))
        dispatch(setVideoInfo(item))
    }

    const subTitleStyleS = {fontSize:'16px', fontWeight:450, margin:'0px 0px 15px', textAlign: rtl ? 'right' : 'left', alignItems:'center', whiteSpace:'', color:''}

    const loader13 = (
        <span
            className='loader-13'
            style={{ fontSize: '10px', margin: rtl ? '20px 10px -20px' : '0px 10px', color: '', transform: rtl ? 'rotate(180deg)' : '' }}
        ></span>
    );

    const searchTapeSection = (
        <SearchTapeSection
            me={me}
            fc={fc}
            txBlack={txBlack}
            handleSearchChange={handleSearchChange}
            searchItems={searchItems}
            startSearch={startSearch}
            mapStateToProps={mapStateToProps}
        />
    )

        const adsSection = (
        <AdsSection
            me={me}
            fc={fc}
            loader={loader13}
            loadingAds={loadingAds}
            subTitleStyleS={subTitleStyleS}
            allAds={allAds}
            activeType={activeType}
            categoryTitleX={categoryTitleX}
            categoryTitleXSub={categoryTitleXSub}
            categoryItems={categoryItems}
            catXRef={catXRef.current}
            adsN={totalAdsRef.current}
            adsNCat={adsQtyRef.current}
            adsNCatSub={adsQtySubRef.current}
            adsNSearch={adsNSearch}
            searchAds={searchAds}
            psList={psList}
            finishDataAds={finishDataAds}
            More={More}
            MoreX={MoreX}
            EditBtn={EditBtn}
            handleGetAllAds={handleGetAllAds}
            handleGetAllAdsSub={handleGetAllAdsSub}
            handleGetAllSearchAds={handleGetAllSearchAds}
            toggleShowPS={toggleShowPS}
            onToggleShowPS={onToggleShowPS}
            resetAds={resetAds}
            catQty={catQty}
            dispatch={dispatch}
            mapStateToProps={mapStateToProps}
        />
    )

    const videoSection = (
        <VideoSection
            me={me}
            fc={fc}
            loader={loader13}
            loadingVideo={loadingVideo}
            subTitleStyleS={subTitleStyleS}
            allVideo={allVideo}
            activeType={activeType}
            categoryTitleX={categoryTitleX}
            categoryTitleXSub={categoryTitleXSub}
            categoryItems={categoryItems}
            catXRef={catXRef.current}
            videoN={totalVideoRef.current}
            videoNCat={videoQtyRef.current}
            videoNCatSub={videoQtySubRef.current}
            videoNSearch={videoNSearch}
            searchVideo={searchVideo}
            finishDataVideo={finishDataVideo}
            More={More}
            MoreX={MoreX}
            EditBtn={EditBtn}
            handleGetAllVideo={handleGetAllVideo}
            handleGetAllVideoSub={handleGetAllVideoSub}
            handleGetAllSearchVideo={handleGetAllSearchVideo}
            toggleShowVideo={mapStateToProps.toggleShowVideo}
            onToggleShowVideo={onToggleShowVideo}
            resetVideo={resetVideo}
            catQty={catQty}
            dispatch={dispatch}
            mapStateToProps={mapStateToProps}
        />
    )

    const instaSection = (
        <InstaSection
            me={me}
            fc={fc}
            loader={loader13}
            loadingInsta={loadingInsta}
            subTitleStyleS={subTitleStyleS}
            allInsta={allInsta}
            activeType={activeType}
            categoryTitleX={categoryTitleX}
            categoryTitleXSub={categoryTitleXSub}
            categoryItems={categoryItems}
            catXRef={catXRef.current}
            instaN={totalInstaRef.current}
            instaNCat={instagramQtyRef.current}
            instaNCatSub={instagramQtySubRef.current}
            instaNSearch={instaNSearch}
            searchInsta={searchInsta}
            finishDataInsta={finishDataInsta}
            More={More}
            MoreX={MoreX}
            EditBtn={EditBtn}
            handleGetAllInsta={handleGetAllInsta}
            handleGetAllInstaSub={handleGetAllInstaSub}
            handleGetAllSearchInsta={handleGetAllSearchInsta}
            resetInsta={resetInsta}
            catQty={catQty}
            dispatch={dispatch}
            mapStateToProps={mapStateToProps}
        />
    )

    const categorySection = (
        <CategorySection
            me={me}
            fc={fc}
            nx={nx}
            action={action}
            saveService={saveService}
            catE={catE}
            txBlack={txBlack}
            activeType={activeType}
            loadingAds={loadingAds}
            loadingVideo={loadingVideo}
            loadingInsta={loadingInsta}
            categorySubs={categorySubs}
            categoryTitleX={categoryTitleX}
            categoryTitleXSub={categoryTitleXSub}
            loadingCategory={loadingCategory}
            onAllCategory={onAllCategory}
            mapCategoryFunction={mapCategoryFunction}
            mapModalCategoryFunction={mapModalCategoryFunction}
            categoryItems={categoryItems}
            toggleEditCategory={toggleEditCategory}
            onToggleEditCategory={onToggleEditCategory}
            categoryList={categoryList}
            modalCategoryList={modalCategoryList}
            subcategoryList={subcategoryList}
            serviceList={serviceList}
            inputEditChangeHandler={inputEditChangeHandler}
            serviceTitleChangeHandler={serviceTitleChangeHandler}
            servicePriceChangeHandler={servicePriceChangeHandler}
            serviceOfferChangeHandler={serviceOfferChangeHandler}
            serviceDurationHChangeHandler={serviceDurationHChangeHandler}
            serviceDurationMinChangeHandler={serviceDurationMinChangeHandler}
            addSubCat={addSubCat}
            addService={addService}
            allAds={allAds}
            allVideo={allVideo}
            allInsta={allInsta}
            catXRef={catXRef.current}
            adsN={totalAdsRef.current}
            adsNCat={adsQtyRef.current}
            adsNCatSub={adsQtySubRef.current}
            videoN={totalVideoRef.current}
            videoNCat={videoQtyRef.current}
            videoNCatSub={videoQtySubRef.current}
            instaN={totalInstaRef.current}
            instaNCat={instagramQtyRef.current}
            instaNCatSub={instagramQtySubRef.current}
            adsSection={adsSection}
            videoSection={videoSection}
            instaSection={instaSection}
            EditBtn={EditBtn}
            dispatch={dispatch}
            mapStateToProps={mapStateToProps}
        />
    )

    const catExist = (categoryItems || []).length>0 ? true : false
    // display: me || catExist ? '' : 'none'
    return (
        <div id='psSub' style={{width:'100%', padding:'10px', backgroundColor:'#ffffff', }}>
            {categorySection}
        </div>

    );
}

export default PsSub;
