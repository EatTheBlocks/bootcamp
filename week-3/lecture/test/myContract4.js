const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MyContract4', () => {
  let myContract4;

  beforeEach(async () => {
    const MyContract4 = await ethers.getContractFactory('MyContract4');
    myContract4 = await MyContract4.deploy();
    await myContract4.deployed();
  });

  it('Should execute foo', async () => {
    const tx = await myContract4.foo();
    await tx.wait();
  });

  it('Should NOT execute foo', async () => {
    const signers = await ethers.getSigners();
    const tx = myContract4.connect(signers[1]).foo();
    await expect(tx)
      .to.be.revertedWith('only owner');
  });

  it('Should execute bar', async () => {
    const tx = await myContract4.bar(1);
    await tx.wait();
  });

  it('Should NOT execute bar', async () => {
    const tx = myContract4.bar(2);
    await expect(tx)
      .to.be.revertedWith('myVar must be 1');
  });

  it('Should execute baz', async () => {
    const tx = await myContract4.baz(1);
    await tx.wait();
  });

  it('Should NOT execute baz if sender not owner', async () => {
    const signers = await ethers.getSigners();
    const tx = myContract4.connect(signers[1]).baz(1);
    await expect(tx)
      .to.be.revertedWith('only owner');
  });

  it('Should NOT execute baz if myVar is not 1', async () => {
    const tx = myContract4.baz(2);
    await expect(tx)
      .to.be.revertedWith('myVar must be 1');
  });
});
