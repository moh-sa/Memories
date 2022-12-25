//Hooks
import { useStyles } from "./styles";
//UI Components
import { Container, Group, ActionIcon, Popover, Text } from "@mantine/core";
import { Common } from "components";
//Icons
import { TbBrandInstagram } from "react-icons/tb";
import { TbBrandTwitter, TbBrandYoutube } from "react-icons/tb";

const Pop = ({ icon }) => {
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <ActionIcon size="lg">{icon}</ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Text>What are you waiting for? This is a fake site!</Text>
      </Popover.Dropdown>
    </Popover>
  );
};

const Footer = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Common.Logo.TextLogo />
        <Group spacing={0} className={classes.links} position="right" noWrap>
          <Pop icon={<TbBrandTwitter size={18} />} />
          <Pop icon={<TbBrandYoutube size={18} />} />
          <Pop icon={<TbBrandInstagram size={18} />} />
        </Group>
      </Container>
    </div>
  );
};

export default Footer;
