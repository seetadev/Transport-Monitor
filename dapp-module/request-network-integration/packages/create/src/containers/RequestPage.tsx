import React, { useState } from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import {
  RContainer,
  RequestView,
  Spacer,
  RButton,
  RequestSkeleton,
  TestnetWarning,
  ReceiptLink,
} from "request-ui";
import {
  IParsedRequest,
  RequestProvider,
  useRequest,
  cancelRequest,
  isCancelError,
} from "request-shared";

import ShareRequest from "../components/ShareRequest";
import ErrorPage from "./ErrorPage";
import { useConnectedUser } from "../contexts/UserContext";
import NotLoggedPage from "./NotLoggedPage";

const useStyles = makeStyles(() => ({
  cancel: {
    color: "#DE1C22",
    border: "1px solid #E4E4E4",
  },
}));

export const RequestNotFound = () => {
  return (
    <ErrorPage
      topText="Your request has not been found, sorry!"
      bottomText="You might want to try again later"
    />
  );
};

const RequestActions = ({
  request,
  account,
  cancel,
}: {
  request: IParsedRequest;
  account?: string | null;
  cancel: () => Promise<void>;
}) => {
  const [cancelling, setCancelling] = useState(false);
  const onCancelClick = async () => {
    setCancelling(true);
    await cancel();
    setCancelling(false);
  };
  const classes = useStyles();
  account = account?.toLowerCase();
  if (
    request.status === "open" &&
    account &&
    [request.payer, request.payee].includes(account)
  ) {
    return (
      <RButton
        color="default"
        className={classes.cancel}
        onClick={onCancelClick}
        disabled={cancelling}
      >
        <Typography variant="h4">
          {request.payer === account ? "Decline request" : "Cancel request"}
        </Typography>
      </RButton>
    );
  }
  return <></>;
};

const RequestPageInner = () => {
  const { account, chainId } = useWeb3React();

  const {
    request,
    loading,
    update,
    counterCurrency,
    counterValue,
  } = useRequest();

  const cancel = async () => {
    if (!request || !account || !chainId) {
      throw new Error("cannot cancel because page is not ready");
    }
    try {
      await cancelRequest(request.requestId, account, chainId);
    } catch (e) {
      if (!isCancelError(e)) {
      } else {
        throw e;
      }
    }
    await update();
  };

  if (loading) {
    return (
      <RContainer>
        <Spacer size={15} xs={8} />
        <RequestSkeleton />
      </RContainer>
    );
  }
  if (!request) {
    return <RequestNotFound />;
  }
  return (
    <RContainer>
      <Spacer size={15} xs={8} />
      <TestnetWarning chainId={request?.network} />
      <RequestView
        payee={request.payee}
        createdDate={request.createdDate}
        paidDate={request.paidDate}
        canceledDate={request.canceledDate}
        status={request.status}
        amount={request.amount.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 5,
        })}
        overpaid={(request.balance - request.amount).toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 5,
        })}
        currency={request.currency}
        reason={request.reason}
        counterValue={counterValue}
        counterCurrency={counterCurrency}
      />
      <Spacer size={12} />
      {request.status === "paid" || request.status === "overpaid" ? (
        <>
          <ReceiptLink
            request={request}
            counterValue={counterValue}
            counterCurrency={counterCurrency}
          />
          <Spacer size={11} />
          <ShareRequest requestId={request.requestId} />
        </>
      ) : (
        <>
          <ShareRequest requestId={request.requestId} />
          <Spacer size={11} />
          <RequestActions request={request} account={account} cancel={cancel} />
        </>
      )}
      <Spacer size={12} />
    </RContainer>
  );
};

const RequestPage = () => {
  const { chainId, account } = useWeb3React();
  const { loading: web3Loading } = useConnectedUser();

  if (web3Loading) {
    return null;
  }
  if (!web3Loading && (!account || !chainId)) {
    return <NotLoggedPage />;
  }
  return (
    <RequestProvider chainId={chainId}>
      <RequestPageInner />
    </RequestProvider>
  );
};
export default RequestPage;
