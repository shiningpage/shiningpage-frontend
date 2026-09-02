import React, { Component } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setPageName, setPageTitle } from '../store/slices/pageSlice';
import { setAddress, setSubject } from '../store/slices/appSlice';
import siteView from '../modules/siteView';
import { AdsHorizontal } from '../components/GoogleAds';
import { FaRegStar } from "react-icons/fa";
import { MdOutlineColorLens, MdOutlineSecurity } from "react-icons/md";
import { BsBarChart } from "react-icons/bs";
import { GoShareAndroid } from "react-icons/go";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { TfiGift } from "react-icons/tfi";
import { GoRocket } from "react-icons/go";
import { LuCrown } from "react-icons/lu";
import { IoGlobeOutline } from "react-icons/io5";
import { AiOutlineQrcode } from "react-icons/ai";

import { checkSeen } from '../helper';
import { s, googleAds } from '../srcSet';

var w = window.innerWidth

class PricingPage extends Component {

    state = {
      w: window.innerWidth,
      page: 'Pricing',
      isYearly: false,
    }

    async componentDidMount() {
      window.scrollTo(0, 0)
      await this.props.dispatch(setPageTitle(`${this.state.page} | ShiningPage`))
      await this.props.dispatch(setPageName('pricing'))
      await this.props.dispatch(setSubject('pricing'))
      await this.props.dispatch(setAddress({ content:[], fix:this.state.page }))
      siteView(this.props)
    }

    onBillingType = () => {
      this.setState({ isYearly: !this.state.isYearly })
    }

    render() {
        const { w, isYearly } = this.state;
        const { isAuthenticated } = this.props;

        const header = (
          <div className="animated fadeInLeft ![animation-delay:.0s] text-4xl font-extrabold tracking-tight my-[30px]">
            <span className="purple-blue">
              Pricing
            </span>
          </div>
        )

        const allInOne = (
          <div className='animated fadeInUp ![animation-delay:.0s] mb-[30px]'>
            <div className='golden-border rounded-5 text-white/90 font-[400] px-[10px] pt-[2px]'>
              ALL-IN-ONE BUSINESS PLATFORM
            </div>
          </div>
        )

        const BusinessBrandWebsite = (
          <div className='animated fadeInUp ![animation-delay:.2s]'>
            <h1 className='gold flex gap-2 text-white/80 !font-bold text-center'>
              <span>Your Business.</span>
              <span>Your Brand.</span>
              <span>Your Website.</span>
            </h1>
          </div>
        )

        const subtitle = (
          <div className='center animated fadeInUp ![animation-delay:.3s]'>
            <p className={`${w>=s && 'w-[80%]'} text-[18px] text-white/80 font-thin text-center`}>
              Create a professional business page that brings your products, services, content, social media and customers together in one place.
            </p>
          </div>
        )

        const featuresArr = [
          [MdOutlineColorLens, '60+ Beautiful Themes'],
          [BsBarChart, 'Analytics & World Map'],
          [GoShareAndroid, 'Social Media Integration'],
          [LuBriefcaseBusiness, 'Business Tools'],
        ]

        const features = (
          <div className={`flex ${w<s ? 'gap-4 pl-[10px]' : 'gap-5'} flex-wrap my-[20px] !mb-[50px]`}>
            {featuresArr.map(([Icon, label], i) => (
              <div key={label} className={`flex items-center gap-3 animated zoomIn`} style={{animationDelay: `.${w<s ? 5 + i : 5}s`}}>
                <Icon className="goldenText2 text-[25px]" />
                <span className='text-[16px]'>{label}</span>
              </div>
            ))}
          </div>
        )

        const monthlyYearly = (
          <div className="animated fadeInDown ![animation-delay:.6s] flex items-center gap-4 text-[16px] mb-[50px]">
            <span className={isYearly ? 'text-gray-400' : 'font-semibold text-white'}>Monthly</span>

            <button type="button" aria-label="Toggle billing period"
              className={`!relative !m-0 !box-border !flex !h-6 !w-11 !min-h-6 !min-w-11 !max-h-6 !max-w-11 !cursor-pointer !appearance-none !border-0 !rounded-full !p-0 shrink-0 items-center transition-colors duration-200 ${isYearly ? '!bg-indigo-500' : '!bg-gray-300'}`}
              onClick={() => this.onBillingType(!isYearly)}
            >
              <span className={`!absolute !left-1 !top-1 !block !h-4 !w-4 !rounded-full !bg-white !p-0 !shadow-sm transition-transform duration-200 ${isYearly ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>

            <div className='flex gap-2'>
              <span className={isYearly ? 'font-semibold text-white' : 'text-gray-400'}>Yearly</span>
              <span className={`text-[12px] font-semibold rounded-5 h-[20px] px-[7px] pt-[2px] transition-colors duration-200 cursor-pointer
                ${ isYearly ? "text-[#00a52e] bg-[#E3F5EB]" : "text-[#A3A3A3] bg-[#F1F1F1]" }`}
                onClick={() => this.setState({ isYearly: true })}>
                Save up to 20%
              </span>
            </div>
          </div>
        )

        const pricingPlans = [
          { name: "Free", description: "For getting started", price: 0, icon: TfiGift, iconBg: "bg-indigo-50", iconColor: "text-indigo-500", buttonText: "Get Started Free", 
            typeClass:"text-[#000000] C11", typeText:"✦ START FOR FREE", 
            features: ["Circle profile picture", "1 About Us slideshow", "Access to all 60+ themes", "Up to 3 categories", "Up to 3 articles", "Up to 10 YouTube videos", "Up to 20 Instagram posts", "Up to 100KB attachments", "Analytics & World Map", "Project management (limited)"] },
          
          { name: "Starter", description: "For growing businesses", price: 9.99, icon: GoRocket, iconBg: "bg-purple-50", iconColor: "text-purple-500", buttonText: "Start Your Growth", 
            typeClass:"text-[#ffffff] bg-gradient-to-r from-blue-600 to-purple-600", typeText:"🚀 FOR GROWING BUSINESSES", 
            features: ["Square business profile picture", "More About Us images", "More team members", "Up to 10 categories", "Up to 10 articles", "Up to 50 YouTube videos", "Up to 100 Instagram posts", "LinkedIn posts", "Up to 25MB attachments", "Connect address to Google Maps", "Remove ShiningPage branding", "Advanced analytics & insights", "Project management with images"] },
          
          { name: "Business", description: "For serious businesses", price: 19.99, icon: LuCrown, popular: true, iconBg: "bg-amber-50", iconColor: "text-amber-500", buttonText: "Choose Business", 
            typeClass:"text-[#6E543B] C14", typeText:"★ MOST POPULAR", 
            features: ["All Starter features", "Unlimited categories", "Unlimited articles", "Unlimited YouTube videos", "Unlimited Instagram posts", "Unlimited LinkedIn posts", "Unlimited attachments", "Custom domain", "Advanced analytics & World Map", "Business tools & integrations", "Advanced project management", "Client & project sharing", "Priority support"] }
        ];

        const plans = (
          <div className={`${w<s ? 'center' : 'flex'} gap-5 flex-wrap mb-[50px]`}>
            {pricingPlans.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <div key={plan.name} style={{animationDelay: `.${7 + i}s`}}
                  className={`animated fadeInUp relative flex flex-col ${w<s ? 'w-[90%]' : ''} rounded-2xl bg-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>

                  <div className={`sticky ${w<s ? 'top-[50px]' : 'top-[60px]'} absolute -top-[1px] left-0 right-0 z-1`}>
                    <div className={`rounded-t-xl ${plan.typeClass} py-2 text-center text-xs font-bold tracking-wide`}>
                      {plan.typeText}
                    </div>
                  </div>

                  <div className='p-7'>
                    <div className='flex gap-3 items-start'>
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${plan.iconBg}`}><Icon className={`text-2xl ${plan.iconColor}`} /></div>
                      <div>
                        <h3 className="mt-2 text-2xl font-bold text-slate-900">{plan.name}</h3>
                        <p className="mt-1 text-sm text-slate-300">{plan.description}</p>

                        <div className="mt-6 flex items-baseline gap-2">
                          <span className="text-white text-4xl font-semibold text-slate-900">£{!isYearly ? plan.price.toFixed(2) : (plan.price * 12 * 0.8).toFixed(2)}</span>
                          <span className="text-sm text-slate-300">/{!isYearly ? 'month' : 'year'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="my-6 h-px bg-slate-200" />

                    <div className='mb-[100px]'>
                      <ul className="space-y-3 flex-1 !pl-[10px]">
                        {plan.features.map((feature, index) => (
                          <li key={`${plan.name}-${index}`} className="flex items-start gap-3 text-sm text-slate-100 font-thin">
                            <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-indigo-400 flex items-center justify-center">
                              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-indigo-600"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.42l2.543 2.544 6.543-6.544a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link to={!isAuthenticated ? '/login' : '/contact'} className={`!no-underline absolute bottom-0 left-0 w-full flex justify-center pb-10`}>
                      <div className={`group center btnShadow w-[80%] h-12 rounded-[8px] ${plan.typeClass} py-3 text-[15px] font-semibold text-center shadow-lg transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:shadow-[0_12px_30px_rgba(79,70,229,0.25)] hover:brightness-105 active:translate-y-0 active:scale-[0.97] active:shadow-md`}>
                        <span className="inline-flex items-center justify-center gap-2">
                          <span>{plan.buttonText}</span>
                          <span className="text-lg transition-all duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </Link>

                  </div>
                </div>
              );
            })}
          </div>
        )

        const advantagesArr = [
          [IoGlobeOutline, 'Use as Your Website', 'Connect your domain and turn ShiningPage into your website.'],
          [AiOutlineQrcode, 'QR Code', 'Get your QR code and drive traffic to your business page.'],
          [FaRegStar, 'Reviews & Engagement', 'Collect reviews and show real ratings from your customers.'],
          [MdOutlineSecurity, 'Secure & Reliable', 'Your data is safe with us. 99.9% uptime guaranteed.'],
        ]

        const advantages = (
          <div className={`flex ${w<s ? 'gap-4 pl-[10px]' : 'gap-5'} flex-wrap my-[20px] !mb-[50px]`}>
            {advantagesArr.map(([Icon, label, description], i) => (
              <div key={label} className={`flex items-start gap-3 animated zoomIn w-[210px]`} style={{animationDelay: `.${w<s ? 5 + i : 5}s`}}>
                <Icon className="goldenText2 text-[40px] min-w-[40px]" />
                <div className='flex flex-col'>
                  <span className='gold2 text-[15px] font-semibold'>{label}</span>
                  <span className='text-[13px] text-white/90 font-thin'>{description}</span>
                </div>
              </div>
            ))}
          </div>
        )

        const professionalSetup = (
          <div className={`animated fadeInUp ![animation-delay:1s] flex flex-col golden-border p-[20px] ${w<500 ? 'w-full' : ''}`}>

            <span className='gold2 text-[25px] font-semibold'>Professional Setup</span>
            <div className='flex gap-2 justify-between mb-[20px]'>
              <span className='text-[14px] text-white/90 w-[300px]'>Let our team create and configure your business page for you.</span>
              <div className='center flex-col gap-0'>
                <span className='gold text-[25px] font-bold -mb-[10px]'>£100</span>
                <span className='text-[13px] text-white/90'>One-time</span>
              </div>
            </div>

            {/* button */}
            <Link to={!isAuthenticated ? '/login' : '/contact'} className={`!no-underline flex justify-center`}>
              <div className={`group center py-3 text-[15px] font-semibold text-center shadow-lg transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:shadow-[0_12px_30px_rgba(79,70,229,0.25)] hover:brightness-105 active:translate-y-0 active:scale-[0.97] active:shadow-md`}>
                <span className="inline-flex items-center justify-center gap-2">
                  <span className='purple-blue'>Get Professional Setup</span>
                  <span className="purple-blue text-lg transition-all duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>

          </div>
        )

        return (
          <div className='text-white'>
            <Container>
              <div className='center' style={{flexDirection:'column', alignItems:'center'}}>
                {header}
                {allInOne}
                {BusinessBrandWebsite}
                {subtitle}
                {features}
                {monthlyYearly}
                {plans}
                {advantages}
                {professionalSetup}
              </div>
            </Container>
          </div>
        )

    }
}

const mapStateToProps = (state) => {
    return {
        mainUserId: state.user.userInfo['_id'],
        mainUser: state.user.userInfo,
        geo: state.app.geo,
        isAuthenticated: state.auth.isAuthenticated,
        subject: state.app.subject,
        setLT: state.app.setLT,
        seenStatus: state.app.seenStatus,
    }
  }
  export default connect (mapStateToProps)(PricingPage);
