import { providers } from "ethers";
import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { ErrorBoundary } from "request-ui";

import {
  CssBaseline,
  makeStyles,
  ThemeProvider,
  createTheme,
} from "@material-ui/core";
import { Web3ReactProvider } from "@web3-react/core";

import CreatePage from "./containers/CreatePage";
import ErrorPage from "./containers/ErrorPage";
import NotFoundPage from "./containers/NotFoundPage";
import RequestPage from "./containers/RequestPage";
import DashboardPage from "./containers/DashboardPage";
import { useEagerConnect } from "./hooks/useEagerConnect";
import { useInactiveListener } from "./hooks/useInactiveListnerer";
import { UserProvider } from "./contexts/UserContext";
import { GnosisSafeProvider } from "./contexts/GnosisSafeContext";

const useStyles = makeStyles(() => ({
  paper: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    maxWidth: "100%",
    background: "white",
  },
}));

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 560,
      sm: 560,
      md: 560,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    body1: {
      fontSize: 12,
      lineHeight: "14px",
    },
    body2: {
      fontSize: 12,
      lineHeight: "14px",
    },
    subtitle1: {
      fontSize: 16,
      lineHeight: "19px",
    },
    h5: {
      fontSize: 12,
      lineHeight: "14px",
      fontWeight: 600,
    },
    h6: {
      fontSize: 12,
      lineHeight: "16px",
      fontWeight: 600,
    },
  },
  overrides: {
    MuiFilledInput: {
      root: {
        fontSize: 12,
        lineHeight: "14px",
        "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
          display: "none",
          margin: 80,
        },
      },
      input: {
        fontSize: 12,
        lineHeight: "14px",
        "&::placeholder": {
          color: "#656565",
          fontSize: 12,
          lineHeight: "14px",
        },
      },
    },
    MuiSelect: {
      selectMenu: {
        fontSize: 12,
        lineHeight: "14px",
      },
    },
    MuiInputLabel: {
      root: {
        fontSize: 12,
        lineHeight: "14px",
        "&::placeholder": {
          color: "#656565",
          fontSize: 12,
          lineHeight: "14px",
        },
      },
      asterisk: {
        display: "none",
      },
    },
    MuiFormHelperText: {
      contained: {
        fontSize: 12,
        lineHeight: "16px",
      },
      root: {
        "&$error": {
          fontSize: 12,
          lineHeight: "16px",
          color: "#DE1C22",
        },
      },
    },
    MuiButton: {
      root: {
        textTransform: "none",
      },
    },
  },
});

const App: React.FC = () => {
  const classes = useStyles();
  const tried = useEagerConnect();
  useInactiveListener(!tried);

  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={classes.paper}>
          <Switch>
            <Route path="/" exact component={CreatePage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/:id([0-9a-fA-F]+)" component={RequestPage} />
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </div>
      </ThemeProvider>
    </HashRouter>
  );
};

export default () => {
  return (
    <ErrorBoundary
      stackdriverErrorReporterApiKey="AIzaSyBr5Ix9knr8FPzOmkB6QmcEs-E9fjReZj8"
      projectId="request-240714"
      service="RequestGnosisSafeApp"
      component={ErrorPage}
    >
      <Web3ReactProvider
        getLibrary={provider => new providers.Web3Provider(provider)}
      >
        <UserProvider>
          <GnosisSafeProvider>
            <App />
          </GnosisSafeProvider>
        </UserProvider>
      </Web3ReactProvider>
    </ErrorBoundary>
  );
};
