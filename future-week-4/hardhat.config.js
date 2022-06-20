require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");


const config = {
  solidity: "0.8.10",
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/4b94586b8dd3424da0f0e32863066cda",
      accounts: [
        `0x7557deb0ad0d42e9299ee72affab6a32d39806e8a5b1356523ce2c6d13308f00`,
      ],
    },
  },
  etherscan: {
    apiKey: "KBS9CDSW5PIT3NAXRJEBZBTJEC3V8TYQA7",
  },
};

module.exports = config;
