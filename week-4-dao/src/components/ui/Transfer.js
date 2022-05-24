import Button from "react-bootstrap/Button";
import { HiRefresh } from "react-icons/hi";
const Transfer = () => {
  const transfer = () => {
    console.log("Transfer");
  };
  return (
    <Button className="mx-2" onClick={transfer}>
      <HiRefresh size={20} /> Transfer Shares
    </Button>
  );
};

export default Transfer;
