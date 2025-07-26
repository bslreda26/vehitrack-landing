import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { saveAuthData, clearAuthData } from "../utils/authUtils";

export interface LoginState {
  fullname: string;
  role_id: number;
  loggedIn: boolean;
  loginError: string;
  token?: string;
}

const initialState: LoginState = {
  fullname: "",
  role_id: 0,
  loggedIn: false,
  loginError: "",
  token: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        fullname: string;
        role_id: number;
        token?: string;
      }>
    ) => {
      state.fullname = action.payload.fullname;
      state.role_id = action.payload.role_id;
      state.loggedIn = true;
      state.token = action.payload.token || "";
      
      // Save to localStorage
      if (action.payload.token) {
        saveAuthData(action.payload.token, {
          fullname: action.payload.fullname,
          role_id: action.payload.role_id
        });
      }
    },
    signout: (state) => {
      state.fullname = "";
      state.role_id = 0;
      state.loggedIn = false;
      state.loginError = "";
      state.token = "";
      
      // Clear from localStorage
      clearAuthData();
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    setLoginError: (state, action: PayloadAction<string>) => {
      state.loginError = action.payload;
    },
    restoreAuth: (state, action: PayloadAction<{
      fullname: string;
      role_id: number;
      token: string;
    }>) => {
      state.fullname = action.payload.fullname;
      state.role_id = action.payload.role_id;
      state.loggedIn = true;
      state.token = action.payload.token;
    },
  },
});

export const { login, signout, setLoggedIn, setLoginError, restoreAuth } = loginSlice.actions;

export default loginSlice.reducer;
