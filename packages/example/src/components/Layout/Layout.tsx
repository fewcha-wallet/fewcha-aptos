// Copyright 2022 Fewcha. All rights reserved.

import React from "react";
import Header from "components/Header/Header";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
