import type { ReactNode } from "react";
import { Stack, Text } from "@mantine/core";

const LoaderWithText = ({ icon, msg }: { icon: ReactNode; msg: string }) => {
  return (
    <Stack align="center">
      {icon}

      <Text size="xl">{msg}</Text>
    </Stack>
  );
};

export default LoaderWithText;
