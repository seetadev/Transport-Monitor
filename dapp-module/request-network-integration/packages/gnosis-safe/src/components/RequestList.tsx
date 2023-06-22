import React from "react";
import {
  makeStyles,
  Box,
  Typography,
  Hidden,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { IParsedRequest, getPayUrl } from "request-shared";
import { Link } from "react-router-dom";
import { RStatusBadge, Spacer, CopyIcon } from "request-ui";
import Moment from "react-moment";
import { Skeleton } from "@material-ui/lab";

const short = (val?: string) =>
  val ? (val.length >= 20 ? `${val.slice(0, 4)}...${val.slice(-4)}` : val) : "";

const useAddressStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    width: "100%",
    height: 22,
    alignItems: "center",
  },
  text: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

const Address = ({
  address,
  display,
  currentUser,
  text,
}: {
  address?: string;
  display?: string;
  currentUser: boolean;
  text?: string;
}) => {
  const classes = useAddressStyles();

  return (
    <Box className={classes.container}>
      {text && (
        <Box className={classes.text} width={40}>
          {text}
        </Box>
      )}
      <Tooltip title={address || ""}>
        <Typography variant={currentUser ? "h5" : "body2"}>
          {display || short(address)}
        </Typography>
      </Tooltip>
    </Box>
  );
};

const Amount = ({
  amount,
  currency,
  role,
}: {
  amount: number;
  currency: string;
  role?: "payee" | "payer";
}) => {
  const displayAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
  });
  const titleAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 18,
  });
  return (
    <Tooltip
      title={titleAmount !== displayAmount ? `${amount} ${currency}` : ""}
    >
      <Box
        color={role === "payee" ? "#008556" : role === "payer" ? "#DE1C22" : ""}
      >
        <Typography variant="h5">
          {role === "payer" ? <>-</> : <>+</>}&nbsp;
          {displayAmount} {currency}
        </Typography>
      </Box>
    </Tooltip>
  );
};

const useStyles = makeStyles(theme => ({
  row: {
    display: "flex",
    flexDirection: "row",
    height: 176,
    padding: "20px 16px",
    margin: "20px 0 4px 0",
    width: "unset",
    backgroundColor: "white",
    boxShadow: "0px 4px 5px rgba(211, 214, 219, 0.8)",
    [theme.breakpoints.up("md")]: {
      borderBottom: "solid 1px #E4E4E4",
      margin: 0,
      padding: 0,
      height: 48,
      boxShadow: "none",
    },
  },
  rowInner: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    alignItems: "start",
    flex: 1,
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
    },
  },
  status: {
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      right: 0,
    },
  },
  viewButton: {
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      right: 0,
      bottom: 0,
    },
  },
  amount: {
    display: "flex",
    // justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      bottom: 0,
    },
  },
  payer: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginTop: 8,
    },
  },
  payee: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginTop: 24,
    },
  },
}));

const Row = React.memo(
  ({
    request,
    account,
    smartContractAddress,
  }: {
    request: IParsedRequest;
    account: string;
    smartContractAddress?: string;
  }) => {
    const classes = useStyles();
    const isAccountPayee = !!account && account.toLowerCase() === request.payee;
    const isAccountPayer = !!account && account.toLowerCase() === request.payer;

    const isSmartContractPayee =
      !!smartContractAddress &&
      smartContractAddress.toLowerCase() === request.payee;
    const isSmartContractPayer =
      !!smartContractAddress &&
      smartContractAddress.toLowerCase() === request.payer;

    const isPaymentAddressSmartContract =
      !!smartContractAddress &&
      request.paymentAddress.toLowerCase() ===
        smartContractAddress.toLowerCase();

    return (
      <Box className={classes.row}>
        <Box className={classes.rowInner}>
          <Box flex={1 / 10}>
            <Spacer size={0} xs={1} />
            <Moment format="ll">{request.createdDate}</Moment>
          </Box>
          <Box flex={2 / 10} className={classes.payee}>
            <Box display="flex">
              <Address
                address={request.payee}
                display={
                  isSmartContractPayee
                    ? "Safe"
                    : isAccountPayee && isPaymentAddressSmartContract
                    ? "You (on behalf of Safe)"
                    : isAccountPayee
                    ? "You"
                    : undefined
                }
                currentUser={isAccountPayee || isSmartContractPayee}
                text="From"
              />
            </Box>
          </Box>
          <Box flex={1 / 10} className={classes.payer}>
            <Spacer size={0} xs={2} />

            {request.payer ? (
              <Address
                address={request.payer}
                display={
                  isSmartContractPayer
                    ? "Safe"
                    : isAccountPayer
                    ? "You"
                    : undefined
                }
                currentUser={isAccountPayer || isSmartContractPayer}
                text="To"
              />
            ) : (
              <Box display="flex">
                <Hidden mdUp>
                  <Box width={40}>To</Box>
                </Hidden>
                <Box display="flex" alignItems="center" fontStyle="italic">
                  <Tooltip title="This request did not specify a payer. It can be paid by anybody using the payment link.">
                    <InfoOutlinedIcon
                      style={{ fontSize: 20, marginRight: 4 }}
                    />
                  </Tooltip>
                  <Typography>Open</Typography>
                </Box>
              </Box>
            )}
          </Box>
          <Box flex={1 / 10} className={classes.amount}>
            <Amount
              amount={request.amount}
              currency={request.currency}
              role={
                isAccountPayee || isSmartContractPayee
                  ? "payee"
                  : isAccountPayer || isSmartContractPayer
                  ? "payer"
                  : undefined
              }
            />
          </Box>
          <Box flex={3 / 10} className={classes.status}>
            {request.loaded ? (
              <RStatusBadge status={request.status} />
            ) : (
              <Skeleton
                animation="wave"
                variant="rect"
                height={32}
                width={100}
              />
            )}
          </Box>
          <Box flex={1 / 10} className={classes.viewButton}>
            <Link
              to={`/${request.requestId}`}
              style={{ textDecoration: "none" }}
            >
              <Typography variant="h5" style={{ color: "#00CC8E" }}>
                View request
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    );
  }
);

const SkeletonRow = () => {
  const classes = useStyles();
  return (
    <Box className={classes.row}>
      <Box className={classes.rowInner}>
        <Box flex={1 / 10}>
          <Skeleton animation="wave" width={100} />
        </Box>
        <Box flex={2 / 10} className={classes.payee}>
          <Skeleton animation="wave" width={200} />
        </Box>
        <Box flex={1 / 10} className={classes.payer}>
          <Skeleton animation="wave" width={200} />
        </Box>
        <Box flex={1 / 10}>
          <Skeleton animation="wave" width={100} className={classes.amount} />
        </Box>
        <Box flex={3 / 10} className={classes.status}>
          <Skeleton animation="wave" variant="rect" height={32} width={100} />
        </Box>
        <Box flex={1 / 10} className={classes.viewButton}>
          <Skeleton animation="wave" width={100} />
        </Box>
      </Box>
    </Box>
  );
};

export default ({
  requests,
  account,
  smartContractAddress,
  loading,
}: {
  requests?: IParsedRequest[];
  account?: string;
  smartContractAddress?: string;
  loading: boolean;
}) => {
  return (
    <Box display="flex" flexDirection="column" width="100%" height="100%">
      <Hidden smDown>
        <Box
          display="flex"
          justifyContent="space-around"
          borderBottom="2px solid #050B20"
          alignItems="center"
          style={{ backgroundColor: "white" }}
          height={48}
        >
          <Box flex={1 / 10}>
            <Typography variant="h5">Date</Typography>
          </Box>
          <Box flex={2 / 10}>
            <Typography variant="h5">From</Typography>
          </Box>
          <Box flex={1 / 10}>
            <Typography variant="h5">To</Typography>
          </Box>
          <Box flex={1 / 10}>
            <Typography variant="h5">Amount</Typography>
          </Box>
          <Box flex={3 / 10}>
            <Typography variant="h5">Status</Typography>
          </Box>
          <Box flex={1 / 10}></Box>
        </Box>
      </Hidden>
      {loading || !requests || !account ? (
        <>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      ) : requests.length > 0 ? (
        requests.map(request => (
          <Row
            key={request.requestId}
            request={request}
            account={account}
            smartContractAddress={smartContractAddress}
          />
        ))
      ) : (
        <Box display="flex" alignItems="center" flexDirection="column">
          <Spacer size={6} xs={12} />
          <Typography variant="body2">
            You don't have any requests yet.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
