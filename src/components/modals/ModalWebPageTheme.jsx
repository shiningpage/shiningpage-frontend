import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { setSubUserInfo, setUserInfo } from '../../dataStore/actions';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { serverURL, s, lightColors } from '../../srcSet';

const ModalWebPageTheme = (props) => {
    const { mainUser, subUserInfo, setLT, lang, rtl } = props.mapStateToProps;
    const [w, setW] = useState(document.body.clientWidth);
    const [action, setAction] = useState(false);
    const [themeGroup, setThemeGroup] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState(mainUser.fc); // تم انتخاب‌شده
    const [buttonVariant, setButtonVariant] = useState("light"); // نوع دکمه

    const favoriteTheme = (item) => {
        setSelectedTheme(item); // تم انتخاب‌شده را به‌روزرسانی کنید
        setButtonVariant("success"); // نوع دکمه را تغییر دهید
    };

    const mapThemes = (fc) => {
        const t1 = [
            11, 4, 9, 3, 6, 8, 
            23, 57, 54, 10, 19, 20, 
            12, 1, 15, 55, 5, 21, 
            25, 2, 17, 0, 26, 7
        ];
        const t2 = [
            22, 13, 33, 14, 38, 31, 
            32, 27, 30, 45, 41, 47, 
            35, 49, 34, 46, 36, 18, 
            39, 48, 37, 44, 58, 43, 
            28, 50, 16, 29, 42, 40
        ];
        const t3 = [
            24, 51, 52, 53, 56
        ];

        const arrays = [t1, t2, t3];
        const newThemeGroup = arrays.map((array, r) => (
            <div key={r} className="theme-container" style={{ marginBottom: '20px', borderRadius: '5px' }}>
                {array.map((item, i) => (
                    <div
                        key={i}
                        className={`center b${fc === item ? (item === 11 ? 0 : item) : ''}`}
                        style={{
                            height: w<400 ? '40px' : '50px',
                            width: '100%',
                            padding: fc === item ? '3px' : '', // تغییر padding
                            borderWidth: '1px',
                            borderRadius: '7px',
                            alignItems: 'center',
                        }}
                        onClick={() => favoriteTheme(item)}
                    >
                        <div
                            className={`C${item} btnShadow`}
                            style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: '5px',
                            }}
                        ></div>
                    </div>
                ))}
            </div>
        ));

        setThemeGroup(newThemeGroup);
    };

    const onSave = async () => {
        try {
            setAction(true);
            const userInfo = {
                userId: mainUser._id,
                fc: selectedTheme,
            }
            await axios.post(`${serverURL}/userPanel/update`, userInfo)
            .then(async(res) => {
                mainUser.fc = res.data.fc
                props.dispatch(setUserInfo(mainUser))
                props.onToggle();
                setTimeout(() => {
                    window.location.reload()
                }, 500);
            //     var user = res.data
            //     delete user.password
            //     // setLatErr(null)
            //     // setLonErr(null)
                
            //     const preTxBlack = lightColors.includes(mainUser.fc) ? true : false
            //     const txBlack = lightColors.includes(user.fc) ? true : false

            //     const searchIcone = document.getElementById(`searchIcone`)
            //     if(searchIcone) {
            //         searchIcone.classList.remove(`f${preTxBlack ? 7 : 11}`);
            //         searchIcone.classList.add(`f${txBlack ? 7 : 11}`);
            //     }

            //     const categoryAll = document.getElementById(`categoryAll`)
            //     if(categoryAll) {
            //         categoryAll.classList.add(`f${txBlack ? 7 : 11}`);
            //         categoryAll.classList.remove(`f${preTxBlack ? 7 : 11}`);
            //         categoryAll.classList.remove(`b${mainUser.fc===11 ? 0 : 11}`);
            //         categoryAll.classList.add(`b${user.fc===11 ? 0 : 11}`);
            //     }

            //     const elmZ = document.getElementById(`catbox0`)
            //     if(elmZ) {
            //         elmZ.classList.remove(`C${mainUser.fc}`);
            //         elmZ.classList.add(`C${user.fc}`);
            //         elmZ.classList.remove(`f${preTxBlack ? 7 : 11}`);
            //         elmZ.classList.add(`f${txBlack ? 7 : 11}`);
            //     }

            //     const categoryItems = user.categoryItems
            //     console.log('categoryItems: ', categoryItems)
            //     categoryItems.forEach(item => {
            //         const elm = document.getElementById(`catbox${item.id}`)
            //         if(elm) {
            //             elm.classList.remove(`C${mainUser.fc}`);
            //             elm.classList.remove(`f${preTxBlack ? 7 : 11}`);
            //             elm.classList.add(`C${user.fc}`);
            //             elm.classList.add(`f${txBlack ? 7 : 11}`);
            //         }
            //     })
            //     props.dispatch(setUserInfo(user))
            //     props.dispatch(setSubUserInfo(user))
            //     setAction(false);
            //     props.onToggle();
            //     if(!props.me) window.location.href=`/publisher/${mainUser.username}`
            })
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        mapThemes(selectedTheme); // نقشه‌برداری تم‌ها بر اساس تم انتخاب‌شده
    }, [selectedTheme]); // بازسازی تم‌ها زمانی که تم انتخاب‌شده تغییر کند

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (props.toggleWebPageTheme) {
            setSelectedTheme(mainUser.fc);
            setButtonVariant("light");
        }
    }, [props.toggleWebPageTheme]);

    const loader13 = (
        <span
            className='loader-13'
            style={{ fontSize: '10px', margin: props.rtl ? '20px 10px -20px' : '0px 10px', color: '', transform: props.rtl ? 'rotate(180deg)' : '' }}
        ></span>
    );

    return (
        <Modal show={props.toggleWebPageTheme} onHide={props.onToggle}>
            <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                <Modal.Title>{setLT.changeTheme}</Modal.Title>
                <AiOutlineCloseCircle className="sidebarIcon" style={{ fontSize: '30px' }} onClick={props.onToggle} />
            </Modal.Header>
            <Modal.Body style={{ fontSize: '13px', borderRadius: '10px' }}>
                {themeGroup}
            </Modal.Body>
            <Modal.Footer>
                <div className="center" style={{ width: '100%' }}>
                    <Button variant={buttonVariant} style={{ minWidth: '100px' }} onClick={onSave}>
                        {action ? loader13 : setLT.save}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalWebPageTheme;
