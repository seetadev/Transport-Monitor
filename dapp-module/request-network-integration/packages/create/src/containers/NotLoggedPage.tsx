import React from "react";
import ErrorPage from "./ErrorPage";

const NotLoggedPage = () => {
  return (
    <ErrorPage
      topText="You are not logged in!"
      bottomText="Please connect a wallet to continue."
    />
  );
};

export default NotLoggedPage;
