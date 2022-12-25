//Hooks
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useStyles } from "./styles";
//Actions
import { logout } from "store/auth/auth.thunk";
//Components
import { Link } from "react-router-dom";
//UI Components
import { Avatar, UnstyledButton, Text } from "@mantine/core";
import { Menu, Divider, Group } from "@mantine/core";
//Icons
import { FaHeart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdLibraryAdd, MdOutlineLibraryBooks } from "react-icons/md";
import { TbLogout, TbChevronDown } from "react-icons/tb";

const UserMenu = ({ user }) => {
  const dispatch = useDispatch();
  const { classes, theme, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const logoutHandler = async () => {
    await dispatch(logout());
  };

  return (
    <Menu
      width={260}
      position="bottom-end"
      transition="pop-top-right"
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
    >
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
        >
          <Group spacing={7}>
            {/* User's Avatar */}
            <Avatar
              src={user.avatarURL}
              alt={`${user.username}'s avatar`}
              radius="md"
              size="sm"
            />
            {/* User name */}
            <Text weight={500} size="md" sx={{ lineHeight: 1 }} mr={3}>
              {user.username}
            </Text>
            <TbChevronDown size={12} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Settings</Menu.Label>
        <Menu.Item
          component={Link}
          to={`user/${user.username}`}
          icon={<CgProfile size={18} color={theme.colors.gray[6]} />}
        >
          Your Profile
        </Menu.Item>

        <Menu.Label>Make a Legacy</Menu.Label>
        <Menu.Item
          component={Link}
          to="/memory/create"
          icon={<MdLibraryAdd size={18} color={theme.colors.yellow[6]} />}
        >
          Add New Memory
        </Menu.Item>

        <Menu.Label>Your Legacy</Menu.Label>
        <Menu.Item
          component={Link}
          to={`user/${user.username}/memories`}
          icon={
            <MdOutlineLibraryBooks size={18} color={theme.colors.orange[6]} />
          }
        >
          Your Memories
        </Menu.Item>
        <Menu.Item
          component={Link}
          to={`user/${user.username}/likes`}
          icon={<FaHeart size={16} color={theme.colors.red[6]} />}
        >
          Liked Memories
        </Menu.Item>

        <Divider />

        <Menu.Label>Danger Zone</Menu.Label>
        <Menu.Item
          color="red"
          icon={<TbLogout size={16} />}
          onClick={logoutHandler}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
