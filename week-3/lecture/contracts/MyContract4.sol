pragma solidity 0.8.13;

contract MyContract4 {
  address public owner;

  constructor() {
    owner = msg.sender;
  }

  function foo() external {
    require(msg.sender == owner, 'only owner');
  }

  function bar(uint myVar) external {
    require(myVar == 1, 'myVar must be 1');
  }

  function baz(uint myVar) external {
    require(msg.sender == owner, 'only owner');
    require(myVar == 1, 'myVar must be 1');
  }
}
