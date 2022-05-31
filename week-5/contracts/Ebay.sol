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
    // 4. Getter functions for the frontend.

    /// ============ Mutable storage ============

    /// @notice Auction struct
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

    /// @notice Offer struct
    struct Offer {
        uint256 id;
        uint256 auctionId;
        address buyer;
        uint256 offerPrice;
    }

    /// @notice List of all Offer
    mapping(uint256 => Offer) public offers;

    /// @notice Id of the next offer
    uint256 private nextOfferId = 1;

    /// @notice Mapping of sellers and their auctions
    mapping(address => uint256[]) private userAuctions;

    /// @notice Mapping of buyers and their offers
    mapping(address => uint256[]) private userOffers;

    /// ============ Modifiers ============

    /// @notice Ensure auction exists
    modifier auctionExists(uint256 _auctionId) {
        // Check if auctionId is valid
        require(
            _auctionId > 0 && _auctionId < nextAuctionId,
            "Auction does not exist"
        );
        _;
    }

    /// ============ Functions ============

    /// @notice Creates a new auction.
    /// @param _name — name of the auction.
    /// @param _description — auction description.
    /// @param _minimumOfferPrice — the minimum offer price this auction will accept.
    /// @param _duration — the duration, in seconds, for which the auction will accept offers.
    function createAuction(
        string calldata _name,
        string calldata _description,
        uint256 _minimumOfferPrice,
        uint256 _duration
    ) external {
        // Minimum offer price should be greater than 0
        require(
            _minimumOfferPrice > 0,
            "Minimum offer price should be greater than 0"
        );

        // Duration should be between 1 to 10 days
        require(
            _duration >= 1 days && _duration <= 10 days,
            "Duration should be between 1 to 10 days"
        );

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

        // Increment the auction counter
        nextAuctionId++;
    }

    /// @notice Creates a new offer for an auction.
    /// @param _auctionId - id of the auction
    function creatOffer(uint256 _auctionId)
        external
        payable
        auctionExists(_auctionId)
    {
        // Retrieve the auction
        Auction storage auction = auctions[_auctionId];

        // Check if auction has expired
        require(block.timestamp < auction.auctionEnd, "Auction expired");

        // Retrieve the best offer
        Offer storage bestOffer = offers[auction.bestOfferId];

        // price should be greater than minimum offer price
        require(
            msg.value >= auction.minimumOfferPrice &&
                msg.value > bestOffer.offerPrice,
            "Price should be greater than minimum offer price and the best offer"
        );

        // Update auction with new offer
        auction.bestOfferId = nextOfferId;

        // Create a new offer
        offers[nextOfferId] = Offer(
            nextOfferId,
            _auctionId,
            msg.sender,
            msg.value
        );

        auction.offerIds.push(nextOfferId);

        // Increment the offer counter
        nextOfferId++;
    }

    /// @notice Executes the auction trade.
    /// @param _auctionId - id of the auction.
    function trade(uint256 _auctionId) external auctionExists(_auctionId) {
        // Retrieve the auction
        Auction storage auction = auctions[_auctionId];

        // Retrieve the best offer
        Offer storage bestOffer = offers[auction.bestOfferId];

        // Check if auction is active
        require(
            block.timestamp > auction.auctionEnd,
            "Auction is still active"
        );

        // Loop through all the offers
        for (uint256 i = 0; i < auction.offerIds.length; i++) {
            uint256 offerId = auction.offerIds[i];
            Offer storage offer = offers[offerId];

            // Refund offer price of all offers except the best offer to corresponding buyer
            if (offerId != bestOffer.id) {
                payable(offer.buyer).transfer(offer.offerPrice);
            }
        }

        // Send winning offer price to the seller
        payable(auction.seller).transfer(bestOffer.offerPrice);
    }

    /// ============ Getter Functions ============

    /// @notice - List of all the auctions
    function getAuctions() external view returns (Auction[] memory) {
        Auction[] memory _auctions = new Auction[](nextAuctionId - 1);
        for (uint256 i = 1; i < nextAuctionId; i++) {
            _auctions[i - 1] = auctions[i];
        }
        return _auctions;
    }

    /// @notice - List of auctions for a seller
    /// @param _user - Seller address
    function getUserAuctions(address _user)
        external
        view
        returns (Auction[] memory)
    {
        uint256[] storage userAuctionIds = userAuctions[_user];
        Auction[] memory _auctions = new Auction[](userAuctionIds.length);
        for (uint256 i = 0; i < userAuctionIds.length; i++) {
            uint256 auctionId = userAuctionIds[i];
            _auctions[i] = auctions[auctionId];
        }
        return _auctions;
    }

    /// @notice - List of offers from a buyer
    /// @param _user - Buyer address
    function getUserOffers(address _user)
        external
        view
        returns (Offer[] memory)
    {
        uint256[] storage userOfferIds = userOffers[_user];
        Offer[] memory _offers = new Offer[](userOfferIds.length);
        for (uint256 i = 0; i < userOfferIds.length; i++) {
            uint256 offerId = userOfferIds[i];
            _offers[i] = offers[offerId];
        }
        return _offers;
    }
}
