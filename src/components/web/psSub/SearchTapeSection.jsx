import React, { useState, useEffect } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { s } from '../../../srcSet';

const SearchTapeSection = (props) => {
    const { me, fc, txBlack, handleSearchChange, searchItems, startSearch, mapStateToProps } = props;
    const { mainUser, subUserInfo, setLT, lang, rtl, } = mapStateToProps;
    const [w, setW] = useState(document.body.clientWidth);

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {

    }, []);

    return (
        <div style={{ width:w<s ? '100%' : '350px', margin:w<s ? '0px 0px 40px' : '0px 5px 40px', fontSize:'13px' }}>
            <input id='searchInput' type="text" value={searchItems} placeholder='search ...' name='searchItems' autoComplete="off"
                className="form-control"
                style={{textAlign:rtl ? 'right' : 'left', margin:'0px 0px -34px', width:'100%', height:'42px', fontSize:'12px', borderRadius:'8px',
                    padding:rtl ? `10px ${w<s ? 50 : 55}px 10px 10px` : `10px 10px 10px ${w<s ? 50 : 55}px`}}
                onChange={handleSearchChange} onKeyDown={startSearch} />
            <div className={`btnShadow center C${fc}`} onClick={startSearch}
                style={{margin: "0px 8px 0px", width: w<s? '30px' : '35px', height:'26px', borderRadius:'5px', alignItems:'center'}}>
                <IoMdSearch id='searchIcone' className={`f${txBlack ? 7 : 11}`} color='' size="1.6em"/>
            </div>
        </div>
    );
}

export default SearchTapeSection;
