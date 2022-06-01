import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
const AuctionList = ({ blockchain }) => {
  // State to store auctions
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    (async () => {
      blockchain.ebay && setAuctions(await blockchain.ebay.getAuctions());
    })();
  }, [blockchain]);

  return (
    <Container>
      <Row className="my-5">
        <Col md={12}>
          <h3>All Auctions</h3>
        </Col>
        {auctions.map((auction) => (
          <Col md={12} className="mb-3" key={auction.id}>
            <Card>
              <Card.Body>
                <Card.Title>{auction.name}</Card.Title>
                <Card.Text>{auction.description}</Card.Text>
                <Link
                  to={`/auction/${auction.id}`}
                  state={{
                    auction: {
                      ...auction,
                      minimumOfferPrice: auction.minimumOfferPrice.toString(),
                      auctionEnd: new Date(
                        auction.auctionEnd * 1000
                      ).toString(),
                    },
                  }}
                >
                  <Button variant="primary">View</Button>
                </Link>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  Ends On:{" "}
                  <b>{new Date(auction.auctionEnd * 1000).toString()}</b>
                </small>
                <br />
                <small className="text-muted">
                  Posted by: <b>{auction.seller}</b>
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AuctionList;
