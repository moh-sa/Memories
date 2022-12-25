import { useMantineColorScheme } from "@mantine/core";

const useDarkMode = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const toggleThemes = () => {
    return toggleColorScheme();
  };

  return {
    toggle: toggleThemes,
    theme: colorScheme,
  };
};

export default useDarkMode;
