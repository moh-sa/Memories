//Hooks
import { useStyles } from "./styles";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "@mantine/hooks";
//Actions
import { like, _delete } from "store/comments/comments.thunk";
//Components
import Moment from "react-moment";
//UI Components
import { Comments, Common } from "components";
import { Paper, Text, Avatar, Group, Stack, ActionIcon } from "@mantine/core";
//Icons
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const Comment = ({ data, user }) => {
  //Hooks
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const [, setLocal] = useLocalStorage({ key: "editComment" });
  //Stats
  const [isModelOpened, setIsModelOpened] = useState(false);
  //Checkers
  const isLoggedIn = user !== null;
  let isAuthor;
  let isAdmin;
  let likeIcon;

  if (isLoggedIn) {
    isAuthor = data.author._id === user._id;
    isAdmin = user.role === "admin";
    likeIcon = data.likes.includes(user._id) ? (
      <AiFillHeart size={18} color="red" />
    ) : (
      <AiOutlineHeart size={18} color="red" />
    );
  }

  const handleEdit = async () => {
    setLocal(data);
  };

  const handleDelete = async () => {
    await dispatch(_delete({ _id: data._id }));
  };

  const handleLike = async () => {
    await dispatch(like({ _id: data._id, userId: user._id }));
  };

  return (
    <>
      <Paper withBorder className={classes.paper}>
        <Group position="apart">
          <Group>
            <Avatar
              src={data.author.avatarURL}
              alt={data.author.username}
              radius="md"
            />
            <div>
              <Text size="sm">{data.author.username}</Text>
              <Text size="xs" color="dimmed">
                <Group>
                  <Moment fromNow interval={60000}>
                    {data.createdAt}
                  </Moment>
                </Group>
              </Text>
            </div>
          </Group>
          {isLoggedIn && (isAuthor || isAdmin) && (
            <Comments.OptionsButton
              edit={handleEdit}
              _delete={() => setIsModelOpened(true)}
            />
          )}
        </Group>

        <Group mt="md">
          <Stack align="center" spacing="xs">
            {/* Like Button */}
            {isLoggedIn && (
              <ActionIcon onClick={handleLike}>{likeIcon}</ActionIcon>
            )}
            {/* Number of Likes */}
            <Text size="sm" color="dimmed">
              {data.likes?.length} likes
            </Text>
          </Stack>
          <Text className={classes.content}>{data.body}</Text>
        </Group>
      </Paper>
      <Common.Modals.Delete
        open={isModelOpened}
        close={() => setIsModelOpened(false)}
        yes={handleDelete}
      />
    </>
  );
};

export default Comment;
