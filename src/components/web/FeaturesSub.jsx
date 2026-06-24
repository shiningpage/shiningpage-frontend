import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditBtn from '../EditBtn';
import RubyCollector from '../RubyCollector';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import RoundStatistics from '../RoundStatistics';
import ModalWebPageTheme from '../modals/ModalWebPageTheme';
import { setSubUserInfo, setUserInfo } from '../../dataStore/actions';
import { scrollTo } from '../../helper';
import { s } from '../../srcSet';

const FeaturesSub = (props) => {
    const { me, fc, nx, viewN, mapStateToProps } = props;
    const { rtl, setLT, subUserInfo, objects } = mapStateToProps;
    
    const [w, setW] = useState(document.body.clientWidth);
    const [toggleWebPageTheme, setToggleWebPageTheme] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // useEffect(() => {
    //     const { id, objects} = props
    //     // console.log(1000000, props.id, props.objects)
    //     objects.forEach(item => {
    //         if(item.id===id && item.active===true) setVisible(true)
    //     })
    // }, [objects])

    const toggleTheme = () => {
        setToggleWebPageTheme(!toggleWebPageTheme)
    }

    const modalWebPageTheme = (
        <ModalWebPageTheme
            me={me}
            dispatch={props.dispatch}
            EditBtn={EditBtn}
            toggleWebPageTheme={toggleWebPageTheme}
            onToggle={toggleTheme}
            mapStateToProps={mapStateToProps}
        />
    )

    return (
        <div className={`center`} style={{width:'100%', flexWrap:'wrap', padding:'50px 0px', position:'relative'}}>
            <div onClick={() => scrollTo('psSub')}>
                <RoundStatistics index={1} title='Contents' Statistsics={nx} fc={fc} anim={w<s ? 'fadeInUpX' : 'fadeInLeft'} time='1.5s'/>
            </div>
            <div onClick={() => scrollTo('attachmentsSub')}>
                <RoundStatistics index={2} title={setLT.attachments} Statistsics={subUserInfo.attachmentItems ? subUserInfo.attachmentItems.length : 0} fc={fc} anim={w<s ? 'fadeInUpX' : 'fadeInLeft'} time='2s'/>
            </div>
            <div onClick={() => scrollTo('statisticsSub')}>
                <RoundStatistics index={3} title={setLT.statistics} Statistsics={viewN} fc={fc} anim={w<s ? 'fadeInUpX' : 'fadeInLeft'} time='2.5s'/>
            </div>
            {me && <EditBtn rtl={rtl} type='colors' top={w<s ? 10 : 20} right={w<s ? 10 : 20} onClick={toggleTheme}/>}
            {/* <RubyCollector id='adsH1' top={30} left={ rtl ? '' : 30} right={ rtl ? 30 : ''}/> */}
            {modalWebPageTheme}
        </div>
    );
};

export default FeaturesSub;
