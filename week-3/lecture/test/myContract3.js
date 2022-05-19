const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MyContract3', () => {
  it('Should transfer ether using deposit()', async () => {
    const MyContract3 = await ethers.getContractFactory('MyContract3');
    const myContract3 = await MyContract3.deploy();
    await myContract3.deployed();

    const tx = await myContract3.deposit(
      {value: ethers.utils.parseEther('1')}
    );
    await tx.wait();

    const balance = await ethers.provider.getBalance(myContract3.address);
    expect(balance.toString()).to.equal(ethers.utils.parseEther('1'));
  });

  it('Should transfer ether using receive()', async () => {
    const MyContract3 = await ethers.getContractFactory('MyContract3');
    const myContract3 = await MyContract3.deploy();
    await myContract3.deployed();

    const signers = await ethers.getSigners();
    const sender = signers[0];
    const tx = await sender.sendTransaction({
      to: myContract3.address,  
      value: ethers.utils.parseEther('1')
    });
    await tx.wait();

    const balance = await ethers.provider.getBalance(myContract3.address);
    expect(balance.toString()).to.equal(ethers.utils.parseEther('1'));
  });
});

describe('MyContract3 - refactored', () => {
  let myContract3;

  beforeEach(async () => {
    const MyContract3 = await ethers.getContractFactory('MyContract3');
    myContract3 = await MyContract3.deploy();
    await myContract3.deployed();
  });

  it('Should transfer ether using deposit()', async () => {
    const tx = await myContract3.deposit(
      {value: ethers.utils.parseEther('1')}
    );
    await tx.wait();

    const balance = await ethers.provider.getBalance(myContract3.address);
    expect(balance.toString()).to.equal(ethers.utils.parseEther('1'));
  });

  it('Should transfer ether using receive()', async () => {
    const signers = await ethers.getSigners();
    const sender = signers[0];
    const tx = await sender.sendTransaction({
      to: myContract3.address,  
      value: ethers.utils.parseEther('1')
    });
    await tx.wait();

    const balance = await ethers.provider.getBalance(myContract3.address);
    expect(balance.toString()).to.equal(ethers.utils.parseEther('1'));
  });
});
