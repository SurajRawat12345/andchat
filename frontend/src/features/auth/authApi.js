import { api } from '../../services/api';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/api/v1/user/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        getCurrentUser: builder.query({
            query: () => '/api/v1/user/me',
        }),

        logout: builder.mutation({
            query: () => ({
                url: '/api/users/logout',
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useGetCurrentUserQuery,
    useLogoutMutation,
} = authApi;