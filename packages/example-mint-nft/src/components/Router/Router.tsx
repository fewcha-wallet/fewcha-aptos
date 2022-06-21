// Copyright 2022 Fewcha. All rights reserved.

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LazyHome } from "../Router/elements";
import Layout from "components/Layout/Layout";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<LazyHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
