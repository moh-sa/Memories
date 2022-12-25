//Components
import { Link } from "react-router-dom";
//UI Components
import { Group, Avatar, Text, Box } from "@mantine/core";

const UserInfo = ({ styles, URL, username }) => {
  return (
    <Box className={styles} component={Link} to={`/user/${username}`}>
      <Group spacing="xs">
        <Avatar src={URL} radius="sm" />
        <div>
          <Text>{username}</Text>
        </div>
      </Group>
    </Box>
  );
};

export default UserInfo;
