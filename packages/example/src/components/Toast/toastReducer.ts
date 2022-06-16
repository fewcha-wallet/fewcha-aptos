// Copyright 2022 Fewcha. All rights reserved.

import { createAction, createReducer } from "@reduxjs/toolkit";
import { ToastReducer } from "../../components/Toast/types";

export const setToast = createAction<ToastReducer>("app/toast");
export const emptyToast: ToastReducer = {
  show: false,
  title: "",
  message: "",
  type: "info",
};

const toastReducer = createReducer(emptyToast, (builder) =>
  builder.addCase(setToast, (state, action) => {
    return {
      ...state,
      show: action.payload.show,
      title: action.payload.title,
      message: action.payload.message || "err:toast:empty-message",
      type: action.payload.type,
    };
  })
);

export default toastReducer;
