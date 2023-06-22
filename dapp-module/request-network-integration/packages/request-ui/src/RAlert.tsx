import React, { useState } from 'react';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import { makeStyles, Theme, Box, Typography, Link } from '@material-ui/core';
import { alertColors } from './colors';
import { AlertTitle, Alert } from '@material-ui/lab';

export type Severity = 'success' | 'info' | 'warning' | 'error';

interface IProps {
  severity: Severity;
  message: string | JSX.Element;
  title?: string;
  actions?: JSX.Element;
  link?: string;
  linkText?: string;
  onClose?: () => void;
}

const useStyles = makeStyles<Theme, IProps>(() => ({
  alert: {
    backgroundColor: ({ severity }) => alertColors[severity],
    top: 0,
    left: 0,
    borderRadius: 0,
    width: '100%',
    padding: '8px 18px',
    display: 'flex',
    // alignItems: 'center',
  },
  message: {
    padding: ({ actions }) => (actions ? '8px 0' : 0),
  },
  icon: {
    marginRight: 10,
    padding: 0,
    paddingTop: ({ actions }) => (actions ? 4 : undefined),
  },
  title: {
    marginBottom: 8,
  },
  action: {
    maxHeight: 32,
    paddingLeft: 0,
  },
}));

const iconMapping = {
  warning: <WarningRoundedIcon />,
  error: <ErrorRoundedIcon />,
  success: <CheckCircleRoundedIcon />,
  info: <InfoRoundedIcon style={{ color: '#2C5DE5' }} />,
};

export const RAlert = (props: IProps) => {
  const { severity, message, title, actions, link, linkText, onClose } = props;
  const classes = useStyles(props);
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <>
      <Alert
        severity={severity}
        iconMapping={iconMapping}
        color={severity}
        className={classes.alert}
        classes={{
          icon: classes.icon,
          message: classes.message,
          action: classes.action,
        }}
        onClose={() => {
          setOpen(false);
          if (onClose) onClose();
        }}
      >
        <Box color="text.primary">
          {title && (
            <AlertTitle>
              <Typography variant="h5">{title}</Typography>
            </AlertTitle>
          )}
          <Typography component="span" variant="body2">
            {message}
          </Typography>
          {linkText && (
            <Link style={{ marginLeft: 8 }} href={link} target="_blank">
              <Typography component="span" variant="h5">
                {linkText}
              </Typography>
            </Link>
          )}
        </Box>
      </Alert>
      {actions && (
        <Alert
          className={classes.alert}
          icon={<></>}
          color={severity}
          style={{ marginTop: 1, justifyContent: 'center' }}
        >
          {actions}
        </Alert>
      )}
    </>
  );
};
