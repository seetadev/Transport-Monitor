import React from 'react';
import { makeStyles, Box } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 0,
    margin: 'auto',
    width: '100%',
    background: 'linear-gradient(-68deg,#FAFAFA 35%,#ffffff 0%)',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.up('sm')]: {
      width: 532,
      background: '#FAFAFA',
    },
  },
}));
export const RContainer: React.FC = ({ children }) => {
  const classes = useStyles();

  return <Box className={classes.container}>{children}</Box>;
};
