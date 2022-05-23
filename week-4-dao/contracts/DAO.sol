// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

contract DAO {

  /**
	* DAO Contract
	* 1. Collects investor's money (ether)
	* 2. Keep track of investor's contributions with shares
	* 3. Allow investors to transfer shares
	* 4. Allow investment proposals to be created and voted
	* 5. Execute successful investment proposals (i.e send money)
	*/
	struct Proposal{
		uint id;
		string name;
		uint amount;
		address payable recipient;
		uint votes;
		uint end;
		bool exeuted;
	}

	mapping (address=>bool) public investors;
	mapping (address=>uint) public shares;
	mapping (uint=>Proposal) public proposals;
	mapping (address=> mapping(uint=>bool)) votes;
	
	uint public totalShares;
	uint public availableFunds;
	uint public contributionEnd;
	uint public nextProposalId;
	uint public voteTime;
	uint public quorum;
	address public admin;


    modifier onlyInvestors(){
		require(investors[msg.sender]==true,"Only investors can perform this activity");
		_;
	}
		
    constructor (uint contributionTime) {
        contributionEnd = block.timestamp + contributionTime;
    }

    function contribute () payable external {
        require (block.timestamp < contributionEnd,'Sorry contribution period to this DAO has ended');
        investors[msg.sender] = true;
        shares[msg.sender] += msg.value;
        totalShares += msg.value;
        availableFunds +=msg.value;

    }

    function redeem (uint amount) external{
         require( shares[msg.sender] >=amount, 'Insufficient shares available');
         require( shares[msg.sender] >=availableFunds, 'Insufficient shares available for transfer');
		 shares[msg.sender] -= amount;
        totalShares -= amount;
        availableFunds -= amount;
    }
 

    function transfer ( uint amount,address to) external{
     require( shares[msg.sender] >=amount, 'Insufficient shares available');
     shares[msg.sender] -= amount;
     investors[to] = true;
     shares[to] += amount;

    } 

	function createProposal (string memory name, uint amount, address payable recipient) external onlyInvestors(){
		require(availableFunds >= amount, 'Not enough funds');

		proposals[nextProposalId] = Proposal(
			nextProposalId,
			name,
			amount,
			recipient,
			0,
			block.timestamp+voteTime,
			false
		);
		
		availableFunds -=amount;
		nextProposalId++;
		
	}
	
	function vote (uint proposalId) external onlyInvestors(){
		Proposal storage proposal  = proposals[proposalId];
		require(votes[msg.sender][proposalId]==false,"Already voted for this proposal");
		require(block.timestamp< proposal.end, "Voting period has ended");
		proposal.votes+= shares[msg.sender];
		votes[msg.sender][proposalId]=true;
	}

}