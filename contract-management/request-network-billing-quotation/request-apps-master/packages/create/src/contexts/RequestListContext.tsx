import React, { useState, useEffect } from "react";
import { IParsedRequest, useListRequests } from "request-shared";
import { useWeb3React } from "@web3-react/core";

interface IContext {
  requests?: IParsedRequest[];
  loading: boolean;
  refresh: () => void;
  filter: string;
  setFilter: (val: string) => void;
}

const RequestListContext = React.createContext<IContext | null>(null);

const applyFilter = (
  requests: IParsedRequest[] | undefined,
  filter: string
) => {
  if (!requests) return undefined;
  if (filter === "all") return requests;
  if (filter === "outstanding")
    return requests.filter(x => x.status === "open");
  if (filter === "paid")
    return requests.filter(x => x.status === "paid" || x.status === "overpaid");
};

export const RequestListProvider: React.FC = ({ children }) => {
  const { account, chainId } = useWeb3React();
  const listRequests = useListRequests();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [requests, setRequests] = useState<IParsedRequest[]>();

  const [filter, setFilter] = useState("all");
  const [filteredRequests, setFilteredRequests] = useState<IParsedRequest[]>();

  useEffect(() => {
    setFilteredRequests(applyFilter(requests, filter));
  }, [filter, requests]);

  useEffect(() => {
    setFilteredRequests(undefined);
  }, [account, chainId]);

  useEffect(() => {
    let canceled = false;
    if (chainId && account) {
      setRequests(undefined);
      listRequests(account, chainId).then(result => {
        if (!canceled) {
          setRequests(result.requests);
          result.on("update", newRequest => {
            setRequests(prevRequests =>
              prevRequests?.map(request =>
                request.requestId === newRequest.requestId
                  ? newRequest
                  : request
              )
            );
          });

          result.loadBalances();
        }
      });
    }
    return () => {
      canceled = true;
    };
  }, [chainId, account, forceUpdate, listRequests]);
  return (
    <RequestListContext.Provider
      value={{
        requests: filteredRequests,
        loading: filteredRequests === undefined,
        refresh: () => setForceUpdate(!forceUpdate),
        filter,
        setFilter,
      }}
    >
      {children}
    </RequestListContext.Provider>
  );
};

export const useRequestList = () => {
  const context = React.useContext(RequestListContext);
  if (!context) {
    throw new Error("This hook must be used inside a RequestListProvider");
  }
  return context;
};
