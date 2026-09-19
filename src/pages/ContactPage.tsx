import { Component, type ChangeEvent } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setPageName, setPageTitle } from '../store/slices/pageSlice';
import { setSubject, setAddress } from '../store/slices/appSlice';
import siteView from '../modules/siteView';
import { addNotification } from '../helper';
import { AdsHorizontal } from '../components/GoogleAds';
import { serverURL, s } from '../srcSet';
import type { RootState, AppDispatch } from '../store/store';

type ContactState = {
    w: number;
    h: number;
    page: string;
    name: string;
    contactInfo: string;
    message: string;
    messageSuccess: string;
    nameErr: boolean;
    contactInfoErr: boolean;
    messageErr: boolean;
    sendingMessage: boolean;
};

type ContactUser = {
    genderValue: number;
    username: string;
};

type ContactGeo = {
    continent: string;
    countryCode: string;
    country: string;
    city: string;
};

type ContactProps = {
    dispatch: AppDispatch;
    setLT: Record<string, string>;
    rtl: boolean;
    lang: string;
    fullAccess: boolean;
    mainUser: ContactUser;
    userId: string;
    geo: ContactGeo;
};

type ContactErrors = {
    nameErr: boolean;
    contactInfoErr: boolean;
    messageErr: boolean;
};

class ContactPage extends Component<
    ContactProps,
    ContactState
> {
    state: ContactState = {
        w: window.innerWidth,
        h: window.innerHeight,
        page: this.props.setLT.contact,
        name: '',
        contactInfo: '',
        message: '',
        messageSuccess: '',
        nameErr: false,
        contactInfoErr: false,
        messageErr: false,
        sendingMessage: false,
    };

    componentDidMount = async () => {
        window.scrollTo(0, 0);

        window.addEventListener(
            'resize',
            this.onResize
        );

        await this.props.dispatch(
            setPageTitle(
                `${this.state.page} | ShiningPage`
            )
        );

        await this.props.dispatch(
            setPageName('contact')
        );

        await this.props.dispatch(
            setSubject('contact')
        );

        await this.props.dispatch(
            setAddress({
                content: [],
                fix: this.state.page,
            })
        );

        siteView({ ...this.props, subject: 'contact' });
    };

    componentWillUnmount = () => {
        window.removeEventListener(
            'resize',
            this.onResize
        );
    };

    checkNull = (): ContactErrors => {
        const {
            name,
            contactInfo,
            message,
        } = this.state;

        const infoErr: ContactErrors = {
            nameErr: false,
            contactInfoErr: false,
            messageErr: false,
        };

        if (name.trim() === '') {
            infoErr.nameErr = true;
        }

        if (contactInfo.trim() === '') {
            infoErr.contactInfoErr = true;
        }

        if (message.trim() === '') {
            infoErr.messageErr = true;
        }

        return infoErr;
    };

    onSendMessage = async () => {
        const { name, contactInfo, message } = this.state;
        const { setLT, fullAccess, mainUser, userId, geo } = this.props;
        const infoErr = this.checkNull();

        if (
            infoErr.nameErr ||
            infoErr.contactInfoErr ||
            infoErr.messageErr
        ) {
            this.setState({
                nameErr: infoErr.nameErr,
                contactInfoErr: infoErr.contactInfoErr,
                messageErr: infoErr.messageErr,
            });

            return;
        }

        this.setState({
            sendingMessage: true,
        });

        const info = {
            message:
                `Site: *** ShiningPage ***\n\n` +
                `From: ${name}\n\n` +
                `Contact Information:\n${contactInfo}\n\n` +
                `Message:\n${message}`,
            senderId: 'unknown',
            receiverId: '607e9088bede482040af3574',
            image: null,
            from: null,
        };

        await axios.post(`${serverURL}/chat/send/`, info);

        addNotification(
            'chat',
            'message',
            fullAccess,
            mainUser,
            userId,
            geo
        );

        this.setState({
            sendingMessage: false,
            nameErr: false,
            contactInfoErr: false,
            messageErr: false,
            messageSuccess:
                setLT.sendMessageSuccess,
        });
    };

    changeHandler = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const name = e.target.name;
        const value = e.target.value;

        if (name === 'message') {
            e.target.style.height = 'auto';
            e.target.style.height =
                `${e.target.scrollHeight}px`;
        }

        if (name === 'name') {
            this.setState({
                name: value,
                nameErr: false,
            });
        }

        if (name === 'contactInfo') {
            this.setState({
                contactInfo: value,
                contactInfoErr: false,
            });
        }

        if (name === 'message') {
            this.setState({
                message: value,
                messageErr: false,
            });
        }
    };

    onResize = () => {
        this.setState({
            w: window.innerWidth,
            h: window.innerHeight,
        });
    };

    render() {
        const {
            w,
            messageSuccess,
            nameErr,
            contactInfoErr,
            messageErr,
            sendingMessage,
            name,
            contactInfo,
            message,
        } = this.state;

        const {
            rtl,
            setLT,
        } = this.props;

        const loader13 = (
            <div
                className="loader-13"
                style={{
                    margin: '0px',
                    color: '#ffffff',
                    transform: rtl
                        ? 'rotate(180deg)'
                        : '',
                }}
            ></div>
        );

        const header = (
            <div className="animated fadeInLeft [animation-delay:.5s] text-4xl font-extrabold tracking-tight my-[30px]">
                <span className="purple-blue">
                    Contact Us
                </span>
            </div>
        );

        const nameConst = (
            <div className="mb-4">
                <label className="mb-2">
                    Name
                </label>

                <input
                    className={`w-full h-12 border rounded-[8px] px-4 outline-none focus:ring-1 focus:ring-[#6D3EE3] ${
                        nameErr ? '!border-red-500' : '!border-[#E1E4EC50]'}
						[&:-webkit-autofill]:!text-white
						[&:-webkit-autofill]:[-webkit-text-fill-color:white]
						[&:-webkit-autofill]:[transition:background-color_9999s_ease-out_0s]
						[&:-webkit-autofill]:[box-shadow:0_0_0px_1000px_transparent_inset]

						[&:-webkit-autofill:hover]:[-webkit-text-fill-color:white]
						[&:-webkit-autofill:focus]:[-webkit-text-fill-color:white]
						[&:-webkit-autofill:active]:[-webkit-text-fill-color:white]
					`}
                    value={name}
                    name="name"
                    onChange={this.changeHandler}
                />
            </div>
        );

        const contactConst = (
            <div className="mb-4">
                <label className="mb-2">
                    Contact{' '}
                    <span className="text-[10px]">
                        (Email, WhatsApp, ...)
                    </span>
                </label>

                <input
                    className={`w-full h-12 border rounded-[8px] px-4 outline-none focus:ring-1 focus:ring-[#6D3EE3] ${
                        contactInfoErr ? '!border-red-500' : '!border-[#E1E4EC50]'}
						
                            [&:-webkit-autofill]:!text-white
                            [&:-webkit-autofill]:[-webkit-text-fill-color:white]
                            [&:-webkit-autofill]:[transition:background-color_9999s_ease-out_0s]
                            [&:-webkit-autofill]:[box-shadow:0_0_0px_1000px_transparent_inset]

                            [&:-webkit-autofill:hover]:[-webkit-text-fill-color:white]
                            [&:-webkit-autofill:focus]:[-webkit-text-fill-color:white]
                            [&:-webkit-autofill:active]:[-webkit-text-fill-color:white]
						`}
                    value={contactInfo}
                    name="contactInfo"
                    onChange={this.changeHandler}
                />
            </div>
        );

        const messageConst = (
            <div className="mb-4">
                <label className="mb-2">
                    Message
                </label>

                <textarea
                    className={`w-full border rounded-[8px] px-4 py-2.5 !resize-none outline-none focus:ring-1 focus:ring-[#6D3EE3] ${
                        messageErr
                            ? '!border-red-500'
                            : '!border-[#E1E4EC50]'
                    }`}
                    value={message}
                    name="message"
                    onChange={this.changeHandler}
                    placeholder={
                        setLT.chatPlaceHolder
                    }
                    rows={5}
                />
            </div>
        );

        const sendBtn = (
            <div
                className="center btnShadow w-full h-12 my-10 rounded-[8px] bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl active:scale-98 focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={this.onSendMessage}
            >
                <span style={{ fontSize: '16px' }}>
                    {sendingMessage
                        ? loader13
                        : 'Submit'}
                </span>
            </div>
        );

        const alertSuccess = (
            <div
                className={`alert alert-success animated fadeInDown w-full my-10 text-[15px] ${
                    messageSuccess
                        ? ''
                        : 'hidden'
                }`}
                role="alert"
            >
                {messageSuccess}
            </div>
        );

        return (
            <div>
                <Container>
                    <div className="center flex-col">
                        {header}

                        <div
                            className={`animated fadeInUpX [animation-elay:.5s] ${
                                w < s
                                    ? 'w-full'
                                    : 'w-[800px]'
                            } mb-[30px] p-[20px] text-white rounded-[20px] backdrop-blur-[20px] bg-[#ffffff10] border !border-white/20`}
                        >
                            <div>
                                {nameConst}
                                {contactConst}
                                {messageConst}

                                {messageSuccess
                                    ? alertSuccess
                                    : sendBtn}
                            </div>

                            <div
                                dangerouslySetInnerHTML={{
                                    __html:
                                        setLT.referToEmail,
                                }}
                            ></div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): Omit<ContactProps, 'dispatch'> => {
    return {
        setLT: state.app.setLT,
        rtl: state.app.rtl,
        lang: state.app.lang,
        fullAccess: state.auth.fullAccess,
        mainUser: {
            genderValue:
                state.user.userInfo.genderValue,
            username:
                state.user.userInfo.username,
        },
        userId: state.user.userInfo._id,
        geo: {
            continent: '',
            countryCode:
                state.app.geo.countryCode,
            country: state.app.geo.country,
            city: state.app.geo.city,
        },
    };
};

export default connect(mapStateToProps)(
    ContactPage
);