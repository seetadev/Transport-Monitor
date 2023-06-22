import React from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import { chainInfos } from 'request-shared';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  bottomLine: {
    borderBottom: '4px solid #FFB95F',
    width: '100%',
    maxWidth: 320,
    [theme.breakpoints.up('sm')]: {
      maxWidth: 'unset',
    },
  },
  textBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 180,
    height: 40,
    color: 'white',
    backgroundColor: '#FFB95F',
  },
}));

export const TestnetWarning = ({ chainId }: { chainId?: number | string }) => {
  const classes = useStyles();
  if (chainId && chainInfos[chainId]?.isTest) {
    return (
      <Box className={classes.container}>
        <Box className={classes.textBox}>
          <Typography variant="body1">Test Network</Typography>
        </Box>
        <Box className={classes.bottomLine} />
      </Box>
    );
  }
  return null;
};
