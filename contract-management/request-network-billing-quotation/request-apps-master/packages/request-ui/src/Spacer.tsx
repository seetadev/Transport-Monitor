import React from 'react';
import { Box, Hidden } from '@material-ui/core';

export const Spacer = ({ size = 1, xs }: { size?: number; xs?: number }) => {
  if (xs) {
    return (
      <>
        <Hidden xsDown>
          <Spacer size={size} />
        </Hidden>
        <Hidden smUp>
          <Spacer size={xs} />
        </Hidden>
      </>
    );
  }
  return <Box height={size * 4} />;
};
