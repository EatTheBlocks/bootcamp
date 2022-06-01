import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
const AuctionList = () => {
  // State to store auctions
  const [auctions, setAuctions] = useState([1, 3, 3, 3]);
  return (
    <Container>
      <Row className="my-5">
        <Col md={12}>
          <h3>All Auctions</h3>
        </Col>
        {auctions.map((auction) => (
          <Col md={12} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Link to="/auction/1">
                  <Button variant="primary">View</Button>
                </Link>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Posted by:</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AuctionList;
