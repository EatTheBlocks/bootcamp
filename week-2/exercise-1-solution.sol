pragma solidity 0.8.13;

contract MyContract {
  address public owner;

  constructor(address _owner) {
    owner = _owner;
  }

  function foo() external {
    require(msg.sender == owner, 'only owner');
    //Rest of the function
  }
}
