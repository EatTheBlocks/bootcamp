import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { showError } from "../utils/common";

const AuctionDetail = ({ blockchain }) => {
  // State to store offers
  const [offers, setOffers] = useState([]);

  // State to store offer
  const [offer, setOffer] = useState(0);

  const location = useLocation();

  const { auction } = location.state;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await blockchain.ebay.createOffer(auction.id, { value: offer });
      setOffer(0);
    } catch (error) {
      showError(error);
    }
  };

  // Get all offers
  useEffect(() => {
    (async () => {
      try {
        blockchain.ebay &&
          setOffers(
            await blockchain.ebay.getUserOffers(blockchain.signerAddress)
          );
      } catch (error) {
        showError(error);
      }
    })();
  }, [blockchain]);

  return (
    <Container className="py-2">
      <Link to="/">
        <Button className="mb-2" variant="outline-primary">
          🔙 All Auctions
        </Button>
      </Link>

      <Row className="">
        <Col md={12} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>{auction.name}</Card.Title>
              <Card.Text>{auction.description}</Card.Text>
              <hr />
              <Form
                className="form-inline"
                style={{ maxWidth: "400px" }}
                onSubmit={handleSubmit}
              >
                <Row>
                  <Col>
                    <Form.Group controlId="offer">
                      <Form.Control
                        type="number"
                        required
                        value={offer}
                        onChange={(e) => setOffer(e.target.value)}
                        placeholder="Enter offer"
                      />
                      <Form.Text className="text-muted">
                        Minimum offer is {auction.minimumOfferPrice}
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Button variant="primary" type="submit">
                      Submit Offer
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">
                Ends On: <b>{auction.auctionEnd}</b>
              </small>
              <br />
              <small className="text-muted">
                Posted by: <b>{auction.seller}</b>
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Offer list */}
      <h4>All Offers</h4>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr>
                  <td>{offer.buyer}</td>
                  <td>{offer.offerPrice.toString()}</td>
                  <td align="right" className="py-10">
                    <Button>Trade</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default AuctionDetail;
