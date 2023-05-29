import React from "react";
import {
  makeStyles,
  Typography,
  TextField,
  Box,
  Button,
} from "@material-ui/core";
import { useClipboard } from "use-clipboard-copy";

import { Spacer } from "request-ui";
import { getPayUrl } from "request-shared";

const useStyles = makeStyles(theme => ({
  wrapper: {
    height: 48,
  },
  inputBase: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    height: 48,
    "& fieldset": {
      border: "1px solid #E4E4E4",
      borderRight: 0,
    },
    "&:hover": {
      "& fieldset": {
        borderColor: "#E4E4E4 !important",
        borderWidth: "1px !important",
      },
    },
    "&:focused": {
      "& fieldset": {
        borderColor: "#E4E4E4 !important",
        borderWidth: "1px !important",
      },
    },
  },
  notchedOutline: {
    borderColor: "#E4E4E4 !important",
    borderWidth: "1px !important",
  },
  button: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    height: 48,
    minHeight: 48,
    color: "white",
    border: 0,
    width: 119,
    minWidth: "unset",
  },
}));

const ShareRequest = ({ requestId }: { requestId: string }) => {
  const classes = useStyles();
  const { copied, copy } = useClipboard({
    copiedTimeout: 1500,
  });

  const url = getPayUrl(requestId);
  return (
    <>
      <Typography variant="h5">Share Request</Typography>
      <Spacer size={3} />
      <Box display="flex" className={classes.wrapper}>
        <TextField
          variant="outlined"
          value={url}
          InputProps={{
            className: classes.inputBase,
            classes: {
              notchedOutline: classes.notchedOutline,
            },
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          size="small"
          onClick={() => copy(url)}
        >
          {copied ? "COPIED!" : "COPY LINK"}
        </Button>
      </Box>
    </>
  );
};

export default ShareRequest;
