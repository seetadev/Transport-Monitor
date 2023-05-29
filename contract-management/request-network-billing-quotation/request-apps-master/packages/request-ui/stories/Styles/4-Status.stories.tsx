import React from 'react';

import { RStatusBadge } from '../../';

export default {
  title: 'Styles',
};

export const StatusStory = () => {
  return (
    <>
      <div>
        <p>
          <RStatusBadge status="open" />
        </p>
        <p>
          <RStatusBadge status="paid" />
        </p>
        <p>
          <RStatusBadge status="overpaid" />
        </p>
        <p>
          <RStatusBadge status="canceled" />
        </p>
        <p style={{ marginTop: 100 }}>
          <RStatusBadge status="pending" />
        </p>
      </div>
    </>
  );
};

StatusStory.story = {
  name: 'Status',
};
