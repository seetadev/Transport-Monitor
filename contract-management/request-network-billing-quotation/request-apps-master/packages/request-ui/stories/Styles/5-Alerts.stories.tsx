import React from 'react';

import { RAlert } from '../../';

export default {
  title: 'Styles',
};

export const AlertStory = () => {
  return (
    <>
      <div>
        <p>
          <RAlert severity="success" message="Announcement text" />
        </p>
        <p>
          <RAlert severity="info" message="Announcement text" />
        </p>
        <p>
          <RAlert severity="warning" message="Announcement text" />
        </p>
        <p>
          <RAlert severity="error" message="Announcement text" />
        </p>
      </div>
    </>
  );
};

AlertStory.story = {
  name: 'Alerts',
};
