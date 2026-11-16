
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMessage,
    faArrowRight,
    faHeart,
    faShieldHalved,
    faBolt,
    faEnvelope
} from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-(--color-footer-background) border-t border-(--color-gray)/20">

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand Section */}
                    <div className="lg:col-span-2">

                        <Link to="/" className="inline-flex items-center gap-3">
                            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-(--color-blue) text-white text-xl">
                                <FontAwesomeIcon icon={faMessage} />
                            </div>

                            <span className="text-2xl font-bold text-white">
                                And<span className="text-(--color-blue)">Chat</span>
                            </span>
                        </Link>

                        <p className="mt-5 max-w-sm text-sm leading-7 text-(--color-footer-text)">
                            Bringing people closer, one conversation at a time.
                            Connect with friends, share moments, and stay in touch
                            wherever life takes you.
                        </p>

                        <div className="flex flex-wrap gap-5 mt-6">
                            <div className="flex items-center gap-2 text-sm text-(--color-footer-text)">
                                <FontAwesomeIcon
                                    icon={faBolt}
                                    className="text-(--color-blue)"
                                />
                                Fast Messaging
                            </div>

                            <div className="flex items-center gap-2 text-sm text-(--color-footer-text)">
                                <FontAwesomeIcon
                                    icon={faShieldHalved}
                                    className="text-(--color-blue)"
                                />
                                Secure Chats
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-base font-bold text-white mb-6">
                            Quick Links
                        </h3>

                        <ul className="space-y-4">
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-(--color-footer-text) underline hover:text-(--color-blue) transition-colors duration-300"
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/login"
                                    className="text-sm text-(--color-footer-text) underline hover:text-(--color-blue) transition-colors duration-300"
                                >
                                    Login
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/signup"
                                    className="text-sm text-(--color-footer-text) underline hover:text-(--color-blue) transition-colors duration-300"
                                >
                                    Create Account
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Get Started */}
                    <div>
                        <h3 className="text-base font-bold text-white mb-6">
                            Get Started
                        </h3>

                        <p className="text-sm leading-6 text-(--color-footer-text) mb-5">
                            Ready to start a conversation? Join AndChat today.
                        </p>

                        <Link
                            to="/signup"
                            className="group inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-(--color-blue) hover:bg-(--color-dark-blue) text-white text-sm font-semibold transition-colors duration-300"
                        >
                            Join AndChat
                            <FontAwesomeIcon
                                icon={faArrowRight}
                                className="transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                            />
                        </Link>
                    </div>

                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-(--color-gray)/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                        <p className="text-sm text-(--color-footer-text) text-center">
                            © {new Date().getFullYear()} AndChat. All rights reserved.
                        </p>

                        <p className="flex items-center gap-2 text-sm text-(--color-footer-text)">
                            Made with
                            <FontAwesomeIcon
                                icon={faHeart}
                                className="text-red-500"
                            />
                            for better conversations
                        </p>

                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;
