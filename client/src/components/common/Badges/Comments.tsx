import { Badge, Text } from "@mantine/core";
import { FaComments } from "react-icons/fa";

interface CommentsBadgeProps {
  badgeStyles: string;
  likesStyles: string;
  data: number;
}

const Comments = ({ badgeStyles, likesStyles, data }: CommentsBadgeProps) => {
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
