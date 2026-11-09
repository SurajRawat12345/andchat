// import { configureStore } from '@reduxjs/toolkit';

// import authReducer from '../features/auth/authSlice.js';
// // import chatReducer from '../features/chats/chatSlice.js';
// // import messageReducer from '../features/messages/messageSlice.js';
// // import userReducer from '../features/users/userSlice.js';

// const store = configureStore({
//     reducer: {
//         auth: authReducer,
//         // chats: chatReducer,
//         // messages: messageReducer,
//         // users: userReducer,
//     },
// });

// export default store;

import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});