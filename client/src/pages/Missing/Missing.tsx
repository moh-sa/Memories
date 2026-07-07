//Hooks
import { useStyles } from "./styles";
import { Link, useLocation } from "react-router-dom";
import { useTitle } from "Hooks";
//UI Components
import { Container, Title, Text, Button, Group } from "@mantine/core";
//Variables
const defautValues = {
  code: 404,
  title: "You have found a secret place.",
  msg: "Unfortunately, this is only a 404 page.\nYou may have mistyped the address, or the page has been moved to another URL.",
};

const Missing = () => {
  //Hookes
  const { classes } = useStyles();
  const location = useLocation();
  const { setTitle } = useTitle();
  //Variables
  const { state } = location;
  const code = state?.code ? state?.code : defautValues.code;
  const title = state?.code ? "Uh Oh!" : defautValues.title;
  const msg = state?.msg ? state?.msg : defautValues.msg;
  //setTitle
  setTitle("page not found");

  return (
    <Container className={classes.root}>
      <div className={classes.label}>{code}</div>
      <Title className={classes.title}>{title}</Title>
      <Text
        color="dimmed"
        size="lg"
        align="center"
        className={classes.description}
      >
        {msg}
      </Text>
      <Group position="center">
        <Button size="md" component={Link} to="/">
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
};

export default Missing;
