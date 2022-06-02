import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { Form, Modal } from "react-bootstrap";
import { showError } from "../utils/common";

const Header = ({ blockchain }) => {
  const [show, setShow] = useState(false);

  //   Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minimumOfferPrice, setMinimumOfferPrice] = useState(0);
  const [duration, setDuration] = useState(0);

  const add = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await blockchain.ebay.createAuction(
        name,
        description,
        minimumOfferPrice,
        duration
      );
    } catch (error) {
      showError(error);
    }
    handleClose();
  };
  return (
    <div>
      <Navbar bg="primary" expand="lg" variant="dark">
        <Container>
          <Link to="/" className="navbar-brand">
            Ebay Dapp
          </Link>
          <Button variant="warning" onClick={add}>
            + Add New Auction
          </Button>
        </Container>
      </Navbar>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Proposal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <Form.Group className="mb-2" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter minimum offer price"
                value={minimumOfferPrice}
                onChange={(e) => setMinimumOfferPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="duration">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter duration"
                value={duration}
                min="86400"
                max="864000"
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              Create
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Header;
