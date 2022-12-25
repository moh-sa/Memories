import { showNotification } from "@mantine/notifications";
import { TbCheck } from "react-icons/tb";

const Success = (title, message) => {
  return showNotification({
    title,
    message,
    autoClose: 10000,
    color: "teal",
    icon: <TbCheck size={20} />,
  });
};

export default Success;
