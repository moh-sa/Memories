import { useMantineColorScheme } from "@mantine/core";

const useDarkMode = () => {
  const colorSchemeCtx = useMantineColorScheme();

  const toggleThemes = () => {
    colorSchemeCtx.toggleColorScheme();
  };

  return {
    toggle: toggleThemes,
    theme: colorSchemeCtx.colorScheme,
  };
};

export default useDarkMode;
