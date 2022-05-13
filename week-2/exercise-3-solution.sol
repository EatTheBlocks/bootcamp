pragma solidity 0.8.13;

contract Array {
  uint[] public myArr;

  function create(uint val) external {
    myArr.push(val);
  }

  //Note: we could also check that the element exist before reading it
  function read(uint i) external view returns(uint) {
    return myArr[i];
  }

  //Note: we could also check that the element exist before updating
  function update(uint i, uint val) external {
    myArr[i] = val; 
  }

  //note: this will leave a hole in the array
  //it's also possible to shift the array to the left to remove the hole
  //but it's more work and uses more gas
  function destroy(uint i) external {
    delete myArr[i];
  }
}
