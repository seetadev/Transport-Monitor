import { RequestStatus } from 'request-shared';

export const colors = {
  statusText: '#456078',
  background: '#FAFAFA',
  subtext: '#656565',
  icon: '#656565',
  border: '#E4E4E4',
  footer: '#C4C4C4',
};

export const statusColors: Record<RequestStatus, string> = {
  open: '#FFF1BE',
  paid: '#D6F3E2',
  pending: '#CBBEFF',
  canceled: '#FFBEBE',
  overpaid: '#BEE8FF',
  waiting: '#D3D3D3',
};

export const alertColors = {
  success: '#D6F3E2',
  info: '#D7E1FE',
  warning: '#FFE1BE',
  error: '#F9D3D4',
};
