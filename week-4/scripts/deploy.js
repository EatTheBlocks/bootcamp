const hre = require("hardhat");

async function main() {
  const CONTRIBUTION_END_TIME = 2000;
  const QUORUM = 60;
  const VOTE_TIME = 500;
  const [deployer] = await hre.ethers.getSigners();

  const DAO = await hre.ethers.getContractFactory("DAO");
  const dao = await DAO.deploy(CONTRIBUTION_END_TIME, VOTE_TIME, QUORUM);

  await dao.deployed();
  console.log("Contract address:", dao.address);

  saveFrontendFiles(dao);
}

function saveFrontendFiles(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/abis";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ DAO: contract.address }, undefined, 2)
  );

  const DAOArtifact = hre.artifacts.readArtifactSync("DAO");

  fs.writeFileSync(
    contractsDir + "/DAO.json",
    JSON.stringify(DAOArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
