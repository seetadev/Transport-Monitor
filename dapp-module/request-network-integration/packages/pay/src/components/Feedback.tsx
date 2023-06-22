import * as EmailValidator from "email-validator";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

import {
  Button,
  IconButton,
  makeStyles,
  Snackbar,
  SnackbarContent,
  TextField,
  Box,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";

import { useConnector } from "../contexts/ConnectorContext";
import { useDissmissable } from "request-ui";
import { useHubspotFeedback } from "../hooks/useHubspotFeedback";

const useStyles = makeStyles(theme => ({
  root: {
    width: 375,
    top: 60,
    [theme.breakpoints.down("xs")]: {
      top: 0,
      left: 0,
      width: "100%",
      position: "relative",
    },
  },
  snackContent: {
    backgroundColor: theme.palette.common.black,
    flexDirection: "column",
    fontSize: 14,
    justifyContent: "center",
    padding: 0,
    color: "rgba(255, 255, 255, 0.72)",
    width: "100%",

    [theme.breakpoints.down("xs")]: {
      borderRadius: 0,
    },
  },
  snackAction: {
    borderTop: "1px solid #E4E4E4",
    margin: "0",
    padding: "6px 0px",
    width: "100%",
    justifyContent: "center",
  },
  snackMessage: {
    width: "100%",
    padding: 16,
  },
  snackInnerContent: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: 600,
    marginBottom: "8px",
  },
  textField: {
    flex: 1,
  },
  input: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.7)",
    color: "#ffffff",
    fontSize: 14,
    "&::placeholder": {
      color: "rgba(255, 255, 255, 0.72)",
    },
  },
}));

const FeedbackWidget = ({
  title,
  message,
  actions,
  open,
  onClose,
  disabled,
}: {
  title: string;
  message?: any;
  actions?: any;
  open: boolean;
  disabled: boolean;
  onClose: () => void;
}) => {
  const classes = useStyles();
  const ref = useRef<HTMLDivElement>();
  const { opacity, ...dissmissableProps } = useDissmissable(ref, onClose);

  return (
    <Draggable {...dissmissableProps} disabled={disabled}>
      <Snackbar
        ref={ref}
        open={open}
        style={{
          opacity,
        }}
        className={classes.root}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <SnackbarContent
          classes={{
            action: classes.snackAction,
            message: classes.snackMessage,
          }}
          className={classes.snackContent}
          message={
            <Box className={classes.snackInnerContent}>
              <Box display="flex" flexDirection="column" flex={1}>
                <Box className={classes.title}>{title}</Box>
                <Box display="flex">{message}</Box>
              </Box>

              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                style={{ padding: 0 }}
                onClick={onClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          }
          action={actions}
        />
      </Snackbar>
    </Draggable>
  );
};

const Feedback = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const classes = useStyles();
  const { sendFeedback } = useHubspotFeedback();
  const [mood, setMood] = useState<"Good" | "Bad">();
  const [email, setEmail] = useState<string>();
  const [comment, setComment] = useState<string>();
  const [input, setInput] = useState<string>();
  const [invalidEmail, setInvalidEmail] = useState(false);

  const { providerName } = useConnector();

  const close = useCallback(async () => {
    onClose();
    if (mood && email === undefined && comment === undefined) {
      await sendFeedback({
        mood,
        comment: "",
        email: "",
        wallet: providerName,
      });
    }
  }, [mood, email, comment, onClose, sendFeedback, providerName]);

  const submitEmail = useCallback(() => {
    if (input) {
      if (EmailValidator.validate(input)) {
        setEmail(input);
        setInput("");
      } else {
        setInvalidEmail(true);
      }
    } else {
      setEmail("");
    }
  }, [input]);

  useEffect(() => {
    if (
      open &&
      mood !== undefined &&
      comment !== undefined &&
      email !== undefined
    ) {
      sendFeedback({ mood, comment, email, wallet: providerName });
      const t = setTimeout(onClose, 5000);
      return () => clearTimeout(t);
    }
  }, [mood, email, comment, sendFeedback, providerName, onClose, open]);

  useEffect(() => {
    const keypressed = (ev: KeyboardEvent) => {
      // CTRL+enter on comment
      if (
        ev.ctrlKey &&
        ev.code === "Enter" &&
        mood !== undefined &&
        comment === undefined
      ) {
        setComment(input);
        setInput("");
      } else if (
        ev.code === "Enter" &&
        comment !== undefined &&
        email === undefined
      ) {
        submitEmail();
      } else if (ev.code === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", keypressed);
    return () => {
      window.removeEventListener("keydown", keypressed);
    };
  }, [mood, email, comment, input, submitEmail, close]);

  useEffect(() => {
    if (invalidEmail && (!input || EmailValidator.validate(input))) {
      setInvalidEmail(false);
    }
  }, [input, invalidEmail]);

  if (!mood) {
    return (
      <FeedbackWidget
        title={"Help us improve Request"}
        actions={
          <>
            <Button onClick={() => setMood("Good")}>
              <span role="img" aria-label="Good">
                👍
              </span>
            </Button>
            <Button onClick={() => setMood("Bad")}>
              <span role="img" aria-label="Bad">
                👎
              </span>
            </Button>
          </>
        }
        message={"How would you rate your experience?"}
        open={open}
        onClose={close}
        disabled={!!mood && (email === undefined || comment === undefined)}
      />
    );
  }

  if (comment === undefined) {
    return (
      <FeedbackWidget
        title={"Any comments to help us improve?"}
        actions={""}
        message={
          <>
            <TextField
              value={input}
              autoFocus={true}
              multiline
              onChange={val => setInput(val.target.value)}
              className={classes.textField}
              size="small"
              InputProps={{
                disableUnderline: true,
                classes: {
                  input: classes.input,
                },
              }}
              placeholder="Enter your comments"
            />
            <Button
              onClick={() => {
                setComment(input || "");
                setInput("");
              }}
            >
              <SendIcon style={{ color: "#ffffff" }} />
            </Button>
          </>
        }
        open={open}
        onClose={close}
        disabled={!!mood && (email === undefined || comment === undefined)}
      />
    );
  }

  if (email === undefined) {
    return (
      <FeedbackWidget
        title="Thanks, we have received your feedback."
        message={
          <Box display="flex" flexDirection="column" width="100%">
            Can we contact you to learn more?
            <Box display="flex" width="100%" marginTop="8px">
              <TextField
                autoFocus={true}
                value={input}
                placeholder="Email address"
                onChange={val => setInput(val.target.value)}
                className={classes.textField}
                InputProps={{
                  classes: {
                    input: classes.input,
                  },
                  disableUnderline: true,
                }}
                size="small"
                error={invalidEmail}
                helperText={invalidEmail ? "Invalid email" : undefined}
              />
              <Button onClick={submitEmail}>
                <SendIcon style={{ color: "#ffffff" }} />
              </Button>
            </Box>
          </Box>
        }
        open={open}
        onClose={close}
        disabled={!!mood && (email === undefined || comment === undefined)}
      />
    );
  }

  return (
    <FeedbackWidget
      title="Your feedback is really appreciated, thank you!"
      open={open}
      onClose={close}
      disabled={!!mood && (email === undefined || comment === undefined)}
    />
  );
};

export default Feedback;
