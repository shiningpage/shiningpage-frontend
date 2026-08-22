import React, { useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { serverURL } from '../srcSet';

const ResetPasswordPage = () => {

    const [searchParams] = useSearchParams();

    const token = searchParams.get('token') || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [newPasswordErr, setNewPasswordErr] = useState('');
    const [confirmPasswordErr, setConfirmPasswordErr] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);


    const onSubmit = async (e) => {

        e.preventDefault();

        setNewPasswordErr('');
        setConfirmPasswordErr('');
        setError('');


        // =========================================
        // Token
        // =========================================

        if (!token) {

            setError(
                'This password reset link is invalid.'
            );

            return;
        }


        // =========================================
        // New password
        // =========================================

        if (!newPassword) {

            setNewPasswordErr(
                'New password is required.'
            );

            return;
        }


        if (newPassword.length < 4) {

            setNewPasswordErr(
                'Password must be at least 4 characters long.'
            );

            return;
        }


        // =========================================
        // Confirm password
        // =========================================

        if (!confirmPassword) {

            setConfirmPasswordErr(
                'Please confirm your password.'
            );

            return;
        }


        if (newPassword !== confirmPassword) {

            setConfirmPasswordErr(
                'Passwords do not match.'
            );

            return;
        }


        try {

            setLoading(true);


            const res = await axios.post(
                `${serverURL}/login/reset-password`,
                {
                    token,
                    newPassword
                }
            );


            const result = res.data;


            if (result.success) {

                setSuccess(true);

            } else {

                setError(
                    result.msg ||
                    'Unable to reset password.'
                );
            }


        } catch (err) {

            console.error(
                'Reset password error:',
                err
            );


            const errorData =
                err.response?.data;


            setError(
                errorData?.msg ||
                'Unable to reset password.'
            );


        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="text-white">

            <Container>

                <div className="flex justify-center items-center py-5 px-4">

                    <div className="w-full max-w-[400px]">


                        {/* ========================================= */}
                        {/* Header */}
                        {/* ========================================= */}

                        <div className="text-center animated fadeInUpX mb-[35px]">

                            <h1 className="text-4xl font-extrabold tracking-tight">

                                <span className="purple-blue">

                                    Reset Password

                                </span>

                            </h1>


                            {!success && (

                                <p className="mt-4 text-gray-300">

                                    Enter your new password below.

                                </p>

                            )}

                        </div>


                        {/* ========================================= */}
                        {/* Success */}
                        {/* ========================================= */}

                        {success ? (

                            <div className="text-center p-6 golden-border">

                                <h2 className="gold font-bold mb-4">

                                    Password Reset Successful

                                </h2>


                                <p className="mb-5">

                                    Your password has been
                                    successfully changed.

                                </p>


                                <p className="text-gray-400 text-sm">

                                    You can now login using your
                                    new password.

                                </p>


                                <div className="mt-6">

                                    <Link
                                        to="/login"
                                        className="link-underline text-[#0C6DFB] font-medium"
                                    >
                                        Back to Login
                                    </Link>

                                </div>

                            </div>

                        ) : (


                            /* ========================================= */
                            /* Form */
                            /* ========================================= */

                            <form
                                onSubmit={onSubmit}
                                className="animated fadeInUpX"
                            >


                                {/* ========================================= */}
                                {/* New Password */}
                                {/* ========================================= */}

                                <div className="mb-5">

                                    <label className="block mb-2 font-medium">

                                        New Password

                                    </label>


                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => {

                                            setNewPassword(
                                                e.target.value
                                            );

                                            setNewPasswordErr('');
                                            setError('');

                                        }}
                                        autoComplete="new-password"
                                        placeholder="Enter new password"
                                        className="border !border-[#E1E4EC50] rounded-[8px] text-white w-full p-3 outline-none"
                                    />


                                    {newPasswordErr && (

                                        <div className="text-[#ff4d6d] mt-2">

                                            {newPasswordErr}

                                        </div>

                                    )}

                                </div>


                                {/* ========================================= */}
                                {/* Confirm Password */}
                                {/* ========================================= */}

                                <div className="mb-5">

                                    <label className="block mb-2 font-medium">

                                        Confirm Password

                                    </label>


                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => {

                                            setConfirmPassword(
                                                e.target.value
                                            );

                                            setConfirmPasswordErr('');
                                            setError('');

                                        }}
                                        autoComplete="new-password"
                                        placeholder="Confirm new password"
                                        className="border !border-[#E1E4EC50] rounded-[8px] text-white w-full p-3 outline-none"
                                    />


                                    {confirmPasswordErr && (

                                        <div className="text-[#ff4d6d] mt-2">

                                            {confirmPasswordErr}

                                        </div>

                                    )}

                                </div>


                                {/* ========================================= */}
                                {/* Server Error */}
                                {/* ========================================= */}

                                {error && (

                                    <div className="text-[#ff4d6d] text-center mb-4">

                                        {error}

                                    </div>

                                )}


                                {/* ========================================= */}
                                {/* Submit */}
                                {/* ========================================= */}

                                <button
                                    type="submit"
                                    disabled={loading || !token}
                                    className="w-full p-3 rounded font-semibold bg-[#6D3EE3] transition-all duration-200 hover:!bg-[#7B4AE850] hover:!-translate-y-[1px] active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-[#6D3EE3] disabled:hover:translate-y-0 disabled:active:scale-100"
                                >

                                    <h2 className="m-0">

                                        {loading
                                            ? 'Resetting...'
                                            : 'Reset Password'
                                        }

                                    </h2>

                                </button>


                                {/* ========================================= */}
                                {/* Back */}
                                {/* ========================================= */}

                                <div className="text-center mt-6">

                                    <Link
                                        to="/login"
                                        className="link-underline text-[#0C6DFB] font-medium"
                                    >
                                        Back to Login
                                    </Link>

                                </div>


                            </form>

                        )}

                    </div>

                </div>

            </Container>

        </div>
    );
};

export default ResetPasswordPage;