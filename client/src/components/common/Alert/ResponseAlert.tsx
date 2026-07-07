import { Alert } from "@mantine/core";
import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const ResponseAlert = ({
  isSuccess = true,
  msg,
}: {
  isSuccess?: boolean;
  msg: string;
}) => {
  return (
    <Alert
      mb="md"
      title={isSuccess ? "Done!" : "Uh Oh!"}
      color={isSuccess ? "green" : "red"}
      icon={isSuccess ? <FaCheckCircle /> : <FaExclamationTriangle />}
    >
      {msg}
    </Alert>
  );
};

export default ResponseAlert;
