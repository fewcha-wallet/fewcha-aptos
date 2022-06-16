// Copyright 2022 Fewcha. All rights reserved.

import React from "react";
import { Provider } from "react-redux";
import Toaster from "../Toast/Toast";
import Router from "../Router/Router";
import PopupProvider from "../Popup/PopupProvider";
import { store } from "../../app/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PopupProvider>
        <Router />
        <Toaster />
      </PopupProvider>
    </Provider>
  );
};

export default App;
