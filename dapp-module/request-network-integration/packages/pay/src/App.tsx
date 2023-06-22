import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ErrorBoundary, theme, Analytics } from "request-ui";

import { CssBaseline, makeStyles, ThemeProvider } from "@material-ui/core";

import DemoPage from "./containers/DemoPage";
import ErrorPage from "./containers/ErrorPage";
import NotFoundPage from "./containers/NotFoundPage";
import PaymentPage from "./containers/PaymentPage";
//@ts-ignore
import { ReceiptPreview } from "request-ui";

const useStyles = makeStyles(theme => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    maxWidth: "100vw",
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={classes.paper}>
          <ErrorBoundary
            stackdriverErrorReporterApiKey="AIzaSyDhj4acOHHIsUsKyISqHv2j7Pqzdu0FjTk"
            projectId="request-240714"
            service="RequestPayments"
            component={ErrorPage}
          >
            <Analytics trackingId="UA-105153327-16">
              <Switch>
                {/* There is no homepage. In Production, redirects to create.request.network. */}
                {window.location.hostname !== "localhost" && (
                  <Route
                    path="/"
                    exact
                    component={() => {
                      window.location.href = "https://create.request.network";
                      return null;
                    }}
                  />
                )}
                {/* Demo page, for tests only */}
                <Route path="/demo" component={DemoPage} />
                {/* Main Payment page */}
                <Route path="/:id([0-9a-fA-F]+)" component={PaymentPage} />
                <Route
                  path="/pdf/:id([0-9a-fA-F]+)"
                  component={ReceiptPreview}
                />
                <Route path="*" component={NotFoundPage} />
              </Switch>
            </Analytics>
          </ErrorBoundary>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
