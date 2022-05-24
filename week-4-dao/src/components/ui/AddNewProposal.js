import { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { HiDocumentAdd } from "react-icons/hi";
import { DAOContract, showError } from "../../utils/common";

const AddNewProposal = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const add = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await DAOContract().createProposal(name, amount, recipient);
    } catch (error) {
      showError(error);
    }
    handleClose();
  };

  return (
    <div>
      <Button variant="primary" onClick={add} className="mx-2">
        <HiDocumentAdd size={20} /> Add New Proposal
      </Button>
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
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="recipient">
              <Form.Label>Recipient</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter recipient address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
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

export default AddNewProposal;
