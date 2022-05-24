import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import ConnectWallet from "../ui/ConnectWallet";
const NavBar = () => {
  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand>ETB DAO</Navbar.Brand>
        <Nav className="me-auto" variant="pills"></Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <ConnectWallet />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
