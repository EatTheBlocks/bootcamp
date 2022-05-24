import AddNewProposal from "../ui/AddNewProposal";
import Contribute from "../ui/Contribute";
import Transfer from "../ui/Transfer";
import Redeem from "../ui/Redeem";
import Withdraw from "../ui/Withdraw";
import { Alert, Badge } from "react-bootstrap";
import { DAOContract, showError } from "../../utils/common";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const Header = () => {
  const [shares, setShares] = useState(0);
  const [contributionEnd, setContributionEnd] = useState(0);
  const { data: account } = useAccount();
  const currentTimestamp = +new Date() / 1000;

  const getShares = async () => {
    try {
      account &&
        setShares((await DAOContract().shares(account.address)).toNumber());
      setContributionEnd((await DAOContract().contributionEnd()).toNumber());
    } catch (error) {
      showError(error);
    }
  };
  useEffect(() => {
    getShares();
  }, [account]);

  return (
    <div>
      <Alert variant="success">
        <Alert.Heading>Hey, you have {shares} shares</Alert.Heading>
        <p>
          Contribution to this DAO is ends on:{" "}
          <b> {new Date(contributionEnd * 1000).toString()}</b>
        </p>
        <hr />
        <p className="mb-0">
          <div className="d-flex justify-content-end m-4">
            {currentTimestamp < contributionEnd && <Contribute />}
            <Transfer />
            <Redeem />
            <Withdraw />
            <AddNewProposal />
          </div>
        </p>
      </Alert>
    </div>
  );
};

export default Header;
