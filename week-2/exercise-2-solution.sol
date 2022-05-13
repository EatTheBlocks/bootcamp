pragma solidity 0.8.13;

contract Wallet {
  address public owner;

  constructor(address owner) {
    owner = _owner;
  }

  function deposit() external payable {
  }

  function withdraw(address payable to, uint amount) external {
    require(msg.sender == owner, 'only owner');
    (bool success, ) = to.call{value: amount}('');
    require(success, 'Address: unable to send value, recipient may have reverted');
  }

  //If people send money directly
  receive() external payable {
  }
}
