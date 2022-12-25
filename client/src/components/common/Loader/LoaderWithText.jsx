import { Stack, Text } from "@mantine/core";

const LoaderWithText = ({ icon, msg }) => {
  return (
    <Stack align="center">
      {icon}

      <Text size="xl">{msg}</Text>
    </Stack>
  );
};

export default LoaderWithText;
