import React from "react";
import Container from "react-bootstrap/esm/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <Navbar bg="primary" expand="lg" variant="dark">
      <Container>
        <Link to="/">
          <Navbar.Brand href="#">Ebay Dapp</Navbar.Brand>
        </Link>
        <Button variant="warning">+ Add New Auction</Button>
      </Container>
    </Navbar>
  );
};

export default Header;
