import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, _params, getRef) => ({
  card: {
    display: "flex",
    alignItems: "flex-end",
    justifyItems: "center",
    flexDirection: "column",
    flex: -1,

    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.md,
    width: "24em",
    height: "100%",

    [`&:hover .${getRef("cover")}`]: {
      transform: "scale(1.03)",
    },
  },

  coverWrapper: {
    position: "relative",
    overflow: "hidden",
  },

  cover: {
    ref: getRef("cover"),
    transition: "transform 500ms ease",
  },

  overlay: {
    position: "absolute",
    top: "45%",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage:
      theme.colorScheme === "dark"
        ? "linear-gradient(180deg, rgba(37,38,43,0) 40%, rgba(37,38,43,0.5) 70%, rgb(37, 38, 43) 100%)"
        : "linear-gradient(180deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.5) 70%, rgb(255, 255, 255) 100%)",
  },

  userInfo: {
    position: "absolute",
    top: "375px",
    left: theme.spacing.sm,
    textDecoration: "none",
    color: "inherit",
  },

  badge: {
    ref: getRef("badge"),
    position: "absolute",
    top: "420px",
    pointerEvents: "none",
    backgroundColor: "transparent",
  },

  like: {
    right: "39px",
    borderRadius: "8px 0 0 8px",
  },

  time: {
    left: 0,
    borderRadius: "0 8px 8px 0",
    color:
      theme.colorScheme === "light"
        ? theme.colors.dark[3]
        : theme.colors.dark[0],
  },

  comments: {
    right: 0,
    borderRadius: "0 0 0 0",
  },

  likes: {
    color: theme.colorScheme === "dark" && "white",
  },

  tags: {
    wordBreak: "break-word",
  },

  buttons: {
    display: "flex",
    width: "100%",
    padding: "12px",
    margin: "auto",
    gap: theme.spacing.xs,
  },

  memeryDetails: {
    width: "100%",
    paddingRight: "10px",
    paddingLeft: "10px",
    margin: "auto 16px",
  },
}));
