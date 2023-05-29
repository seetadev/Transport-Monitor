import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import { RContainer, RFooter, Spacer, colors } from "request-ui";

const useStyles = makeStyles(theme => ({
  box: {
    boxShadow:
      "0px -4px 5px rgba(211, 214, 219, 0.5), 0px 4px 5px rgba(211, 214, 219, 0.5)",
    textAlign: "center",
    width: "100%",
    background: colors.background,
    [theme.breakpoints.up("sm")]: {
      width: 532,
      boxShadow: "unset",
      borderRadius: 4,
      boxSizing: "border-box",
    },
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: "#DE1C22",
    borderRadius: "50%",
    display: "inline-block",
  },
}));

const ErrorPage = ({
  topText,
  bottomText,
}: {
  topText: string | JSX.Element;
  bottomText?: string | JSX.Element;
}) => {
  const classes = useStyles();
  return (
    <RContainer>
      <Spacer size={10} xs={5} />
      <Box className={classes.box}>
        <Spacer size={40} xs={20} />
        <div className={classes.dot} />
        <Spacer size={10} xs={3} />
        <Typography variant="h5">
          {topText ? topText : "An error occured..."}
        </Typography>
        <Spacer size={2} xs={1} />
        <Typography variant="caption">
          {bottomText ? bottomText : "You might want to try again later..."}
        </Typography>
        <Spacer size={40} xs={20} />
      </Box>
      <Box flex={1} />
      <RFooter />
    </RContainer>
  );
};

export default ErrorPage;
