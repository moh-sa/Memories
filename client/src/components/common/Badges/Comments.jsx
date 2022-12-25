import { Badge, Text } from "@mantine/core";
import { FaComments } from "react-icons/fa";

const Comments = ({ badgeStyles, likesStyles, data }) => {
  return (
    <Badge
      className={badgeStyles}
      variant="light"
      color="blue"
      leftSection={<FaComments style={{ marginTop: "4px" }} />}
    >
      <Text className={likesStyles}>{data}</Text>
    </Badge>
  );
};

export default Comments;
