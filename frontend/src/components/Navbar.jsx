import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTheme from '../hooks/useTheme.jsx';
import useCurrentUser from '../hooks/useCurrentUser.jsx';
import { useLogoutMutation } from '../features/auth/authApi.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMessage,
    faSun,
    faMoon,
    faRightToBracket,
    faUserPlus,
    faUser,
    faGear,
    faCircleQuestion,
    faRightFromBracket,
    faXmark,
    faComments,
} from '@fortawesome/free-solid-svg-icons';

function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { currentUser, isLoggedIn, isLoading } = useCurrentUser();

    const isDark = theme === 'dark';

    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const profileRef = useRef(null);
    const navigate = useNavigate();

    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Logout
    const handleLogout = async () => {
        try {
            await logout().unwrap();
            setIsProfileOpen(false);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

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
                        <div ref={profileRef} className="relative">

                            {/* Profile Button */}
                            <button
                                type="button"
                                onClick={() => setIsProfileOpen((prev) => !prev)}
                                aria-label="Open profile menu"
                                aria-expanded={isProfileOpen}
                                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-(--color-gray)/50 text-(--color-text) hover:bg-(--color-gray)/20 transition-all duration-200"
                            >
                                <FontAwesomeIcon icon={faUser} />
                            </button>

                            {/* Desktop Dropdown */}
                            <div
                                className={`hidden md:block absolute right-0 top-14 z-50 w-64 origin-top-right rounded-xl border border-(--color-gray)/30 bg-(--color-background) shadow-xl overflow-hidden transition-all duration-200 ${
                                    isProfileOpen
                                        ? 'visible opacity-100 scale-100'
                                        : 'invisible opacity-0 scale-95 pointer-events-none'
                                }`}
                            >

                                {/* User Information */}
                                <div className="p-4 border-b border-(--color-gray)/20">
                                    <p className="font-semibold text-(--color-text)">
                                        {currentUser?.username}
                                    </p>

                                    <p className="text-xs text-(--color-gray) mt-1 break-all">
                                        {currentUser?.email}
                                    </p>
                                </div>

                                {/* Menu Options */}
                                <div className="p-2">

                                    <Link
                                        to="/profile"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-(--color-text) hover:bg-(--color-gray)/15 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faUser} className="w-4" />
                                        Your Profile
                                    </Link>

                                    <Link
                                        to="/settings"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-(--color-text) hover:bg-(--color-gray)/15 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faGear} className="w-4" />
                                        Settings
                                    </Link>

                                    <Link
                                        to="/help"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-(--color-text) hover:bg-(--color-gray)/15 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faCircleQuestion} className="w-4" />
                                        Help & Support
                                    </Link>

                                </div>

                                {/* Logout */}
                                <div className="p-2 border-t border-(--color-gray)/20">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                    >
                                        <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
                                        {isLoggingOut ? 'Logging out...' : 'Sign out'}
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Backdrop */}
                            <div
                                className={`md:hidden fixed inset-0 z-60 bg-black/50 transition-opacity duration-300 ${
                                    isProfileOpen
                                        ? 'visible opacity-100'
                                        : 'invisible opacity-0 pointer-events-none'
                                }`}
                                onClick={() => setIsProfileOpen(false)}
                            />

                            {/* Mobile Side Menu */}
                            <div
                                className={`md:hidden fixed top-0 right-0 z-70 w-full h-dvh bg-(--color-background) text-(--color-text) flex flex-col transition-transform duration-300 ease-in-out ${
                                    isProfileOpen
                                        ? 'translate-x-0'
                                        : 'translate-x-full'
                                }`}
                            >

                                {/* Mobile Header */}
                                <div className="flex items-center justify-between p-5 border-b border-(--color-gray)/20">

                                    <div>
                                        <h2 className="text-lg font-bold text-(--color-text)">
                                            And<span className="text-(--color-blue)">Chat</span>
                                        </h2>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsProfileOpen(false)}
                                        aria-label="Close profile menu"
                                        className="w-9 h-9 flex items-center justify-center rounded-lg text-(--color-text) hover:bg-(--color-gray)/15 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                </div>

                                {/* Mobile User Information */}
                                <div className="p-5 border-b border-(--color-gray)/20">
                                    <div className="flex items-center gap-3">

                                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-(--color-blue) text-white text-lg">
                                            <FontAwesomeIcon icon={faUser} />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-semibold text-(--color-text) truncate">
                                                {currentUser?.username}
                                            </p>

                                            <p className="text-xs text-(--color-gray) truncate">
                                                {currentUser?.email}
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                {/* Mobile Menu Options */}
                                <div className="p-3 space-y-1">

                                    <Link
                                        to="/profile"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-(--color-text) hover:bg-(--color-gray)/15 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faUser} className="w-5" />
                                        <span className="font-medium text-sm">Your Profile</span>
                                    </Link>

                                    <Link
                                        to="/settings"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-(--color-text) hover:bg-(--color-gray)/15 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faGear} className="w-5" />
                                        <span className="font-medium text-sm">Settings</span>
                                    </Link>

                                    <Link
                                        to="/help"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-(--color-text) hover:bg-(--color-gray)/15 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faCircleQuestion} className="w-5" />
                                        <span className="font-medium text-sm">Help & Support</span>
                                    </Link>

                                </div>

                                {/* Mobile Logout */}
                                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-(--color-gray)/20">

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 font-semibold text-sm hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                    >
                                        <FontAwesomeIcon icon={faRightFromBracket} />
                                        {isLoggingOut ? 'Logging out...' : 'Sign out'}
                                    </button>

                                </div>

                            </div>

                        </div>
                        // <div className="flex items-center gap-2 sm:gap-4">
                        //     {/* Profile Button */}
                        //     <Link
                        //         to="/profile"
                        //         title="Profile"
                        //         aria-label="Profile"
                        //         className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-(--color-gray)/50 text-(--color-text) hover:bg-(--color-gray)/20 transition-all duration-200"
                        //     >
                        //         <FontAwesomeIcon icon={faUser} />
                        //     </Link>
                        // </div>
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
