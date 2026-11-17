
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useRegisterMutation } from '../features/auth/authApi.js';

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [
        register,
        {
            isLoading: isRegistering,
            error: registerError,
        },
    ] = useRegisterMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await register({
                username,
                email,
                password,
            }).unwrap();

            console.log('Registration successful');

            setUsername('');
            setEmail('');
            setPassword('');

            navigate('/hello');
        } catch (error) {
            console.log('Registration failed:', error);
        }
    };

    return (
        <section
            className="h-screen max-h-screen min-h-[calc(100vh-80px)] w-full flex items-center justify-center overflow-y-auto px-4 py-4 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/images/loginbg.jpg')"
            }}
        >
            {/* Registration Card */}
            <div className="w-full max-w-md max-h-full overflow-y-auto p-4 sm:p-6 rounded-3xl bg-black/20 backdrop-blur-xl border border-white/20 shadow-2xl">

                {/* Brand */}
                <div className="text-center mb-6">
                    <Link to="/" className="inline-block">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white">
                            And<span className="text-(--color-blue)">Chat</span>
                        </h1>
                    </Link>

                    <p className="text-sm text-white/70 mt-3">
                        Create your account and start chatting.
                    </p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Username */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-semibold text-white mb-2"
                        >
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            minLength={3}
                            required
                            className="w-full p-2 rounded-lg bg-white/90 text-black placeholder:text-gray-600 outline-none border border-white/30 focus:bg-white focus:ring-4 focus:ring-(--color-blue)/30 transition-all duration-300"
                        />
                    </div>

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
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            minLength={8}
                            required
                            className="w-full p-2 rounded-lg bg-white/90 text-black placeholder:text-gray-600 outline-none border border-white/30 focus:bg-white focus:ring-4 focus:ring-(--color-blue)/30 transition-all duration-300"
                        />
                    </div>

                    {/* Registration Error */}
                    {registerError && (
                        <p className="text-sm text-red-300 text-center">
                            {registerError?.data?.message ||
                                'Registration failed. Please try again.'}
                        </p>
                    )}

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={isRegistering}
                        className="w-full py-3.5 rounded-2xl bg-(--color-blue) hover:bg-(--color-dark-blue) text-white text-sm sm:text-base font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isRegistering ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                {/* Login Link */}
                <p className="text-center text-sm text-white/70 mt-8">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-semibold text-white hover:text-(--color-blue) transition-colors duration-300"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </section>
    );
}

export default Register;
