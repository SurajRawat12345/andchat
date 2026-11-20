import { api } from '../../services/api';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/api/v1/user/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'],
        }),

        getCurrentUser: builder.query({
            query: () => '/api/v1/user/me',
            providesTags: ['User'],
        }),

        register: builder.mutation({
            query: (userData) => ({
                url: '/api/v1/user/register',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),

        logout: builder.mutation({
            query: () => ({
                url: '/api/v1/user/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useLoginMutation,
    useGetCurrentUserQuery,
    useRegisterMutation,
    useLogoutMutation,
} = authApi;