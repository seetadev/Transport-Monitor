import * as React from 'react';
import Moment from 'react-moment';

import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CommentIcon from '@material-ui/icons/Comment';
import { Skeleton } from '@material-ui/lab';

import { RequestStatus, useEnsName } from 'request-shared';
import { CurrencyDefinition } from '@requestnetwork/currency';

import { colors } from './colors';
import { Spacer } from './Spacer';
import { RStatusBadge } from './RStatusBadge';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    boxShadow:
      '0px -4px 5px rgba(211, 214, 219, 0.5), 0px 4px 5px rgba(211, 214, 219, 0.5)',
    textAlign: 'center',
    width: '100%',

    [theme.breakpoints.up('sm')]: {
      boxShadow: '0px 4px 5px rgba(211, 214, 219, 0.5)',
      borderRadius: 4,
      boxSizing: 'border-box',
    },
    '& p': {
      width: '100%',
      overflowWrap: 'break-word',
    },
  },

  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    paddingRight: 16,
    paddingLeft: 16,
    [theme.breakpoints.up('sm')]: {
      paddingRight: 40,
      paddingLeft: 40,
    },
  },
  from: {
    textOverflow: 'ellipsis',
    width: '100%',
    overflow: 'hidden',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: colors.background,
    paddingTop: 32,
    paddingBottom: 40,
    borderTop: '1px solid',
    borderColor: colors.border,
  },
  footer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: 24,
    paddingBottom: 40,
    paddingRight: 16,
    paddingLeft: 16,
    [theme.breakpoints.up('sm')]: {
      paddingRight: 40,
      paddingLeft: 40,
    },
    borderTop: '1px solid',
    borderColor: colors.border,
  },
  reason: {
    wordBreak: 'break-word',
  },
}));

interface IProps {
  payee: string;
  createdDate: Date;
  paidDate?: Date;
  canceledDate?: Date;
  status: RequestStatus;
  amount: string;
  overpaid: string;
  currency: CurrencyDefinition;
  reason?: string;
  counterValue?: string;
  counterCurrency: CurrencyDefinition;
}

export const RequestSkeleton = () => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Box className={classes.header} color="">
        <Typography variant="h5">Request for payment from</Typography>
        <Spacer />
        <Skeleton animation="wave" variant="text" width={400} />
      </Box>
      <Box className={classes.body}>
        <Skeleton animation="wave" variant="text" width={200} />
        <Spacer size={4} />
        <Skeleton animation="wave" variant="rect" width={75} height={32} />
        <Spacer size={3} />
        <Skeleton animation="wave" variant="text" width={100} height={36} />
        <Skeleton animation="wave" variant="text" width={70} height={20} />
      </Box>

      <Box className={classes.footer} color="text.secondary">
        <CommentIcon />
        <Spacer />
        <Skeleton width="30%" />
        <Skeleton width="60%" />
        <Skeleton width="40%" />
      </Box>
    </Box>
  );
};

export const RequestView = ({
  payee,
  paidDate,
  createdDate,
  canceledDate,
  status,
  amount,
  overpaid,
  currency,
  reason,
  counterValue,
  counterCurrency,
}: IProps) => {
  const classes = useStyles();

  const [payeeName] = useEnsName(payee);

  return (
    <Box className={classes.container}>
      <Box className={classes.header} color="">
        <Typography variant="h5">Request for payment from</Typography>
        <Spacer />
        <Box color="text.secondary" className={classes.from}>
          <Typography variant="caption">{payeeName || payee}</Typography>
        </Box>
      </Box>
      <Box className={classes.body}>
        <Box color="text.secondary">
          <Typography variant="body2">
            {paidDate ? 'Paid' : canceledDate ? 'Canceled' : 'Created'} on{' '}
            <Moment format="ll">
              {paidDate || canceledDate || createdDate}
            </Moment>
          </Typography>
        </Box>
        <Spacer size={4} />
        <RStatusBadge status={status} />
        <Spacer size={3} />
        <Typography variant="h3">
          {amount} {currency.symbol}
        </Typography>

        {counterValue && (
          <Box color="text.secondary">
            <Typography variant="body2">
              {counterCurrency} {counterValue}
            </Typography>
          </Box>
        )}
        {status === 'overpaid' && (
          <Box fontStyle="italic" color="text.primary">
            <Spacer size={2} />
            <Typography variant="body2">
              This request has been overpaid by {overpaid} {currency}
            </Typography>
          </Box>
        )}
      </Box>

      {reason && (
        <Box className={classes.footer} color="text.secondary">
          <CommentIcon />
          <Spacer />
          <Typography variant="caption" className={classes.reason}>
            {reason}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
