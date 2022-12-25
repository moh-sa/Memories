import { Link } from "react-router-dom";
import { Image, Text, Box } from "@mantine/core";

const URL =
  "https://res.cloudinary.com/tno/image/upload/w_64,dpr_auto/v1656717410/memoriesLogo_jydozc.webp";

const ImageLogo = () => {
  return (
    <Box component={Link} to="/">
      <Image
        src={URL}
        alt="Memories image logo"
        ml="lg"
        mr="xs"
        width="2.25em"
        withPlaceholder
        placeholder={<Text align="center">Memories image logo</Text>}
      />
    </Box>
  );
};

export default ImageLogo;
