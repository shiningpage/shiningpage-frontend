import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { setAddress } from '../dataStore/actions';
import { serverURL } from '../srcSet';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(setAddress({ content: [], fix: 'Forgot Password' }));
    }, [dispatch]);

    const emailHandler = (e) => {
        let value = e.target.value.toLowerCase();
        setEmail(value);
        setEmailErr('');
        setError('');
        setSuccess(false);

        if (!value) {
            setEmailErr('Email is required.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) setEmailErr('Please enter a valid email address.');
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setEmailErr('Email is required.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setEmailErr('Please enter a valid email address.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess(false);

            const res = await axios.post(`${serverURL}/login/forgot-password`, { email });
            const result = res.data;

            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.msg || 'Unable to process your request.');
            }

        } catch (err) {
            console.error('Forgot password error:', err);
            const errorData = err.response?.data;
            setError(errorData?.msg || 'Unable to process your request.');

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-white">
            <Container>
                <div className="flex justify-center items-center py-5 px-4">
                    <div className="w-full max-w-[400px]">

                        <div className="text-center animated fadeInUpX mb-[35px]">
                            <h1 className="text-4xl font-extrabold tracking-tight"><span className="purple-blue">Forgot Password</span></h1>
                            <p className="mt-4 text-gray-300">Enter your email address and we'll send you a link to reset your password.</p>
                        </div>

                        {success ? (
                            <div className="text-center p-6 golden-border">
                                <h2 className="gold font-bold mb-4">Check your email</h2>

                                <p className="mb-5 text-white/90">If an account exists for <span className='italic font-[400] purple-blue'>{email}</span>, we have sent you a password reset link.</p>

                                <p className="text-gray-400 text-sm">Please check your inbox and spam folder.</p>

                                <div className="mt-6">
                                    <Link to="/login" className="link-underline text-[#0C6DFB] font-medium">Back to Login</Link>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={onSubmit} className="animated fadeInUpX">

                                <div className="mb-5">
                                    <label className="block mb-2 font-medium">Email</label>

                                    <input type="email" value={email} onChange={emailHandler} autoComplete="email" placeholder="Enter your email"
                                        className="border !border-[#E1E4EC50] rounded-[8px] text-white w-full p-3 rounded text-black outline-none
                                            [&:-webkit-autofill]:!text-white
                                            [&:-webkit-autofill]:[-webkit-text-fill-color:white]
                                            [&:-webkit-autofill]:[transition:background-color_9999s_ease-out_0s]
                                            [&:-webkit-autofill]:[box-shadow:0_0_0px_1000px_transparent_inset]

                                            [&:-webkit-autofill:hover]:[-webkit-text-fill-color:white]
                                            [&:-webkit-autofill:focus]:[-webkit-text-fill-color:white]
                                            [&:-webkit-autofill:active]:[-webkit-text-fill-color:white]
                                        "
                                    />

                                    {emailErr && <div className="text-[#ff4d6d] mt-2">{emailErr}</div>}
                                </div>

                                {error && <div className="text-[#ff4d6d] text-center mb-4">{error}</div>}

                                <button type="submit" disabled={loading} className="w-full p-3 rounded font-semibold bg-[#6D3EE3] transition-all duration-200 hover:!bg-[#7B4AE850] hover:1shadow-[0_6px_20px_rgba(109,62,227,0.25)] hover:!-translate-y-[1px] active:scale-[0.98] active:shadow-sm disabled:opacity-50 disabled:hover:bg-[#6D3EE3] disabled:hover:shadow-none disabled:hover:translate-y-0 disabled:active:scale-100">
                                    <h2 className='m-0'>{loading ? 'Sending...' : 'Send Reset Link'}</h2>
                                </button>
                                <div className="text-center mt-6">
                                    <Link to="/login" className="link-underline text-[#0C6DFB] font-medium">Back to Login</Link>
                                </div>

                            </form>
                        )}

                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ForgotPassword;