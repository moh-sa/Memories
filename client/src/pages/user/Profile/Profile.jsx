//Hooks
import { useStyles } from "./styles";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTitle } from "Hooks";
//Actions
import { user } from "services";
//Components
import Moment from "react-moment";
//UI Components
import { Common } from "components";
import { Container, Indicator, Grid, Title } from "@mantine/core";
import { Avatar, Text, Button, Badge, Group } from "@mantine/core";
//Icons
import { FaClock } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { FaComments } from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md";
//Variables
const indiStyles = {
  0: { margin: "0 auto" },
  1: { indicator: { backgroundColor: "transparent" } },
};

const Profile = () => {
  //hooks
  const { classes } = useStyles();
  const { username } = useParams();
  const navigate = useNavigate();
  const { setTitle } = useTitle();
  //states
  const [profData, setProfData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExists, setIsExists] = useState(false);
  //variables
  const avatar = (
    <Avatar
      radius="sm"
      size={150}
      src={profData?.avatarURL}
      alt={`${username}'s avatar`}
    />
  );
  //setTitle
  setTitle(`${username} profile`);

  const getProfile = async () => {
    setIsLoading(true);
    try {
      const { data } = await user.getProfile({ username });
      setProfData(data.data);
      setIsExists(true);
    } catch (error) {
      console.log(error);
      setIsExists(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, [username]);

  return (
    <section className={classes.section}>
      {isLoading && <Common.LoadingOverlay />}
      {!isLoading && !isExists && (
        <div className={classes.notFound}>
          <Title order={2}>Uh Oh!</Title>
          <Text>
            {
              "We didn't find the requested username.\nPlease check and try again."
            }
          </Text>
          <Button onClick={() => navigate(-1)} mt="md">
            Go Back
          </Button>
        </div>
      )}
      {profData && isExists && (
        <Container>
          <Title order={3} mb="md">
            {username}'s Profile
          </Title>
          <div style={{ textAlign: "center" }}>
            <Group>
              <Indicator
                position="bottom-center"
                style={indiStyles[0]}
                styles={() => indiStyles[1]}
                label={<Label date={profData.createdAt} />}
              >
                {avatar}
              </Indicator>
            </Group>
            <Text size="xl" mt="sm" mb="md">
              {username}
            </Text>
            <Grid>
              <GridButton
                data={profData.numberOfLikes}
                singular="Like"
                plural="Likes"
                color="red"
                icon={<AiFillHeart />}
              />
              <GridButton
                data={profData.numberOfMemories}
                singular="memory"
                plural="Memories"
                color="orange"
                icon={<MdLibraryBooks />}
              />
              <GridButton
                data={profData.numberOfComments}
                singular="Comment"
                plural="Comments"
                icon={<FaComments />}
              />
            </Grid>
          </div>
        </Container>
      )}
    </section>
  );
};

export default Profile;

const GridButton = ({ data, color, icon, singular, plural }) => {
  return (
    <Grid.Col xs={12} sm={4}>
      <Button
        fullWidth
        uppercase
        size="lg"
        color={color}
        leftIcon={icon}
        component={Link}
        to={plural === "Comments" ? "" : plural}
        disabled={plural === "Comments"}
      >
        {data} {data === 1 ? singular : plural}
      </Button>
    </Grid.Col>
  );
};

const Label = ({ date }) => {
  return (
    <Badge color="green" leftSection={<FaClock />}>
      Since <Moment format="YYYY/MM/DD">{date}</Moment>
    </Badge>
  );
};
