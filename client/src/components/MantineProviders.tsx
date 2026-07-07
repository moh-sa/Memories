import type { ReactNode } from "react";
import {
  MantineProvider,
  ColorSchemeProvider,
  type ColorScheme,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import Spotlight from "components/Spotlight";

const localStorageOptions = {
  key: "mantine-color-scheme",
  defaultValue: "light",
  getInitialValueInEffect: true,
} satisfies {
  key: string;
  defaultValue: ColorScheme;
  getInitialValueInEffect: boolean;
};

const MantineProviders = ({ children }: { children: ReactNode }) => {
  const [colorScheme, setColorScheme]
    = useLocalStorage<ColorScheme>(localStorageOptions);
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };
  useHotkeys([["mod+J", () => {
    toggleColorScheme();
  }]]);

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
