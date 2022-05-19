pragma solidity 0.8.13;

contract MyContract5 {
  uint public start;

  constructor() {
    start = block.timestamp;
  }

  function foo() external {
    require(block.timestamp > start + 1000, 'too soon'); 
  }
}
