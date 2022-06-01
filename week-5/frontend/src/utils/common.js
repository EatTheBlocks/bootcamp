import { ethers } from "ethers";
import ContractAddress from "./../artifacts/contracts/Ebay.sol/contract-address.json";
import ContractAbi from "./../artifacts/contracts/Ebay.sol/Ebay.json";
import Swal from "sweetalert2";

const getBlockchain = () =>
  new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        const ebay = new ethers.Contract(
          ContractAddress.address,
          ContractAbi.abi,
          signer
        );

        resolve({ signerAddress, ebay });
      }
      resolve({ signerAddress: undefined, ebay: undefined });
    });
  });

function showError(error) {
  Swal.fire({
    icon: "error",
    title: "Transaction Failed",
    text: error.toString(),
  });
}

export { getBlockchain, showError };
export default getBlockchain;
