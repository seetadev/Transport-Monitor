import React from 'react';
import {
  makeStyles,
  Button,
  ButtonTypeMap,
  ExtendButtonBaseTypeMap,
  CircularProgress,
} from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { OverrideProps } from '@material-ui/core/OverridableComponent';
import classnames from 'classnames';

import arrowRight from './assets/img/arrow_green.png';
import arrowLeft from './assets/img/arrow_white.png';

interface IProps
  extends Omit<
    OverrideProps<ExtendButtonBaseTypeMap<ButtonTypeMap>, 'a'>,
    'variant'
  > {
  children?: React.ReactNode;
  className?: string;
  size?: 'large' | 'medium';
  fullWidth?: boolean;
  loading?: boolean;
  direction?: 'right' | 'left';
  sticky?: boolean;
}

interface IAnimationProps {
  direction: 'right' | 'left';
}

const useAnimationStyles = makeStyles<Theme, IAnimationProps>({
  '@keyframes leftToRight': {
    '0%': {
      transform: 'translateX(0px)',
    },
    '100%': {
      transform: 'translateX(150%)',
    },
  },
  '@keyframes rightToLeft': {
    '0%': {
      transform: 'translateX(150%)',
    },
    '100%': {
      transform: 'translateX(0%)',
    },
  },
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  left: {
    animation: `$rightToLeft 2s linear infinite`,
  },
  right: {
    animation: `$leftToRight 2s linear infinite`,
  },
  img: {
    position: 'absolute',
    height: 155,
    left: -110,
    top: -37,
    transform: ({ direction }) =>
      direction === 'right' ? 'rotate(90deg)' : 'rotate(-90deg)',
  },
});

const ButtonAnimation = ({ direction }: IAnimationProps) => {
  const classes = useAnimationStyles({ direction });
  return (
    <div className={classnames(classes.root, classes[direction])}>
      <img
        src={direction === 'right' ? arrowRight : arrowLeft}
        className={classes.img}
      />
    </div>
  );
};

const useStyles = makeStyles<Theme, IProps>(theme => ({
  sticky: {
    position: 'sticky',
    bottom: 0,

    [theme.breakpoints.up('sm')]: {
      position: 'relative',
      bottom: 'unset',
    },
  },
  buttonRoot: {
    padding: ({ loading }) => (loading ? 0 : undefined),
  },
  ripple: {
    backgroundColor: '#050B20',
  },
}));

export const RButton = (props: IProps) => {
  const {
    size,
    sticky,
    loading,
    color,
    startIcon,
    fullWidth,
    className,
    direction,
    children,
    ...other
  } = props;
  const classes = useStyles(props);
  return (
    <Button
      href=""
      {...other}
      startIcon={!loading && startIcon}
      disableElevation
      fullWidth={fullWidth}
      className={classnames(classes.root, className, {
        [classes.sticky]: sticky,
      })}
      classes={{
        root: classes.buttonRoot,
      }}
      variant="contained"
      color={color}
    >
      {loading && direction && color === 'primary' && (
        <ButtonAnimation direction={direction} />
      )}
      {loading && color !== 'primary' && <CircularProgress />}
      {!loading && children}
    </Button>
  );
};
