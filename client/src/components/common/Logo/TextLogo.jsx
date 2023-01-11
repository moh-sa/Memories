import { Link } from "react-router-dom";
import { Text, Box } from "@mantine/core";

const TextLogo = () => {
  return (
    <Box
      component={Link}
      to="/"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Text weight={500} size="1.47em">
        Memories
      </Text>
    </Box>
  );
};

export default TextLogo;
