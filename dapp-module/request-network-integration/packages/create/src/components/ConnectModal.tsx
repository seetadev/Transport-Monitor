import React from "react";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Link,
  Box,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Spacer, RButton } from "request-ui";
import MetamaskIcon from "../assets/img/metamask.png";
import { Spinner } from "./Spinner";

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  link: {
    color: "#00CC8E",
    textDecorationLine: "underline",
  },
}));

export const ConnectModal: React.FC<{
  connecting: boolean;
  open: boolean;
  connect: () => void;
  onClose: () => void;
}> = ({ connect, connecting, open, onClose }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle disableTypography>
        {connecting ? (
          <></>
        ) : (
          <Typography variant="subtitle1">Sign in</Typography>
        )}

        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {connecting ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyItems="center"
            alignItems="center"
          >
            <Spinner style={{ width: 64, height: 64 }} />
            <Spacer size={8} />
            <Typography variant="body2">
              Please connect your MetaMask account...
            </Typography>
          </Box>
        ) : (
          <>
            <RButton
              color="default"
              fullWidth
              onClick={connect}
              data-testid="connect-metamask"
            >
              <Box
                display="flex"
                flex={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <img alt="" src={MetamaskIcon} width={48} height={48} />
                <Typography variant="caption">Metamask</Typography>
                <Box width={48} />
              </Box>
            </RButton>
            <Spacer size={12} />
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="caption">
                Is your favorite wallet not supported?
              </Typography>
              <Link
                href="https://share.hsforms.com/1SUDFJxJySliSedFiwifsfw2nz19"
                className={classes.link}
              >
                <Typography variant="caption">Let us know</Typography>
              </Link>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
