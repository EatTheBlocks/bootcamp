import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
const AuctionDetail = () => {
  // State to store offers
  const [offers, setOffers] = useState([1, 3, 3, 3]);
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
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
              <hr />
              <Form className="form-inline" style={{ maxWidth: "400px" }}>
                <Row>
                  <Col>
                    <Form.Group controlId="offer">
                      <Form.Control
                        type="number"
                        required
                        placeholder="Enter offer"
                      />
                      <Form.Text className="text-muted">
                        Minimum offer is 20
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
              <small className="text-muted">Posted by:</small>
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
                  <td>Mark</td>
                  <td>Otto</td>
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
