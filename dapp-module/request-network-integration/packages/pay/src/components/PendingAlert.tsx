import React from "react";
import { makeStyles, Box, Link, Typography } from "@material-ui/core";
import { RAlert } from "request-ui";
import { IParsedRequest, getEtherscanUrl } from "request-shared";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    margin: "0 12px",
    [theme.breakpoints.up("sm")]: {
      margin: 0,
    },
  },
}));

const PendingAlert = ({
  request,
  txHash,
}: {
  request: IParsedRequest;
  txHash: string;
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <RAlert
        severity="info"
        title="Why is this pending?"
        message="The payment is processing but taking longer than expected. You can check the estimated time remaining on Etherscan."
        actions={
          <Link
            href={`${getEtherscanUrl(request)}/tx/${txHash}`}
            target="_blank"
          >
            <Typography variant="h5">View on Etherscan</Typography>
          </Link>
        }
      />
    </Box>
  );
};

export default PendingAlert;
