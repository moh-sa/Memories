//UI Components
import { Menu, ActionIcon } from "@mantine/core";
//Icons
import { TbEdit, TbTrash, TbDots } from "react-icons/tb"; //Icons Imports

const OptionsButton = ({ edit, _delete }) => {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon>
          <TbDots />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item icon={<TbEdit size={14} />} onClick={edit}>
          Edit
        </Menu.Item>
        <Menu.Divider />

        <Menu.Item color="red" icon={<TbTrash size={14} />} onClick={_delete}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default OptionsButton;
