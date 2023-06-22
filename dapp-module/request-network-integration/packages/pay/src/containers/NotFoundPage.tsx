import * as React from "react";
import ErrorPage from "./ErrorPage";

const NotFoundPage = () => {
  return (
    <ErrorPage
      topText="404 not found."
      bottomText="Please double check your url."
    />
  );
};

export default NotFoundPage;
