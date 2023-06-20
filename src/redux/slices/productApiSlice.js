import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/api';

const productsAdapter = createEntityAdapter({});

const initialState = productsAdapter.getInitialState();

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params = {}) => ({
        url: '/shop-panel/products',
        params,
      }),
      transformResponse: (responseData) => {
        const { totalPages, totalDocument, nextPage } = responseData;
        const prebuiltReducer = productsAdapter.setAll(initialState, responseData.data);
        return { ...prebuiltReducer, totalPages, totalDocument, nextPage };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) return [{ type: 'Product', id: 'LIST' }, ...result.ids.map((id) => ({ type: 'Product', id }))];
        return [{ type: 'Product', id: 'LIST' }];
      },
    }),
    addNewProduct: builder.mutation({
      query: (params) => ({
        url: '/shop-panel/product',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation({
      query: (params) => ({
        url: '/shop-panel/product',
        method: 'PATCH',
        body: params,
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: 'Product', id: arg.id }];
      },
    }),
    deleteProduct: builder.mutation({
      query: (params) => ({
        url: `/shop-panel/products`,
        method: 'DELETE',
        body: params,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.id }],
    }),
  }),
});

export const { useGetProductsQuery, useAddNewProductMutation, useDeleteProductMutation, useUpdateProductMutation } =
  productApiSlice;
