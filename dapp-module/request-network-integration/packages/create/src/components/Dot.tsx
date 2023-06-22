import React from "react";
import { makeStyles, Box, Theme, Tooltip } from "@material-ui/core";
import { chainInfos } from "request-shared";

interface IProps {
  account?: string;
  network?: number;
  size?: number;
}

const useStyles = makeStyles<Theme, IProps>(theme => ({
  dot: {
    height: ({ size }) => size ?? 18,
    width: ({ size }) => size ?? 18,
    backgroundColor: ({ account, network }) =>
      account && network ? chainInfos[network]?.color || "#DE1C22" : "#DE1C22",
    borderRadius: "50%",
    display: "inline-block",
  },
}));

const Dot = (props: IProps) => {
  const classes = useStyles(props);

  const title = props.network
    ? chainInfos[props.network]?.name || "Unsupported network"
    : "";

  return (
    <Tooltip title={title}>
      <Box className={classes.dot} />
    </Tooltip>
  );
};
export default Dot;
