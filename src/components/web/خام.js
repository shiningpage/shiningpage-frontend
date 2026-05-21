import React, { useState, useEffect } from 'react';
import {  } from '../../helper';

const Test = (props) => {
    const { fc, txBlack, mapStateToProps } = props;
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
        <div>
            test
        </div>
    );
}

export default Test;
