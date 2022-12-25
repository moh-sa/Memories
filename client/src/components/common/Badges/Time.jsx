//UI Components
import Moment from "react-moment";
import { Badge, Text } from "@mantine/core";
//Icons
import { FaClock } from "react-icons/fa";

const Time = ({ badgeStyles, likesStyles, time }) => {
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
