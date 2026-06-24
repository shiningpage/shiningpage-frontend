import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import { s, } from '../srcSet';

class SocialMediaHelp extends Component{

    state = {
        w: window.innerWidth,
    }

    componentDidMount = async () => {
        window.addEventListener("resize", this.onResize)
        // console.log(11, this.props.topicKey)
        // console.log(this.props.topic)
        // console.log(this.props.icons)
    }

    onResize = () => {
        this.setState({
            w: window.innerWidth
        })
    }

	render () {
        const {w, } = this.state
        const {lang, page, topic, topicKey, icons} = this.props

        const instagramHelp = (
            <section className='publicDescription'>
                <div>
                    {icons.instagramIcon}&nbsp;
                    Instagram
                </div>
                <strong>NOTES :</strong>
                <p>- Make sure the page is public.</p>
                <br/>
                <strong>Followers :</strong>
                <p>- Link = USERNAME WITHOUT @</p>
                <p>- PLEASE do NOT put more than 1 order for the same link at the same time to avoid the overlap and we CAN'T CANCEL the order in this case.</p>
            </section>
        )
                // <p>🔴 Before ordering Followers, it is better to disable the "Flag for Review" function</p>
                // <ul>
                //   <li><strong>Instructions:</strong></li>
                //   <li>Go to "Settings and Activity"</li>
                //   <li>Select "Follow and Invite Friends"</li>
                //   <li>Disable the "Flag for Review" Function</li>
                //   <li><a href="https://prnt.sc/5Ia-_Bp6O69T" target="_blank">Screenshot for reference</a></li>
                // </ul>

        const youtubeHelp = (
            <section className='publicDescription'>
                <div>
                    {icons.youtubeIcon}&nbsp;
                    Youtube
                </div>
                <strong>NOTES :</strong>
                <p>- Link = Put the YOUTUBE CHANNEL LINK</p>
                <p>- Channel must have at least 1 video.</p>
                <p>- Public number of SUBS.</p>
                <p>- When you change the link or block or hide the subscribers of the account, the order is marked completed!</p>
                <p>- PLEASE do NOT put more than 1 order for the same link at the same time to avoid the overlap and we CAN'T CANCEL the order in this case.</p>
                <p>🔴 Important: The number of subscribers must be public and NOT hidden otherwise the start count will be zero and the order will be marked as completed and no cancellation will be available for those orders.</p>
            </section>
        )

        const websiteTrafficHelp = (
            <section className='publicDescription'>
                <div>
                    {icons.websiteTrafficIcon}&nbsp;
                    Website Traffic
                </div>
                <strong>NOTES :</strong>
                <p>- Link = full website URL, including http:// or https://</p>
                <p>❌ No Adult, Drugs or other harmful websites allowed</p>
            </section>
        )

        const snapchatHelp = (
            <section className='publicDescription'>
                <div>
                    {icons.snapchatIcon}&nbsp;
                    Snapchat
                </div>
                <div><strong>NOTES :</strong></div>
                <p>- PLEASE do NOT put more than 1 order for the same link at the same time to avoid overlap unless the first request ends, Otherwise we CAN'T CANCEL the order in this case.</p>
                <strong>Followers : -------------------------------</strong>
                <p>- Link = USERNAME WITHOUT @</p>
                <br />
                <strong>- VERY IMPORTANT :</strong>
                <p><strong>🔴 Before placing an order, please update your settings as follows:</strong></p>
                <ul>
                  <li><strong>Settings {'>'} Who Can:</strong></li>
                  <li>Contact Me: <strong>Everyone</strong></li>
                  <li>Send Notifications to Me: <strong>Everyone</strong></li>
                  <li>View My Story: <strong>Everyone</strong></li>
                  <li>See Me in Quick Add: <strong>Enable</strong></li>
                </ul>
                <p>🔴 Snapchat Might Take Up to 48 Hours to Update The Followers Count!</p>
                <p>🔴 If the quantity ordered is bigger than 100 then Snapchat will show you that you have +99 New followers and that does not mean that you only got 99 BUT it means that you got all the quantity ordered so please don't raise a ticket about this.</p>
                <br/>
                <strong>Spotlight : -------------------------------</strong>
                <p>- Link = put the link to the post on the Spotlight Platform</p>
                <p>- Example of explorer (share): &nbsp;
                    <a href="https://prnt.sc/ezyqB0EABEce" target="_blank" rel="noopener noreferrer">https://prnt.sc/ezyqB0EABEce</a>
                </p>
                <br/>
                <strong>Story Views : -------------------------------</strong>
                <p>- Link = USERNAME WITHOUT @</p>
                <p>🔴 If you have already posted stories before doing those settings so please remove the stories and edit the settings then post them again then put the order.</p>
            </section>
        )

        const telegramHelp = (
            <section className='publicDescription'>
                <div>
                    {icons.telegramIcon}&nbsp;
                    Telegram
                </div>
                <strong>NOTES :</strong>
                <strong>Members : -------------------------------</strong>
                <p>- Link = https://t.me/name</p>
            </section>
        )

        const twitchHelp = (
            <section className='publicDescription'>
                <div>
                    {icons.twitchIcon}&nbsp;
                    Twitch
                </div>
                <strong>NOTES :</strong>
                <strong>Followers : -------------------------------</strong>
                <p>- Link = Twitch username</p>
                <strong>Channel Views : -------------------------------</strong>
                <p>- Link = Channel username</p>
                <strong>Clip Views : -------------------------------</strong>
                <p>- Link = Clip link</p>
                <strong>Live Views : -------------------------------</strong>
                <p>- Link = https://www.twitch.tv/username</p>
            </section>
        )

        return (
            <div>
                {(!topicKey || topicKey==='instagram') && instagramHelp}
                {(!topicKey || topicKey==='youtube') && youtubeHelp}
                {(!topicKey || topicKey==='snapchat') && snapchatHelp}
                {(!topicKey || topicKey==='traffic') && websiteTrafficHelp}
                {(!topicKey || topicKey==='twitch') && twitchHelp}
                {(!topicKey || topicKey==='telegram') && telegramHelp}
            </div>
        );
        // {(!topicKey || topicKey==='facebook') && facebookHelp}
        // {(!topicKey || topicKey==='twitter') && twitterHelp}
        // {(!topicKey || topicKey==='tiktok') && tiktokHelp}
        // {(!topicKey || topicKey==='linkedin') && linkedinHelp}
        // {(!topicKey || topicKey==='discord') && discordHelp}
        // {(!topicKey || topicKey==='spotify') && spotifyHelp}
    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.userInfo['_id'],
        lang: state.lang,
        rtl: state.rtl,
        page: state.page,
        siteType: state.siteType,
        toggleSidebar: state.toggleSidebar
    }
}

export default connect (mapStateToProps)(SocialMediaHelp);
