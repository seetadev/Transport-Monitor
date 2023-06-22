import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { MuiThemeProvider } from '@material-ui/core';

import { theme } from '../src/RequestTheme';

addDecorator(storyFn => (
  <MuiThemeProvider theme={theme}>{storyFn()}</MuiThemeProvider>
));

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.(js|ts)x?$/), module);
