import React, { useState, useEffect } from 'react';
import { FaAngleDown } from 'react-icons/fa';

import { AiOutlineAlignLeft } from 'react-icons/ai';


import { scrollTo } from '../../helper';

const NavbarSub = (props) => {
    const { fc, txBlack, mapStateToProps } = props;
    const { mainUser, subUserInfo, setLT, lang, rtl, } = mapStateToProps;
    const [w, setW] = useState(document.body.clientWidth);
    const [togglePSD, setTogglePSD] = useState(false);
    const [catDropList, setCatDropList] = useState([]);
    const [catNavbar, setCatNavbar] = useState([]);

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const categoryItems = subUserInfo.categoryItems
        // حذف other
        const filteredItems = (categoryItems || []).filter(item => item.id !== 0);
        mapCatDropList(filteredItems)
        mapCatNavbar(filteredItems)
    }, [subUserInfo.categoryItems]);


    const handleCat = () => {
        scrollTo('psSub')
    }

    const mapCatDropList = async (data) => {
        var catName
        var dataRV = data.map(
            (item, i) => (
                catName = item.title ? item.title.toUpperCase() : 'N/A',
                <div key={i} className={`dropdown-item fontColor h${fc}`} style={{borderBottom:'1px solid #99999930', padding:'10px', fontSize:'12px', fontWeight:450, whiteSpace:'wrap'}}
                    onClick={() => handleCat()}>
                    {catName}
                </div>
            )
        )
        setCatDropList(dataRV)
    }

    const mapCatNavbar = async (data) => {
        var dataRV = data.map(
            (item, i) => {
                const catName = item.title ? item.title.toUpperCase() : 'N/A'
                return (
                    <div key={i} className={`underline fontColor bl h${fc}`} style={{ maxHeight:'40px', padding: data.length<=5 ? '0px 20px' : '0px 10px', fontSize:'13px', fontWeight:450, }}
                        onClick={() => handleCat()}>
                        {catName.length>25 ? catName.substr(0, 25) + ' ...' : catName}
                    </div>
                )
            }
        )
        setCatNavbar(dataRV)
    }

    const onTogglePSD = () => {
        setTogglePSD(!togglePSD)
    }

    const productAndServices = (
        <div className="btn-group" style={{cursor:'pointer'}} onClick={onTogglePSD}>
            <div className={`d-flex C${fc} dropdown`} style={{ width:'', height:'40px'}}
                id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="false" aria-expanded="false" data-bs-offset="0,0" data-bs-auto-close="inside" 
            >
                <div className='center' style={{ minWidth:'40px', height:'40px', backgroundColor:'#ffffff', alignItems:'center', }}>
                    <AiOutlineAlignLeft style={{ width:'20px', height:'20px', transform: rtl ? 'scaleX(-1)' : ''}}/>
                </div>
                <div className={`d-flex  f${txBlack ? 7 : 11}`} style={{ width:'', height:'40px', padding: rtl ? '0px 20px 0px 30px' : '0px 30px 0px 20px', alignItems:'center', fontSize:'14px', fontWeight:'450', whiteSpace:'nowrap'}}>
                    {setLT.categories ? setLT.categories.toUpperCase() : ''}&nbsp;
                    <FaAngleDown style={{ transform: togglePSD ? 'rotate(-180deg)' : '', transition: '.4s' }}/>
                </div>
            </div>
            <div className="dropdown-menu animated fadeIn" aria-labelledby="dropdownMenuButton"
                style={{fontSize:'13px', cursor:'pointer', borderRadius:'0px', padding:'0px', width:'205px'}}>
                {catDropList}
            </div>
        </div>
    )
    
    return (
        <div className='d-flex backBlur' style={{width:'100%', height:'50px', zIndex:'2', position:'absolute', backgroundColor:'#ffffff99'}}>
            <div className='center' style={{width:'100%', height:'100%', margin:'0px 10px', justifyContent:'start', alignItems:'center'}}>
                {productAndServices}&nbsp;&nbsp;
                <div className='d-flex f11' style={{ width:window.innerWidth-310, overflow: 'scroll'}}>
                    {catNavbar}
                </div>
            </div>
        </div>
    );
}

export default NavbarSub;
