import * as React from "react";
import axios from "axios";

import { usePayment, RequiresApprovalError } from "../contexts/PaymentContext";
import { useWeb3React } from "@web3-react/core";

import { useConnector } from "../contexts/ConnectorContext";
import { Typography, Box, makeStyles, Link } from "@material-ui/core";
import { Types } from "@requestnetwork/request-client.js";
import { getBtcPaymentUrl } from "@requestnetwork/payment-processor";
import {
  useMobile,
  ReceiptLink,
  Spacer,
  RButton,
  RIcon,
  RSpinner,
} from "request-ui";
import QRCode from "qrcode.react";
import RequestIconDark from "../assets/img/Request_icon_dark.svg";
import BtcIcon from "../assets/img/btc.png";
import MetamaskIcon from "../assets/img/metamask.png";
import CoinbaseIcon from "../assets/img/coinbase.png";
import TrustIcon from "../assets/img/trust.png";
import { useRequest } from "request-shared";

import AccountBalanceWallet from "@material-ui/icons/AccountBalanceWalletOutlined";

const PayAction = ({
  disabled,
  pay,
  paying,
}: {
  broadcasting: boolean;
  paying: boolean;
  disabled: boolean;
  pay: () => void;
}) => {
  return (
    <RButton
      disabled={disabled}
      onClick={pay}
      color="primary"
      size="large"
      fullWidth
      startIcon={<RIcon variant={disabled ? "dark" : "light"} />}
      sticky
      loading={paying}
      direction="left"
    >
      <Typography variant="h5">Pay now</Typography>
    </RButton>
  );
};
const useApproveStyles = makeStyles(theme => ({
  square: {
    borderRadius: 0,
    [theme.breakpoints.up("sm")]: {
      borderRadius: 4,
    },
  },
}));
const ApproveAction = ({ approve }: { approve: () => void }) => {
  const classes = useApproveStyles();
  return (
    <RButton
      sticky
      size="medium"
      onClick={approve}
      color="secondary"
      fullWidth
      className={classes.square}
    >
      <Typography variant="caption">Approve before paying</Typography>
    </RButton>
  );
};

const ConnectAction = ({
  activate,
  mobileRedirect,
  installMetamask,
}: {
  activate: () => void;
  mobileRedirect: (name: string) => Promise<any>;
  installMetamask: () => void;
}) => {
  const web3 = "ethereum" in window;
  const [active, setActive] = React.useState(false);

  const mobileRedirectWrapper = async (name: string) => {
    setActive(true);
    await mobileRedirect(name);
    setActive(false);
  };
  const mobile = useMobile();
  if (active) return <RSpinner />;

  if (web3)
    return (
      <RButton
        startIcon={<AccountBalanceWallet />}
        color="default"
        onClick={activate}
      >
        <Box color="text.primary">
          <Typography variant="h4">Connect your wallet</Typography>
        </Box>
      </RButton>
    );

  if (mobile)
    return (
      <>
        <RButton
          startIcon={<img src={CoinbaseIcon} alt="" width={32} height={32} />}
          color="default"
          onClick={() => mobileRedirectWrapper("coinbase")}
          style={{ minWidth: 300 }}
        >
          <Box color="text.primary">
            <Typography variant="h4">Open with Coinbase Wallet</Typography>
          </Box>
        </RButton>
        <Spacer size={3} />
        <RButton
          startIcon={<img src={TrustIcon} alt="" width={32} height={32} />}
          color="default"
          onClick={() => mobileRedirectWrapper("trust")}
          style={{ minWidth: 300 }}
        >
          <Box color="text.primary">
            <Typography variant="h4">Open with Trust Wallet</Typography>
          </Box>
        </RButton>
      </>
    );

  return (
    <RButton
      startIcon={<img src={MetamaskIcon} alt="" width={32} height={32} />}
      color="default"
      onClick={installMetamask}
    >
      <Box color="text.primary">
        <Typography variant="h4">Install Metamask</Typography>
      </Box>
    </RButton>
  );
};

const BtcPay = ({ url }: { url: string }) => {
  const mobile = useMobile();
  if (mobile)
    return (
      <RButton
        color="default"
        onClick={() => window.open(url, "_blank")?.focus()}
        startIcon={<img src={BtcIcon} alt="" width={16} height={16} />}
      >
        Pay
      </RButton>
    );
  return (
    <>
      <Typography variant="body2">Pay with a mobile wallet</Typography>
      <Spacer />
      <QRCode
        value={url}
        size={128}
        level={"H"}
        imageSettings={{
          src: RequestIconDark,
          width: 24,
          height: 24,
          excavate: true,
        }}
      />
    </>
  );
};

const coinbaseShare = async (requestId: string) => {
  const { data } = await axios.get(
    `https://europe-west1-request-240714.cloudfunctions.net/coinbase-share?requestId=${requestId}`
  );
  return data || "https://go.cb-w.com/jHZvKzZ2H5";
};

const PaymentActions = () => {
  const { request, counterValue, counterCurrency } = useRequest();
  const { active, error } = useWeb3React();
  const {
    error: paymentError,
    pay,
    ready: paymentReady,
    approve,
    paying,
    broadcasting,
  } = usePayment();
  const { activateConnector } = useConnector();

  if (!request) {
    return <></>;
  }

  if (
    request.status === "canceled" ||
    (request.status === "pending" && !paying)
  ) {
    return <></>;
  }

  if (request.status === "paid" || request.status === "overpaid") {
    return (
      <>
        <Box
          color="text.secondary"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          padding="0 11px"
          textAlign="center"
        >
          <Typography variant="caption" style={{ fontStyle: "italic" }}>
            {/* 2 spans to force the line break after dashboard */}
            <span style={{ display: "inline-block" }}>
              Want to access your dashboard
            </span>{" "}
            <span style={{ display: "inline-block" }}>
              or request a payment?
            </span>
          </Typography>
          <Spacer />
          <Link
            href="https://create.request.network"
            target="_blank"
            underline="always"
            color="secondary"
          >
            <Typography component="span" variant="h5">
              Click here
            </Typography>
          </Link>
        </Box>
        <Spacer size={8} />
        <ReceiptLink
          request={request}
          counterCurrency={counterCurrency}
          counterValue={counterValue}
        />
      </>
    );
  }

  if (request.currencyType === Types.RequestLogic.CURRENCY.BTC) {
    return <BtcPay url={getBtcPaymentUrl(request.raw)} />;
  }

  if (request.currencyType === Types.RequestLogic.CURRENCY.ISO4217) {
    return <></>;
  }

  if (!active && !error) {
    return (
      <ConnectAction
        activate={() => activateConnector("injected")}
        mobileRedirect={async name => {
          let url;
          if (name === "coinbase") {
            url = await coinbaseShare(request.requestId);
          } else if (name === "trust") {
            url = `https://link.trustwallet.com/open_url?url=${window.location.toString()}`;
          } else {
            throw new Error(`unsupported wallet ${name}`);
          }
          window.open(url);
        }}
        installMetamask={() => window.open("http://metamask.io/")}
      />
    );
  }

  if (paymentError instanceof RequiresApprovalError) {
    return <ApproveAction approve={approve} />;
  }

  return (
    <PayAction
      pay={pay}
      paying={paying}
      broadcasting={broadcasting}
      disabled={
        !paymentReady ||
        !!error ||
        !!paymentError ||
        request.status === "waiting"
      }
    />
  );
};

export default PaymentActions;
