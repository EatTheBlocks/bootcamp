const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MyContract6', () => {
  it('Should emit an event', async () => {
    const MyContract6 = await ethers.getContractFactory('MyContract6');
    const myContract6 = await MyContract6.deploy();
    await myContract6.deployed();

    await expect(myContract6.foo(1, 2))
      .to.emit(myContract6, 'MyEvent')
      .withArgs(1, 2);
  });
});

