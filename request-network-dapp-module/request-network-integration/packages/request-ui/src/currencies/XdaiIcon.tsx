import React from "react";
import { makeStyles, SvgIcon, SvgIconProps } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  st0: {
    fillRule: "evenodd",
    clipRule: "evenodd",
    fill: "#48A9A6",
  },
  st1: {
    fillRule: "evenodd",
    clipRule: "evenodd",
    fill: "#FFFFFF",
  },
}));

export const XdaiIcon: React.FC<SvgIconProps> = (props) => {
  const classes = useStyles();
  return (
    <SvgIcon viewBox="0 0 256 255.8" {...props}>
      <path
        id="Fill-1"
        className={classes["st0"]}
        d="M128,0c70.6,0,128,57.3,128,127.9s-57.4,127.9-128,127.9S0,198.5,0,127.9S57.4,0,128,0z"
      />
      <polygon
        id="Fill-2"
        className={classes["st1"]}
        points="62.3,88.6 114.9,88.6 114.9,62.3 62.3,62.3 			"
      />
      <polygon
        id="Fill-3"
        className={classes["st1"]}
        points="141.1,88.6 193.7,88.6 193.7,62.3 141.1,62.3 			"
      />
      <polygon
        id="Fill-4"
        className={classes["st1"]}
        points="193.7,141.1 167.4,141.1 167.4,167.4 141.1,167.4 141.1,193.7 193.7,193.7 			"
      />
      <polygon
        id="Fill-5"
        className={classes["st1"]}
        points="114.9,193.7 114.9,167.4 88.6,167.4 88.6,141.1 62.3,141.1 62.3,193.7 			"
      />
    </SvgIcon>
  );
};
