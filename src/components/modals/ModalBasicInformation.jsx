import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { setSubUserInfo, setUserInfo, setCountry } from '../../dataStore/actions';
import CountrySelector from '../CountrySelector';
import male from '../../assets/images/other/man2.png';
import female from '../../assets/images/other/woman2.png';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { serverURL, s } from '../../srcSet';


const ModalBasicInformation = (props) => {
    const {mainUser, setLT, rtl, lang} = props.mapStateToProps
    const [w, setW] = useState(document.body.clientWidth);
    const [action, setAction] = useState(false);
    const [bizName, setBizName] = useState(mainUser.bizName ? mainUser.bizName : mainUser.username);
    const [genderValue, setGenderValue] = useState(mainUser.genderValue);

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (props.toggleBasicInformation) {
            setGenderValue(mainUser.genderValue);
            setBizName(mainUser.bizName ? mainUser.bizName : mainUser.username);
        }
    }, [props.toggleBasicInformation]);

    const onSave = async () => {
        try {
            setAction(true);
            const user = {
                userId: mainUser._id,
                genderValue,
                bizName,
                continent: props.mapStateToProps.country.continent,
                country: props.mapStateToProps.country.country,
                countryCode: props.mapStateToProps.country.countryCode,
            }

            await axios.post(`${serverURL}/userPanel/update`, user)
            .then(async (res) => {
                delete res.data.password
                props.dispatch(setUserInfo(res.data))
                props.dispatch(setSubUserInfo(res.data))
                // const countryInfo = {
                //     countryCode: res.data.countryCode,
                //     country: res.data.country,
                //     continent: res.data.continent
                // }
                // props.dispatch(setCountry(countryInfo))
                setAction(false);
                props.onToggle();
                setTimeout(() => {
                    if(user.countryCode!==mainUser.countryCode) window.location.reload()
                }, 100);
            })
        } catch (error) {
            console.error(error);
        }
    };

    const changeHandler = (event) => {
        const { name, value } = event.target;
        setBizName(value.trim() === "" ? null : value);
    };

    const onGender = (x) => {
        setGenderValue(x)
    }

    const loader13 = (
        <span
            className='loader-13'
            style={{ fontSize: '10px', margin: rtl ? '20px 10px -20px' : '0px 10px', color: '', transform: rtl ? 'rotate(180deg)' : '' }}
        ></span>
    );

    const genderConst = (
        <div className='center' style={{margin:'10px 0px 60px'}}>
            <div className="radio" style={{margin:'0px 10px'}} onClick={() => onGender(1)}>
                <label className='center' style={{margin:'0px', alignItems:'center', cursor:'pointer', flexWrap:'wrap'}}>
                    <img className='' src={male} alt="male" style={{filter: genderValue===1 ? '' : 'grayscale(100%)', objectFit: 'contain', borderRadius:'100px', width:'35px', height:'35px', margin:'0px', padding:'0px'}} />
                    <div className='d-flex' style={{alignItems:'center'}}>
                    <span style={{marginTop:lang==='fa' ? '0px' : '5px'}}>{setLT.male}</span>
                    <input
                        type="radio"
                        value="option2"
                        checked={genderValue===1 ? true : false}
                        style={{margin:'0px 5px', cursor:'pointer'}}
                        onChange={() => null}
                    />
                    </div>
                </label>
            </div>
            <div className="radio" style={{margin:'0px 10px'}} onClick={() => onGender(0)}>
                <label className='center' style={{margin:'0px', alignItems:'center', cursor:'pointer', flexWrap:'wrap'}}>
                    <img className='' src={female} alt="female" style={{filter: genderValue===0 ? '' : 'grayscale(100%)', objectFit: 'contain', borderRadius:'100px', width:'35px', height:'35px', margin:'0px', padding:'0px'}} />
                    <div className='d-flex' style={{alignItems:'center'}}>
                        <span style={{marginTop:lang==='fa' ? '0px' : '5px'}}>{setLT.female}</span>
                        <input
                            type="radio"
                            value="option3"
                            checked={genderValue===0 ? true : false}
                            style={{margin:'0px 5px', cursor:'pointer'}}
                            onChange={() => null}
                        />
                    </div>
                </label>
            </div>
        </div>
    )

    const biznameInput = (
        <label htmlFor="inp1" className={`${rtl ? 'inpRTL' : 'inpLTR' }`}>
            <input value={bizName} type="text" autoComplete="off" style={{textAlign: 'center'}} id="inp1" placeholder="&nbsp;" name="username" onChange={changeHandler}/>
            <span className="label" style={{fontSize:'15px'}}>{setLT.bizName}</span>
            <span className="border"></span>
        </label>
    )

    const countryInput = (
        <div style={{margin:'20px 0px 20px', zIndex:'1'}}>
            <div className='d-flex' style={{marginBottom:'0px', color:'', alignItems: 'center', fontSize:'14px', fontWeight:'bold'}}>
                {setLT.country}&nbsp;
                <div className='d-flex sticky-top' style={{direction:'ltr', fontWeight:400, marginTop:'0px', alignItems:'center'}}>
                    <CountrySelector/>
                </div>
            </div>
        </div>
    )

    return (
        <Modal show={props.toggleBasicInformation} onHide={props.onToggle}>
            <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                <Modal.Title>{setLT.basicInformation}</Modal.Title>
                <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={props.onToggle} />
            </Modal.Header>
            <Modal.Body style={{ fontSize: '13px', borderRadius: '10px' }}>
                <div style={{padding:'10px'}}>
                    {genderConst}
                    {biznameInput}
                    {countryInput}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='center' style={{ width: '100%' }}>
                    <Button variant="success" style={{minWidth:'100px'}} onClick={onSave}>{action ? loader13 : setLT.save}</Button>
                </div>

            </Modal.Footer>
        </Modal>
    );
};

export default ModalBasicInformation;
