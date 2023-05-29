import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

const Ethereum = (props: SvgIconProps) => (
  <SvgIcon viewBox="0 0 256 417" {...props}>
    <g>
      <polygon
        fill="#343434"
        points="127.9611 0 125.1661 9.5 125.1661 285.168 127.9611 287.958 255.9231 212.32"
      />
      <polygon
        fill="#8C8C8C"
        points="127.962 0 0 212.32 127.962 287.959 127.962 154.158"
      />
      <polygon
        fill="#3C3C3B"
        points="127.9611 312.1866 126.3861 314.1066 126.3861 412.3056 127.9611 416.9066 255.9991 236.5866"
      />
      <polygon
        fill="#8C8C8C"
        points="127.962 416.9052 127.962 312.1852 0 236.5852"
      />
      <polygon
        fill="#141414"
        points="127.9611 287.9577 255.9211 212.3207 127.9611 154.1587"
      />
      <polygon
        fill="#393939"
        points="0.0009 212.3208 127.9609 287.9578 127.9609 154.1588"
      />
    </g>
  </SvgIcon>
);

const Polygon = (props: SvgIconProps) => (
  <SvgIcon viewBox="0 0 125 125" {...props}>
    <defs>
      <clipPath id="clip-path">
        <rect
          id="Rectangle_32"
          width="125"
          height="125"
          transform="translate(385 345)"
          fill="#fff"
        />
      </clipPath>
    </defs>
    <g id="favicon" transform="translate(-385 -345)">
      <g id="Mask_Group_3" clipPath="url(#clip-path)">
        <path
          id="Path_151"
          d="M91.487,31.85a7.794,7.794,0,0,0-7.605,0L66.434,41.97l-11.855,6.6L37.132,58.69a7.8,7.8,0,0,1-7.605,0L15.658,50.77a7.566,7.566,0,0,1-3.8-6.38V28.77a7.114,7.114,0,0,1,3.8-6.38l13.645-7.7a7.8,7.8,0,0,1,7.605,0l13.645,7.7a7.566,7.566,0,0,1,3.8,6.38V38.89l11.855-6.82V21.95a7.114,7.114,0,0,0-3.8-6.38L37.132,1.051a7.8,7.8,0,0,0-7.605,0L3.8,15.571A7.114,7.114,0,0,0,0,21.95V51.21a7.114,7.114,0,0,0,3.8,6.38l25.724,14.52a7.8,7.8,0,0,0,7.605,0l17.447-9.9,11.855-6.82,17.448-9.9a7.794,7.794,0,0,1,7.605,0l13.645,7.7a7.567,7.567,0,0,1,3.8,6.38v15.62a7.114,7.114,0,0,1-3.8,6.38l-13.645,7.92a7.8,7.8,0,0,1-7.605,0l-13.645-7.7a7.567,7.567,0,0,1-3.8-6.38V65.289l-11.855,6.82v10.12a7.114,7.114,0,0,0,3.8,6.38l25.724,14.52a7.8,7.8,0,0,0,7.605,0l25.724-14.52a7.567,7.567,0,0,0,3.8-6.38V52.97a7.114,7.114,0,0,0-3.8-6.38Z"
          transform="translate(387 354.939)"
          fill="#8247e5"
        />
      </g>
    </g>
  </SvgIcon>
);
const XDAI = (props: SvgIconProps) => (
  <SvgIcon viewBox="0 0 512 512" {...props}>
    <title>Logo_</title>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <path
        d="M40,298 L126,298 L126,384 L212,384 L212,470 L40,470 L40,298 Z M470,298 L470,470 L298,470 L298,384 L384,384 L384,298 L470,298 Z M212,40 L212,126 L40,126 L40,40 L212,40 Z M470,40 L470,126 L298,126 L298,40 L470,40 Z"
        fill="#48A9A6"
      ></path>
    </g>
  </SvgIcon>
);

export const chainIcons: Record<string, typeof SvgIcon> = {
  mainnet: Ethereum,
  matic: Polygon,
  xdai: XDAI,
  goerli: Ethereum,
};
