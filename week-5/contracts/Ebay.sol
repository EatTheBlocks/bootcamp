//SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

/// ============ Imports ============
import "hardhat/console.sol";

/// @title Ebay
/// @notice Smart contract for auction based market place.
contract Ebay {
    // 1. Allow sellers to create auctions.
    // 2. Allow buyers to  make offer for an auction.
    // 3. Allow buyer to accecpt the highest ofer at the end the auction.

    /// ============ Mutable storage ============

    /// @notice Auction structs
    struct Auction {
        uint256 id;
        address seller;
        string name;
        string description;
        uint256 minimumOfferPrice;
        uint256 auctionEnd;
        uint256 bestOfferId;
        uint256[] offerIds;
    }

    /// @notice List of all auctions
    mapping(uint256 => Auction) public auctions;

    /// @notice Id of the next auction
    uint256 private nextAuctionId = 1;

    /// @notice Creates a new auction.
    /// @param _name — name of the auction.
    /// @param _description — auction description.
    /// @param _minimumOfferPrice — the minimum offer price this auction will accept.
    /// @param _duration — the duration, in seconds, for which the auction will accept offers.
    function createOffer(
        string calldata _name,
        string calldata _description,
        uint256 _minimumOfferPrice,
        uint256 _duration
    ) public {
        uint256[] memory offerIds = new uint256[](0);

        auctions[nextAuctionId] = Auction(
            nextAuctionId,
            msg.sender,
            _name,
            _description,
            _minimumOfferPrice,
            block.timestamp + _duration,
            0,
            offerIds
        );
    }
}
