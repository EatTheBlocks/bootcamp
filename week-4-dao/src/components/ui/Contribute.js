import { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { HiCurrencyDollar } from "react-icons/hi";
import { DAOContract, showError } from "../../utils/common";

const Contribute = () => {
  const [show, setShow] = useState(false);

  const [amount, setAmount] = useState(0);

  const contribute = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await DAOContract().contribute({ value: amount });
    } catch (error) {
      showError(error);
    }
    handleClose();
  };
  return (
    <div>
      <Button className="mx-2" onClick={contribute}>
        <HiCurrencyDollar size={20} /> Contribute
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Contribute to ETB DAO</Modal.Title>
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
            <Button variant="primary" type="submit" className="mt-2">
              Contribute
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Contribute;
