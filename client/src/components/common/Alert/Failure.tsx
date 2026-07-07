import { Alert } from "@mantine/core";
import { FaExclamationTriangle } from "react-icons/fa";

const Failure = ({ msg }: { msg: string }) => {
  return (
    <Alert mb="md" title="Uh Oh!" color="red" icon={<FaExclamationTriangle />}>
      {msg}
    </Alert>
  );
};

export default Failure;
