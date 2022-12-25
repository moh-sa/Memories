import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { Spotlight } from "components";

const localStorageOptions = {
  key: "mantine-color-scheme",
  defaultValue: "light",
  getInitialValueInEffect: true,
};

const MantineProviders = ({ children }) => {
  const [colorScheme, setColorScheme] = useLocalStorage(localStorageOptions);
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Spotlight.Provider>
          <NotificationsProvider>{children}</NotificationsProvider>
        </Spotlight.Provider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default MantineProviders;
