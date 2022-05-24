import Button from "react-bootstrap/Button";
import { HiCollection } from "react-icons/hi";
const Withdraw = () => {
  const withdraw = () => {
    console.log("withdraw");
  };
  return (
    <Button className="mx-2" onClick={withdraw} variant="danger">
      <HiCollection size={20} /> Withdraw Funds
    </Button>
  );
};

export default Withdraw;
