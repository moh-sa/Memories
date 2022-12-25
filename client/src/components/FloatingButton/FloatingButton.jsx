//Hooks
import { useSelector } from "react-redux";
//Components
import { Link } from "react-router-dom";
//UI Components
import { Button } from "@mantine/core";
//Icons
import { MdLibraryAdd } from "react-icons/md";
//Styles
import "./styles.css";

const FloatingButton = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Button
      style={{ display: !user && "none" }}
      className="FAB"
      component={Link}
      to="/memory/create"
    >
      <MdLibraryAdd size={26} />
    </Button>
  );
};

export default FloatingButton;
