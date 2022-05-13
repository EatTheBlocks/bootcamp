pragma solidity 0.8.13;

contract Mapping {
  mapping(uint => uint) public myMap;

  function create(uint key, uint val) external {
    myMap[key] = val;
  }

  //Note: even non-existing entry will return the default value of the
  //type, without errors
  function read(uint key) external view returns(uint) {
    return myMap[key];
  }

  //Note: same as the create function 
  function update(uint key, uint val) external {
    myMap[key] = val;
  }

  function destroy(uint key) external {
    delete myMap[key];
  }
}
