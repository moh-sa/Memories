import { Link } from "react-router-dom";
import { Image, Text, Box, useMantineColorScheme } from "@mantine/core";
import WhiteLogo from "./assets/WHITE-LOGO.svg";
import BlackLogo from "./assets/BLACK-LOGO.svg";

const TextLogo = () => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Box component={Link} to="/">
      <Image
        src={colorScheme === "dark" ? WhiteLogo : BlackLogo}
        alt="Memories text logo"
        width="8em"
        withPlaceholder
        placeholder={<Text align="center">Memories text logo</Text>}
      />
    </Box>
  );
};

export default TextLogo;
