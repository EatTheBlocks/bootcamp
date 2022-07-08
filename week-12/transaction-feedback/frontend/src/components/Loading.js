import React from "react";
import Modal from "react-bootstrap/Modal";

const Loading = ({ showLoading = true }) => {
  return (
    <Modal show={showLoading}>
      <Modal.Header>
        <Modal.Title>Processing...</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Loading SVG Icon */}
        <svg
          width={40}
          version="1.1"
          id="L9"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 100 100"
          enableBackground="new 0 0 0 0"
        >
          <path
            fill="#000"
            d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              dur="1s"
              from="0 50 50"
              to="360 50 50"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        Please wait, your transaction is being mined...
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default Loading;
