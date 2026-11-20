import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faMessage,
    faSun,
    faMoon,
    faRightToBracket,
    faUserPlus,
    faUser,
    faComments,
} from '@fortawesome/free-solid-svg-icons';

import useTheme from '../hooks/useTheme.jsx';
import useCurrentUser from '../hooks/useCurrentUser.jsx';

function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { currentUser, isLoggedIn, isLoading } = useCurrentUser();

    const isDark = theme === 'dark';

    return (
        <nav className="sticky top-0 z-50 w-full border-b-2 border-(--color-gray)/30 bg-(--color-background) text-(--color-text) transition-colors duration-300">

            <div className="max-w-7xl h-16 md:h-20 mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between">

                {/* Company Logo & Name */}
                <Link
                    to="/"
                    className="flex items-center gap-1.5 sm:gap-3 no-underline text-(--color-text)"
                >
                    <div className="w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-(--color-blue) text-white text-xl shadow-sm">
                        <FontAwesomeIcon
                            icon={faMessage}
                            className="text-sm sm:text-xl"
                        />
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
                                    isDark
                                        ? 'text-(--color-blue)'
                                        : 'text-amber-500'
                                }`}
                            />
                        </span>
                    </button>

                    {/* Authentication Actions */}
                    {isLoading ? (
                        <div className="w-20 h-10" />
                    ) : isLoggedIn ? (
                        <div className="flex items-center gap-2 sm:gap-4">

                            {/* Profile Button */}
                            <Link
                                to="/profile"
                                title="Profile"
                                aria-label="Profile"
                                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-(--color-gray)/50 text-(--color-text) hover:bg-(--color-gray)/20 transition-all duration-200"
                            >
                                <FontAwesomeIcon icon={faUser} />
                            </Link>

                        </div>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-4">

                            {/* Login */}
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-lg border-2 border-(--color-gray)/50 text-(--color-text) text-sm font-semibold hover:bg-(--color-gray) transition-all duration-200"
                            >
                                <FontAwesomeIcon icon={faRightToBracket} />
                                <span className="hidden sm:inline">Login</span>
                            </Link>

                            {/* Sign Up */}
                            <Link
                                to="/signup"
                                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-(--color-blue) text-white text-sm border-2 border-(--color-blue)/30 font-semibold hover:bg-(--color-dark-blue) hover:border-(--color-dark-blue) shadow-sm transition-all duration-200"
                            >
                                <FontAwesomeIcon icon={faUserPlus} />
                                Sign Up
                            </Link>

                        </div>
                    )}

                </div>
            </div>
        </nav>
    );
}

export default Navbar;
