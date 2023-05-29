import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import { Spacer } from "request-ui";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  box: {
    textAlign: "center",
  },
}));

export default ({
  topText,
  bottomText,
}: {
  topText: string | JSX.Element;
  bottomText?: string | JSX.Element;
}) => {
  const classes = useStyles();
  return (
    <>
      <Box flex={1} borderRight="1px solid #E8E7E6;">
        <Box className={classes.box}>
          <Spacer size={10} xs={3} />
          <Typography variant="subtitle1">
            {topText ? topText : "An error occured..."}
          </Typography>
          <Spacer size={2} xs={1} />
          <Typography variant="caption">
            {bottomText ? bottomText : "You might want to try again later..."}
          </Typography>
          <Spacer size={2} xs={1} />
          <RouterLink to="/dashboard" style={{ color: "#001428" }}>
            <Typography variant="caption">Go to my dashboard</Typography>
          </RouterLink>
          <Spacer size={10} xs={3} />
        </Box>
      </Box>
      <Box flex={1} />
    </>
  );
};
