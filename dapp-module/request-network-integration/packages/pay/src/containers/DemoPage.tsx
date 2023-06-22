/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Box,
  FormLabel,
  Switch,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Fab,
  TextField,
  Slider,
  ButtonGroup,
  ThemeProvider,
  createTheme,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import {
  PaymentPageInner,
  ErrorContainer,
  FeedbackContainer,
} from "./PaymentPage";
import { UnsupportedChainIdError, getWeb3ReactContext } from "@web3-react/core";
import { NoEthereumProviderError } from "@web3-react/injected-connector";
import { RequestContext, RequestStatus, IParsedRequest } from "request-shared";
import { Types } from "@requestnetwork/request-client.js";
import { CurrencyManager, CurrencyDefinition } from "@requestnetwork/currency";
import { ConnectorContext } from "../contexts/ConnectorContext";
import {
  PaymentContext,
  RequiresApprovalError,
  NotEnoughForGasError,
  NotEnoughForRequestError,
  FiatRequestNotSupportedError,
} from "../contexts/PaymentContext";
import Draggable from "react-draggable";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 10000,
  },
  field: {
    display: "flex",
    marginBottom: "10px",
    marginTop: "20px",
    justifyContent: "space-between",
  },
}));

const currencyManager = CurrencyManager.getDefault();
const currencies: Record<
  Types.RequestLogic.CURRENCY,
  CurrencyDefinition | undefined
> = {
  [Types.RequestLogic.CURRENCY.ERC20]: currencyManager.from("DAI"),
  [Types.RequestLogic.CURRENCY.BTC]: currencyManager.from("BTC"),
  [Types.RequestLogic.CURRENCY.ETH]: currencyManager.from("ETH"),
  [Types.RequestLogic.CURRENCY.ISO4217]: currencyManager.from("EUR"),
  [Types.RequestLogic.CURRENCY.ERC777]: undefined,
};

const paymentNetwork: Record<Types.RequestLogic.CURRENCY, string> = {
  [Types.RequestLogic.CURRENCY.ERC20]:
    Types.Extension.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT,
  [Types.RequestLogic.CURRENCY.ETH]:
    Types.Extension.PAYMENT_NETWORK_ID.ETH_INPUT_DATA,
  [Types.RequestLogic.CURRENCY.BTC]: "",
  [Types.RequestLogic.CURRENCY.ISO4217]: "",
  [Types.RequestLogic.CURRENCY.ERC777]: "",
};

const extensionValues = {
  [Types.RequestLogic.CURRENCY.ERC20]: {
    paymentAddress: "0x000000000000000000000000000000000000000",
    salt: "abcd",
  },
  [Types.RequestLogic.CURRENCY.BTC]: {
    paymentAddress: "1234",
  },
  [Types.RequestLogic.CURRENCY.ETH]: {
    paymentAddress: "0x000000000000000000000000000000000000000",
    salt: "abcd",
  },
  [Types.RequestLogic.CURRENCY.ISO4217]: {},
  [Types.RequestLogic.CURRENCY.ERC777]: {},
};

const errors: Record<string, Error> = {
  RequiresApprovalError: new RequiresApprovalError(),
  NotEnoughForRequestError: new NotEnoughForRequestError(),
  NotEnoughForGasError: new NotEnoughForGasError(),
  FiatRequestNotSupportedError: new FiatRequestNotSupportedError(),
  UnsupportedChainIdError: new UnsupportedChainIdError(4, [1]),
  NoEthereumProviderError: new NoEthereumProviderError(),
};
const errorsDescriptions: Record<string, string> = {
  "": "None",
  NoEthereumProviderError: "No Web3",
  UnsupportedChainIdError: "Network",
  RequiresApprovalError: "Approval",
  NotEnoughForRequestError: "Low Funds",
  NotEnoughForGasError: "Low Gas",
  FiatRequestNotSupportedError: "Fiat (EUR ⬆)",
};

let reasons: Record<number, string> = {};
const getReason = async (length: number) => {
  if (length === 0) return undefined;
  if (!reasons[length]) {
    const res = await Axios.get<string>(`https://baconipsum.com/api/`, {
      params: {
        type: "meat-and-filler",
        sentences: length,
        format: "text",
      },
    });
    reasons[length] = res.data;
  }
  return reasons[length];
};

const getRequest = async (state: IState): Promise<IParsedRequest> => {
  const currency = currencies[state.currencyType];
  if (!currency) {
    throw new Error(`no currency for ${state.currencyType}`);
  }
  return {
    requestId: "0x000000000000000000000000000000000000000",
    amount: Number(state.amount),
    balance: Number(state.amount) + 1,
    currency,
    currencyType: state.currencyType,
    status: state.status,
    createdDate: new Date(),
    paidDate:
      state.status === "paid" || state.status === "overpaid"
        ? new Date()
        : undefined,
    canceledDate: state.status === "canceled" ? new Date() : undefined,
    paymentAddress: "0x000000000000000000000000000000000000000",
    reason: await getReason(state.reasonLength),
    currencyNetwork: "goerli",
    currencySymbol: currency.symbol,
    payee: "0x0ebB3177F8959ae1F2e7935250Ff83Ba6A159049",
    raw: {
      currencyInfo: {
        type: state.currencyType,
        value:
          state.currencyType === Types.RequestLogic.CURRENCY.ERC20
            ? "0x995d6a8c21f24be1dd04e105dd0d83758343e258"
            : "",
        network: "goerli",
      },
      expectedAmount: "100000",
      extensions: {
        ["anything"]: {
          type: "payment-network",
          id: paymentNetwork[state.currencyType] || "",
          values: extensionValues[state.currencyType],
        },
      },
    } as any,
    network: state.testnet ? "goerli" : "mainnet",
  };
};

interface IState {
  connector: string;
  status: RequestStatus;
  error?: Error;
  reasonLength: number;
  active: boolean;
  loadingTime: number;
  amount: string;
  paying: boolean;
  approving: boolean;
  forceThrow: boolean;
  loading: boolean;
  currencyType: Types.RequestLogic.CURRENCY;
  debug: boolean;
  broadcasting: boolean;
  ens: boolean;
  testnet: boolean;
}

const defaultState: IState = {
  status: "open",
  reasonLength: 1,
  connector: "",
  active: false,
  loadingTime: 2500,
  amount: "1.234567",
  paying: false,
  approving: false,
  forceThrow: false,
  loading: true,
  currencyType: Types.RequestLogic.CURRENCY.ERC20,
  debug: false,
  broadcasting: false,
  ens: true,
  testnet: true,
};

const defaultTheme = createTheme({});

const DemoSettings = ({
  state,
  setState: set,
}: {
  state?: IState;
  setState: (state: Partial<IState>) => void;
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const reset = () => {
    window.localStorage.removeItem("demo");
    window.location.reload();
  };

  useEffect(() => {
    const openModal = (ev: KeyboardEvent) => {
      if (ev.key === "/" || ev.key === "?") setOpen(!open);
    };
    window.addEventListener("keydown", openModal);
    return () => {
      window.removeEventListener("keydown", openModal);
    };
  }, []);

  useEffect(() => {
    const storedState = window.localStorage.getItem("demo");
    if (storedState) {
      const { error, ...loadedState } = JSON.parse(storedState);
      set({
        ...loadedState,
        error: error && errors[error.name],
      });
    } else {
      set(defaultState);
    }
  }, []);

  useEffect(() => {
    if (state) {
      const {
        forceThrow,
        paying,
        approving,
        broadcasting,
        loading,
        connector,
        ...stateToSave
      } = state;
      window.localStorage.setItem("demo", JSON.stringify(stateToSave));
    }
  }, [state]);

  if (!state) {
    return <></>;
  }
  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth={true}>
        <DialogTitle>Demo Settings</DialogTitle>
        <DialogContent>
          <Box className={classes.field} alignItems="center">
            <FormLabel>Status</FormLabel>
            <ButtonGroup size="small" variant="contained">
              {["open", "pending", "paid", "overpaid", "canceled"].map(
                (status) => (
                  <Button
                    key={status}
                    onClick={() => set({ status: status as RequestStatus })}
                    color={state.status === status ? "primary" : undefined}
                  >
                    {status}
                  </Button>
                )
              )}
            </ButtonGroup>
          </Box>

          <Box className={classes.field} alignItems="center">
            <FormLabel>Currency</FormLabel>
            <ButtonGroup size="small" variant="contained">
              {Object.keys(currencies).map((c) => (
                <Button
                  key={c}
                  value={c}
                  color={c === state.currencyType ? "primary" : undefined}
                  onClick={(e) => set({ currencyType: c as any })}
                >
                  {currencies[c as Types.RequestLogic.CURRENCY]}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
          <Box
            className={classes.field}
            alignItems="flex-start"
            flexDirection="column"
          >
            <FormLabel>Error</FormLabel>
            <ButtonGroup size="small" variant="contained">
              {Object.keys(errorsDescriptions).map((err) => (
                <Button
                  key={err}
                  color={
                    (state.error?.name || "") === err ? "primary" : undefined
                  }
                  onClick={(e) => set({ error: errors[err] })}
                >
                  {errorsDescriptions[err]}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
          <Box className={classes.field} alignItems="center">
            <FormLabel>Metamask Connected</FormLabel>
            <Switch
              color="primary"
              checked={state.active}
              onChange={() => set({ active: !state.active })}
            />
          </Box>
          <Box className={classes.field} alignItems="center">
            <FormLabel>Amount</FormLabel>
            <TextField
              style={{ maxWidth: 150 }}
              size="small"
              value={state.amount}
              onChange={(e) => set({ amount: e.target.value })}
            />
          </Box>
          <Box
            className={classes.field}
            alignItems="flex-start"
            flexDirection="column"
          >
            <FormLabel>Reason</FormLabel>
            <Slider
              value={state.reasonLength}
              step={1}
              max={20}
              valueLabelDisplay="auto"
              marks={[
                {
                  value: 0,
                  label: "0",
                },
                {
                  value: 20,
                  label: "20",
                },
              ]}
              onChangeCommitted={(e, v) => set({ reasonLength: v as number })}
            />
          </Box>
          <Box
            className={classes.field}
            alignItems="flex-start"
            flexDirection="column"
          >
            <FormLabel>Loading time</FormLabel>
            <Slider
              value={state.loadingTime}
              min={0}
              max={5000}
              marks={[
                {
                  value: 0,
                  label: "0",
                },
                {
                  value: 5000,
                  label: "5s",
                },
              ]}
              valueLabelDisplay="auto"
              onChangeCommitted={(e, v) => set({ loadingTime: v as number })}
            />
          </Box>
          <Box className={classes.field} alignItems="center">
            <FormLabel>Force Throw</FormLabel>
            <Switch
              color="primary"
              checked={state.forceThrow}
              onChange={() => set({ forceThrow: !state.forceThrow })}
            />
          </Box>
          <Box className={classes.field} alignItems="center">
            <FormLabel>Debug</FormLabel>
            <Switch
              color="primary"
              checked={state.debug}
              onChange={() => set({ debug: !state.debug })}
            />
          </Box>
          <Box className={classes.field} alignItems="center">
            <FormLabel>ENS</FormLabel>
            <Switch
              color="primary"
              checked={state.ens}
              onChange={() => set({ ens: !state.ens })}
            />
          </Box>
          <Box className={classes.field} alignItems="center">
            <FormLabel>Testnet</FormLabel>
            <Switch
              color="primary"
              checked={state.testnet}
              onChange={() => set({ testnet: !state.testnet })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={reset} variant="outlined">
            Reset
          </Button>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Draggable>
        <Fab onClick={() => setOpen(true)} className={classes.fab}>
          <SettingsIcon />
        </Fab>
      </Draggable>
    </ThemeProvider>
  );
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const DemoPage = () => {
  const web3context = getWeb3ReactContext();
  const [request, setRequest] = useState<IParsedRequest>();
  const [state, setState] = useState<IState>();

  const set = (x: Partial<IState>) => {
    console.log(
      Object.keys(x).reduce((prev: any, curr: any) => {
        const oldValue = state ? (state as any)[curr] : "n/a";
        const newValue = x ? (x as any)[curr] : "n/a";
        prev[curr] = `${oldValue} => ${newValue}`;
        return prev;
      }, {})
    );
    if (state) {
      setState({
        ...state,
        ...x,
      });
    } else {
      setState(x as IState);
    }
  };

  const simulatePay = async () => {
    await sleep(2500);
    set({ broadcasting: true, paying: true });
    await sleep(15000);
    set({ broadcasting: true, paying: true, status: "pending" });
    await sleep(5000);
    set({ broadcasting: false, paying: false, status: "paid" });
  };

  const simulateApprove = async () => {
    await sleep(2500);
    set({ broadcasting: true, approving: true });
    await sleep(3000);
    set({ broadcasting: false, approving: false, error: undefined });
  };

  useEffect(() => {
    if (state?.paying) {
      simulatePay();
    }
  }, [state?.paying]);

  useEffect(() => {
    if (state?.approving) {
      simulateApprove();
    }
  }, [state?.approving]);

  useEffect(() => {
    if (state?.connector) {
      setTimeout(() => set({ active: true }), 2500);
    }
  }, [state?.connector]);

  useEffect(() => {
    if (!state) return;
    let canceled = false;

    getRequest(state).then((request) => {
      if (canceled) return;
      setTimeout(() => setRequest(request), state.loadingTime);
    });

    return () => {
      canceled = true;
    };
  }, [state]);

  useEffect(() => {
    if (state?.currencyType === Types.RequestLogic.CURRENCY.ISO4217) {
      set({ error: new FiatRequestNotSupportedError() });
    }
  }, [state?.currencyType]);

  return (
    <>
      <DemoSettings state={state} setState={set} />
      {state?.forceThrow ? (extensionValues as any)[12]["a"] : null}
      {state && (
        <RequestContext.Provider
          value={{
            counterCurrency: currencyManager.from("USD")!,
            counterValue: "1.00",
            request,
            loading: !request,
            setPending: () => {},
            update: () => Promise.resolve(),
          }}
        >
          <web3context.Provider
            value={{
              error: state.error,
              setError: (e) => set({ error: e }),
              activate: () => Promise.resolve(),
              active: state.active,
              deactivate: () => Promise.resolve(),
              account: "",
              chainId: 1,
            }}
          >
            <ConnectorContext.Provider
              value={{
                ready: true,
                activateConnector: (c) => set({ connector: c }),
                connectorName: state.connector,
                providerName: "",
              }}
            >
              <PaymentContext.Provider
                value={{
                  approving: state.approving,
                  paying: state.paying,
                  approve: () => set({ approving: true }),
                  pay: () => set({ paying: true }),
                  ready: true,
                  error: state.error,
                  broadcasting: state.broadcasting,
                  txHash: "abcd",
                }}
              >
                <FeedbackContainer />
                <ErrorContainer />
                <PaymentPageInner />
                {state.debug && <pre>{JSON.stringify(state)}</pre>}
              </PaymentContext.Provider>
            </ConnectorContext.Provider>
          </web3context.Provider>
        </RequestContext.Provider>
      )}
    </>
  );
};

export default DemoPage;
