// UI Components
import RelativeTime from "components/common/RelativeTime/RelativeTime";
import { Badge, Text } from "@mantine/core";
// Icons
import { FaClock } from "react-icons/fa";

interface TimeBadgeProps {
  badgeStyles: string;
  likesStyles: string;
  time: string;
}

const Time = ({ badgeStyles, likesStyles, time }: TimeBadgeProps) => {
  return (
    <Badge
      className={badgeStyles}
      variant="light"
      leftSection={<FaClock style={{ marginTop: "4px" }} />}
    >
      <Text className={likesStyles}>
        <RelativeTime interval={60000}>
          {time}
        </RelativeTime>
      </Text>
    </Badge>
  );
};

export default Time;
