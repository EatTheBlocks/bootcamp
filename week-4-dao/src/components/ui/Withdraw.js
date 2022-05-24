import { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { HiCollection } from "react-icons/hi";
import { DAOContract, showError } from "../../utils/common";
const Withdraw = () => {
  const [show, setShow] = useState(false);

  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState("");

  const withdraw = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await DAOContract().withdraw(amount, recipient);
    } catch (error) {
      showError(error);
    }
    handleClose();
  };

  return (
    <div>
      <Button className="mx-2" onClick={withdraw} variant="danger">
        <HiCollection size={20} /> Withdraw Funds
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Withdraw Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <Form.Group className="mb-2" controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="text"
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
              Withdraw
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Withdraw;
