import { ethers } from "ethers";
import { address } from "./../artifacts/contracts/Ebay.sol/contract-address.json";
import { abi } from "./../artifacts/contracts/Ebay.sol/Ebay.json";

const getBlockchain = () =>
  new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        const ebay = new ethers.Contract(address, abi, signer);

        resolve({ signerAddress, ebay });
      }
      resolve({ signerAddress: undefined, ebay: undefined });
    });
  });

export default getBlockchain;
