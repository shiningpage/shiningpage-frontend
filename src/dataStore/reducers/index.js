import { combineReducers } from 'redux';
import { userInfo } from './user/userInfo';
import { subUserInfo } from './user/subUserInfo';
import { page } from './other/page';
import { pageName } from './other/pageName';
import { geo } from './other/geo';
import { pageTitle } from './other/pageTitle';
import { lang } from './other/lang';
import { rtl } from './other/rtl';
import { auth } from './user/auth';
import { membership } from './user/membership';
import { sendMessage } from './other/sendMessage';
import { notSeenChatQTY } from './other/notSeenChatQTY';
import { toggleSidebar } from './other/toggleSidebar';
import { toggleChat } from './other/toggleChat';
import { setLT } from './other/setLT';
import { starredAds } from './other/starredAds';
import { starredCompany } from './other/starredCompany';
import { fullAccess } from './other/fullAccess';
import { starredVideo } from './other/starredVideo';
import { subject } from './other/subject';
import { toggleShowVideo } from './other/toggleShowVideo';
import { toggleLoading } from './other/toggleLoading';
import { country } from './other/country';
import { subChatInfo } from './other/subChatInfo';
import { page404 } from './other/page404';
import { updateVersionDate } from './other/updateVersionDate';
import { pageYOffset } from './other/pageYOffset';
import { address } from './other/address';
import { toggleChatList } from './other/toggleChatList';
import { scrollDirection } from './other/scrollDirection';
import { categoryX } from './other/categoryX';
import { toggleAds } from './other/toggleAds';
import { toggleVideo } from './other/toggleVideo';
import { toggleInsta } from './other/toggleInsta';
import { adsInfo } from './other/adsInfo';
import { videoInfo } from './other/videoInfo';
import { instaInfo } from './other/instaInfo';
import { balance } from './other/balance';
import { ruby } from './other/ruby';
import { objects } from './other/objects';
import { toggleViewStatus } from './other/toggleViewStatus';
import { seenStatus } from './other/seenStatus';
import { pageRubyTime } from './other/pageRubyTime';
import { rubyBlock } from './other/rubyBlock';
import { rubyInterval } from './other/rubyInterval';
import { userServiceSelected } from './other/userServiceSelected';

export default combineReducers({
    starredCompany, toggleLoading, starredAds, updateVersionDate, 
    userInfo, notSeenChatQTY, balance, ruby, objects, 
    pageName, subUserInfo, toggleSidebar, sendMessage, 
    adsInfo, videoInfo, instaInfo, toggleChat, fullAccess, toggleShowVideo, setLT, 
    subject, page, geo, pageTitle, lang, rtl, seenStatus, 
    page404, pageYOffset, address, toggleViewStatus, 
    auth, membership, country, toggleChatList, scrollDirection,
    subChatInfo, starredVideo, categoryX, toggleAds, toggleVideo,
    toggleInsta, pageRubyTime, rubyBlock, rubyInterval,
    userServiceSelected,
})