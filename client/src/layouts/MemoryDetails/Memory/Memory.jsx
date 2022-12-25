//Hooks
import { useStyles } from "./styles";
//Components
import Moment from "react-moment";
//UI Components
import { Markup } from "interweave";
import { Group, Title, Text, Avatar } from "@mantine/core";
import { Image, Container, ActionIcon } from "@mantine/core";
import { TypographyStylesProvider } from "@mantine/core";
//Icons
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const Memory = ({ data, like, user }) => {
  const { classes } = useStyles();
  const { author } = data;
  const isLoggedIn = user !== null;
  let likeIcon;

  if (isLoggedIn) {
    likeIcon = data.likes.includes(user._id) ? (
      <AiFillHeart size={18} color="red" />
    ) : (
      <AiOutlineHeart size={18} color="red" />
    );
  }

  const handleLike = async () => {
    like({ _id: data._id, userId: user._id, type: "cover" });
  };

  return (
    <section className={classes.section}>
      {/* Memory's Image with Mantine's AspectRatio component that keep the media in boundries all the time */}
      <Container>
        <Image
          withPlaceholder
          radius="md"
          alt={data.description}
          src={data.coverURL}
          className={classes.cover}
        />
      </Container>

      {/* Upper Section that contains username, avatar, date, No. likes, like button */}
      <div className={classes.upperPart}>
        <Text transform="capitalize">
          <Title order={3} className={classes.title}>
            {data.title}
          </Title>
        </Text>

        {/* Auther Details */}
        <Group spacing="xs" position="center">
          {/* Avatar */}
          <Avatar src={author.avatarURL} size="sm" radius="md" />
          {/* Username */}
          <Text size="sm" color="dimmed">
            {author.username}
          </Text>
          <Text size="sm" color="dimmed">{` • `}</Text>
          {/* Since when? */}
          <Text size="sm" color="dimmed">
            <Moment interval={60000} fromNow>
              {data.createdAt}
            </Moment>
          </Text>
          <Text size="sm" color="dimmed">{` • `}</Text>
          {/* Like Button */}
          {isLoggedIn && (
            <ActionIcon onClick={handleLike}>{likeIcon}</ActionIcon>
          )}
          {/* Number of Likes */}
          <Text size="sm" color="dimmed">
            {data.likes?.length} likes
          </Text>
        </Group>
      </div>

      {/* Memory's Body */}
      <TypographyStylesProvider>
        <Markup content={data.body} />
      </TypographyStylesProvider>
    </section>
  );
};

export default Memory;
