import { providers } from "ethers";
import * as React from "react";
import Intercom from "react-intercom";

import { Box, makeStyles } from "@material-ui/core";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { CurrencyProvider, getCurrencies } from "request-shared";

import {
  RAlert,
  RFooter,
  Spacer,
  RequestView,
  RSpinner,
  RContainer,
  RequestSkeleton,
  TestnetWarning,
} from "request-ui";

import Feedback from "../components/Feedback";
import PaymentActions from "../components/PaymentActions";
import { ConnectorProvider, useConnector } from "../contexts/ConnectorContext";
import {
  PaymentProvider,
  usePayment,
  RequiresApprovalError,
} from "../contexts/PaymentContext";
import { RequestProvider, useRequest } from "request-shared";
import { usePrevious } from "../hooks/usePrevious";
import { useMobile } from "request-ui";
import ErrorPage from "./ErrorPage";
import { ErrorMessage } from "../components/ErrorMessage";
import { useEagerConnect } from "../hooks/useEagerConnect";
import PendingAlert from "../components/PendingAlert";

export const RequestNotFound = () => {
  return (
    <ErrorPage
      topText="Your request has not been found, sorry!"
      bottomText="You might want to try again later"
    />
  );
};

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    position: "sticky",
    bottom: 0,
    [theme.breakpoints.up("sm")]: {
      position: "relative",
    },
  },
}));

const WrappedSpinner = () => {
  const classes = useStyles();
  return (
    <Box className={classes.wrapper}>
      <RSpinner />
    </Box>
  );
};

const useErrorContainerStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "column",
    background: "linear-gradient(-26deg,#ffffff 50%,#FAFAFA 0%)",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      background: "#FAFAFA",
    },
  },
}));

export const ErrorContainer = () => {
  const mobile = useMobile();
  const { error: paymentError } = usePayment();
  const { error: web3Error } = useWeb3React();

  const { request } = useRequest();
  const classes = useErrorContainerStyles();

  const requiresApproval = paymentError instanceof RequiresApprovalError;
  const showErrorAtTop = mobile || !requiresApproval;

  const error = web3Error || paymentError;

  return (
    <Box className={classes.container}>
      {request?.status === "open" && error && showErrorAtTop && (
        <ErrorMessage error={error} request={request} />
      )}
      <RContainer>
        <Spacer size={15} xs={5} />
        <TestnetWarning chainId={request?.network} />
      </RContainer>
    </Box>
  );
};

export const FeedbackContainer = () => {
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const { request } = useRequest();
  const prevStatus = usePrevious(request?.status);

  React.useEffect(() => {
    if (
      prevStatus &&
      prevStatus !== request?.status &&
      (request?.status === "paid" || request?.status === "overpaid")
    ) {
      setFeedbackOpen(true);
    }
  }, [request, prevStatus]);
  return (
    <Feedback open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
  );
};

export const PaymentPageInner = () => {
  const [loaded, setLoaded] = React.useState(false);

  const { ready: connectorReady, connectorName } = useConnector();
  const {
    loading: requestLoading,
    request,
    counterCurrency,
    counterValue,
  } = useRequest();
  const {
    paying,
    approving,
    error,
    ready: paymentReady,
    txHash,
  } = usePayment();
  const mobile = useMobile();
  const { active, error: web3Error } = useWeb3React();

  React.useEffect(() => {
    // this hook is to avoid flashing elements on screen.
    // handles only first load
    if (loaded) return;
    // request must be loaded
    if (requestLoading) return;
    // connector must be ready
    if (!connectorReady) return;
    // if connector is active, check if payment is ready
    if (active && paymentReady) setLoaded(true);
    // there can be a delay between connectorReady=true and active=true
    //  so wait 500ms to ensure the connector is not active.
    if (!active) {
      const t = setTimeout(() => setLoaded(true), 500);
      return () => clearTimeout(t);
    }
  }, [requestLoading, connectorReady, active, paymentReady, loaded]);

  if (loaded && !request) {
    return <RequestNotFound />;
  }

  const requiresApproval =
    request?.status === "open" && error instanceof RequiresApprovalError;
  const activating = !active && !!connectorName;
  const stickToBottom =
    mobile &&
    active &&
    (request?.status === "open" || request?.status === "pending");
  const showSpinner =
    (approving || activating) && ((!web3Error && !error) || requiresApproval);
  const showFooter =
    !mobile ||
    request?.status === "paid" ||
    request?.status === "overpaid" ||
    request?.status === "canceled" ||
    (request?.status === "pending" && !paying);
  return (
    <RContainer>
      {request ? (
        <RequestView
          amount={request.amount.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 5,
          })}
          overpaid={(request.balance - request.amount).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 5,
          })}
          createdDate={request.createdDate}
          paidDate={request.paidDate}
          canceledDate={request.canceledDate}
          currency={request.currency}
          payee={request.payee}
          reason={request.reason}
          status={request.status}
          counterValue={counterValue}
          counterCurrency={counterCurrency}
        />
      ) : (
        <RequestSkeleton />
      )}

      {requiresApproval && !mobile ? (
        <>
          <Spacer size={12} />
          <RAlert
            severity="info"
            message="Please approve the contract in order to proceed with payment, using your connected wallet"
          />
          <Spacer size={5} />
        </>
      ) : request?.status === "pending" && txHash ? (
        <>
          <Spacer size={12} />

          <PendingAlert request={request} txHash={txHash} />
          <Spacer size={5} />
        </>
      ) : (
        <Spacer size={12} xs={10} />
      )}
      {stickToBottom && <Box flex={1} />}
      {!showSpinner && <PaymentActions />}
      {showSpinner && <WrappedSpinner />}
      {showFooter && (
        <>
          <Spacer size={15} />
          <RFooter />
        </>
      )}
    </RContainer>
  );
};

const AutoConnect = () => {
  const { request } = useRequest();
  useEagerConnect(request);

  return <></>;
};

const PaymentPage = () => {
  const isMobile = useMobile();

  return (
    <CurrencyProvider currencies={getCurrencies()}>
      <RequestProvider>
        <Web3ReactProvider
          getLibrary={provider => new providers.Web3Provider(provider)}
        >
          <ConnectorProvider>
            <PaymentProvider>
              <AutoConnect />
              <FeedbackContainer />
              <ErrorContainer />
              <PaymentPageInner />
              <Intercom
                appID="mmdbekc3"
                custom_launcher_selector="#intercom-trigger"
                hide_default_launcher={isMobile}
              />
            </PaymentProvider>
          </ConnectorProvider>
        </Web3ReactProvider>
      </RequestProvider>
    </CurrencyProvider>
  );
};

export default PaymentPage;
