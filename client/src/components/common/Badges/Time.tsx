// UI Components
import Moment from "react-moment";
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
        <Moment fromNow interval={60000}>
          {time}
        </Moment>
      </Text>
    </Badge>
  );
};

export default Time;
