const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAO Contract", () => {
  let DAO, DAOContract;
  const CONTRIBUTION_END_TIME = 500;
  const CONTRIBUTED_AMOUNT = 1000;
  let investor, recipient;

  beforeEach(async () => {
    DAO = await ethers.getContractFactory("DAO");
    [investor, recipient] = await ethers.getSigners();
    DAOContract = await DAO.deploy(CONTRIBUTION_END_TIME);
  });

  describe("Valid Contribution", async () => {
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

  describe("Contribution Expiry", async () => {
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

  describe("Redeem Shares", async () => {
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

  describe("Transfer Shares", async () => {
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

  describe("dummy", () => {});

  describe("Proposal", async () => {
    // Contribute
    beforeEach(async () => {
      await DAOContract.connect(investor).contribute({
        value: CONTRIBUTED_AMOUNT,
      });
    });

    describe("Valid Proposal", async () => {
      const PROPOSAL_NAME = "Test Proposal";
      const PROPOSAL_AMOUNT = 600;
      const RECIPIENT_ADDRESS = recipient.address;

      beforeEach(async () => {
        await DAOContract.createProposal(
          PROPOSAL_NAME,
          PROPOSAL_AMOUNT,
          RECIPIENT_ADDRESS
        );
      });

      it("Should create a new proposal", async () => {
        const [id, name, amount, address] = await DAOContract.proposals(0);
        await expect(name).to.be.equal("");
        await expect(amount).to.be.equal(PROPOSAL_AMOUNT);
      });
    });

    // it("Should not allow to create proposal more than available funds", async () => {
    //   await expect(
    //     DAOContract.createProposal(
    //       "Test Proposal",
    //       CONTRIBUTED_AMOUNT + 1,
    //       recipient.address
    //     )
    //   ).to.be.revertedWith("Not enough fund");
    // });
  });
});
