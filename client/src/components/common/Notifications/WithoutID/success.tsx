import { showNotification } from "@mantine/notifications";
import { TbCheck } from "react-icons/tb";

const Success = (title: string, message: string) => {
  showNotification({
    title,
    message,
    autoClose: 10000,
    color: "teal",
    icon: <TbCheck size={20} />,
  });
};

export default Success;
