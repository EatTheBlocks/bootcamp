import Button from "react-bootstrap/Button";
import { HiCurrencyDollar } from "react-icons/hi";
import { DAOContract, showError } from "../../utils/common";

const Contribute = () => {
  const contribute = async () => {
    try {
      await DAOContract().contribute({ value: 1000 });
    } catch (error) {
      showError(error);
    }
  };
  return (
    <Button className="mx-2" onClick={contribute}>
      <HiCurrencyDollar size={20} /> Contribute
    </Button>
  );
};

export default Contribute;
