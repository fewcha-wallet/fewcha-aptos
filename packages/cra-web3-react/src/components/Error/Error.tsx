// Copyright 2021 ANSU Group. All rights reserved.

import React from "react";
import cn from "../../services/cn";

const Error: React.FC<{ className?: string; error: any }> = ({
  error,
  className,
}) => {
  if (error) {
    return (
      <div className={cn("bundle-error text-red-600 text-sm mt-1", className)}>
        {error.message}
      </div>
    );
  }
  return <></>;
};

export default Error;
