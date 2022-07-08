const { ethers } = require("hardhat");

async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await simpleStorageFactory.deploy();

  console.log("Deploying the contract now...");

  await simpleStorage.deployed();
  
  console.log("Contract deployed to:", simpleStorage.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
