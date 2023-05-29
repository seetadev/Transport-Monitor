import React from 'react';
import { SvgIcon, SvgIconProps, makeStyles, Theme } from '@material-ui/core';

interface IProps extends SvgIconProps {
  variant?: 'light' | 'dark';
}

const colors: Record<'light' | 'dark', [string, string]> = {
  light: ['#008c62', '#00e6a0'],
  dark: ['#001912', '#004422'],
};

const useStyles = makeStyles<Theme, IProps>(() => ({
  item1: { fill: ({ variant }) => colors[variant!][0] },
  item2: { fill: ({ variant }) => colors[variant!][1] },
  root: {
    width: ({ width }) => width,
    height: ({ height }) => height,
  },
}));

export const RIcon: React.FC<SvgIconProps & { variant?: string }> = props => {
  const classes = useStyles(props as IProps);
  return (
    <SvgIcon {...props} viewBox="0 0 129.7 141.16" className={classes.root}>
      <g>
        <path
          className={classes.item1}
          d="M87.65,79.31,123.07,44a14.07,14.07,0,0,0,4.14-10l.06-28.54a5.71,5.71,0,0,0-1.58-3.93L57.74,69.33a14.08,14.08,0,0,0,0,20l47.91,47.76a14.1,14.1,0,1,0,19.9-20Z"
        />
        <path
          className={classes.item2}
          d="M121.73,0H15C6.37,0,0,6.52,0,15.42V126.77a14.17,14.17,0,0,0,14.36,14.35h0a14.11,14.11,0,0,0,14.35-14.35V27.47h71l26-25.87A5.45,5.45,0,0,0,121.73,0Z"
        />
      </g>
    </SvgIcon>
  );
};

RIcon.defaultProps = {
  variant: 'light',
  width: 22,
  height: 22,
};
