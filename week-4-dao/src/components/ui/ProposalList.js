import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { FcApproval } from "react-icons/fc";
import { ImQuill } from "react-icons/im";
import { useEffect, useState } from "react";
import { DAOContract, showError } from "../../utils/common";

const ProposalList = () => {
  const [proposals, setProposals] = useState([]);

  const getProposals = async () => {
    try {
      setProposals(await DAOContract().getProposals());
    } catch (error) {
      showError(error);
    }
  };

  useEffect(() => {
    getProposals();
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {proposals.map((proposal) => (
            <tr>
              <td>{proposal.id.toNumber()}</td>
              <td>{proposal.name}</td>
              <td>{proposal.amount.toNumber()}</td>
              <td>{proposal.recipient}</td>
              <td>{proposal.votes.toNumber()}</td>
              <td>{new Date(proposal.end * 1000).toString()}</td>
              <td>
                <FcApproval />
              </td>
              <td>
                <Button>
                  <ImQuill /> Vote
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProposalList;
