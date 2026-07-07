import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  parent: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },

  children: {
    display: "flex",
    flexGrow: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },
}));
