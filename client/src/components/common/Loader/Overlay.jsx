import { LoadingOverlay, Loader } from "@mantine/core";
import LoaderWithText from "./LoaderWithText";

const Overlay = ({ icon = <Loader size="xl" />, msg = "Loading..." }) => {
  return (
    <LoadingOverlay
      visible
      overlayOpacity={1}
      loader={<LoaderWithText icon={icon} msg={msg} />}
    />
  );
};

export default Overlay;
