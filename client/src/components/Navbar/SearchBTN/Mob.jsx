//hooks
import { useStyles } from "./styles";
//Components
import { openSpotlight } from "@mantine/spotlight";
//UI Components
import { ActionIcon } from "@mantine/core";
//Icons
import { TbSearch } from "react-icons/tb";

const Mob = () => {
  const { classes } = useStyles();
  return (
    <ActionIcon
      className={classes.mobile}
      variant="light"
      onClick={openSpotlight}
    >
      <TbSearch size={20} />
    </ActionIcon>
  );
};

export default Mob;
