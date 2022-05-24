import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { FcApproval } from "react-icons/fc";
import { ImLibrary, ImQuill } from "react-icons/im";
import { useEffect, useState } from "react";
import { DAOContract, showError } from "../../utils/common";
import { useAccount } from "wagmi";

const ProposalList = () => {
  const [proposals, setProposals] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: account } = useAccount();

  const getProposals = async () => {
    try {
      setProposals(await DAOContract().getProposals());
      account && setIsAdmin((await DAOContract().admin()) == account.address);
    } catch (error) {
      showError(error);
    }
  };

  const vote = async (id) => {
    try {
      await DAOContract().vote(id);
    } catch (error) {
      showError(error);
    }
  };

  const execute = async (id) => {
    try {
      await DAOContract().executeProposal(id);
    } catch (error) {
      showError(error);
    }
  };

  useEffect(() => {
    getProposals();
  }, [account]);

  return (
    <div>
      <h3>All Proposals</h3>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Recipient</th>
            <th>Votes</th>
            <th>Voting Ends</th>
            <th>Active</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((proposal) => (
            <tr>
              <td>{proposal.id.toNumber()}</td>
              <td>{proposal.name}</td>
              <td>{proposal.amount.toString()}</td>
              <td>{proposal.recipient}</td>
              <td>{proposal.votes.toString()}</td>
              <td>{new Date(proposal.end * 1000).toString()}</td>
              <td>
                <FcApproval />
              </td>
              <td>
                <Button onClick={() => vote(proposal.id)}>
                  <ImQuill /> Vote
                </Button>
              </td>
              <td>
                {isAdmin && (
                  <Button onClick={() => execute(proposal.id)}>
                    <ImLibrary /> Execute
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProposalList;
