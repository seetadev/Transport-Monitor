import { FormikHelpers } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { isCancelError, useCreateRequest } from "request-shared";
import { useErrorReporter } from "request-ui";

import { useWeb3React } from "@web3-react/core";

import { CreateRequestForm, IFormData } from "../components/CreateRequest";
import { useConnectedUser } from "../contexts/UserContext";

const CreatePage = () => {
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
            createdWith: window.location.hostname,
          },
          currencyId: values.currency,
          payer: values.payer,
          paymentAddress: values.paymentAddress,
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
    <CreateRequestForm
      account={name || account || undefined}
      address={account || undefined}
      network={chainId}
      error={error}
      onSubmit={submit}
      loading={web3Loading}
    />
  );
};

export default CreatePage;
