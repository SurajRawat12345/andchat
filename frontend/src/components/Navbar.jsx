
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSun,
    faMoon,
    faRightToBracket,
    faUserPlus,
    faMessage
} from '@fortawesome/free-solid-svg-icons';

import useTheme from '../hooks/useTheme';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === 'dark';

    return (
        <nav className="sticky top-0 z-50 w-full border-b-2 border-(--color-gray)/30 bg-(--color-background) text-(--color-text) transition-colors duration-300">

            <div className="max-w-7xl h-20 mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

                {/* Company Logo & Name */}
                <Link
                    to="/"
                    className="flex items-center gap-3 no-underline text-(--color-text)"
                >
                    <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-(--color-blue) text-white text-xl shadow-sm">
                        <FontAwesomeIcon icon={faMessage} />
                    </div>

                    <span className="text-xl sm:text-2xl font-bold tracking-tight">
                        And<span className="text-(--color-blue)">Chat</span>
                    </span>
                </Link>

                {/* Navbar Actions */}
                <div className="flex items-center gap-2 sm:gap-4">

                    {/* Theme Switcher */}
                    <button
                        type="button"
                        role="switch"
                        aria-checked={isDark}
                        aria-label="Toggle dark mode"
                        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                        onClick={toggleTheme}
                        className="relative w-16 h-8 flex items-center rounded-full bg-(--color-gray)/30 border border-(--color-gray)/40 p-0.75 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-(--color-blue)"
                    >
                        {/* Sun Icon */}
                        <span className="absolute left-2 flex items-center justify-center text-amber-500">
                            <FontAwesomeIcon icon={faSun} size="sm" />
                        </span>

                        {/* Moon Icon */}
                        <span className="absolute right-2 flex items-center justify-center text-(--color-blue)">
                            <FontAwesomeIcon icon={faMoon} size="sm" />
                        </span>

                        {/* Sliding Toggle */}
                        <span
                            className={`relative z-10 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ease-in-out ${
                                isDark ? 'translate-x-8' : 'translate-x-0'
                            }`}
                        >
                            <FontAwesomeIcon
                                icon={isDark ? faMoon : faSun}
                                className={`text-xs ${
                                    isDark ? 'text-(--color-blue)' : 'text-amber-500'
                                }`}
                            />
                        </span>
                    </button>

                    {/* Login */}
                    <Link
                        to="/login"
                        className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-(--color-gray)/50 text-(--color-text) text-sm font-semibold hover:bg-(--color-gray) transition-all duration-200"
                    >
                        <FontAwesomeIcon icon={faRightToBracket} />
                        Login
                    </Link>

                    {/* Sign Up */}
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-(--color-blue) text-white text-sm border-2 border-(--color-blue)/30 font-semibold hover:bg-(--color-dark-blue) hover:border-(--color-dark-blue) shadow-sm transition-all duration-200"
                    >
                        <FontAwesomeIcon icon={faUserPlus} />
                        Sign Up
                    </Link>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
