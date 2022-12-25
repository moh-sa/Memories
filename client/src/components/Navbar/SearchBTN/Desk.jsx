//hooks
import { useStyles } from "./styles";
//Components
import { openSpotlight } from "@mantine/spotlight";
//UI Components
import { UnstyledButton, Group, Text } from "@mantine/core";
//Icons
import { TbSearch } from "react-icons/tb";

const Desk = () => {
  const { classes } = useStyles();
  return (
    <UnstyledButton className={classes.desktop} onClick={openSpotlight}>
      <Group position="apart">
        <Group>
          <TbSearch size={16} color="#adb5bd" />
          <Text color="gray.5">Search</Text>
        </Group>

        <Text className={classes.KBD}>Ctrl + K</Text>
      </Group>
    </UnstyledButton>
  );
};

export default Desk;
