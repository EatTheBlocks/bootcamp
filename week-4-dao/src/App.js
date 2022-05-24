import Navbar from "./components/layout/Navbar";
import { WagmiConfig, createClient } from "wagmi";
import React, { useEffect, useState } from "react";
import AddNewProposal from "./components/ui/AddNewProposal";
import Container from "react-bootstrap/esm/Container";
import ProposalList from "./components/ui/ProposalList";
import Contribute from "./components/ui/Contribute";
import Header from "./components/layout/Header";

const client = createClient({
  autoConnect: true,
});
function App() {
  const startErrorLog = () => {
    window.onerror = (message, file, line, column, errorObject) => {
      column = column || (window.event && window.event.errorCharacter);
      var stack = errorObject ? errorObject.stack : null;

      console.log("error");

      var data = {
        message: message,
        file: file,
        line: line,
        column: column,
        errorStack: stack,
      };
      return false;
    };
  };

  useEffect(() => {
    startErrorLog();
  }, []);

  return (
    <WagmiConfig client={client}>
      <Navbar />
      <Container>
        <Header />
        <ProposalList />
      </Container>
    </WagmiConfig>
  );
}

export default App;
