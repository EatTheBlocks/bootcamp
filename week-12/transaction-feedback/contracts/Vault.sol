//SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

/// ============ Imports ============
import "hardhat/console.sol";

/// @title Vault
/// @notice Smart contract to store balance in a vault.
contract Vault {
    // 1. Allow users to send ether to this vault.
    // 2. Allow users to get their vault balance.

    /// ============ Mutable storage ============

    /// @notice List of account balances
    mapping(address => uint) public balance;

    /// ============ Functions ============

    ///@notice - Receive ethers sent to the contract.
    function deposit() external payable {
        balance[msg.sender] += msg.value;
    }

    /// @notice Get vault balance of an address.
    function getBalance() external view returns (uint) {
        return balance[msg.sender];
    }
}
