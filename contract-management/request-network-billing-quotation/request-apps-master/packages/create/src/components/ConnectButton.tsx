import React from "react";
import { makeStyles } from "@material-ui/core";
import { RButton } from "request-ui";
import classnames from "classnames";

const useStyles = makeStyles(theme => ({
  "@keyframes bounce": {
    "0%": {
      transform: "scale(1,1) translate(0px, 0px)",
    },

    "70%": {
      transform: "scale(1,1) translate(0px, 0px)",
    },

    "90%": {
      transform: "scale(1,1) translate(0px, -2px)",
    },

    "100%": {
      transform: "scale(1,1) translate(0px, 0px)",
    },
  },
  button: {
    width: "100%",
    top: -2,
    [theme.breakpoints.up("md")]: {
      width: "unset",
    },
  },
  animated: {
    [theme.breakpoints.up("sm")]: {
      animation: "$bounce 3.25s infinite",

      "&:hover": {
        animation: "none",
      },
      "&:clicked": {
        animation: "none",
      },
    },
  },
}));

const ConnectButton = ({
  onClick,
  connecting,
}: {
  connecting: boolean;
  onClick: () => void;
}) => {
  const classes = useStyles();
  const web3detected = !!window.ethereum;

  return (
    <RButton
      color="secondary"
      data-testid="connect-button"
      onClick={onClick}
      disabled={connecting || !web3detected}
      className={classnames(classes.button, {
        [classes.animated]: !connecting,
      })}
    >
      Connect a wallet
    </RButton>
  );
};
export default ConnectButton;
