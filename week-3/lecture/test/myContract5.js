const { expect } = require('chai');
const { ethers } = require('hardhat');
const { time } = require('@openzeppelin/test-helpers');

describe('MyContract5', () => {
  let myContract5;

  beforeEach(async () => {
    const MyContract5 = await ethers.getContractFactory('MyContract5');
    myContract5 = await MyContract5.deploy();
    await myContract5.deployed();
  });

  it('Should execute foo', async () => {
    await time.increase(time.duration.seconds(1001));
    const tx = await myContract5.foo();
    await tx.wait();
  });

  it('Should NOT execute foo', async () => {
    const tx = myContract5.foo();
    await expect(tx)
      .to.be.revertedWith('too soon');
  });
});
