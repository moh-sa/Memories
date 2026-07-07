import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  hideSLXS: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
  hideGTXS: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },
}));
