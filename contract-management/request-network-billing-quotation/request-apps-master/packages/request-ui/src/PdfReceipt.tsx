import * as React from 'react';
import Moment from 'react-moment';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
  Font,
  pdf,
  PDFViewer,
} from '@react-pdf/renderer';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import { Box, Typography } from '@material-ui/core';
import {
  IParsedRequest,
  RequestProvider,
  useRequest,
  getEtherscanUrl,
} from 'request-shared';
import { CurrencyDefinition } from '@requestnetwork/currency';

import { RButton } from './RButton';
import { statusLabels } from './RStatusBadge';
import { statusColors } from './colors';
import moment from 'moment';

interface IProps {
  request: IParsedRequest;
  counterCurrency: CurrencyDefinition;
  counterValue?: string;
}

const downloadFile = (function () {
  var a = document.createElement('a');
  document.body.appendChild(a);
  (a as any).style = 'display: none';
  return (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
})();

export const downloadPdf = async (props: IProps) => {
  const transactionUrl = props.request?.txHash
    ? getEtherscanUrl(props.request) + '/tx/' + props.request.txHash
    : '';

  const blob = await pdf(
    <PdfReceipt transactionUrl={transactionUrl} {...props} />
  ).toBlob();

  const date = moment(new Date()).format('YYYY.MM.DD');
  downloadFile(blob, `${date} RequestReceipt.pdf`);
};

export const ReceiptLink = (props: IProps) => {
  return (
    <RButton
      onClick={() => downloadPdf(props)}
      startIcon={<ArrowDownward />}
      color="default"
    >
      <Box color="text.primary">
        <Typography variant="h5">Download PDF receipt</Typography>
      </Box>
    </RButton>
  );
};

export const ReceiptPreview = () => {
  return (
    <RequestProvider>
      <RequestPreview />
    </RequestProvider>
  );
};

const RequestPreview = () => {
  const { request } = useRequest();

  const transactionUrl = request?.txHash
    ? getEtherscanUrl(request) + '/tx/' + request.txHash
    : '';
  if (!request) {
    return null;
  }
  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <PdfReceipt request={request} transactionUrl={transactionUrl} />
    </PDFViewer>
  );
};

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FAFAFA',
    padding: '40px 20px 48px 23px',
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '16px',
  },
  title: {
    marginBottom: 12,
    alignItems: 'flex-end',
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '24px',
  },
  headerRow: {
    marginBottom: 4,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerBodyText: {
    marginBottom: 4,
    color: '#656565',
  },
  status: {
    borderRadius: 4,
    minWidth: 74,
    height: 32,
    padding: '8px 24px',
    color: '#456078',
    fontWeight: 600,
  },
  caption: {
    marginBottom: 4,
    fontWeight: 600,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 80,
  },
  contentHeader: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomColor: '#050B20',
    borderBottomStyle: 'solid',
    borderBottomWidth: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentRow: {
    backgroundColor: 'white',
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E4E4E4',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
  },
  footer: {
    alignItems: 'center',
    color: '#656565',
  },
  testNetwork: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '110%',
    marginTop: -40,
    marginRight: -25,
    marginLeft: -25,
    marginBottom: 40,
  },
  testNetworkBanner: {
    height: 4,
    backgroundColor: '#FFB95F',
    width: '100%',
  },
  testNetworkText: {
    backgroundColor: '#FFB95F',
    color: 'white',
    height: 40,
    width: 180,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const PdfReceipt = ({
  request,
  transactionUrl,
}: {
  request: IParsedRequest;
  transactionUrl?: string;
}) => {
  Font.register({
    family: 'Inter',
    fonts: [
      {
        src: './fonts/Inter-Regular.ttf',
      },
      {
        src: './fonts/Inter-Medium.ttf',
        fontWeight: 600,
      },
    ],
  });
  const amountAndCurrency = request.amount.toString() + ' ' + request.currency;
  if (!['paid', 'overpaid', 'canceled'].includes(request.status))
    throw new Error(
      `Cannot download a receipt when request is ${request.status}`
    );
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {request.network === 'goerli' && (
          <View style={styles.testNetwork}>
            <View style={styles.testNetworkBanner} />
            <View style={styles.testNetworkText}>
              <Text>Goerli Test Network</Text>
            </View>
          </View>
        )}
        <View style={styles.title}>
          <Text>Receipt</Text>
        </View>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.caption}>From</Text>
            <Text style={styles.headerBodyText}>{request.payee}</Text>
          </View>
          <View
            style={{
              alignItems: 'flex-end',
            }}
          >
            <Text style={styles.headerBodyText}>
              Issued on{' '}
              <Moment element={Text} format="ll">
                {request.createdDate}
              </Moment>
            </Text>
            <Text
              style={[
                styles.headerBodyText,
                {
                  fontWeight: 600,
                  color: '#050B20',
                },
              ]}
            >
              Paid on{' '}
              <Moment element={Text} format="ll">
                {request.paidDate}
              </Moment>
            </Text>
          </View>
        </View>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.caption}>Billed to</Text>

            <Text style={styles.headerBodyText}>{request.payer || 'Open'}</Text>
          </View>

          <View>
            <Text
              style={{
                ...styles.status,
                backgroundColor: statusColors[request.status],
              }}
            >
              {statusLabels[request.status]}
            </Text>
          </View>
        </View>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.caption}>Paid by</Text>
            <Text style={styles.headerBodyText}>{request.paymentFrom}</Text>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={{ flex: 5 / 10 }}>Description</Text>
            <Text style={{ flex: 1 / 10 }}>Qty</Text>
            <Text style={{ flex: 2 / 10 }}>Unit price</Text>
            <Text style={{ flex: 2 / 10 }}>Amount</Text>
          </View>
          <View style={styles.contentRow}>
            <Text style={{ flex: 5 / 10 }}></Text>
            <Text style={{ flex: 1 / 10 }}>1</Text>
            <Text style={{ flex: 2 / 10 }}>{amountAndCurrency}</Text>
            <Text style={{ flex: 2 / 10 }}>{amountAndCurrency}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ flex: 6 / 10 }}></Text>
            <View style={[styles.contentRow, { flex: 4 / 10 }]}>
              <Text style={{ flex: 1 / 2 }}>Subtotal</Text>
              <Text style={{ flex: 1 / 2 }}>{amountAndCurrency}</Text>
            </View>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ flex: 6 / 10 }}></Text>
            <View
              style={[styles.contentRow, { flex: 4 / 10, fontWeight: 600 }]}
            >
              <Text style={{ flex: 1 / 2 }}>Paid</Text>
              <Text style={{ flex: 1 / 2 }}>{amountAndCurrency}</Text>
            </View>
          </View>
        </View>
        {request.reason ? (
          <View style={{ marginTop: 40 }}>
            <Text style={styles.caption}>Reason</Text>
            <Text style={styles.headerBodyText}>{request.reason}</Text>
          </View>
        ) : null}
        <View style={{ flex: 1 }} />
        <View style={styles.footer}>
          <Text>
            You can view your request online by clicking{' '}
            <Link
              src={`https://pay.request.network/${request.requestId}`}
              style={{ textDecoration: 'none', color: '#00CC8E' }}
            >
              here
            </Link>
            .
          </Text>
          {transactionUrl && (
            <Text style={{ marginTop: 4 }}>
              View your transaction on Etherscan{' '}
              <Link
                src={transactionUrl}
                style={{ textDecoration: 'none', color: '#00CC8E' }}
              >
                here
              </Link>
              .
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
};
