import { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { HiChevronDoubleDown } from "react-icons/hi";
import { getBlockchain, showError } from "../../utils/common";
const Redeem = () => {
  const [show, setShow] = useState(false);

  const [amount, setAmount] = useState(0);

  const redeem = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { DAOContract, signerAddress } = await getBlockchain();
    try {
      await DAOContract.redeem(amount);
    } catch (error) {
      showError(error);
    }
    handleClose();
  };

  return (
    <div>
      <Button className="mx-2" onClick={redeem}>
        <HiChevronDoubleDown size={20} /> Redeem Shares
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Redeem Shares</Modal.Title>
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
              Redeem
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Redeem;
