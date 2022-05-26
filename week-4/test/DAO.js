const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAO Contract", () => {
  let DAO, DAOContract;
  const CONTRIBUTION_END_TIME = 500;
  const QUORUM = 60;
  const VOTE_TIME = 500;
  const CONTRIBUTED_AMOUNT = 1000;
  const PROPOSAL_NAME = "Test Proposal";
  const PROPOSAL_AMOUNT = 600;
  let RECIPIENT_ADDRESS;
  let investor, recipient;

  //   Deploy the contract
  beforeEach(async () => {
    DAO = await ethers.getContractFactory("DAO");
    [admin, investor, investor2, recipient] = await ethers.getSigners();
    DAOContract = await DAO.deploy(CONTRIBUTION_END_TIME, VOTE_TIME, QUORUM);
  });

  // Contribution
  describe("Valid Contribution", () => {
    beforeEach(async () => {
      await DAOContract.connect(investor).contribute({
        value: CONTRIBUTED_AMOUNT,
      });
    });

    it("Should issue shares to investors", async () => {
      expect(await DAOContract.shares(investor.address)).to.equal(
        CONTRIBUTED_AMOUNT
      );
    });

    it("Should add contributor as investor", async () => {
      expect(await DAOContract.investors(investor.address)).to.equal(true);
    });

    it("Should increase the total shares by the contributed amount", async () => {
      expect(await DAOContract.totalShares()).to.equal(CONTRIBUTED_AMOUNT);
    });

    it("Should increase the available funds by the contributed amount", async () => {
      expect(await DAOContract.availableFunds()).to.equal(CONTRIBUTED_AMOUNT);
    });

    it("Should add contributor as investor", async () => {
      expect(await DAOContract.investors(investor.address)).to.equal(true);
    });
  });

  describe("Contribution Expiry", () => {
    beforeEach(async () => {
      // Forward the EVM timestamp by CONTRIBUTION_END_TIME
      await ethers.provider.send("evm_increaseTime", [CONTRIBUTION_END_TIME]);
      await ethers.provider.send("evm_mine");
    });

    it("Should not accept any contributions after contribution period ends", async () => {
      await expect(
        DAOContract.connect(investor).contribute({ value: 1000 })
      ).to.be.revertedWith("Sorry contribution period to this DAO has ended");

      expect(await DAOContract.investors(investor.address)).to.equal(false);
      expect(await DAOContract.totalShares()).to.equal(0);
    });
  });

  // Redeem
  describe("Redeem Shares", () => {
    // Contribute
    beforeEach(async () => {
      await DAOContract.connect(investor).contribute({
        value: CONTRIBUTED_AMOUNT,
      });
    });

    it("Should allow to redeem less than contribution amount", async () => {
      await expect(DAOContract.connect(investor).redeem(CONTRIBUTED_AMOUNT - 1))
        .to.not.be.reverted;
    });

    it("Should allow to redeem equal to contribution amount", async () => {
      await expect(DAOContract.connect(investor).redeem(CONTRIBUTED_AMOUNT)).to
        .not.be.reverted;
    });

    it("Should not allow to redeem more than contribution amount", async () => {
      await expect(
        DAOContract.connect(investor).redeem(CONTRIBUTED_AMOUNT + 1)
      ).to.be.revertedWith("Insufficient shares available");
    });

    it("Should decrease investor's shares after redeem", async () => {
      const amount = CONTRIBUTED_AMOUNT - 500;
      await expect(DAOContract.connect(investor).redeem(amount)).to.not.be
        .reverted;

      await expect(await DAOContract.shares(investor.address)).to.be.equal(
        amount
      );
    });

    it("Should decrease total shares after redeem", async () => {
      const amount = CONTRIBUTED_AMOUNT - 500;
      await expect(DAOContract.connect(investor).redeem(amount)).to.not.be
        .reverted;

      await expect(await DAOContract.totalShares()).to.be.equal(amount);
    });

    it("Should decrease available funds after redeem", async () => {
      const amount = CONTRIBUTED_AMOUNT - 500;
      await expect(DAOContract.connect(investor).redeem(amount)).to.not.be
        .reverted;

      await expect(await DAOContract.availableFunds()).to.be.equal(amount);
    });
  });

  // Transfer
  describe("Transfer Shares", () => {
    // Contribute
    beforeEach(async () => {
      await DAOContract.connect(investor).contribute({
        value: CONTRIBUTED_AMOUNT,
      });
    });

    it("Should allow to transfer less than contribution amount", async () => {
      await expect(
        DAOContract.connect(investor).transfer(
          CONTRIBUTED_AMOUNT - 1,
          recipient.address
        )
      ).to.not.be.reverted;
    });

    it("Should allow to transfer equal to contribution amount", async () => {
      await expect(
        DAOContract.connect(investor).transfer(
          CONTRIBUTED_AMOUNT,
          recipient.address
        )
      ).to.not.be.reverted;
    });

    it("Should not allow to transfer more than contribution amount", async () => {
      await expect(
        DAOContract.connect(investor).transfer(
          CONTRIBUTED_AMOUNT + 1,
          recipient.address
        )
      ).to.be.revertedWith("Insufficient shares available");
    });

    describe("On Transfer Success", async () => {
      const amount = 250;
      const balance = CONTRIBUTED_AMOUNT - amount;

      // Transfer shares
      beforeEach(async () => {
        await expect(
          DAOContract.connect(investor).transfer(amount, recipient.address)
        ).to.not.be.reverted;
      });

      it("Should decrease investor's shares after transfer", async () => {
        await expect(await DAOContract.shares(investor.address)).to.be.equal(
          balance
        );
      });

      it("Should increase recipients's shares after transfer", async () => {
        await expect(await DAOContract.shares(recipient.address)).to.be.equal(
          amount
        );
      });

      it("Should not change total shares", async () => {
        await expect(await DAOContract.totalShares()).to.be.equal(
          CONTRIBUTED_AMOUNT
        );
      });
      it("Should not change available funds", async () => {
        await expect(await DAOContract.availableFunds()).to.be.equal(
          CONTRIBUTED_AMOUNT
        );
      });
    });
  });

  // Proposal
  describe("Proposal", () => {
    // Contribute
    beforeEach(async () => {
      RECIPIENT_ADDRESS = recipient.address;
      await DAOContract.connect(investor).contribute({
        value: CONTRIBUTED_AMOUNT,
      });
    });

    it("Should create a new proposal", async () => {
      await DAOContract.connect(investor).createProposal(
        PROPOSAL_NAME,
        PROPOSAL_AMOUNT,
        RECIPIENT_ADDRESS
      );

      const [id, name, amount, address] = await DAOContract.proposals(0);
      await expect(name).to.be.equal(PROPOSAL_NAME);
      await expect(amount).to.be.equal(PROPOSAL_AMOUNT);
      await expect(address).to.be.equal(RECIPIENT_ADDRESS);
    });

    it("Should only allow investors to create a proposal", async () => {
      await expect(
        DAOContract.connect(recipient).createProposal(
          PROPOSAL_NAME,
          PROPOSAL_AMOUNT,
          RECIPIENT_ADDRESS
        )
      ).to.be.revertedWith("Only investors can perform this activity");
    });

    it("Should not allow to create proposal more than available funds", async () => {
      await expect(
        DAOContract.connect(investor).createProposal(
          PROPOSAL_NAME,
          CONTRIBUTED_AMOUNT + 1,
          RECIPIENT_ADDRESS
        )
      ).to.be.revertedWith("Not enough funds");
    });
  });

  describe("Vote", () => {
    beforeEach(async () => {
      // Contribute
      RECIPIENT_ADDRESS = recipient.address;
      await DAOContract.connect(investor).contribute({
        value: CONTRIBUTED_AMOUNT,
      });

      //   Create proposal
      await DAOContract.connect(investor).createProposal(
        PROPOSAL_NAME,
        PROPOSAL_AMOUNT,
        RECIPIENT_ADDRESS
      );
    });

    it("Should allow to investors to vote", async () => {
      let proposal = await DAOContract.proposals(0);
      await DAOContract.connect(investor).vote(proposal.id);
      proposal = await DAOContract.proposals(0);

      await expect(proposal.votes).to.be.equal(CONTRIBUTED_AMOUNT);
    });

    it("Should allow not non investors to vote", async () => {
      let proposal = await DAOContract.proposals(0);
      await expect(
        DAOContract.connect(recipient).vote(proposal.id)
      ).to.be.revertedWith("Only investors can perform this activity");
    });

    it("Should allow not investor to vote more than once on same proposal", async () => {
      let proposal = await DAOContract.proposals(0);
      await DAOContract.connect(investor).vote(proposal.id);
      await expect(
        DAOContract.connect(investor).vote(proposal.id)
      ).to.be.revertedWith("Already voted for this proposal");
    });

    it("Should allow not investor to vote after voting period has ended", async () => {
      let proposal = await DAOContract.proposals(0);
      await ethers.provider.send("evm_increaseTime", [VOTE_TIME]);
      await ethers.provider.send("evm_mine");
      await expect(
        DAOContract.connect(investor).vote(proposal.id)
      ).to.be.revertedWith("Voting period has ended");
    });
  });

  //   Execute
  describe("Execute", () => {
    beforeEach(async () => {
      // Contribute Investor 1
      RECIPIENT_ADDRESS = recipient.address;
      await DAOContract.connect(investor).contribute({
        value: CONTRIBUTED_AMOUNT,
      });

      // Contribute Investor 2
      RECIPIENT_ADDRESS = recipient.address;
      await DAOContract.connect(investor2).contribute({
        value: CONTRIBUTED_AMOUNT,
      });

      //   Create proposal
      await DAOContract.connect(investor).createProposal(
        PROPOSAL_NAME,
        PROPOSAL_AMOUNT,
        RECIPIENT_ADDRESS
      );
    });

    it("Should allow admin execute proposal after sufficient votes", async () => {
      let proposal = await DAOContract.proposals(0);
      let expectedBalance = (await recipient.getBalance()).add(proposal.amount);
      await DAOContract.connect(investor).vote(proposal.id);
      await DAOContract.connect(investor2).vote(proposal.id);
      await DAOContract.connect(admin).executeProposal(proposal.id);
      expect(await recipient.getBalance()).to.be.eql(expectedBalance);
    });

    it("Should not allow to execute proposal with insufficient votes ", async () => {
      let proposal = await DAOContract.proposals(0);
      let expectedBalance = (await recipient.getBalance()).add(proposal.amount);
      await DAOContract.connect(investor).vote(proposal.id);
      await expect(
        DAOContract.connect(admin).executeProposal(proposal.id)
      ).to.be.revertedWith("Not enough votes to execute the proposal");
    });

    it("Should not allow non admin execute proposal", async () => {
      let proposal = await DAOContract.proposals(0);
      await expect(
        DAOContract.connect(investor).executeProposal(proposal.id)
      ).to.be.revertedWith("Only admin can perform this activity");
    });
  });

  //   Withdraw
  describe("Withdraw", () => {
    beforeEach(async () => {
      // Contribute Investor 1
      RECIPIENT_ADDRESS = recipient.address;
      await DAOContract.connect(investor).contribute({
        value: CONTRIBUTED_AMOUNT,
      });
    });

    it("Should allow admin to withdraw funds", async () => {
      let expectedBalance = (await recipient.getBalance()).add(
        CONTRIBUTED_AMOUNT
      );
      await DAOContract.connect(admin).withdraw(
        CONTRIBUTED_AMOUNT,
        RECIPIENT_ADDRESS
      );
      expect(await recipient.getBalance()).to.be.eql(expectedBalance);
    });

    it("Should not allow to withdraw more than available funds", async () => {
      await expect(
        DAOContract.connect(admin).withdraw(
          CONTRIBUTED_AMOUNT + 100,
          RECIPIENT_ADDRESS
        )
      ).to.be.revertedWith("Not enough funds");
    });

    it("Should not allow non admin to withdraw funds", async () => {
      await expect(
        DAOContract.connect(investor).withdraw(
          CONTRIBUTED_AMOUNT + 100,
          RECIPIENT_ADDRESS
        )
      ).to.be.revertedWith("Only admin can perform this activity");
    });
  });
});
