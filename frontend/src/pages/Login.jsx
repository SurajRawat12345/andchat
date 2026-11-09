import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import {
    useLoginMutation,
    useGetCurrentUserQuery,
} from '../features/auth/authApi.js';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Login mutation
    const [
        login,
        {
            isLoading: isLoggingIn,
            error: loginError,
        },
    ] = useLoginMutation();

    // Get currently authenticated user
    const {
        data,
        isLoading: isCheckingAuth,
        isError: isAuthError,
        refetch,
    } = useGetCurrentUserQuery();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login({
                email,
                password,
            }).unwrap();

            // Fetch updated user information after login
            await refetch();

            setEmail('');
            setPassword('');
        } catch (error) {
            console.log('Login failed:', error);
        }
    };

    // Show loading while checking authentication
    if (isCheckingAuth) {
        return <h2>Checking authentication...</h2>;
    }

    // Extract user from API response
    const user = data?.data;

    return (
        <div>
            {user && !isAuthError ? (
                <>
                    <h1>Welcome, {user.username}!</h1>

                    <pre>
                        {JSON.stringify(user, null, 4)}
                    </pre>
                </>
            ) : (
                <>
                    <h1>Login Form</h1>
                    <Link to="/">Home</Link>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {loginError && (
                        <p>
                            {loginError?.data?.message ||
                                'Login failed. Please try again.'}
                        </p>
                    )}
                </>
            )}
        </div>
    );
}

export default Login;