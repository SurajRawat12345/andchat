import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_SERVER_URL;

const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: 'include',
});

export const api = createApi({
    reducerPath: 'api',
    baseQuery,
    endpoints: () => ({}),
});