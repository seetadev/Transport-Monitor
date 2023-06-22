import React from 'react';
import { Box, Divider, ListSubheader, MenuItem } from '@material-ui/core';
import { ChainInfo, chainInfos, useCurrency } from 'request-shared';
import * as currencyIcons from './currencies';

type Currency = { id: string; symbol: string; network?: string };

export const CurrencyPickerItem = ({
  currency,
  showNetwork,
}: {
  currency: Currency;
  showNetwork?: boolean;
}) => {
  const Icon = (currencyIcons as any)[currency.symbol.toUpperCase()];
  const text =
    'network' in currency && currency.network && showNetwork
      ? `${currency.symbol} (${chainInfos[currency.network].name})`
      : currency.symbol;

  return (
    <Box display="flex" alignItems="center">
      {Icon ? <Icon style={{ width: 18, height: 18, marginRight: 8 }} /> : null}{' '}
      {text}
    </Box>
  );
};

export const getCurrenciesForPicker = ({
  currencyFilter,
}: {
  currencyFilter?: (currency: Currency) => boolean;
}) => {
  const { currencyList } = useCurrency();

  const currenciesByNetwork = currencyList.reduce((prev, curr) => {
    if (!('network' in curr)) return prev;
    if (currencyFilter && !currencyFilter(curr)) return prev;
    const chain = chainInfos[curr.network];
    if (!chain) return prev;
    let net = prev.find(x => x.chain.id === curr.network);
    if (!net) {
      net = { chain, currencies: [] };
      prev.push(net);
    }
    net.currencies.push(curr);
    return prev;
  }, [] as { chain: ChainInfo; currencies: Currency[] }[]);

  return currenciesByNetwork.map(({ chain, currencies }) => {
    //const ChainIcon = chainIcons[chain.id];
    return [
      <ListSubheader
        key={chain.id}
        style={{
          lineHeight: '23px',
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: 10,
        }}
      >
        <Box display="flex" alignItems="center">
          {chain.name}
          {/* {ChainIcon && (
            <ChainIcon style={{ width: 12, height: 12, marginLeft: 8 }} />
          )} */}
        </Box>
      </ListSubheader>,
      <Divider />,
      currencies.map(currency => {
        return (
          <MenuItem key={currency.id} value={currency.id}>
            <CurrencyPickerItem currency={currency} />
          </MenuItem>
        );
      }),
    ];
  });
};
