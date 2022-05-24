import Button from "react-bootstrap/Button";
import { HiDocumentAdd } from "react-icons/hi";

const AddNewProposal = () => {
  const add = () => {};
  return (
    <Button variant="primary" onClick={add} className="mx-2">
      <HiDocumentAdd size={20} /> Add New Proposal
    </Button>
  );
};

export default AddNewProposal;
