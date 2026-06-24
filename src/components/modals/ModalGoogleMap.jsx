import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { setSubUserInfo, setUserInfo } from '../../dataStore/actions';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { MdLocationOn } from 'react-icons/md';
import { serverURL, s } from '../../srcSet';

const ModalGoogleMap = (props) => {
    const {mainUser, setLT, rtl, lang} = props.mapStateToProps
    const [w, setW] = useState(document.body.clientWidth);
    const [action, setAction] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [lat, setLat] = useState();
    const [lon, setLon] = useState();
    const [latErr, setLatErr] = useState();
    const [lonErr, setLonErr] = useState();

    useEffect(() => {
        const handleResize = () => setW(document.body.clientWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (props.toggleGoogleMap) {
            setLat(mainUser.lat);
            setLon(mainUser.lon);
        }
    }, [props.toggleGoogleMap]);

    const changeHandler = (event) => {
        const { name, value } = event.target;
        const stateUpdaters = {
            lat: setLat,
            lon: setLon,
        };

        // Call the appropriate state updater if it exists
        if (stateUpdaters[name]) {
            stateUpdaters[name](value.trim() === "" ? null : value);
        }
    };

    const getLocation = () => {
        setGettingLocation(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLat(latitude);
                setLon(longitude);
                setLatErr(null)
                setLonErr(null)
                setGettingLocation(false)
            },
            (err) => {
                console.error("Error retrieving location:", err);
            }
        );
    };

    const checkNullLocation = () => {
        var infoErr = {}
        if(lat===undefined || lat===null || lat==='') infoErr.latErr = setLT.latErr
        if(lon===undefined || lon===null || lon==='') infoErr.lonErr = setLT.lonErr
        return infoErr
    }

    const testLocation = () => {
        var infoErr = checkNullLocation()
        if(Object.keys(infoErr).length>0) {
            setLatErr(infoErr.latErr)
            setLonErr(infoErr.lonErr)
        } else {
            setLatErr(null)
            setLonErr(null)
            window.open(`https://maps.google.com/?q=${lat},${lon}&z=15`);
        }
    }

    const onSave = async () => {
        try {
            setAction(true);
            var infoErr = checkNullLocation()
            if(Object.keys(infoErr).length>0) {
                setLatErr(infoErr.latErr)
                setLonErr(infoErr.lonErr)
                setAction(false)
            } else {
                const user = {
                    userId: mainUser._id,
                    lat,
                    lon,
                }
                // console.log(user)
                await axios.post(`${serverURL}/userPanel/update`, user)
                .then(async(res) => {
                    delete res.data.password
                    setLatErr(null)
                    setLonErr(null)
                    props.dispatch(setUserInfo(res.data))
                    props.dispatch(setSubUserInfo(res.data))
                    setAction(false);
                    props.onToggle();
                })
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onDeleteLocation = async () => {
        setAction(true);
        const user = {
            userId: mainUser._id,
            lat: null,
            lon: null,
        }
        await axios.post(`${serverURL}/userPanel/update`, user)
        .then(async(res) => {
            delete res.data.password
            setLatErr(null)
            setLonErr(null)
            setLat(null)
            setLon(null)
            props.dispatch(setUserInfo(res.data))
            props.dispatch(setSubUserInfo(res.data))
            setAction(false);
            props.onToggle();
        })
        .catch((error) => {
            console.log(error)
        });
    }

    const loader13 = (
        <span
            className='loader-13'
            style={{ fontSize: '10px', margin: rtl ? '20px 10px -20px' : '0px 10px', color: '', transform: rtl ? 'rotate(180deg)' : '' }}
        ></span>
    );

    const loaderAlert = <div className='loader-07' style={{margin: '', color:'#00CCFF', width:'100px', height:'100px', position:'absolute'}}></div>

    const currentLocationBtn = (
        <div className='d-flex center' style={{width:'100%', alignItems:'center', margin:'15px 0px'}}>
            <div className='d-flex btnShadow waves-effect waves-light btn-large'
                style={{width:'', height:'40px', padding:'10px', color:'#000000',
                fontSize:'15px', flexDirection:'', alignItems:'center', border:'2px solid #00CCFF',
                backgroundColor: '#ffffff', borderRadius:'5px'}}
                onClick = {getLocation}>
                {loaderAlert}
                <MdLocationOn style={{fontSize:'20px', color:'#0236a5'}}/>&nbsp;
                <span style={{fontSize:''}}>{gettingLocation ? loader13 : setLT.currentLocation}</span>
            </div>
        </div>
    )

    const latitude = (
        <div style={{margin:'10px', }}>
            <div>
                <div style={{textAlign:rtl ? 'right' : 'left', fontSize:'14px', fontWeight:'bold'}}>{setLT.latitude}</div>
                <input className='form-control' value={lat} style={{width: '100%', height:'30px', borderRadius:'5px', textAlign:'center', direction:'ltr'}} name="lat" onChange={changeHandler}/>
            </div>
            <span className='invalid-feedback' style={{ margin: '5px 0px 10px', display: latErr ? 'block' : 'none', textAlign: rtl ? 'right' : 'left'}}>
                {latErr}
            </span>
        </div>
    )

    const longitude = (
        <div style={{margin:'10px', }}>
            <div>
                <div style={{textAlign:rtl ? 'right' : 'left', fontSize:'14px', fontWeight:'bold'}}>{setLT.longitude}</div>
                <input className='form-control' value={lon} style={{width: '100%', height:'30px', borderRadius:'5px', textAlign:'center', direction:'ltr'}} name="lon" onChange={changeHandler}/>
            </div>
            <span className='invalid-feedback' style={{ margin: '5px 0px 10px', display: lonErr ? 'block' : 'none', textAlign: rtl ? 'right' : 'left'}}>
                {lonErr}
            </span>
        </div>
    )

    const testLocationBtn = (
        <div className='d-flex center' style={{width:'100%', alignItems:'center', margin:'30px 0px'}}>
            <div className='d-flex btnShadow waves-effect waves-light btn-large'
                style={{width:'', height:'40px', padding:'10px', color:'#000000',
                fontSize:'15px', flexDirection:'', alignItems:'center', border:'2px solid #00CCFF',
                backgroundColor: '#ffffff', borderRadius:'5px'}}
                onClick = {testLocation}
            >
                <span style={{fontSize:''}}>{setLT.testLocation}</span>
            </div>
        </div>
    )

    return (
        <Modal show={props.toggleGoogleMap} onHide={props.onToggle}>
            <Modal.Header className="d-flex justify-content-between" style={{ padding: '10px' }}>
                <Modal.Title>{setLT.userLocation}</Modal.Title>
                <AiOutlineCloseCircle className='sidebarIcon' style={{ fontSize: '30px' }} onClick={props.onToggle} />
            </Modal.Header>
            <Modal.Body style={{ fontSize: '14px', borderRadius: '10px' }}>
                {setLT.locationT1}
                {currentLocationBtn}
                {longitude}
                {latitude}
                {testLocationBtn}
            </Modal.Body>
            <Modal.Footer>
                <div className='center' style={{ width: '100%' }}>
                    <div className={props.rtl ? 'dropdown' : 'dropleft'} style={{ padding: '0px', position:'absolute', bottom:15, left:15 }}>
                        <div id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="" aria-expanded="false">
                            <props.EditBtn position={''} type='delete' onClick={() => null} />
                        </div>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton"
                            style={{ fontSize: '13px', cursor: 'pointer', padding: '0px', backgroundColor: '' }}>
                            <div className="dropdown-item" style={{ color: 'red' }} onClick={onDeleteLocation}>
                                {setLT.delete}
                            </div>
                        </div>
                    </div>
                    <Button variant="success" style={{minWidth:'100px'}} onClick={onSave}>{action ? loader13 : setLT.save}</Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalGoogleMap;
