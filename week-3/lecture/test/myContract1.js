const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MyContract1', () => {
  it('Should return Hello World', async () => {
    const MyContract1 = await ethers.getContractFactory('MyContract1');
    const myContract1 = await MyContract1.deploy();
    await myContract1.deployed();

    const result = await myContract1.helloWorld();
    expect(result).to.equal('Hello World');
  });
});
