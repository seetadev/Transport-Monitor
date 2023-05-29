import React from "react";
import { Spacer } from "request-ui";

import { Box, Typography } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import { Link as RouterLink } from "react-router-dom";

import RequestList from "../components/RequestList";
import {
  useRequestList,
  RequestListProvider,
} from "../contexts/RequestListContext";
import { useConnectedUser } from "../contexts/UserContext";
import { useGnosisSafe } from "../contexts/GnosisSafeContext";

export const NoRequests = () => {
  return (
    <Box textAlign="center" padding="16px" width="100%">
      <Spacer size={4} xs={12} />
      <Typography variant="h5">
        There are no requests associated with your wallet address.
      </Typography>
      <Spacer size={12} />
      <RouterLink to="/" style={{ color: "#001428" }}>
        <Typography variant="caption">Create a Request</Typography>
      </RouterLink>
    </Box>
  );
};

const Header = () => {
  return (
    <Box padding="24px" paddingBottom={0}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Your dashboard</Typography>
        <RouterLink to="/" style={{ color: "#008C73" }}>
          <Typography variant="caption">Create a new Request</Typography>
        </RouterLink>
      </Box>
    </Box>
  );
};

export const Dashboard = () => {
  const { account } = useWeb3React();
  const { loading: web3Loading } = useConnectedUser();
  const { safeInfo } = useGnosisSafe();
  const { requests, loading: requestsLoading } = useRequestList();

  if (!requestsLoading && requests?.length === 0) {
    return <NoRequests />;
  }

  return (
    <Box flex={1} borderRight="1px solid #E8E7E6;">
      <Header />
      <Box padding="24px">
        <RequestList
          requests={requests}
          account={account || undefined}
          smartContractAddress={safeInfo?.safeAddress || undefined}
          loading={web3Loading}
        />
      </Box>
    </Box>
  );
};

export default () => {
  return (
    <RequestListProvider>
      <Dashboard />
    </RequestListProvider>
  );
};
