//Hooks
import { useStyles } from "./styes";
import { useSelector } from "react-redux";
//Components
import { Link } from "react-router-dom";
//UI Components
import { Box, Button, Group, Grid, ActionIcon } from "@mantine/core";
import { Header as HeaderCom, Container } from "@mantine/core";
import { Common, Navbar } from "components";
//Icons
import { TbLogin } from "react-icons/tb";

const Header = () => {
  //hooks
  const { classes } = useStyles();
  //selectors
  const auth = useSelector((state) => state.auth);

  return (
    <HeaderCom py="sm">
      <div
        style={{
          backgroundColor: "darkgrey",
          color: "white",
          padding: "3px",
          marginTop: "-12px",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        <div>
          ⚠This app is inspired by{" "}
          <a href="https://youtu.be/VsUzmlZfYNg">JavaScript Mastery</a> 's
          project.⚠
        </div>
        <div>
          Check the <a href="https://github.com/moh-sa/Memories">repo</a>
        </div>
      </div>
      <Container>
        <Grid>
          <Grid.Col span={4} style={{ margin: "auto 0" }}>
            <Group>
              <Box className={classes.hideSLXS}>
                <Common.Logo.ImageLogo />
              </Box>
              <Common.Logo.TextLogo />
            </Group>
          </Grid.Col>
          <Grid.Col span={8}>
            <Group position="right">
              {/* Search Bar DESKTOP */}
              <Navbar.Search.Desk />
              {/* User Menu: shortcuts, and logout */}
              {auth?.user && <Navbar.UserMenu user={auth?.user} />}

              {/* Login & Register Buttons */}
              {!auth?.user && (
                <Group spacing="xs">
                  {/* Desktop btn */}
                  <Button
                    variant="light"
                    size="xs"
                    component={Link}
                    to="/login"
                    className={classes.hideSLXS}
                  >
                    Login
                  </Button>
                  {/* mobile btn */}
                  <ActionIcon
                    color="blue"
                    variant="light"
                    component={Link}
                    to="/login"
                    className={classes.hideGTXS}
                  >
                    <TbLogin size={16} />
                  </ActionIcon>
                  <Button size="xs" component={Link} to="/register">
                    Register
                  </Button>
                </Group>
              )}

              {/* Swtich to dark mode button */}
              <Navbar.SwitchThemes />

              {/* Search Bar MOBILE */}
              <Navbar.Search.Mob />
            </Group>
          </Grid.Col>
        </Grid>
      </Container>
    </HeaderCom>
  );
};

export default Header;
