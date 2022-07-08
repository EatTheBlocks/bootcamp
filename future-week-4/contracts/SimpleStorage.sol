//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

contract SimpleStorage {

	uint public storedData;

	constructor() {
   		storedData = 10;
	}

	function get() public view returns (uint) {
   		return storedData;
	}

	function set(uint x) public {
		storedData = x;
	}
}