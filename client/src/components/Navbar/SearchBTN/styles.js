import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  desktop: {
    width: "260px",
    height: "34px",
    paddingLeft: "12px",
    paddingRight: "5px",
    border: `1px solid ${
      theme.colorScheme === "light"
        ? theme.colors.gray[2]
        : theme.colors.dark[4]
    }`,
    borderRadius: "8px",

    [theme.fn.largerThan("sm")]: {
      display: "inline-block",
    },
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  mobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "flex",
    },
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  KBD: {
    fontWeight: 700,
    fontSize: "11px",
    padding: "4px 7px",
    borderRadius: "4px",
    color:
      theme.colorScheme === "light"
        ? theme.colors.gray[7]
        : theme.colors.dark[2],
    border: `1px solid ${
      theme.colorScheme === "light"
        ? theme.colors.gray[2]
        : theme.colors.dark[7]
    }`,
    backgroundColor:
      theme.colorScheme === "light"
        ? theme.colors.gray[0]
        : theme.colors.dark[7],
  },
}));
