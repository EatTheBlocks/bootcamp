import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Connect = () => {
  let navigate = useNavigate();

  /**
   * This function attempts to connect the Metamask wallet installed on the browser.
   */
  const connectWallet = async () => {
    // Attempt to connect to wallet
    if (window.ethereum) {
      // Request metamask account
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Navigate to dapp home page
        navigate("/home");
      } catch (e) {
        // Request account did not succeed, possibly user access denied.
        Swal.fire({
          icon: "error",
          title: "Wallet Access Denied",
          text: "We need access to Metamask Wallet to continue, please allow it.",
        });
      }
    } else {
      // Metamask not installed, ask user to install it.
      Swal.fire({
        icon: "error",
        title: "Wallet Not Found",
        text: "Metamask Wallet is required to use this application, please install it.",
      });
    }
  };

  return (
    <Card style={{ width: "30%", margin: "0 auto" }}>
      <Card.Img
        variant="bottom"
        src="https://logowik.com/content/uploads/images/metamask4112.jpg"
      />
      <Card.Body>
        <Card.Title>Connect Your Wallet</Card.Title>
        <Card.Text>
          Connect your metamask wallet to continue your this Dapp.
        </Card.Text>
        <Button onClick={connectWallet}>Connect Metamask</Button>
      </Card.Body>
    </Card>
  );
};

export default Connect;
