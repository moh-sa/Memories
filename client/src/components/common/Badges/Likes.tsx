import { Badge, Text } from "@mantine/core";
import { AiFillHeart } from "react-icons/ai";

interface LikesBadgeProps {
  badgeStyles: string;
  likesStyles: string;
  likes: number;
}

const Likes = ({ badgeStyles, likesStyles, likes }: LikesBadgeProps) => {
  return (
    <Badge
      className={badgeStyles}
      variant="light"
      color="pink"
      leftSection={<AiFillHeart style={{ marginTop: "4px" }} />}
    >
      <Text className={likesStyles}>{likes}</Text>
    </Badge>
  );
};

export default Likes;
