import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, user: null, shop: null },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, user, shop } = action.payload;
      state.token = accessToken;
      state.user = user;
      state.shop = shop;
    },
    logOut: (state, action) => {
      state.token = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => {
  return { token: state.auth.token, user: state.auth.user, shop: state.auth.shop };
};
