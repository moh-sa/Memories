import { showNotification } from "@mantine/notifications";

const PendingNoti = (id: string, title: string, message: string) => {
  showNotification({
    id,
    title,
    message,
    loading: true,
    autoClose: false,
  });
};

export default PendingNoti;
