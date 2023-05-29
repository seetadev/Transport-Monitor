import { FormikHelpers } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { isCancelError, useCreateRequest } from "request-shared";
import { useErrorReporter, RLogo, Spacer } from "request-ui";
import { Box, Typography } from "@material-ui/core";

import { useWeb3React } from "@web3-react/core";

import { CreateRequestForm, IFormData } from "../components/CreateRequest";
import { useConnectedUser } from "../contexts/UserContext";

import { useGnosisSafe } from "../contexts/GnosisSafeContext";
import { IdentityTypes } from "@requestnetwork/types";

export default () => {
  const { safeInfo } = useGnosisSafe();
  const history = useHistory();
  const [error, setError] = useState<string>();
  const { account, chainId } = useWeb3React();
  const { loading: web3Loading, name } = useConnectedUser();
  const { report } = useErrorReporter();
  const createRequest = useCreateRequest();

  const submit = async (
    values: IFormData,
    helpers: FormikHelpers<IFormData>
  ) => {
    if (!account || !chainId) {
      throw new Error("not connected");
    }
    if (!values.amount) {
      throw new Error("amount not specified");
    }
    if (!values.currency) {
      throw new Error("currency not specified");
    }
    try {
      const request = await createRequest(
        {
          amount: values.amount,
          contentData: {
            reason: values.reason,
            builderId: "request-team",
            createdWith: "gnosis-safe",
          },
          currencyId: values.currency,
          payer: values.payer,
          paymentAddress: safeInfo!.safeAddress,
          // add the safeAddress in the topics to link it to the gnosis multisig
          topics: [
            {
              type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
              value: safeInfo!.safeAddress,
              // TODO: mistake in the interface topics should be any[] instead of string[]
            } as any,
          ],
        },
        account,
        chainId
      );
      // await request.waitForConfirmation();
      history.push(`/${request.requestId}`);
    } catch (e) {
      if (!isCancelError(e)) {
        setError(e.message);
        report(e);
      }
    }
  };
  return (
    <>
      <Box flex={1} padding="24px" paddingBottom={0}>
        <CreateRequestForm
          account={name || account || undefined}
          network={chainId}
          error={error}
          onSubmit={submit}
          loading={web3Loading}
        />
      </Box>
      <Box flex={1} padding="24px" display="flex" flexDirection="column">
        <Typography variant="subtitle1">Welcome to</Typography>
        <Spacer size={3} />
        <RLogo />
        <Spacer size={3} />
        <Typography variant="body2">
          1. Request cryptocurrency and get paid easily: put the amount, pick a
          token and precise the reason.
          <Spacer />
          2. Share the request to your client or friend directly, or enter their
          Ethereum reference (address or ENS)
          <Spacer />
          3. Get paid in a click
          <Spacer size={2} />
          No middleman, no more mistake.
        </Typography>
        <img style={{ width: 242, height: 136 }} src="./req01.png" />
      </Box>
    </>
  );
};
