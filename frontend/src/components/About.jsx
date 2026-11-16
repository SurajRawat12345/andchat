
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMessage,
    faUsers,
    faShieldHalved,
    faBolt,
    faArrowRight,
    faHeart
} from '@fortawesome/free-solid-svg-icons';

const About = () => {
    return (
        <section className="py-20 sm:py-28 bg-(--color-background) transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

                    {/* Left: Illustration */}
                    <div className="relative flex justify-center items-center order-2 lg:order-1">

                        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-(--color-blue)/10 blur-3xl" />

                        <div className="relative w-full max-w-lg">
                            <img
                                src="https://illustrations.popsy.co/blue/team-work.svg"
                                alt="People connecting and collaborating"
                                className="w-full h-auto object-contain"
                            />

                            {/* Floating Feature Card */}
                            <div className="absolute bottom-5 -left-2 sm:left-0 bg-(--color-background) border border-(--color-gray)/20 shadow-xl rounded-2xl p-4 flex items-center gap-3">

                                <div className="w-11 h-11 rounded-xl bg-(--color-blue)/10 flex items-center justify-center text-(--color-blue)">
                                    <FontAwesomeIcon icon={faHeart} className="text-lg" />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-(--color-text)">
                                        Made for Connections
                                    </p>
                                    <p className="text-xs text-(--color-gray) mt-1">
                                        Every conversation matters
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="order-1 lg:order-2">

                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--color-blue)/10 text-(--color-blue) text-sm font-semibold mb-6">
                            <FontAwesomeIcon icon={faMessage} />
                            About AndChat
                        </span>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-(--color-text)">
                            Bringing People
                            <span className="block text-(--color-blue)">
                                Closer Together.
                            </span>
                        </h2>

                        <p className="mt-6 text-base leading-8 text-(--color-gray)">
                            We believe great conversations build meaningful
                            connections. AndChat is designed to make staying
                            connected simple, seamless, and enjoyable.
                        </p>

                        <p className="mt-4 text-base leading-8 text-(--color-gray)">
                            Whether you're catching up with a friend or
                            connecting with a group, AndChat brings your
                            conversations together in one convenient place.
                        </p>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-9">

                            {/* Feature 1 */}
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 shrink-0 rounded-xl bg-(--color-blue)/10 flex items-center justify-center text-(--color-blue)">
                                    <FontAwesomeIcon icon={faBolt} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-(--color-text)">
                                        Simple & Fast
                                    </h3>
                                    <p className="text-sm text-(--color-gray) mt-1 leading-6">
                                        Enjoy smooth and effortless conversations.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 shrink-0 rounded-xl bg-(--color-blue)/10 flex items-center justify-center text-(--color-blue)">
                                    <FontAwesomeIcon icon={faUsers} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-(--color-text)">
                                        Stay Connected
                                    </h3>
                                    <p className="text-sm text-(--color-gray) mt-1 leading-6">
                                        Connect through personal and group chats.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex items-start gap-4 sm:col-span-2">
                                <div className="w-11 h-11 shrink-0 rounded-xl bg-(--color-blue)/10 flex items-center justify-center text-(--color-blue)">
                                    <FontAwesomeIcon icon={faShieldHalved} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-(--color-text)">
                                        Privacy Matters
                                    </h3>
                                    <p className="text-sm text-(--color-gray) mt-1 leading-6">
                                        We believe your conversations deserve care and respect.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* CTA */}
                        <div className="mt-10">
                            <Link
                                to="/signup"
                                className="group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-(--color-blue) hover:bg-(--color-dark-blue) text-white font-semibold transition-colors duration-300"
                            >
                                Join Our Community

                                <FontAwesomeIcon
                                    icon={faArrowRight}
                                    className="transition-transform duration-500 ease-in-out group-hover:translate-x-1"
                                />
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
