// Copyright 2022 Fewcha. All rights reserved.

import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import toastReducer from "components/Toast/toastReducer";
import appReducer from "features/app/appReducer";

export const store = configureStore({
  reducer: {
    app: appReducer,
    toast: toastReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
