import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { FcApproval } from "react-icons/fc";
import { ImQuill } from "react-icons/im";
import { useEffect, useState } from "react";
import { DAOContract } from "../../utils/common";

const ProposalList = () => {
  const [proposals, setProposals] = useState([]);

  const getProposals = async () => {
    console.log(await DAOContract().proposals(0));
    setProposals(await DAOContract().proposals(0));
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
          <tr>
            <td>1</td>
            <td>{proposals.name}</td>
            <td>2000</td>
            <td>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</td>
            <td>1000</td>
            <td>26 May, 2022</td>
            <td>
              <FcApproval />
            </td>
            <td>
              <Button>
                <ImQuill /> Vote
              </Button>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Test Proposal2</td>
            <td>2000</td>
            <td>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</td>
            <td>1000</td>
            <td>26 May, 2022</td>
            <td>
              <FcApproval />
            </td>
            <td>
              <Button>
                <ImQuill /> Vote
              </Button>
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>Test Proposal3</td>
            <td>2000</td>
            <td>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</td>
            <td>1000</td>
            <td>26 May, 2022</td>
            <td>
              <FcApproval />
            </td>
            <td>
              <Button>
                <ImQuill /> Vote
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default ProposalList;
