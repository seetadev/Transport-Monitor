import React from "react";
import { Button, Link } from "@material-ui/core";
import { addEthereumChain, chainInfos } from "request-shared";
import { useWeb3React } from "@web3-react/core";

export const ChangeChainLink = ({
  chain,
  variant = "link",
}: {
  chain: string;
  variant?: "link" | "button";
}) => {
  const { library } = useWeb3React();

  const onClick = () => addEthereumChain(chain, library);
  const text = <>Change to {chainInfos[chain]?.name}</>;
  if (variant === "link")
    return (
      <Link style={{ cursor: "pointer" }} onClick={onClick}>
        {text}
      </Link>
    );
  return (
    <Button variant="contained" color="secondary" onClick={onClick}>
      {text}
    </Button>
  );
};
