import { ActionIcon } from "@mantine/core";
import { BsFillSunFill as Sun } from "react-icons/bs";
import { RiMoonClearFill as Moon } from "react-icons/ri";
import { useDarkMode } from "Hooks";

const SwitchThemes = () => {
  const { theme, toggle } = useDarkMode();
  const isDark = theme === "dark";
  return (
    <ActionIcon
      variant="light"
      title="Toggle theme"
      aria-label="Toggle theme"
      color={isDark ? "yellow" : "blue"}
      onClick={toggle}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </ActionIcon>
  );
};

export default SwitchThemes;
