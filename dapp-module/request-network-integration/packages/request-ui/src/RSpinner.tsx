import React from 'react';
import { makeStyles } from '@material-ui/core';
import ArrowImage from './assets/img/arrow-xlg.png';

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative',
    padding: '2rem',
    overflow: 'hidden',
    transform: 'scale(0.5)',
  },
  '@global': {
    '@keyframes arrow-animation': {
      '0% ': {
        WebkitTransform: 'translate3d(-160%, 0, 0)',
        transform: 'translate3d(-160%,0,0) ',
      },
      '10% ': {
        WebkitTransform: 'translate3d(-160%, 0, 0)',
        transform: 'translate3d(-160%,0,0) ',
      },

      '35% ': {
        WebkitTransform: 'translate3d(-20%, 0, 0)',
        transform: 'translate3d(-20%, 0, 0)',
      },

      '65% ': {
        WebkitTransform: 'translate3d(20%, 0, 0)',
        transform: 'translate3d(20%, 0, 0)',
      },

      '90% ': {
        WebkitTransform: 'translate3d(160%, 0, 0)',
        transform: 'translate3d(160%, 0, 0)',
      },
      '100% ': {
        WebkitTransform: 'translate3d(160%, 0, 0)',
        transform: 'translate3d(160%, 0, 0)',
      },
    },
  },
  content: {
    width: 98,
    height: 114,
    WebkitTransform: 'rotate(-45deg)',
    MsTransform: 'rotate(-45deg)',
    transform: 'rotate(-45deg)',
  },
  arrow: {
    width: 98,
    paddingBottom: '58.40622%',
    position: 'relative',
    pointerEvents: 'none',
    '& svg': {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
    },
  },
  arrow1: {
    WebkitTransform: 'translate3d(-160%, 0, 0)',
    transform: 'translate3d(-160%, 0, 0)',
    WebkitAnimation: 'arrow-animation 1.2s infinite linear',
    animation: 'arrow-animation 1.2s infinite linear',
    '& svg': {
      WebkitTransform: 'rotate(180deg)',
      MsTransform: 'rotate(180deg)',
      transform: 'rotate(180deg)',
    },
  },
  arrow2: {
    WebkitTransform: 'translate3d(160%, 0, 0)',
    transform: 'translate3d(160%, 0, 0)',
    animation: 'arrow-animation reverse 1.2s infinite linear',
  },
}));

export const RSpinner = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={[classes.arrow, classes.arrow1].join(' ')}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1029 601"
            width="1029"
            height="601"
            preserveAspectRatio="xMaxYMid slice"
          >
            <defs>
              <mask
                maskUnits="userSpaceOnUse"
                id="arrow-xlg-mask"
                mask-type="alpha"
              >
                <image width="1029" height="601" href={ArrowImage} />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              fill="#00E6A0"
              width="100%"
              height="100%"
              mask="url(#arrow-xlg-mask)"
            />
          </svg>
        </div>
        <div className={[classes.arrow, classes.arrow2].join(' ')}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1029 601"
            width="1029"
            height="601"
            preserveAspectRatio="xMaxYMid slice"
          >
            <rect
              x="0"
              y="0"
              fill="#008C62"
              width="100%"
              height="100%"
              mask="url(#arrow-xlg-mask)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
