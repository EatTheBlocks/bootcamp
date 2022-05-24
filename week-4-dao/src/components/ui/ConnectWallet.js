import React, { useState } from "react"; // import useState
import Button from "react-bootstrap/Button";
import { useAccount, useConnect, useEnsName } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { FcApproval } from "react-icons/fc";

const ConnectWallet = () => {
  const { data: account } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  if (account)
    return (
      <div
        style={{ background: "#fff", padding: "4px 8px", borderRadius: "4px" }}
      >
        <FcApproval /> Connected to 0x...{account.address.slice(-4)}
      </div>
    );

  return (
    <Button variant="warning" onClick={() => connect()}>
      Connect Wallet
    </Button>
  );
};

export default ConnectWallet;
