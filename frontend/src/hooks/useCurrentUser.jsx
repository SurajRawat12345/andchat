import { useGetCurrentUserQuery } from '../features/auth/authApi.js';

function useCurrentUser() {
    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useGetCurrentUserQuery();

    const currentUser = !isLoading && !isError
        ? data?.data
        : null;

    return {
        currentUser,
        isLoading,
        isError,
        isLoggedIn: Boolean(currentUser),
        isFetching,
    };
}

export default useCurrentUser;