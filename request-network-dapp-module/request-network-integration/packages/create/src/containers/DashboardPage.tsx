import React, { useEffect, useState } from "react";
import { Spacer, TestnetWarning, RButton } from "request-ui";

import {
  Box,
  Hidden,
  makeStyles,
  Fab,
  IconButton,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useWeb3React } from "@web3-react/core";
import { useHistory, Link } from "react-router-dom";

import CsvExport from "../components/CsvExport";
import { Filter } from "../components/Filter";
import RequestList from "../components/RequestList";
import {
  useRequestList,
  RequestListProvider,
} from "../contexts/RequestListContext";
import { useConnectedUser } from "../contexts/UserContext";
import NotLoggedPage from "./NotLoggedPage";
import Dot from "../components/Dot";

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: 1150,
    padding: "0 16px",
    [theme.breakpoints.up("md")]: {
      backgroundColor: "unset",
      padding: "unset",
    },
  },
  fab: {
    right: 16,
    position: "fixed",
    bottom: 16,
  },
}));

export const NoRequests = () => {
  return (
    <Box textAlign="center" padding="16px">
      <Spacer size={31} xs={12} />
      <Dot size={8} />
      <Spacer size={3} />
      <Typography variant="h4">
        There are no requests associated with your wallet address.
      </Typography>

      <Spacer size={12} />
      <Link to="/" style={{ textDecoration: "none " }}>
        <RButton sticky size="medium" color="secondary" style={{ width: 315 }}>
          <Box color="white">
            <Typography variant="h4">Create a request</Typography>
          </Box>
        </RButton>
      </Link>
    </Box>
  );
};

export const Dashboard = () => {
  const classes = useStyles();
  const { account, chainId } = useWeb3React();
  const { loading: web3Loading } = useConnectedUser();
  const {
    loading: requestsLoading,
    requests,
    filter,
    setFilter,
  } = useRequestList();
  const [firstLoad, setFirstLoad] = useState(true);
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      setFirstLoad(false);
    }, 1000);
  }, [firstLoad]);

  useEffect(() => {
    setFirstLoad(true);
  }, [filter]);

  if (!web3Loading && (!account || !chainId)) {
    return <NotLoggedPage />;
  }

  if (!requestsLoading && requests?.length === 0 && filter === "all") {
    return <NoRequests />;
  }

  return (
    <Box className={classes.container}>
      <Spacer size={24} xs={5} />
      <TestnetWarning chainId={chainId} />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flex={1}>
          {["All", "Outstanding", "Paid"].map((f, index) => (
            <Filter
              key={index}
              name={f}
              select={() => setFilter(f.toLowerCase())}
              active={f.toLowerCase() === filter}
            />
          ))}
        </Box>
        <Hidden xsDown>
          <CsvExport requests={requests} />
        </Hidden>
      </Box>
      <RequestList
        requests={firstLoad ? requests?.slice(0, 15) : requests}
        account={account || undefined}
        loading={web3Loading}
      />
      <Spacer size={24} />
      <Hidden smUp>
        <Fab className={classes.fab} color="secondary">
          <IconButton onClick={() => history.push("/")}>
            <AddIcon />
          </IconButton>
        </Fab>
      </Hidden>
    </Box>
  );
};

const DashboardPage = () => {
  return (
    <RequestListProvider>
      <Dashboard />
    </RequestListProvider>
  );
};

export default DashboardPage;
