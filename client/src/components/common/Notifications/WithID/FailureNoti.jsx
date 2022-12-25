import { updateNotification } from "@mantine/notifications";
import { TbX } from "react-icons/tb";

const FailureNoti = (id, title, message) => {
  return updateNotification({
    id,
    title,
    message,
    autoClose: 5000,
    color: "red",
    icon: <TbX size={20} />,
  });
};

export default FailureNoti;
