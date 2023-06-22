import React from 'react';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

import { RButton, RIcon } from '../../';
import { Typography, Button } from '@material-ui/core';

export default {
  title: 'Styles/Buttons',
};

export const NormalButtonStory = () => {
  return (
    <table>
      <tr>
        <th>Primary</th>
        <td style={{ width: 532 }}>
          <RButton color="primary" startIcon={<RIcon />} fullWidth>
            Pay now
          </RButton>
        </td>
      </tr>

      <tr>
        <th>Secondary</th>
        <td>
          <RButton color="secondary">Create a request</RButton>
        </td>
      </tr>
      <tr>
        <th>Default</th>
        <td>
          <RButton color="default" startIcon={<ArrowDownward />}>
            Download PDF receipt
          </RButton>
        </td>
      </tr>
    </table>
  );
};

NormalButtonStory.story = {
  name: 'Normal',
};

export const LoadingButtonStory = () => (
  <table>
    <tr>
      <th>Primary, Left</th>
      <td style={{ width: 532 }}>
        <RButton
          color="primary"
          startIcon={<RIcon />}
          loading
          fullWidth
          direction="left"
        >
          Pay now
        </RButton>
      </td>
    </tr>
    <tr>
      <th>Primary, Right</th>
      <td style={{ width: 532 }}>
        <RButton
          color="primary"
          startIcon={<RIcon />}
          loading
          fullWidth
          direction="right"
        >
          Pay now
        </RButton>
      </td>
    </tr>
    <tr>
      <th>Secondary</th>
      <td>
        <RButton color="secondary" loading>
          <Typography variant="caption">Create a request</Typography>
        </RButton>
      </td>
    </tr>
    <tr>
      <th>Default</th>
      <td>
        <RButton color="default" startIcon={<ArrowDownward />} loading>
          <Typography variant="h4">Download PDF receipt</Typography>
        </RButton>
      </td>
    </tr>
  </table>
);

LoadingButtonStory.story = {
  name: 'Loading',
};

export const DisabledButtonStory = () => (
  <table>
    <tr>
      <th>Primary</th>
      <td style={{ width: 532 }}>
        <RButton
          color="primary"
          startIcon={<RIcon />}
          disabled
          fullWidth
          direction="left"
        >
          Pay now
        </RButton>
      </td>
    </tr>
    <tr>
      <th>Secondary</th>
      <td>
        <RButton color="secondary" disabled>
          <Typography variant="caption">Create a request</Typography>
        </RButton>
      </td>
    </tr>
    <tr>
      <th>Default</th>
      <td>
        <RButton color="default" startIcon={<ArrowDownward />} disabled>
          <Typography variant="h4">Download PDF receipt</Typography>
        </RButton>
      </td>
    </tr>
  </table>
);

DisabledButtonStory.story = {
  name: 'Disabled',
};
