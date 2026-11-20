
import React from 'react';
import { Link } from 'react-router-dom';
import useCurrentUser from '../hooks/useCurrentUser.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRight,
    faMessage,
    faShieldHalved,
    faBolt,
    faRocket
} from '@fortawesome/free-solid-svg-icons';

const Landing = () => {
    const { currentUser, isLoggedIn, isLoading } = useCurrentUser();

    return (
        <section className="h-auto min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex items-center bg-(--color-background) transition-colors duration-300">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm-pt-8 md:pt-0 pb-4 mt-0 md:-mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">

                    {/* Left: Text Content */}
                    <div className="text-center md:text-left">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-(--color-blue)/10 text-(--color-blue) mb-6">
                            <FontAwesomeIcon icon={faMessage} />
                            Connect. Chat. Share.
                        </span>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-(--color-text)">
                            Conversations
                            <span className="block text-(--color-blue)">
                                Made Simple.
                            </span>
                        </h1>

                        <p className="mt-6 text-base sm:text-lg leading-8 text-(--color-dark-gray) max-w-xl mx-auto md:mx-0">
                            Stay connected with the people who matter.
                            Enjoy seamless messaging, create group chats,
                            and share moments — all in one place.
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-8">
                            <div className="flex items-center gap-2 text-(--color-text)">
                                <FontAwesomeIcon
                                    icon={faBolt}
                                    className="text-(--color-blue)"
                                />
                                <span className="text-sm font-medium">
                                    Fast Messaging
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-(--color-text)">
                                <FontAwesomeIcon
                                    icon={faShieldHalved}
                                    className="text-(--color-blue)"
                                />
                                <span className="text-sm font-medium">
                                    Secure Chats
                                </span>
                            </div>
                        </div>

                        {/* Authentication Actions */}
                        {isLoading ? (
                            <div className="w-20 h-10" />
                            ) : isLoggedIn ? (
                                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mt-10">
                                    <Link
                                        to="/chats"
                                        className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-(--color-blue) hover:bg-(--color-dark-blue) text-white border-2 border-(--color-blue)/30 hover:border-(--color-dark-blue) font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20"
                                    >
                                        Go to Chats
                                        <FontAwesomeIcon
                                            icon={faArrowRight}
                                            className="pt-1.25 transform-gpu transition-transform duration-500 ease-in-out group-hover:translate-x-1"
                                        />
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mt-10">
                                    <Link
                                        to="/signup"
                                        className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-(--color-blue) hover:bg-(--color-dark-blue) text-white border-2 border-(--color-blue)/30 hover:border-(--color-dark-blue) font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20"
                                    >
                                        Get Started
                                        <FontAwesomeIcon icon={faRocket} />
                                    </Link>

                                    <Link
                                        to="/login"
                                        className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border-2 border-(--color-gray)/50 text-(--color-text) hover:bg-(--color-gray) font-semibold transition-all duration-300"
                                    >
                                        Login
                                        <FontAwesomeIcon
                                            icon={faArrowRight}
                                            className="pt-1.25 transform-gpu transition-transform duration-500 ease-in-out group-hover:translate-x-1"
                                        />
                                    </Link>
                                </div>
                            )
                        }
                    </div>

                    {/* Right: Image */}
                    <div className="relative flex justify-center items-center">
                        <div className="absolute w-72 max-h-60 sm:w-96 sm:h-96 rounded-full blur-3xl" />

                        <img
                            src="/images/landing-image.png"
                            alt="People communicating through AndChat"
                            className="relative w-full max-w-lg h-auto object-contain"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Landing;
