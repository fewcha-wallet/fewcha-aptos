// Copyright 2022 Fewcha. All rights reserved.

import React, { lazy, Suspense } from "react";

export const UnimplementElement = () => <div>Unimplement</div>;

export const createDefaultElement =
  (Inner: React.LazyExoticComponent<React.FC>): React.FC =>
  () =>
    <Suspense fallback={<div></div>}>{<Inner />}</Suspense>;

export const LazyApp = createDefaultElement(
  lazy(() => import("../../components/App/App"))
);

export const LazyHome = createDefaultElement(
  lazy(() => import("../../pages/Home"))
);
