import "./App.css";

import { useEffect, useState } from "react";
import { getBlockchain, showError, showSuccess } from "./utils/common";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Loading from "./components/Loading";

function App() {
  const [blockchain, setBlockchain] = useState({});
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [showLoading, setShowLoading] = useState(false);

  const init = async () => {
    //Connect to blockchain
    setBlockchain(await getBlockchain());

    // Get Account balance
    blockchain.vault && setBalance(await blockchain.vault.getBalance());
  };

  const deposit = async (e) => {
    // Prevent form default submission
    // Read more: https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
    e.preventDefault();

    //Show loading dialog
    setShowLoading(true);

    // try sending the transaction
    try {
      // Send transaction
      const transaction = await blockchain.vault.deposit({
        value: depositAmount,
      });

      // Wait for the transaction to get mined
      await transaction.wait();

      // Hide the loading bar
      setShowLoading(false);

      // Show transaction success message along with etherscan transaction link
      // NOTE: Etherscan transaction links are only available for main net or test nets and NOT for
      //  contracts deployed on hardhat local node
      showSuccess(transaction);

      // Reset default deposit amount to 0
      setDepositAmount(0);
    } catch (error) {
      // Hide loading dialog
      setShowLoading(false);

      // Show error dialog
      showError(error);
    }
  };

  useEffect(() => {
    // Auto connect the first time
    init();
  });

  return (
    <Card style={{ margin: "20px" }}>
      <Card.Body>
        <Card.Title>Vault Account: {blockchain?.signerAddress}</Card.Title>
        <Card.Text>Balance: {balance.toString()}</Card.Text>
        <hr />
        <form onSubmit={deposit}>
          <input
            type="number"
            min="1"
            placeholder="Deposit amount"
            required
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />{" "}
          <Button variant="primary" type="submit">
            Deposit
          </Button>
        </form>
      </Card.Body>

      {/* Loading dialog */}
      <Loading showLoading={showLoading} />
    </Card>
  );
}

export default App;
