import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import { Table, InputGroup, Form, Col, Row, DropdownButton, ButtonGroup, Dropdown } from 'react-bootstrap';
import { setRubyBlock, setObjects, setCountry, setFullAccess, setUserInfo, setSubUserInfo, 
    setAuth, setSeenStatus, setToggleViewStatus, setPage, setBalance, setRuby,
    setPageRubyTime, setRubyInterval, } from './dataStore/actions';
import male from './assets/images/other/man2.png';
import female from './assets/images/other/woman2.png';
import { TbTrashXFilled } from "react-icons/tb";

import { serverURL, NavH } from './srcSet';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// ایجاد شناسه یکتا برای کاربر
const getFingerprint = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    // console.log("شناسه کاربر (VisitorID):", result.visitorId);
    return result.visitorId;
}

async function getLocalIPs() {
    const ips = [];
    const rtc = new RTCPeerConnection({ iceServers: [] });

    rtc.createDataChannel("");
    rtc.onicecandidate = (event) => {
        if (event && event.candidate) {
            const parts = event.candidate.candidate.split(" ");
            const ip = parts[4];
            if (!ips.includes(ip)) {
                ips.push(ip);
            }
        }
    };
  
    await rtc.createOffer().then((offer) => rtc.setLocalDescription(offer));
    return new Promise((resolve) => {
        setTimeout(() => resolve(ips), 1000);
    });
}

const getPos = async (id) => {
  const elmnt = document.getElementById(id)
  if(elmnt) {
    const rect = elmnt.getBoundingClientRect();
    const top = rect.top// + window.scrollY;
    const left = rect.left// + window.scrollX;
    const width = rect.width;
    const height = rect.height;
    const bottom = top + height;
    const right = left + width;

    return { top, left, bottom, right, width, height }
  }
}

const dig3 = (x, d = 0) => {
    const num = Number(x);
    if (isNaN(num)) return '';
  
    const fixed = num.toFixed(d); // کنترل تعداد اعشار
    const parts = fixed.split('.');
    const intPart = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); // جدا کردن سه‌رقمی
    return parts[1] ? `${intPart}.${parts[1]}` : intPart;
}

const isoDateToDateTime = (isoDateStr, lang) => {
  // console.log(lang)
  const fx = lang==='fa' ? 'fa-IR' : 'en-GB'
  const dateObj = new Date(isoDateStr);

  // Convert to Iran time zone
  // const options = { timeZone: 'Asia/Tehran', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  // const formattedDate = new Intl.DateTimeFormat('fa-IR', options).format(dateObj);
  
  // Convert to UK time zone
  const options = { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true, weekday:'short' };
  const formattedDate = new Intl.DateTimeFormat(fx, options).format(dateObj);
  // Split the formatted date into date and time parts
  if(lang==='fa') {
    var day, date, time
    var [dayAndDate, time] = formattedDate.split(',');
    var [day, date] = dayAndDate.trim().split(' ');
    var cleanedTime = time.trim();
    time = cleanedTime
    // console.log('day', day)
    // console.log('date', date)
    // console.log('time', time)
  } else {
    var day, date, time
    [day, date, time] = formattedDate.split(', ');
  }

  return {day, date, time}
}

const addNotification = async (subject, type, fullAccess, mainUser, userId, geo, subId) => {
    // console.log('geo: ', geo)
    if(!fullAccess){
        var data = {
            mainUser,
            visitor: mainUser._id!==undefined ? mainUser._id : 'unknown',
            visitee: userId,
            subject,
            type,
            seen: false
        }
        if(mainUser._id===undefined) {
            data.countryCodeZ = geo.countryCode
            data.countryZ = geo.country
        }
        if(subId) data.subId = subId
        if(data.visitee && data.visitor!==data.visitee) await axios.post(`${serverURL}/notification/add`, data)
    }
}

const logout = (lang, dispatch) => {
    localStorage.removeItem('jwtToken');
    dispatch(setPage(''))
    dispatch(setAuth(false))
    dispatch(setFullAccess(false))
    dispatch(setUserInfo([]))
    dispatch(setCountry({}))
    dispatch(setBalance('0.00'))
    dispatch(setRuby('0.00'))
    dispatch(setRubyInterval({ ruby:0, done:0, dateTime:'' }))
    window.scrollTo(0, 0);
    window.location.reload();
    window.location.href = `/`;
}

const goToWebPage = (user) => {
    const root = user.businessType>0 ? 'publisher' : 'user'
    window.location.href = `/${root}/${user.username}`;
}

const countryName = (code, name) => {
    var x
    switch (code) {
        case 'IR' : x = 'Iran'; break;
        case 'US' : x = 'United State'; break;
        case 'BO' : x = 'Bolivia'; break;
        case 'BQ' : x = 'Bonaire/Eust'; break;
        case 'BA' : x = 'Bosnia Herzg'; break;
        case 'IO' : x = 'Br Ind Oc Tr'; break;
        case 'UM' : x = 'United States MOI'; break;
        case 'VG' : x = 'Virgin Isl (UK)'; break;
        case 'VI' : x = 'Virgin Isl (US)'; break;
        case 'BN' : x = 'Brunei'; break;
        case 'CF' : x = 'Central African'; break;
        case 'CC' : x = 'Cocos Islands'; break;
        case 'CD' : x = 'Congo'; break;
        case 'DO' : x = 'Dominican'; break;
        case 'FK' : x = 'Falkland Islands'; break;
        case 'TF' : x = 'French SRN TERR'; break;
        case 'HM' : x = 'Heard McDonald Isl'; break;
        case 'LA' : x = 'Lao'; break;
        case 'MK' : x = 'Macedonia'; break;
        case 'FM' : x = 'Micronesia'; break;
        case 'MD' : x = 'Moldova'; break;
        case 'KP' : x = 'North Korea'; break;
        case 'MP' : x = 'Northern Mariana'; break;
        case 'PS' : x = 'Palestine'; break;
        case 'XK' : x = 'Kosovo'; break;
        case 'RU' : x = 'Russian'; break;
        case 'SH' : x = 'St Helena'; break;
        case 'MF' : x = 'St Martin'; break;
        case 'PM' : x = 'St Pier Mq'; break;
        case 'VC' : x = 'St Vincent'; break;
        case 'KN' : x = 'St Kitts Nev'; break;
        case 'ST' : x = 'Sao Tome Prn'; break;
        case 'SX' : x = 'Sint Maarten'; break;
        case 'GS' : x = 'Georgia Sandwich Isl'; break;
        case 'KR' : x = 'South Korea'; break;
        case 'SJ' : x = 'Svalbard Jan Mayen'; break;
        case 'SY' : x = 'Syrian'; break;
        case 'TZ' : x = 'Tanzania'; break;
        case 'TC' : x = 'Turks Caicos Isl'; break;
        case 'GB' : x = 'United Kingdom'; break;
        case 'AE' : x = 'Emirates'; break;
        case 'VE' : x = 'Venezuela'; break;
        default: x = name
    }
    return x
}

const difDate = (d1, d2, lang) => {
    var lang = lang ? lang : 'en'
    var t = (d1-new Date(d2))/60000
    var i, x, y
    switch (true) {
      case (t<60):
        i = 0
        x = Math.round(t)
        y = 'm'
        break;
      case (60 <= t && t < 60*24):
        i = 1
        x = Math.round(t/60)
        y = 'h'
        break;
      case (60*24 <= t && t < 60*24*30):
        i = 2
        x = Math.round(t/(60*24))
        y = 'd'
        break;
      case ( 60*24*30 <= t && t < 60*24*365):
        i = 3
        x = Math.round(t/(60*24*30))
        y = 'mo'
        break;
      case ( t >= 60*24*365):
        i = 4
        x = Math.round(t/(60*24*365))
        y = 'yr'
        break;
      default: x = '?'
    }
  
    var enArr = ['m', 'h', 'd', 'mo', 'yr']
    var faArr = ['دقیقه', ' ساعت', ' روز', ' ماه', ' سال ']
    function Suffix(lang, i){
      switch(lang){
        case 'en': return enArr[i];
        case 'fa': return faArr[i];
        default: return enArr[i];
      }
    }
    var dx = x + Suffix(lang, i)
    return dx
}

const exist = (item) => {
    if (item === undefined || item === null) return false;
    if (typeof item === "string" && item.trim() === "") return false;
    return true;
}

const xNote = async (username, lang, subject, type) => {
    // console.log('0')
    var x
    switch (lang) {
        case 'en': x = xNoteEn(subject, type); break;
        case 'fa': x = xNoteFa(subject, type); break;
        case 'ar': x = xNoteAr(subject, type); break;
        case 'ru': x = xNoteRu(subject, type); break;
        default:   x = xNoteEn(subject, type);
    }
    return x

    function xNoteEn (subject, type) {
        // console.log(1)
        var x
        switch (subject) {
            case 'website': x = `${username} clicked on your Website link.`; break;
            case 'instagram': x = `${username} clicked on your Instagram link.`; break;
            case 'telegram': x = `${username} clicked on your Telegram link.`; break;
            case 'facebook': x = `${username} clicked on your Facebook link.`; break;
            case 'youtube': x = `${username} clicked on your YouTube link.`; break;
            case 'linkedin': x = `${username} clicked on your LinkedIn link.`; break;
            case 'profile': x = xEnProfile(type); break;
            case 'bizPage': x = xEnBizPage(type); break;
            case 'ad': x = xEnAd(type); break;
            case 'adPage': x = xEnAdPage(type); break;
            case 'video': x = xEnVideo(type); break;
            case 'chat': x = `${username} sent you a message.`; break;
            default: x = '';
        }
        return x
    }

    function xNoteFa (subject, type) {
        var x
        switch (subject) {
            case 'website': x = `${username} بر روی لینک وبسایت شما کلیک کرد.`; break;
            case 'instagram': x = `${username} بر روی لینک اینستاگرام شما کلیک کرد.`; break;
            case 'telegram': x = `${username} بر روی لینک تلگرام شما کلیک کرد.`; break;
            case 'facebook': x = `${username} بر روی لینک فیس بوک شما کلیک کرد.`; break;
            case 'youtube': x = `${username} بر روی لینک یوتیوب شما کلیک کرد.`; break;
            case 'linkedin': x = `${username} بر روی لینک لینکدین شما کلیک کرد.`; break;
            case 'profile': x = xFaProfile(type); break;
            case 'bizPage': x = xFaBizPage(type); break;
            case 'ad': x = xFaAd(type); break;
            case 'adPage': x = xFaAdPage(type); break;
            case 'video': x = xFaVideo(type); break;
            case 'chat': x = `${username} برای شما پیام فرستاد.`; break;
            default: x = '';
        }
        return x
    }

    function xNoteAr (subject, type) {
        var x
        switch (subject) {
            case 'website': x = `نقر ${username} على رابط موقع الويب الخاص بك.`; break;
            case 'instagram': x = `نقر ${username} على رابط انستغرام الخاص بك.`; break;
            case 'telegram': x = `نقر ${username} على رابط تيليجرام الخاص بك.`; break;
            case 'facebook': x = `نقر ${username} على رابط الفيسبوك الخاص بك.`; break;
            case 'youtube': x = `نقر ${username} على رابط يوتيوب الخاص بك.`; break;
            case 'linkedin': x = `نقر ${username} على رابط لينكدإن الخاص بك.`; break;
            case 'profile': x = xArProfile(type); break;
            case 'bizPage': x = xArBizPage(type); break;
            case 'ad': x = xArAd(type); break;
            case 'adPage': x = xArAdPage(type); break;
            case 'video': x = xArVideo(type); break;
            case 'chat': x = `أرسل لك ${username} رسالة.`; break;
            default: x = '';
        }
        return x
    }

    function xNoteRu (subject, type) {
        // console.log(1)
        var x
        switch (subject) {
            case 'website': x = `${username} нажал на ваш Ссылка на сайт.`; break;
            case 'instagram': x = `${username} нажал на ваш Ссылка в Instagram.`; break;
            case 'telegram': x = `${username} нажал на ваш Ссылка в Telegram.`; break;
            case 'facebook': x = `${username} нажал на ваш Ссылка на Facebook.`; break;
            case 'youtube': x = `${username} нажал на ваш Ссылка на YouTube.`; break;
            case 'linkedin': x = `${username} нажал на ваш Ссылка на LinkedIn.`; break;
            case 'profile': x = xRuProfile(type); break;
            case 'bizPage': x = xRuBizPage(type); break;
            case 'ad': x = xRuAd(type); break;
            case 'adPage': x = xRuAdPage(type); break;
            case 'video': x = xRuVideo(type); break;
            case 'chat': x = `${username} отправил вам сообщение.`; break;
            default: x = '';
        }
        return x
    }

    function xEnProfile (type) {
        var x
        switch (type) {
            case 'view': x = `${username} viewed your profile.`; break;
            case 'like': x = `${username} liked your profile.`; break;
            case 'comment': x = `${username} left a comment for your profile.`; break;
            default: x = '';
        }
        return x
    }

    function xFaProfile (type) {
        var x
        switch (type) {
            case 'view': x = `${username} از پروفایل شما بازدید کرد.`; break;
            case 'like': x = `${username} پروفایل شما را لایک کرد.`; break;
            case 'comment': x = `${username} برای پروفایل شما کامنت گذاشت.`; break;
            default: x = '';
        }
        return x
    }

    function xArProfile (type) {
        var x
        switch (type) {
            case 'view': x = `${username} شاهد ملفك الشخصي.`; break;
            case 'like': x = `${username} اعجب بملفك الشخصي.`; break;
            case 'comment': x = `${username} ترك تعليقاً لملفك الشخصي.`; break;
            default: x = '';
        }
        return x
    }

    function xRuProfile (type) {
        var x
        switch (type) {
            case 'view': x = `${username} просмотрел ваш профиль.`; break;
            case 'like': x = `${username} понравился твой профиль.`; break;
            case 'comment': x = `${username} оставил комментарий к вашему профилю.`; break;
            default: x = '';
        }
        return x
    }

    function xEnBizPage (type) {
        var x
        switch (type) {
            case 'view': x = `${username} viewed your business webpage.`; break;
            case 'like': x = `${username} liked your business webpage.`; break;
            case 'comment': x = `${username} left a comment for your business webpage.`; break;
            default: x = '';
        }
        return x
    }

    function xFaBizPage (type) {
        var x
        switch (type) {
            case 'view': x = `${username} از صفحه وب تجاری شما بازدید کرد.`; break;
            case 'like': x = `${username} صفحه وب تجاری شما را لایک کرد.`; break;
            case 'comment': x = `${username} برای صفحه وب تجاری شما کامنت گذاشت.`; break;
            default: x = '';
        }
        return x
    }

    function xArBizPage (type) {
        var x
        switch (type) {
            case 'view': x = `شاهد ${username} صفحة الويب الخاصة بشركتك.`; break;
            case 'like': x = `${username} اعجب بصفحة الويب الخاصة بشركتك.`; break;
            case 'comment': x = `${username} ترك تعليقاً لصفحة الويب الخاصة بشركتك.`; break;
            default: x = '';
        }
        return x
    }

    function xRuBizPage (type) {
        var x
        switch (type) {
            case 'view': x = `${username} просмотрел ваша бизнес-страница.`; break;
            case 'like': x = `${username} понравилась ваша бизнес-страница.`; break;
            case 'comment': x = `${username} оставил комментарий на странице ваша бизнес-страница.`; break;
            default: x = '';
        }
        return x
    }

    function xEnAd (type) {
        var x
        switch (type) {
            case 'view': x = `${username} viewed your ad.`; break;
            case 'like': x = `${username} liked your ad.`; break;
            case 'comment': x = `${username} left a comment for your ad.`; break;
            default: x = '';
        }
        return x
    }

    function xFaAd (type) {
        var x
        switch (type) {
            case 'view': x = `${username} از آگهی شما بازدید کرد.`; break;
            case 'like': x = `${username} آگهی شما را لایک کرد.`; break;
            case 'comment': x = `${username} برای آگهی شما کامنت گذاشت.`; break;
            default: x = '';
        }
        return x
    }

    function xArAd (type) {
        var x
        switch (type) {
            case 'view': x = `${username} شاهد إعلانك.`; break;
            case 'like': x = `${username} اعجب بإعلانك.`; break;
            case 'comment': x = `${username} ترك تعليقا على إعلانك .`; break;
            default: x = '';
        }
        return x
    }

    function xRuAd (type) {
        var x
        switch (type) {
            case 'view': x = `${username} просмотрел ваше объявление.`; break;
            case 'like': x = `${username} понравилась ваша реклама.`; break;
            case 'comment': x = `${username} оставил комментарий к вашему объявлению.`; break;
            default: x = '';
        }
        return x
    }

    function xEnAdPage (type) {
        var x
        switch (type) {
            case 'view': x = `${username} viewed your ad webpage.`; break;
            case 'like': x = `${username} liked your ad webpage.`; break;
            case 'comment': x = `${username} left a comment for your ad webpage.`; break;
            default: x = '';
        }
        return x
    }

    function xFaAdPage (type) {
        var x
        switch (type) {
            case 'view': x = `${username} از صفحه وب آگهی شما بازدید کرد.`; break;
            case 'like': x = `${username} صفحه وب آگهی شما را لایک کرد.`; break;
            case 'comment': x = `${username} برای صفحه وب آگهی شما کامنت گذاشت.`; break;
            default: x = '';
        }
        return x
    }

    function xArAdPage (type) {
        var x
        switch (type) {
            case 'view': x = `شاهد ${username} صفحة الويب الإعلانية الخاصة بك.`; break;
            case 'like': x = `${username} اعجب بصفحتك الاعلانية.`; break;
            case 'comment': x = `${username} ترك تعليقاً لصفحة الويب الخاصة بإعلانك.`; break;
            default: x = '';
        }
        return x
    }

    function xRuAdPage (type) {
        var x
        switch (type) {
            case 'view': x = `${username} просмотрел вашу рекламную веб-страницу.`; break;
            case 'like': x = `${username} понравилась ваша рекламная веб-страница.`; break;
            case 'comment': x = `${username} оставил комментарий на вашей рекламной веб-странице.`; break;
            default: x = '';
        }
        return x
    }

    function xEnVideo (type) {
        var x
        switch (type) {
            case 'view': x = `${username} viewed your video.`; break;
            case 'like': x = `${username} liked your video.`; break;
            case 'comment': x = `${username} left a comment for your video.`; break;
            default: x = '';
        }
        return x
    }

    function xFaVideo (type) {
        var x
        switch (type) {
            case 'view': x = `${username} از ویدئوی شما بازدید کرد.`; break;
            case 'like': x = `${username} ویدئوی شما را لایک کرد.`; break;
            case 'comment': x = `${username} برای ویدئوی شما کامنت گذاشت.`; break;
            default: x = '';
        }
        return x
    }

    function xArVideo (type) {
        var x
        switch (type) {
            case 'view': x = `شاهد ${username} الفيديو الخاص بك.`; break;
            case 'like': x = `${username} اعجب بالفيديو الخاص بك.`; break;
            case 'comment': x = `${username} ترك تعليقا على الفيديو الخاص بك.`; break;
            default: x = '';
        }
        return x
    }

    function xRuVideo (type) {
        var x
        switch (type) {
            case 'view': x = `${username} просмотрел ваше видео.`; break;
            case 'like': x = `${username} понравилось ваше видео.`; break;
            case 'comment': x = `${username} оставил комментарий к вашему видео.`; break;
            default: x = '';
        }
        return x
    }

}

const scrollStatus = (lastScrollTop) => {
    var direction
    var currentScroll = window.scrollY
    if (currentScroll > lastScrollTop){
        // صفحه به سمت پایین اسکرول می‌شود
        // console.log("Scrolling down");
        direction = 'down'
    } else {
        // صفحه به سمت بالا اسکرول می‌شود
        // console.log("Scrolling up");
        direction = 'up'
    }
    return {
        scrollDirection: direction,
        lastScrollTop: currentScroll
    }
}

const setId = async (items) => {
    // پیدا کردن بزرگترین آیدی موجود در آرایه
    const maxId = items.reduce((max, obj) => (obj.id > max ? obj.id : max), 0);
    // تنظیم آیدی برای آبجکت جدید
    const newId = maxId + 1;
    return newId
}

const totalFileSize = (items=[]) => {
    // جمع کردن fileSize همه آیتم‌ها
    const totalSize = items.reduce((total, obj) => total + (obj.fileSize || 0), 0);
    return totalSize;
}

const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes >= 1024 * 1024) {
        // اندازه به مگابایت
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
        return `${sizeInMB} MB`;
    } else {
        // اندازه به کیلوبایت
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);
        return `${sizeInKB} KB`;
    }
}

const attachmentLimitRemain = (totalSize, attachmentLimit) => {
    let limit = attachmentLimit * 1024 // تبدیل به بایت
    let unit = 'MB'; // پیش‌فرض واحد مگابایت است
    let totalSizeUnit = totalSize / (1024 * 1024)
    let limittUnit = limit / (1024 * 1024)
  
    if (limit < 1024 * 1024) { // اگر limit کمتر از 1MB باشد، از KB استفاده کن
      unit = 'KB';
      totalSizeUnit = totalSize / 1024
      limittUnit = limit / 1024
    }

    return `(${totalSizeUnit.toFixed(2)}/${limittUnit.toFixed(2)}) ${unit}`;
}

const scrollTo = async (name) => {
    let elem = document.getElementById(name);
    if (elem) {
        // موقعیت المان
        const rect = elem.getBoundingClientRect();
        // اسکرول به صفحه با توجه به موقعیت المان و اضافه کردن ۶۰ پیکسل به بالا
        window.scrollTo({
            top: rect.top + window.scrollY - NavH,
            behavior: 'smooth',  // اگر می‌خواهید اسکرول به صورت صاف و ملایم باشد
        });
    } else {
        window.scrollTo(0, 0)
        // console.log(false)
    }
}

const scrollInModal = async (name) => {
    let elem = document.getElementById(name);
    if(elem) {
        // اسکرول به المان با استفاده از ref
        elem.scrollIntoView({
            // behavior: 'smooth',
            block: 'start',
        });
    }
}

const countAllAds = async (userId) => {
    const n = await axios.post(`${serverURL}/ads/countAllUserAds`, {userId})
    return n.data
}

const countAllVideo = async (userId) => {
    const n = await axios.post(`${serverURL}/video/countAllUserVideo`, {userId})
    return n.data
}

const countAllInsta = async (userId) => {
    const n = await axios.post(`${serverURL}/instagram/countAllUserInsta`, {userId})
    return n.data
}

const getUserInfo = async (userId, dispatch) => {
    try {
        const res = await axios.post(`${serverURL}/user/getUserInfo`, { _id: userId });
        if (res.data) {
            delete res.data.password;
            // console.log(12345, res.data.categoryItems)
            dispatch(setUserInfo(res.data));
            dispatch(setSubUserInfo(res.data));
            return res.data
        }
    } catch (error) {
        console.error(error);
    }
};

const background = (text, status, fz) => {
    // console.log(12, status)
    const getColor = () => {
        switch (status) {
            case 'Completed':
                return 'green';
            case 'Pending':
                return 'orange';
            case 'In progress':
                return 'blue';
            case 'Processing':
                return '#00BFFF';
            case 'Partial':
                return '#FF4500';
            case 'Canceled':
                return '#FF0100';
            default:
                return 'gray'; // Default color for other statuses
        }
    };
  
    const HTML = `
        <div style="
            text-align: center;
            font-size: ${fz}px;
            background-color: ${getColor()};
            color: white;
            padding: 5px 10px;
            border-radius: 8px;
        ">
            ${text}
        </div>
    `;
  
    return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
};

const countTopicsAndCategories = async (whoralyServices) => {
    const counts = {};
  
    whoralyServices.forEach(service => {
        const topic = service.topic;
        const category = service.category;
        const isEnabled = service.enable;
  
        // اگر این topic قبلاً در counts وجود ندارد، آن را ایجاد کنید
        if (!counts[topic]) {
            counts[topic] = {
                total: 0,
                enabledCount: 0,
                disabledCount: 0,
                categories: {}
            };
        }
  
        // افزایش تعداد کلی برای این topic
        counts[topic].total++;
  
        // افزایش تعداد enable های true برای این topic
        if (isEnabled) {
            counts[topic].enabledCount++;
        } else {
            counts[topic].disabledCount++;
        }
  
        // اگر این category برای این topic وجود ندارد، آن را ایجاد کنید
        if (!counts[topic].categories[category]) {
            counts[topic].categories[category] = {
                total: 0,
                enabledCount: 0,
                disabledCount: 0,
            };
        }
  
        // افزایش تعداد این category برای این topic
        counts[topic].categories[category].total++;
  
        // افزایش تعداد enable های true برای این category
        if (isEnabled) {
            counts[topic].categories[category].enabledCount++;
        } else {
            counts[topic].categories[category].disabledCount++;
        }
    });
  
    return counts;
}

const isoDateToNormal = (isoDateStr) => {
    const dateTime = isoDateToDateTime(isoDateStr)
    const date = dateTime.date
    const time = dateTime.time
    const day = dateTime.day
    // console.log(10000, day)
  
    // Create HTML
    const HTML = `<div><span>${date}</span><br><span>${time}</span></div>`;

    return <div dangerouslySetInnerHTML={{ __html: HTML }} />
};
  
const serviceIdName = (id, name) => {
    const HTML = `<div><span style="font-weight: 450;">ID ${id}</span> - <span>${name}</span></div>`;
    return <div dangerouslySetInnerHTML={{ __html: HTML }} />
}

const checkArea = (posArr) => {
    const { top, left, bottom, right } = posArr;
    const area = { top, left, bottom, right };
  
    return new Promise((resolve, reject) => {
        document.addEventListener('click', function(e) {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            // console.log(mouseX, mouseY)
            if (mouseX >= area.left && mouseX <= area.right && mouseY >= area.top && mouseY <= area.bottom) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

const countryAdsenseRate = (code) => {
    const rates = {
        'GB': 0.2,   // بریتانیا
        'DE': 0.18,   // آلمان
    };

    return rates[code] || 0.01; // مقدار پیش‌فرض برای سایر کشورها
};

const createConfetti = () => {
	const confettiContainer = document.createElement("div");
	confettiContainer.classList.add("confetti-container");
	document.body.appendChild(confettiContainer);

	for (let i = 0; i < 50; i++) { // تعداد ستاره‌ها
	  let confetti = document.createElement("div");
	  confetti.classList.add("confetti");
  
	  // تنظیم رنگ‌های درخشان و متنوع
	  confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`;

	  // تنظیم موقعیت تصادفی از بالای صفحه
	  confetti.style.left = `${Math.random() * 100}vw`;

	  // تنظیم اندازه تصادفی
	  let size = Math.random() * 12 + 8;
	  confetti.style.width = confetti.style.height = `${size}px`;
  
	  // تنظیم مدت زمان و تاخیر تصادفی برای طبیعی‌تر شدن
	  confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
	  confetti.style.animationDelay = `${Math.random()}s`;
  
	  confettiContainer.appendChild(confetti);
	}
  
	// حذف ستاره‌ها بعد از چند ثانیه
	setTimeout(() => {
	  confettiContainer.remove();
	}, 5000);
}

const identifyObj = (dispatch, obj = []) => {
    const adsIdArray = [
        { id: 'adsH1', active: false },
        { id: 'adsH2', active: false },
        { id: 'adsH3', active: false },
        { id: 'adsH4', active: false },
        { id: 'adsMulti1', active: false },
        { id: 'adsMulti2', active: false },
        { id: 'adsContact', active: false },
        { id: 'adsHAds', active: false },
        { id: 'adsHVideo', active: false },
        { id: 'adsHInsta', active: false },
    ];
  
    // بررسی هر آیتم در adsIdArray
    for (let i = 0; i < adsIdArray.length; i++) {
        const adId = adsIdArray[i].id;

        // بررسی وجود adId در obj با استفاده از some
        const isExist = obj.some((item) => item.id === adId);
    
        // اگر آیدی در obj وجود نداشت، آن را به obj اضافه کن
        if (!isExist) {
            const adElement = document.getElementById(adId);
    
            // اگر عنصر در DOM وجود داشت
            if (adElement) {
                obj.push(adsIdArray[i]);
            }
        }
    }

    // ارسال نتیجه به dispatch
    dispatch(setObjects(obj));
};

const getBalance = async (userId, dispatch) => {
    const balanceData = await axios.get(`${serverURL}/finance/balance/` + userId)
    var data = balanceData.data

    // Ensure the balance is in 2 decimal places
    const formattedBalance = parseFloat(data.totalAmount).toFixed(2)

    dispatch(setBalance(dig3(formattedBalance)))
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // انتخاب اندیس تصادفی
        [array[i], array[j]] = [array[j], array[i]]; // جابجایی
    }
    return array
}

const getRemainingTime = (nextAllowedISOString) => {
    const now = new Date();
    const nextAllowed = new Date(nextAllowedISOString);
    const remainingMs = nextAllowed - now;

    if (remainingMs <= 0) return "00:00:00";

    const totalSeconds = Math.floor(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const checkSeen = async (page, seenStatus, dispatch) => {
    const now = new Date();
    const utcDateTime = now.toISOString();
    const existingItem = seenStatus.find(item => item.page === page);

    if (existingItem) {
        const nextAllowed = new Date(existingItem.nextAllowedTime);

        if (existingItem.try <= 1) {
            if (now >= nextAllowed) {
                // Time passed → reset try to 0 and set nextAllowedTime between 24–72 hours
                existingItem.try = 0;
                existingItem.viewDateTime = utcDateTime;

                const randomHours = Math.floor(Math.random() * (72 - 24 + 1)) + 24;
                const nextAllowedTime = new Date(now.getTime() + randomHours * 60 * 60 * 1000).toISOString();

                existingItem.nextAllowedTime = nextAllowedTime;
                dispatch(setRubyBlock(false));
            } else {
                // console.log("nextAllowedTime:", existingItem.nextAllowedTime);

                const readableTime = getRemainingTime(existingItem.nextAllowedTime);

                dispatch(setRubyBlock(true));
                dispatch(setPageRubyTime(readableTime));
                dispatch(setToggleViewStatus({toggle:true, page:true}));
            }
        }
    } else {
        // First visit → nextAllowedTime between 3–5 minutes
        const randomMinutes = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
        const nextAllowedTime = new Date(now.getTime() + randomMinutes * 60 * 1000).toISOString();
        seenStatus.push({
            page,
            try: 1,
            viewDateTime: utcDateTime,
            nextAllowedTime: nextAllowedTime
        });
        dispatch(setRubyBlock(false));
    }

    // console.log("seenStatus:", seenStatus);
    //  dispatch(setSeenStatus([]));
};

const checkRubyInterval = (rubyInterval, dispatch) => {
    // console.log(rubyInterval);
    const now = new Date();
    const utcDateTime = now.toISOString();

    // اگر dateTime برابر با '' باشد یا زمان کنونی از dateTime بزرگتر باشد
    if (!rubyInterval.dateTime || new Date(utcDateTime) > new Date(rubyInterval.dateTime)) {
        // console.log('rubyInterval: ', rubyInterval);
        // تولید زمان رندوم بین 2 تا 10 ساعت بعد
        const randomHours = Math.floor(Math.random() * (10 - 2 + 1)) + 2;
        const randomDate = new Date();
        randomDate.setHours(randomDate.getHours() + randomHours);
        const randomDateTime = randomDate.toISOString();  // تبدیل به فرمت ISO

        // تولید مقدار رندوم برای ruby بین 10 تا 20
        const randomRuby = Math.floor(Math.random() * (20 - 10 + 1)) + 10;

        // بروزرسانی rubyInterval
        rubyInterval = {
            ruby: randomRuby,
            done: 0,
            dateTime: randomDateTime
        };
        dispatch(setRubyInterval(rubyInterval))
        // console.log(rubyInterval);
    }
}

const cleanEditorHtml = (dirtyHtml = '') => {
  if (!dirtyHtml) return '';

  const FORBIDDEN_TAGS = ['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META'];

  const parser = new DOMParser();
  const doc = parser.parseFromString(dirtyHtml, 'text/html');

  const walk = (node) => {
    [...node.children].forEach((child) => {
      // حذف تگ‌های خطرناک
      if (FORBIDDEN_TAGS.includes(child.tagName)) {
        child.remove();
        return;
      }

      // حذف span/div بلااستفاده که فقط یک بلاک دارند
      if (
        (child.tagName === 'SPAN' || child.tagName === 'DIV') &&
        child.childNodes.length === 1 &&
        child.firstChild.nodeType === 1 &&
        child.firstChild.tagName !== 'INS' && // حفظ adsbox
        !child.classList.contains('adsbox')  &&
  			child.firstChild.tagName !== 'HR' // <hr> رو حذف نکن
      ) {
        child.replaceWith(child.firstChild);
      }

      // پاکسازی attribute ها
      [...child.attributes].forEach((attr) => {
        const name = attr.name;

        // حذف event handler ها
        if (name.startsWith('on')) {
          child.removeAttribute(name);
          return;
        }

        // حذف style در غیر لیست‌ها
        if (name === 'style' && !['UL', 'OL', 'LI'].includes(child.tagName)) {
          child.removeAttribute(name);
          return;
        }

        // مدیریت data-* فقط برای adsbox
        if (name.startsWith('data-')) {
          if (
            child.classList.contains('adsbox') &&
            (name === 'data-ad' || name === 'data-id')
          ) {
            return; // مجاز
          }
          child.removeAttribute(name); // سایر data-* حذف شوند
        }
      });

      // حذف span/p خالی (ولی اگر داخل ul/li باشد نگه داشته شود)
      if (
        (child.tagName === 'SPAN' || child.tagName === 'P') &&
        child.textContent.trim() === '' &&
        !child.closest('LI')&&
  			child.querySelector('hr') === null // اگر hr داخل این تگ هست حذف نکن
      ) {
        child.remove();
        return;
      }

      // پردازش بازگشتی
      walk(child);
    });
  };

  walk(doc.body);

  // حذف فقط <p> های خالی بدون دست زدن به <br>
  let html = doc.body.innerHTML.replace(/<p>\s*<\/p>/g, '').trim();

  return html;
};

const mapTeam = (team, w, s, onDeleteTeam, me) => {
    const truncateHtmlText = (html, maxLength = 70) => {
        if (!html) return "";

        // تبدیل HTML به متن ساده
        const div = document.createElement("div");
        div.innerHTML = html;
        let text = div.textContent || div.innerText || "";

        if (text.length <= maxLength) return text;

        let truncated = text.substr(0, maxLength);

        // جلوگیری از نصفه شدن کلمه
        truncated = truncated.substr(0, truncated.lastIndexOf(" "));

        return truncated + "...";
    };

    var dataRV = team.map(
        (item, i) => {
            const root = item.businessType>0 ? 'publisher' : 'user'
            const img = (
                <Link to={`/${root}/${item.username}`} target="_blank" className={`C${item.fc} btnShadow`}
                    style={{width:"110px", minWidth:"110px", height:"110px", borderRadius: item.businessType>0 ? '3px' : '100px', border:'3px solid #99999900', overflow:'hidden'}}>
                    <img
                        style={{objectFit: 'cover', width:'100%', height:'100%'}}
                        src={ exist(item.profileIndex)
                            ? `https://www.pix.shiningpage.com/whoraly/profile/big/${item._id}-${item.profileIndex}.jpeg`
                            : item.genderValue===0 ? female : male
                        }
                        alt={item.username}
                    />
                </Link>
            )

            const usernameX = item.bizName ? item.bizName : item.username
            const username = (
                <div style={{fontSize:'16px', fontWeight:450, marginBottom:'10px', textAlign:'center'}}>
                    {usernameX}
                </div>
            )

            const jobSummary = (
                <div style={{fontSize:'18px', fontWeight:700, textAlign:'center'}}>
                    {item.jobSummary}
                </div>
            )

            const shortText = truncateHtmlText(item.biography);
            const about = (
                <div style={{ fontSize: '13px', fontWeight: 300, marginBottom:'0px', fontStyle:'italic' }}>
                    {shortText}
                    {" "}
                    <a
                        href={`/${root}/${item.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        more
                    </a>
                </div>
            );

            const deleteBtn = (
                <div className='dropleft' style={{position:'absolute', padding:'0px', bottom:0, right:0}}>
                    <div className='center bin2' id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="" aria-expanded="false"
                        style={{width:'40px', height:'40px', alignItems:'center', borderRadius:'100px'}}>
                        <TbTrashXFilled style={{fontSize:'18px'}}/>
                    </div>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton"
                        style={{fontSize:'13px', cursor:'pointer', padding:'0px', backgroundColor:''}}>
                        <div className="underline" style={{color:'red', padding:'5px 10px'}} onClick={() => onDeleteTeam(i)}>
                            delete
                        </div>
                    </div>
                </div>
            )

            return (
                <div key={i} style={{ position:'relative', width:'300px', height:'', minWidth:'300px',
                        marginRight:w<s ? '0px' : '10px', marginBottom:'10px', padding:'20px', border:'1px solid #99999950', borderRadius:'10px',
                        backgroundColor:'#ffffff'}}
                    onClick={() => null}>
                    <div className='d-flex' style={{flexDirection:'column'}}>
                        <div className='d-flex' style={{marginBottom:'20px', alignItems:'center'}}>
                            {img}
                            <div style={{width:'100%'}}>
                                {username}
                                {jobSummary}
                            </div>
                        </div>
                        {about}
                    </div>
                    {me && deleteBtn}
                </div>
            )
        }
    )

    return dataRV
}


export { getPos, dig3, isoDateToDateTime, addNotification, logout, goToWebPage, countryName, 
    difDate, exist, xNote, scrollStatus, setId, formatFileSize, totalFileSize, attachmentLimitRemain, 
    scrollTo, scrollInModal, countAllAds, countAllVideo, countAllInsta, getFingerprint, checkArea, 
    getLocalIPs, getUserInfo, background, countTopicsAndCategories, isoDateToNormal, serviceIdName, 
    countryAdsenseRate, createConfetti, identifyObj, getBalance, checkSeen, shuffleArray, 
    checkRubyInterval, getRemainingTime, cleanEditorHtml, mapTeam, 
};