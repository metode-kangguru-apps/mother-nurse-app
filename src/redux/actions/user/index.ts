import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRequest } from './types';

const initialState: UserRequest = {
  user: undefined,
  loading: false,
  error: false,
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserRequest: (state) => {
      state.loading = true
    },
    fetchUserSuccess: (state, action: PayloadAction<any>) => {
      // set user state
      state.user = {
        displayName: action.payload.displayName,
        email: action.payload.email,
        uid: action.payload.uid,
        stsTokenManager: action.payload.stsTokenManager,
        isAnonymous: action.payload.isAnonymous,
        userType: action.payload.userType
      };
      state.error = false;
      state.loading = false;
    },
    clearDataUserSuccess: (state) => {
      state.user = undefined,
      state.error = false;
      state.loading = false;
    },
    fetchUserError: (state) => {
      state.error = true;
      state.loading = false;
    },
  },
});

export const {
    fetchUserRequest,
    fetchUserSuccess,
    clearDataUserSuccess,
    fetchUserError
} = user.actions;

export default user.reducer;