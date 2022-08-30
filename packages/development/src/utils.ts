// Copyright 2022 Fewcha. All rights reserved.

export const parseError = (status: number): boolean => {
  switch (status) {
    case 200:
      return true;
    case 400:
      alert("bad request");
      return false;
    case 401:
      alert("User cancelled");
      return false;
    case 403:
      alert("Forbidden: please connect wallet");
      return false;
    case 404:
      alert("Not Found");
      return false;
    case 500:
      alert("Internal Server Error");
      return false;
    case 502:
      alert("Bad Gateway");
      return false;
    case 503:
      alert("Service Unavailable");
      return false;
    default:
      alert("Unknown Error");
      return false;
  }
};
