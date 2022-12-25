import { Alert } from "@mantine/core";
import { FaCheckCircle } from "react-icons/fa";

const Success = ({ msg }) => {
  return (
    <Alert mb="md" title="Done!" color="green" icon={<FaCheckCircle />}>
      {msg}
    </Alert>
  );
};

export default Success;
