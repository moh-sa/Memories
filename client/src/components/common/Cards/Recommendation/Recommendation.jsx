//Hooks
import { useStyles } from "./styles";
//Components
import { Link } from "react-router-dom";
//UI Components
import Moment from "react-moment";
import { Card, Text, Group, Center } from "@mantine/core";
//Icons
import { FaRegClock, FaHeart } from "react-icons/fa";

const Recommendation = ({ data }) => {
  const { classes, theme } = useStyles();
  return (
    <Card
      p="lg"
      shadow="lg"
      radius="lg"
      className={classes.card}
      component={Link}
      to={`/memory/${data._id}`}
    >
      <div
        className={classes.image}
        style={{
          backgroundImage: `url(${data.cover})`,
        }}
      />
      <div className={classes.overlay} />

      <div className={classes.content}>
        <div>
          <Text
            size="lg"
            weight={500}
            transform="capitalize"
            className={classes.title}
          >
            {data.title}
          </Text>

          <Group position="apart" spacing="xs">
            <Text size="sm" className={classes.name}>
              {data.author.username}
            </Text>

            <Group spacing="lg">
              <Center>
                <FaHeart color={theme.colors.dark[2]} />
                <Text size="sm" className={classes.bodyText}>
                  {data.likes.length}
                </Text>
              </Center>
              <Center>
                <FaRegClock size={16} color={theme.colors.dark[2]} />
                <Text size="sm" className={classes.bodyText}>
                  <Moment fromNow interval={60000}>
                    {data.createdAt}
                  </Moment>
                </Text>
              </Center>
            </Group>
          </Group>
        </div>
      </div>
    </Card>
  );
};

export default Recommendation;
