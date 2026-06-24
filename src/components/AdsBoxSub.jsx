import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import {  } from '../helper';
import { s } from '../srcSet';

const AdsBoxSub = (props) => {
    const { fc, txBlack, mapStateToProps } = props;
    const { mainUser, subUserInfo, setLT, lang, rtl, } = mapStateToProps;
    const [w, setW] = useState(document.body.clientWidth);
    const [copy, setCopy] = useState(false);

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {

    }, []);

    const copyToClipBoard = () => {
        var text = `https://www.SelfSheet.com/en?ref=${subUserInfo.username}`;
        navigator.clipboard.writeText(text);
        var tooltip = document.getElementById("myTooltip");
        tooltip.innerHTML = "The link is copied.";
        setCopy(true)
    }
    
    const copyLink = (
        <Button variant= {copy ? 'success' : "link"} onClick={!copy ? copyToClipBoard : ''}
            style={{fontSize:'14px', width:'', height:'30px', lineHeight:'10px', margin:'0px', direction:'ltr'}}>
            <span className="tooltiptext" id="myTooltip">{!copy ? 'Copy Link' : 'The link is copied.'}</span>
        </Button>
    )

    return (
        <Container>
            <div style={{padding:'10px'}}>
                {/* <div className='txWhite'>{setLT.advertisement}</div> */}
                <div className='txWhite'>Collect rubies by visiting SelfSheet.</div>
                <div style={{padding:'15px', border:'1px solid #99999999', borderRadius:'5px', width:'100%', backgroundColor:'#ffffff20'}}>
                    <div className='d-flex' style={{direction:'ltr'}}>
                        <a href={`https://www.SelfSheet.com/en?ref=${subUserInfo.username}`} className='character btnShadow' style={{width:'130px', minWidth:'100px', height:'80px', marginRight:'10px', borderRadius:'5px'}}></a>
                        <div style={{width:w<s ? '100%' : '400px'}}>
                            <div style={{width:'100%', marginBottom:'10px'}}>{setLT.discoverPersonality}</div>
                            <a href={`https://www.SelfSheet.com/en?ref=${subUserInfo.username}`} className='link-underline' style={{ fontWeight: 400, color:'black' }}>www.SelfSheet.com</a>&nbsp;&nbsp;
                            {copyLink}
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default AdsBoxSub;
