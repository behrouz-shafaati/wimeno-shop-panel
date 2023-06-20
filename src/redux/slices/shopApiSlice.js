import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/api';

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShop: builder.query({
      query: (params = {}) => {
        return {
          url: '/shop-panel',
          method: 'GET',
          params,
        };
      },
      providesTags: ['GeneralShop'],
    }),
    updateShop: builder.mutation({
      query: (params) => ({
        url: '/shop-panel',
        method: 'PATCH',
        body: params,
      }),
      invalidatesTags: ['GeneralShop'],
    }),
  }),
});

export const { useGetShopQuery, useUpdateShopMutation } = usersApiSlice;
