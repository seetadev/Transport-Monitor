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
import { IParsedRequest, getPayUrl, useEnsName } from "request-shared";
import { Link } from "react-router-dom";
import { RStatusBadge, Spacer, CopyIcon } from "request-ui";
import Moment from "react-moment";
import { Skeleton } from "@material-ui/lab";
import { useClipboard } from "use-clipboard-copy";
import { CurrencyDefinition } from "@requestnetwork/currency";

const short = (val?: string) =>
  val
    ? val.length >= 20
      ? `${val.slice(0, 10)}...${val.slice(-10)}`
      : val
    : "";

const useAddressStyles = makeStyles(() => ({
  container: {
    display: "flex",
    width: "100%",
    height: 22,
    alignItems: "center",
    "& .copy": {
      display: "none",
    },
    "&:hover .copy": {
      display: "block",
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
  const { copied, copy } = useClipboard({
    copiedTimeout: 1000,
  });

  const [name] = useEnsName(address, { disabled: !!display });

  return (
    <Box className={classes.container}>
      {text && (
        <Hidden mdUp>
          <Box width={40}>{text}</Box>
        </Hidden>
      )}
      <Tooltip title={address || ""}>
        <Typography variant={currentUser ? "h5" : "body2"}>
          {display || name || short(address)}
        </Typography>
      </Tooltip>
      {address && (
        <IconButton className="copy" size="small" onClick={() => copy(address)}>
          {copied ? (
            <CheckIcon style={{ width: 16, height: 16 }} />
          ) : (
            <CopyIcon style={{ width: 16, height: 16 }} />
          )}
        </IconButton>
      )}
    </Box>
  );
};

const Amount = ({
  amount,
  currency,
  role,
}: {
  amount: number;
  currency: CurrencyDefinition;
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
      title={
        titleAmount !== displayAmount ? `${amount} ${currency.symbol}` : ""
      }
    >
      <Box
        color={role === "payee" ? "#008556" : role === "payer" ? "#DE1C22" : ""}
      >
        <Typography variant="h5">
          {role === "payer" ? <>-</> : <>+</>}&nbsp;
          {displayAmount} {currency.symbol}
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
  ({ request, account }: { request: IParsedRequest; account: string }) => {
    const classes = useStyles();
    const isPayee = !!account && account.toLowerCase() === request.payee;
    const isPayer = !!account && account.toLowerCase() === request.payer;
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
                currentUser={isPayee}
                text="From"
              />
            </Box>
          </Box>
          <Box flex={2 / 10} className={classes.payer}>
            <Spacer size={0} xs={2} />

            {request.payer ? (
              <Address
                address={request.payer}
                currentUser={isPayer}
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
              role={isPayee ? "payee" : isPayer ? "payer" : undefined}
            />
          </Box>
          <Box flex={2 / 10} className={classes.status}>
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
            {request.status !== "open" || isPayee || !request.loaded ? (
              <Link
                to={`/${request.requestId}`}
                style={{ textDecoration: "none" }}
              >
                <Typography variant="h5" style={{ color: "#00CC8E" }}>
                  View request
                </Typography>
              </Link>
            ) : (
              <a
                href={getPayUrl(request.requestId)}
                style={{ textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Typography variant="h5" style={{ color: "#00CC8E" }}>
                  Pay now
                </Typography>
              </a>
            )}
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
        <Box flex={2 / 10} className={classes.payer}>
          <Skeleton animation="wave" width={200} />
        </Box>
        <Box flex={1 / 10}>
          <Skeleton animation="wave" width={100} className={classes.amount} />
        </Box>
        <Box flex={2 / 10} className={classes.status}>
          <Skeleton animation="wave" variant="rect" height={32} width={100} />
        </Box>
        <Box flex={1 / 10} className={classes.viewButton}>
          <Skeleton animation="wave" width={100} />
        </Box>
      </Box>
    </Box>
  );
};

export const RequestList = ({
  requests,
  account,
  loading,
}: {
  requests?: IParsedRequest[];
  account?: string;
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
          <Box flex={2 / 10}>
            <Typography variant="h5">To</Typography>
          </Box>
          <Box flex={1 / 10}>
            <Typography variant="h5">Amount</Typography>
          </Box>
          <Box flex={2 / 10}>
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
          <Row key={request.requestId} request={request} account={account} />
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

export default RequestList;
