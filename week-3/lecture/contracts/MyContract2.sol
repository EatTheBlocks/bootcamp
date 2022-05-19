pragma solidity 0.8.13;

contract MyContract2 {
  uint public myVar;

  function update(uint _myVar) external {
    myVar = _myVar;
  }
}
