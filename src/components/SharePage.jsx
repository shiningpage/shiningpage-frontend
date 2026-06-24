import React, { Component } from "react";
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import shiningpageAds from '../assets/images/other/logo.png'
import { FaGlobe } from 'react-icons/fa';

import {
  EmailShareButton, FacebookShareButton, InstapaperShareButton, LineShareButton,
  LinkedinShareButton, LivejournalShareButton, MailruShareButton, OKShareButton,
  PinterestShareButton, PocketShareButton, RedditShareButton, TelegramShareButton,
  TumblrShareButton, TwitterShareButton, ViberShareButton, VKShareButton,
  WhatsappShareButton, WorkplaceShareButton, WeiboShareButton,
} from "react-share";
import {
  EmailIcon, FacebookIcon, InstapaperIcon, LineIcon, LinkedinIcon, LivejournalIcon, MailruIcon, OKIcon, PinterestIcon, PocketIcon,
  RedditIcon, TelegramIcon, TumblrIcon, TwitterIcon, ViberIcon, VKIcon, WeiboIcon, WhatsappIcon, WorkplaceIcon,
} from "react-share";

import { s } from '../srcSet';

class SharePage extends Component {

  state = {
    w: window.innerWidth
  }

  componentDidMount () {
    window.addEventListener("resize", this.onResize)
  }

  onResize = () => {
    this.setState({
      w: window.innerWidth
    })
  }

  copyToClipBoard = () => {
    var text = document.getElementById("myText").innerHTML;
    navigator.clipboard.writeText(text);
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "The link is copied.";
    this.setState({copy: true})
  }

  outFunc = () => {
    var tooltip = document.getElementById("myTooltip");
    //tooltip.innerHTML = "Copy to clipboard";
  }

  render() {
    const {w, copy} = this.state
    const {rtl, lang, setLT, url, mainTitle, subTitle} = this.props
    const titleStyle = {fontSize:'30px', fontWeight:450, margin:'70px 0px 40px', textAlign: 'center', alignItems:'center', whiteSpace:'', color:'', width:'100%'}

    const shareUrl = url;
    const title = `${mainTitle}
${subTitle}
`

    const facebook = (
      <div style={{margin: '5px'}}>
        <FacebookShareButton
          url={shareUrl}
          quote={title}
          className="Demo__some-network__share-button">
          <FacebookIcon
            size={32}
            round />
        </FacebookShareButton>
      </div>
    )
    const twitter = (
      <div style={{margin: '5px'}}>
        <TwitterShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button">
          <TwitterIcon
            size={32}
            round />
        </TwitterShareButton>
    </div>
    )
    const telegram = (
      <div style={{margin: '5px'}}>
        <TelegramShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button">
          <TelegramIcon size={32} round />
        </TelegramShareButton>
      </div>
    )
    
    const whatsapp = (
      <div style={{margin: '5px'}}>
        <WhatsappShareButton
          url={shareUrl}
          title={title}
          separator=":: "
          className="Demo__some-network__share-button">
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
    )
    const linkedin = (
      <div style={{margin: '5px'}}>
        <LinkedinShareButton
          url={shareUrl}
          windowWidth={750}
          windowHeight={600}
          className="Demo__some-network__share-button">
          <LinkedinIcon
            size={32}
            round />
        </LinkedinShareButton>
      </div>
    )
    const pinterest = (
      <div style={{margin: '5px'}}>
        <PinterestShareButton
          url={String(window.location)}
          media={`${String(window.location)}/${shiningpageAds}`}
          windowWidth={1000}
          windowHeight={730}
          className="Demo__some-network__share-button">
          <PinterestIcon size={32} round />
        </PinterestShareButton>
      </div>
    )
    const vk = (
      <div style={{margin: '5px'}}>
        <VKShareButton
          url={shareUrl}
          image={`${String(window.location)}/${shiningpageAds}`}
          windowWidth={660}
          windowHeight={460}
          className="Demo__some-network__share-button">
          <VKIcon
            size={32}
            round />
        </VKShareButton>
      </div>
    )
    const okIcon = (
      <div style={{margin: '5px'}}>
        <OKShareButton
          url={shareUrl}
          image={`${String(window.location)}/${shiningpageAds}`}
          className="Demo__some-network__share-button">
          <OKIcon
            size={32}
            round />
        </OKShareButton>
      </div>
    )
    const reddit = (
      <div style={{margin: '5px'}}>
        <RedditShareButton
          url={shareUrl}
          title={title}
          windowWidth={660}
          windowHeight={460}
          className="Demo__some-network__share-button">
          <RedditIcon
            size={32}
            round />
        </RedditShareButton>
      </div>
    )
    const tumblr = (
      <div style={{margin: '5px'}}>
        <TumblrShareButton
          url={shareUrl}
          title={title}
          windowWidth={660}
          windowHeight={460}
          className="Demo__some-network__share-button">
          <TumblrIcon
            size={32}
            round />
        </TumblrShareButton>
      </div>
    )
    const livejournal = (
      <div style={{margin: '5px'}}>
        <LivejournalShareButton
          url={shareUrl}
          title={title}
          description={shareUrl}
          className="Demo__some-network__share-button"
        >
          <LivejournalIcon size={32} round />
        </LivejournalShareButton>
      </div>
    )
    const mailru = (
      <div style={{margin: '5px'}}>
        <MailruShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button">
          <MailruIcon
            size={32}
            round />
        </MailruShareButton>
      </div>
    )
    const email = (
      <div style={{margin: '5px'}}>
        <EmailShareButton
          url={shareUrl}
          subject={title}
          body="body"
          className="Demo__some-network__share-button">
          <EmailIcon
            size={32}
            round />
        </EmailShareButton>
      </div>
    )
    const viber = (
      <div style={{margin: '5px'}}>
        <ViberShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button">
          <ViberIcon
            size={32}
            round />
        </ViberShareButton>
      </div>
    )
    const workplace = (
      <div style={{margin: '5px'}}>
        <WorkplaceShareButton
          url={shareUrl}
          quote={title}
          className="Demo__some-network__share-button">
          <WorkplaceIcon
            size={32}
            round />
        </WorkplaceShareButton>
      </div>
    )
    const line = (
      <div style={{margin: '5px'}}>
        <LineShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button">
          <LineIcon
            size={32}
            round />
        </LineShareButton>
      </div>
    )
    const weibo = (
      <div style={{margin: '5px'}}>
        <WeiboShareButton
          url={shareUrl}
          title={title}
          image={`${String(window.location)}/${shiningpageAds}`}
          className="Demo__some-network__share-button">
          <img width='32px'  className="Demo__some-network__custom-icon" src="https://icons.iconarchive.com/icons/martz90/circle-addon2/512/weibo-icon.png" alt="Weibo share button" />
        </WeiboShareButton>
      </div>
    )
    const pocket = (
      <div style={{margin: '5px'}}>
        <PocketShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button">
          <PocketIcon
            size={32}
            round />
        </PocketShareButton>
      </div>
    )
    const instapaper = (
      <div style={{margin: '5px'}}>
        <InstapaperShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button">
          <InstapaperIcon
            size={32}
            round />
        </InstapaperShareButton>
      </div>
    )


    const share = (
      <div className='center' style={{flexWrap:'wrap'}}>
        {facebook}
        {twitter}
        {telegram}
        {whatsapp}
        {/* instagram */}
        {linkedin}
        {pinterest}
        {vk}
        {okIcon}
        {reddit}
        {tumblr}
        {livejournal}
        {mailru}
        {/* email */}
        {viber}
        {workplace}
        {line}
        {/* weibo */}
        {pocket}
        {instapaper}
      </div>
    )

    const bizLinkConst = (
      <div className='d-flex' style={{direction:'ltr'}}>
        <div className='d-flex' style={{maxWidth:w<s ? '250px' : '', direction:'ltr', margin:'20px 0px 10px', textAlign:'center'}}>
            <FaGlobe className='' style={{fontSize:'25px', margin:'0px', color:'brown'}}/>&nbsp;&nbsp;
            <div id="myText" style={{width:'240px', marginTop:'2px', textAlign:'left', border:'1px solid #99999999', borderRadius:'3px', padding:'0px 5px', overflow:'scroll'}}>{url}</div>
        </div>
      </div>
    )

    return (
        <div>
          <div className='' style={{margin: '0px', textAlign: rtl ? 'right' : 'left'}}>
            <div className='center' style={titleStyle}>Sharing</div>
            {share}
            {bizLinkConst}
            <div className='d-flex' style={{justifyContent:rtl ? 'flex-end' : ''}}>
              <Button variant= {copy ? 'success' : "primary"} onClick={!copy ? this.copyToClipBoard : ''} onMouseOut={this.outFunc()}
                  style={{width:'', height:'30px', lineHeight:'10px', margin:'0px 0px 10px', direction:'ltr'}}>
                  <span className="tooltiptext" id="myTooltip">Copy Link</span>
              </Button>
            </div>
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      mainUserId: state.userInfo['_id'],
      rtl: state.rtl,
      lang: state.lang,
      auth: state.auth, 
      page: state.page,
      setLT: state.setLT,
  }
}

export default connect (mapStateToProps)(SharePage);
