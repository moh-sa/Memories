import { showNotification } from "@mantine/notifications";
import { TbX } from "react-icons/tb";

const Failure = (title, message) => {
  return showNotification({
    title,
    message,
    autoClose: 10000,
    color: "red",
    icon: <TbX size={20} />,
  });
};

export default Failure;
