import { apiSlice } from '../api/api';
import { logOut, setCredentials } from './authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/shop-panel',
        method: 'POST',
        body: credentials,
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(logOut());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),
    refresh: builder.query({
      query: () => ({
        url: '/auth/shop-panel/refresh',
        method: 'GET',
      }),
      providesTags: [{ type: 'Auth', id: 'REFRESH' }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, user, shop } = data;
          dispatch(setCredentials({ accessToken, user, shop }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshQuery } = authApiSlice;
