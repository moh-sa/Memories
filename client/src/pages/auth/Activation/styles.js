import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  section: {
    width: "100%",
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  Container: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    width: "350px",
    height: "350px",
    borderRadius: theme.radius.md,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[1],
  },
  icon: {
    backgroundColor: "white",
    borderRadius: theme.radius.xl,
  },
  msg: {
    whiteSpace: "pre-line",
  },
}));
