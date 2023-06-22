import * as React from "react";
import ErrorPage from "./ErrorPage";

export default () => {
  return (
    <ErrorPage
      topText="404 not found."
      bottomText="Please double check your url."
    />
  );
};
