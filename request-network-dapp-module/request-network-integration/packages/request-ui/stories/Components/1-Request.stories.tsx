import React from 'react';
import { Box } from '@material-ui/core';

import { RequestView } from '../../';

export default {
  title: 'Components',
};

export const RequestStory = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      marginTop={10}
    >
      <Box width={532}>
        <RequestView
          payee="brice.eth"
          createdDate={new Date()}
          status="open"
          amount="0.01"
          currency="ETH"
          reason="Morning croissants"
          counterValue="2.04"
          counterCurrency="USD"
        />
      </Box>
    </Box>
  );
};

RequestStory.story = {
  name: 'Request',
};
