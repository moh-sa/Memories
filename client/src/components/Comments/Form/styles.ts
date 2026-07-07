import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  paper: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },

  form: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
}));
