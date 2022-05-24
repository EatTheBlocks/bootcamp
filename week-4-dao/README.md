# DAO App

## Run Locally

### 1. Start Frontend

The frontend is built using `create-react-app`
To start the frontend run

```
npm start
```

### 2. Start a [local node](https://hardhat.org/getting-started/#connecting-a-wallet-or-dapp-to-hardhat-network)

```
	npx hardhat node
```

### 3. Open a new terminal and deploy the smart contract in the `localhost` network

```
npx hardhat run --network localhost scripts/deploy.js
```

### 4. Follow the instructions to link hardhat to metamask

[Connecting hardhat to metamask](https://support.chainstack.com/hc/en-us/articles/4408642503449-Using-MetaMask-with-a-Hardhat-node)
