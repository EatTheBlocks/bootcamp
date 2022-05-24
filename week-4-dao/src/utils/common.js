import { ethers } from "ethers";
import DAOArtifact from "../abis/DAO.json";
import ContractAddress from "../abis/contract-address.json";
import Swal from "sweetalert2";

async function requestAccount() {
  await window.ethereum.request({ method: "eth_requestAccounts" });
}

function DAOContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    ContractAddress.DAO,
    DAOArtifact.abi,
    signer
  );

  return contract;
}

function showError(error) {
  Swal.fire({
    icon: "error",
    title: "Transaction Failed",
    text: error.toString(),
  });
}

export { requestAccount, DAOContract, showError };
