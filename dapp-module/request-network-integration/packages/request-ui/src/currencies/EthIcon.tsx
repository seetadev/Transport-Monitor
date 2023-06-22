import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export const EthIcon: React.FC<SvgIconProps> = props => {
  return (
    <SvgIcon viewBox="0 0 28 28" {...props}>
      <circle id="Oval-2" fill="#7986CB" cx="14" cy="14" r="14"></circle>
      <g
        id="ethereum"
        strokeWidth="1"
        transform="translate(8.166667, 4.277778)"
        fill="#FFFFFF"
      >
        <polygon
          id="Shape"
          fillRule="nonzero"
          opacity="0.688616071"
          points="0.0343894477 9.58247421 5.80975415 12.9945706 5.80975415 0"
        />
        <polygon
          id="Shape"
          fillRule="nonzero"
          opacity="0.686328125"
          points="5.80975415 0 5.80975415 12.9945706 11.5828487 9.58247421"
        />
        <polygon
          id="Shape"
          fillRule="nonzero"
          opacity="0.800000012"
          points="0.0343894477 10.676706 5.80975415 18.8130689 5.80975415 14.0888024"
        />
        <polygon
          id="Shape"
          fillRule="nonzero"
          opacity="0.900000036"
          points="5.80975415 14.0888024 5.80975415 18.8130689 11.587389 10.676706"
        />
        <polygon
          id="Shape"
          fillRule="nonzero"
          opacity="0.698270089"
          points="5.80975415 6.95586377 0.0343894477 9.58247421 5.80975415 12.9945706 11.5828487 9.58247421"
        />
      </g>
    </SvgIcon>
  );
};
