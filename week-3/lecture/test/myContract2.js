const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MyContract2', () => {
  it('Should update myVar', async () => {
    const MyContract2 = await ethers.getContractFactory('MyContract2');
    const myContract2 = await MyContract2.deploy();
    await myContract2.deployed();

    const tx = await myContract2.update(10);
    await tx.wait();

    const result = await myContract2.myVar();
    expect(result).to.equal(10);
  });
});
