import "./App.css";

import { useEffect, useState } from "react";
import { getBlockchain, showError } from "./utils/common";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function App() {
  const [blockchain, setBlockchain] = useState({});
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);

  const init = async () => {
    //Connect to blockchain
    setBlockchain(await getBlockchain());

    // Get Account balance
    blockchain.vault && setBalance(await blockchain.vault.getBalance());
  };

  const deposit = async (e) => {
    e.preventDefault();
    try {
      await blockchain.vault.deposit({ value: depositAmount });
      setDepositAmount(0);
    } catch (error) {
      showError(error);
    }
  };

  useEffect(() => {
    // Auto connect the first time
    init();

    // Re initialize on account change

    window.ethereum?.on("accountsChanged", init);

    // Remove event listener on unmount
    return () => {
      window.ethereum?.removeListener("accountsChanged", init);
    };
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
    </Card>
  );
}

export default App;
