// Copyright 2022 Fewcha. All rights reserved.

import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { setToast, emptyToast } from "./toastReducer";
import { RootState } from "../../app/store";

const Toast: React.FC = () => {
  const toastRedux = useSelector((state: RootState) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toastRedux.show) {
      switch (toastRedux.type) {
        case "error":
          toast.error(toastRedux.message);
          break;
        case "success":
          toast.success(toastRedux.message);
          break;
        case "info":
          toast.success(toastRedux.message);
          break;
        default:
          break;
      }
      dispatch(setToast(emptyToast));
    }
  });

  return (
    <Toaster
      containerStyle={{ top: 30 }}
      position="top-center"
      toastOptions={{
        error: {
          style: {
            border: "1px solid #e23333",
            padding: "8px 16px",
            color: "#e23333",
          },
        },
        success: {
          style: {
            border: "1px solid #33e296",
            padding: "8px 16px",
            color: "#33e296",
          },
        },
      }}
    />
  );
};

export default Toast;
