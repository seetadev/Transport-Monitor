import * as React from 'react';

import { Box, Typography, Link, makeStyles } from '@material-ui/core';
import { RIcon } from './RIcon';
import { Spacer } from './Spacer';

const useStyles = makeStyles(() => ({
  link: {
    display: 'flex',
  },
}));

export const RFooter = () => {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      flex={1}
      justifyContent="flex-end"
      color="text.secondary"
    >
      <Box display="flex">
        <Typography variant="caption">Powered by</Typography>
        <div>&nbsp;</div>
        <Link
          href="https://request.network"
          color="textSecondary"
          underline="none"
          className={classes.link}
        >
          <RIcon />
          <div>&nbsp;</div>
          <Typography variant="caption">Request</Typography>
        </Link>
      </Box>
      <Spacer size={15} xs={10} />
    </Box>
  );
};
