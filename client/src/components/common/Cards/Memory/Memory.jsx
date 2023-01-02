//Hooks
import { useStyles } from "./styles";
import { useState } from "react";
//Components
import { Link } from "react-router-dom";
//UI Components
import { Common } from "components";
import { UserInfo } from "./subComponents";
import { Card, Text, Image, Button, Box, Anchor } from "@mantine/core";
//Icons
import { TbEdit, TbTrash } from "react-icons/tb";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const Memory = ({ data, user, like, edit, _delete }) => {
  //Hooks
  const { classes } = useStyles();
  //Stats
  const [isModelOpened, setIsModelOpened] = useState(false);
  //Checkers
  const isLoggedIn = user._id !== undefined;
  const isAuthor = data.author._id === user._id;
  const isAdmin = user.role === "admin";

  const tags = data.tags.map((tag) => (
    <Text
      size="sm"
      color="dimmed"
      key={tag}
      component={Link}
      to={`/search?tags=${tag}`}
    >
      {`#${tag} `}
    </Text>
  ));

  const likeIcon = data.likes.includes(user._id) ? (
    <AiFillHeart size={18} color="red" />
  ) : (
    <AiOutlineHeart size={18} color="red" />
  );

  const handleDelete = async () => {
    const delData = { _id: data._id, public_id: data.cover };
    _delete(delData);
    setIsModelOpened(false);
  };

  return (
    <>
      <Card withBorder className={classes.card}>
        {/* Image Cover */}
        <Card.Section
          className={classes.coverWrapper}
          component={Link}
          to={`/memory/${data._id}`}
        >
          <Image
            withPlaceholder
            width="24em"
            height="27em"
            src={data.coverURL}
            alt={data.description}
            className={classes.cover}
          />
          {/* Overlay */}
          <div className={classes.overlay} />
        </Card.Section>

        {/* Badges */}
        {/* Likes */}
        <Common.Badges.Likes
          badgeStyles={`${classes.badge} ${classes.like}`}
          likesStyles={classes.likes}
          likes={data.likes.length}
        />
        {/* Time */}
        <Common.Badges.Time
          badgeStyles={`${classes.badge} ${classes.time}`}
          likesStyles={classes.likes}
          time={data.createdAt}
        />
        {/* Comments */}
        <Common.Badges.Comments
          badgeStyles={`${classes.badge} ${classes.comments}`}
          likesStyles={classes.likes}
          data={data.numberOfComments}
        />

        {/* userInfo */}
        <UserInfo
          styles={classes.userInfo}
          URL={data.author.avatarURL}
          username={data.author.username}
        />

        {/* Memory Details */}
        <Card.Section className={classes.memeryDetails}>
          <div>
            {/* Title and Description */}
            <Text
              weight={700}
              size="xl"
              transform="capitalize"
              component={Link}
              to={`/memory/${data._id}`}
            >
              {data.title}
            </Text>
            <Text>
              {data.description}
              {" ..."}
              {
                <Anchor component={Link} to={`/memory/${data._id}`}>
                  read more
                </Anchor>
              }
            </Text>
          </div>

          {/* Tags */}
          <Box className={classes.tags} mb="sm" mt="md">
            {tags}
          </Box>
        </Card.Section>

        {/* Buttons */}
        {isLoggedIn && (
          <Card.Section withBorder className={classes.buttons}>
            {/* Like Button */}
            <Button
              fullWidth
              variant="light"
              color="pink"
              onClick={() =>
                like({ _id: data._id, userId: user._id, type: "card" })
              }
            >
              {likeIcon}
            </Button>

            {/* Edit Button */}
            {(isAuthor || isAdmin) && (
              <Button fullWidth variant="light" onClick={() => edit(data)}>
                <TbEdit size={18} />
              </Button>
            )}

            {/* Delete Button */}
            {(isAuthor || isAdmin) && (
              <Button
                variant="light"
                color="yellow"
                onClick={() => setIsModelOpened(true)}
              >
                <TbTrash size={18} color="orange" />
              </Button>
            )}
          </Card.Section>
        )}
      </Card>
      <Common.Modals.Delete
        open={isModelOpened}
        close={() => setIsModelOpened(false)}
        yes={handleDelete}
      />
    </>
  );
};

export default Memory;
