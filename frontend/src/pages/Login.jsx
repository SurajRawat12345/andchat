
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
    useLoginMutation,
} from '../features/auth/authApi.js';

import useCurrentUser from '../hooks/useCurrentUser.jsx';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {
        currentUser,
        isLoading: isCheckingAuth,
    } = useCurrentUser();

    const [
        login,
        {
            isLoading: isLoggingIn,
            error: loginError,
        },
    ] = useLoginMutation();

    // Common login function
    const handleLogin = async (loginEmail, loginPassword) => {
        try {
            await login({
                email: loginEmail,
                password: loginPassword,
            }).unwrap();

            setEmail('');
            setPassword('');

            console.log('Login successful');
            navigate('/chats');

        } catch (error) {
            console.log('Login failed:', error);
        }
    };

    // Normal Login
    const handleSubmit = async (e) => {
        e.preventDefault();

        await handleLogin(email, password);
    };

    // HR Demo Login
    const handleHrDemo = async () => {
        const demoEmail = 'testuser@gmail.com';
        const demoPassword = '12345678';

        setEmail(demoEmail);
        setPassword(demoPassword);

        await handleLogin(demoEmail, demoPassword);
    };

    // Checking Authentication
    if (isCheckingAuth) {
        return (
            <div className="min-h-[calc(100svh-80px)] flex items-center justify-center bg-(--color-background)">
                <p className="text-(--color-gray) font-medium">
                    Checking authentication...
                </p>
            </div>
        );
    }

    // Already Logged In
    if (currentUser) {
        return (
            <div className="min-h-[calc(100svh-80px)] flex flex-col items-center justify-center bg-(--color-background) px-4">

                <h1 className="text-2xl sm:text-3xl font-bold text-(--color-text)">
                    Welcome, {currentUser.username}!
                </h1>

                <button
                    onClick={() => navigate('/chats')}
                    className="mt-6 px-6 py-3 rounded-xl bg-(--color-blue) hover:bg-(--color-dark-blue) text-white font-semibold transition-colors duration-300"
                >
                    Go to Chats
                </button>

            </div>
        );
    }

    return (
        <section
            className="h-screen max-h-screen min-h-[calc(100vh-80px)] w-full flex items-center justify-center overflow-y-auto px-4 py-4 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/images/loginbg.jpg')"
            }}
        >

            {/* Login Card */}
            <div className="w-full max-w-md max-h-full overflow-y-auto p-4 sm:p-6 rounded-3xl bg-black/20 backdrop-blur-xl border border-white/20 shadow-2xl">

                {/* Brand */}
                <div className="text-center mb-6">
                    <Link to="/" className="inline-block">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white">
                            And<span className="text-(--color-blue)">Chat</span>
                        </h1>
                    </Link>

                    <p className="text-sm text-white/70 mt-3">
                        Welcome back! Please login to your account.
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-white mb-2"
                        >
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                            className="w-full p-2 rounded-lg bg-white/90 text-black placeholder:text-gray-600 outline-none border border-white/30 focus:bg-white focus:ring-4 focus:ring-(--color-blue)/30 transition-all duration-300"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-white mb-2"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                            className="w-full p-2 rounded-lg bg-white/90 text-black placeholder:text-gray-600 outline-none border border-white/30 focus:bg-white focus:ring-4 focus:ring-(--color-blue)/30 transition-all duration-300"
                        />
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-white/80 hover:text-white transition-colors duration-300"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Login Error */}
                    {loginError && (
                        <p className="text-sm text-red-300 text-center">
                            {loginError?.data?.message ||
                                'Login failed. Please try again.'}
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-2">

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full py-3.5 rounded-2xl bg-(--color-blue) hover:bg-(--color-dark-blue) text-white text-sm sm:text-base font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoggingIn ? 'Logging in...' : 'Login'}
                        </button>

                        {/* HR Demo Button */}
                        <button
                            type="button"
                            onClick={handleHrDemo}
                            disabled={isLoggingIn}
                            className="w-full py-3.5 rounded-2xl border border-white/40 text-white text-sm sm:text-base font-semibold hover:bg-white/10 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoggingIn ? 'Please wait...' : 'HR Demo'}
                        </button>

                    </div>
                </form>

                {/* Signup */}
                <p className="text-center text-sm text-white/70 mt-8">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="font-semibold text-white hover:text-(--color-blue) transition-colors duration-300"
                    >
                        Create an account
                    </Link>
                </p>

            </div>
        </section>
    );
}

export default Login;