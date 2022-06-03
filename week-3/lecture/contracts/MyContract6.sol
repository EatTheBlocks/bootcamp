pragma solidity 0.8.13;

contract MyContract6 {
  event MyEvent(
    uint field1,
    uint field2
  );

  function foo(uint field1, uint field2) external {
    emit MyEvent(field1, field2);
  }
}
