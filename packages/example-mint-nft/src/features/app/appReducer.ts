// Copyright 2022 Fewcha. All rights reserved.

import { createAction, createReducer } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { defaultAppReducer } from "./types";

export const login = createAction("app/login");
export const logout = createAction("app/logout");
export const openSidebar = createAction("app/openSidebar");
export const closeSidebar = createAction("app/closeSidebar");

const appReducer = createReducer(defaultAppReducer, (builder) =>
  builder
    .addCase(login, (state) => {
      state.isLoggedIn = true;
    })
    .addCase(logout, (state) => {
      state.isLoggedIn = false;
    })
    .addCase(openSidebar, (state) => {
      state.openSidebar = true;
    })
    .addCase(closeSidebar, (state) => {
      state.openSidebar = false;
    })
);

export const selectApp = (state: RootState) => state.app;

export default appReducer;
