import { updateNotification } from "@mantine/notifications";
import { TbCheck } from "react-icons/tb";

const SuccessNoti = (id: string, title: string, message: string) => {
  updateNotification({
    id,
    title,
    message,
    autoClose: 5000,
    color: "teal",
    icon: <TbCheck size={20} />,
  });
};

export default SuccessNoti;
