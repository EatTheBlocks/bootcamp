const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Wallet", function () {
  let wallet, addresses;

  before(async() => {
    const Wallet = await ethers.getContractFactory("Wallet");
    const signers = await ethers.getSigners();
    addresses = await Promise.all([
      signers[0].getAddress(), 
      signers[1].getAddress(), 
      signers[2].getAddress(),
      signers[3].getAddress(),
      signers[4].getAddress(),
      signers[5].getAddress(),
    ]);
    wallet = await Wallet.deploy([addresses[0], addresses[1], addresses[2]], 2);
    await wallet.deployed();
  });

  it('should have correct approvers and quorum', async () => {
    const approvers = await wallet.getApprovers();
    const quorum = await wallet.quorum();
    expect(approvers.length === 3);
    expect(approvers[0] === addresses[0]);
    expect(approvers[1] === addresses[1]);
    expect(approvers[2] === addresses[2]);
    expect(quorum.toNumber() === 2);
  });

  it('should create transfers', async () => {
    await wallet.createTransfer(100, addresses[5]);
    const transfers = await wallet.getTransfers();
    expect(transfers.length === 1);
    expect(transfers[0].id === '0');
    expect(transfers[0].amount === '100');
    expect(transfers[0].to === addresses[5]);
    expect(transfers[0].approvals === '0');
    expect(transfers[0].sent === false);
  });
});
