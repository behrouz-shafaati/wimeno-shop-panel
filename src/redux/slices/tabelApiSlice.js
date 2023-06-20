import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/api';

const TabelsAdapter = createEntityAdapter({});

const initialState = TabelsAdapter.getInitialState();

export const TabelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTabels: builder.query({
      query: (params = {}) => ({
        url: '/shop-panel/tabels',
        params,
      }),
      transformResponse: (responseData) => {
        const { totalPages, totalDocument, nextPage } = responseData;
        const prebuiltReducer = TabelsAdapter.setAll(initialState, responseData.data);
        return { ...prebuiltReducer, totalPages, totalDocument, nextPage };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) return [{ type: 'Tabel', id: 'LIST' }, ...result.ids.map((id) => ({ type: 'Tabel', id }))];
        return [{ type: 'Tabel', id: 'LIST' }];
      },
    }),
    addNewTabel: builder.mutation({
      query: (params) => ({
        url: '/shop-panel/tabel',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: [{ type: 'Tabel', id: 'LIST' }],
    }),
    updateTabel: builder.mutation({
      query: (params) => ({
        url: '/panel/tabel',
        method: 'PATCH',
        body: {
          ...params,
        },
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: 'Tabel', id: arg.id }];
      },
    }),
    deleteTabel: builder.mutation({
      query: (params) => ({
        url: `/panel/tabels`,
        method: 'DELETE',
        body: params,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Tabel', id: arg.id }],
    }),
  }),
});

export const { useGetTabelsQuery, useAddNewTabelMutation, useDeleteTabelMutation, useUpdateTabelMutation } =
  TabelApiSlice;
