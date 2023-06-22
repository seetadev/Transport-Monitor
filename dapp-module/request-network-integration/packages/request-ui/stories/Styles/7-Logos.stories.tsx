import React from 'react';

import { RLogo, RIcon } from '../../';

export default {
  title: 'Styles/Logos',
};

export const Logos = () => {
  return (
    <>
      <p>
        <RLogo />
      </p>
      <p>
        <RLogo variant="blue" />
      </p>
    </>
  );
};

Logos.story = {
  name: 'Logo',
};

export const Icons = () => {
  return (
    <>
      <p>
        <RIcon />
      </p>
      <p>
        <RIcon dark />
      </p>
    </>
  );
};

Icons.story = {
  name: 'Icon',
};
