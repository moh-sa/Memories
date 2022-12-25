import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  paper: {
    padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.xs,
  },

  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
}));
