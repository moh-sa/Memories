// Hooks
import { Link } from "react-router-dom";
// UI Components
import { Button } from "@mantine/core";
// Icons
import { MdLibraryAdd } from "react-icons/md";
import { useAppSelector } from "store/hooks";
import type { RootState } from "store/store";
// Styles
import "./styles.css";

const FloatingButton = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);

  return (
    <Button
      style={{ display: user ? undefined : "none" }}
      className="FAB"
      component={Link}
      to="/memory/create"
    >
      <MdLibraryAdd size={26} />
    </Button>
  );
};

export default FloatingButton;
