import { Link } from "react-router-dom";
import { Text, Box } from "@mantine/core";

const TextLogo = () => {
  return (
    <Box component={Link} to="/">
      <Text weight={500} align="center">
        Memories
      </Text>
    </Box>
  );
};

export default TextLogo;
