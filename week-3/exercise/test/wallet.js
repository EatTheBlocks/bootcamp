const { expect } = require('chai');
const { ethers, waffle } = require('hardhat');

describe('Wallet', function () {
  let wallet;
  let provider;

  beforeEach(async function () {
    [account0, account1, account2, account3, account4, account5, account6] =
      await ethers.getSigners();

    provider = waffle.provider;

    const Wallet = await ethers.getContractFactory('Wallet');

    wallet = await Wallet.deploy(
      [account0.address, account1.address, account2.address],
      2
    );

    await account0.sendTransaction({
      to: wallet.address,
      value: 1000
    });
  });

  it('should have correct number of approvers and quorum', async function () {
    const approvers = await wallet.getApprovers();
    const quorum = await wallet.quorum();

    expect(approvers.length).to.eq(3);

    expect(approvers[0]).to.eq(account0.address);
    expect(approvers[1]).to.eq(account1.address);
    expect(approvers[2]).to.eq(account2.address);

    expect(quorum.toString(), '2');
    // expect(quorum === 2);
  });

  it('should create transfers', async function () {
    await wallet.createTransfer(100, account5.address, {
      from: account0.address
    });
    const transfers = await wallet.getTransfers();

    expect(transfers.length).to.eq(1);
    expect(transfers[0].id.toString()).to.eq('0');
    expect(transfers[0].amount.toString()).to.eq('100');
    expect(transfers[0].to).to.eq(account5.address);
    expect(transfers[0].approvals.toString()).to.eq('0');
    expect(transfers[0].sent).to.eq(false);
  });

  it('should NOT create transfer if sender is not approved', async () => {
    await expect(
      wallet.connect(account4).createTransfer(100, account5.address)
    ).to.be.revertedWith('only an approver can call this function');
  });

  it('should increment approvals', async function () {
    await wallet.createTransfer(100, account5.address);

    await wallet.approveTransfer(0);

    const transfers = await wallet.getTransfers();

    const balance = await provider.getBalance(wallet.address);

    expect(transfers[0].approvals.toString()).to.eq('1');
    expect(transfers[0].sent).to.eq(false);
    expect(balance.toString()).to.eq('1000');
  });

  it('should send transfer if the quorum is met', async function () {
    const balanceBefore = ethers.BigNumber.from(
      await provider.getBalance(account6.address)
    );

    await wallet.connect(account0).createTransfer(100, account6.address);

    await wallet.connect(account0).createTransfer(100, account6.address);

    await wallet.connect(account0).approveTransfer(0);
    await wallet.connect(account1).approveTransfer(0);

    const balanceAfter = ethers.BigNumber.from(
      await provider.getBalance(account6.address)
    );

    expect(balanceAfter.sub(balanceBefore).toString()).to.eq('100');
  });

  it('should NOT approve transfer if sender is not approved', async () => {
    await wallet.connect(account0).createTransfer(100, account5.address);

    await expect(
      wallet.connect(account4).approveTransfer(0)
    ).to.be.revertedWith('only an approver can call this function');
  });

  it('should NOT approve transfer if transfer is already sent', async () => {
    await wallet.connect(account0).createTransfer(100, account6.address);
    await wallet.connect(account0).approveTransfer(0);
    await wallet.connect(account1).approveTransfer(0);

    await expect(
      wallet.connect(account2).approveTransfer(0)
    ).to.be.revertedWith('transfer has already been sent');
  });

  it('should NOT approve transfer twice', async () => {
    await wallet.connect(account0).createTransfer(100, account6.address);
    await wallet.connect(account0).approveTransfer(0);

    await expect(
      wallet.connect(account0).approveTransfer(0)
    ).to.be.revertedWith('transfer has already been approved');
  });

  it('should get the approvals by approver', async () => {
    await wallet.connect(account0).createTransfer(100, account4.address);
    await wallet.connect(account0).createTransfer(100, account5.address);
    await wallet.connect(account0).createTransfer(100, account6.address);

    await wallet.connect(account1).approveTransfer(0);
    await wallet.connect(account1).approveTransfer(2);

    const approvalsByApprovers = await wallet.getApprovalsByApprover(
      account1.address
    );

    expect(approvalsByApprovers.length.toString()).to.eq('3');
    expect(approvalsByApprovers[0]).to.eq(true);
  });
});
