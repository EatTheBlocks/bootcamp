const { expect } = require('chai');
const { ethers } = require('hardhat');

const { time } = require('@openzeppelin/test-helpers');

describe('Wallet', function () {
  const transferValue = ethers.utils.parseEther('1');
  const quorum = 2;
  const transferId = 0;

  let wallet;
  let approvers = [];
  let faucet;
  let to;
  let notApprovedSigner;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    approvers.push(signers[0]);
    approvers.push(signers[1]);
    approvers.push(signers[2]);
    to = signers[3];
    notApprovedSigner = signers[4];
    faucet = signers[5];

    const WalletContract = await ethers.getContractFactory('Wallet');
    wallet = await WalletContract.deploy(
      approvers.map((x) => x.address),
      quorum
    );
    await wallet.deployed();
  });

  describe('Create transfer', () => {
    it('Should NOT create transfer if not approver', async function () {
      const tx = wallet
        .connect(notApprovedSigner)
        .createTransfer(transferValue, to.address);
      await expect(tx).to.revertedWith('only approver allowed');
    });

    it('Should create transfer if approver', async function () {
      const tx = await wallet.createTransfer(transferValue, to.address);
      await tx.wait();

      const transfer = await wallet.transfers(transferId);
      expect(transfer.id).to.equal(transferId);
      expect(transfer.to).to.equal(to.address);
      expect(transfer.amount).to.equal(transferValue);
      expect(transfer.approvals).to.equal(0);
      expect(transfer.sent).to.equal(false);
    });
  });

  describe('Approve transfer', () => {
    beforeEach(async () => {
      const tx = await wallet.createTransfer(transferValue, to.address);
      await tx.wait();
    });

    it('Should NOT approve transfer if not approver', async function () {
      const tx = wallet.connect(notApprovedSigner).approveTransfer(transferId);
      await expect(tx).to.revertedWith('only approver allowed');
    });

    it('Should approve transfer if approver', async function () {
      const tx = await wallet.approveTransfer(transferId);
      await tx.wait();

      const hasApproved = await wallet.approvals(
        approvers[0].address,
        transferId
      );
      expect(hasApproved).to.true;

      const transfer = await wallet.transfers(transferId);
      expect(transfer.approvals).to.equal(1);
    });

    it('Should NOT approve transfer if address already approved', async function () {
      const tx = await wallet.approveTransfer(transferId);
      await tx.wait();

      const tx2 = wallet.approveTransfer(transferId);
      await expect(tx2).to.revertedWith('cannot approve transfer twice');
    });

    it('Should sent transfer after reaching quorum', async function () {
      // Arrange
      const toBalancePre = await ethers.provider.getBalance(to.address);
      const expectedToBalanceAfterTransfer = toBalancePre.add(transferValue);
      const transferEthers = await faucet.sendTransaction({
        to: wallet.address,
        value: transferValue,
      });
      await transferEthers.wait();

      // Act
      const tx = await wallet.approveTransfer(transferId);
      await tx.wait();

      const tx2 = await wallet
        .connect(approvers[1])
        .approveTransfer(transferId);
      await tx2.wait();

      // Assert
      const transfer = await wallet.transfers(transferId);
      expect(transfer.approvals).to.equal(2);
      expect(transfer.sent).to.true;

      const walletBalance = await ethers.provider.getBalance(wallet.address);
      expect(walletBalance).to.equal(0);

      const toBalancePost = await ethers.provider.getBalance(to.address);
      expect(toBalancePost).to.equal(expectedToBalanceAfterTransfer);
    });

    it('Should NOT approve transfer if already sent', async function () {
      const transferEthers = await faucet.sendTransaction({
        to: wallet.address,
        value: transferValue,
      });
      await transferEthers.wait();

      const tx = await wallet.approveTransfer(transferId);
      await tx.wait();

      const tx2 = await wallet
        .connect(approvers[1])
        .approveTransfer(transferId);
      await tx2.wait();

      const tx3 = wallet.connect(approvers[2]).approveTransfer(transferId);
      await expect(tx3).to.revertedWith('transfer has already been sent');
    });
  });

  describe('Getters', () => {
    it('Should return approvers', async function () {
      const walletApprovers = await wallet.getApprovers();
      expect(walletApprovers.length).to.equal(approvers.length);
      for (let i = 0; i < approvers.length; i++) {
        expect(walletApprovers[i]).to.equal(approvers[i].address);
      }
    });

    it('Should return transfers', async function () {
      const tx = await wallet.createTransfer(transferValue, to.address);
      await tx.wait();

      const transfers = await wallet.getTransfers();
      expect(transfers.length).to.equal(1);
      expect(transfers[0].id).to.equal(transferId);
      expect(transfers[0].to).to.equal(to.address);
      expect(transfers[0].amount).to.equal(transferValue);
      expect(transfers[0].approvals).to.equal(0);
      expect(transfers[0].sent).to.equal(false);
    });
  });
});
