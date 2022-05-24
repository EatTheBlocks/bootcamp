import Button from "react-bootstrap/Button";
import { HiChevronDoubleDown } from "react-icons/hi";
const Redeem = () => {
  const redeem = () => {
    console.log("redeem");
  };
  return (
    <Button className="mx-2" onClick={redeem}>
      <HiChevronDoubleDown size={20} /> Redeem Shares
    </Button>
  );
};

export default Redeem;
