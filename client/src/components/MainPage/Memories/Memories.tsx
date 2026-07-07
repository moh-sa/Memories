// Hooks
import { useStyles } from "./styles";
// UI Components
import Cards from "components/common/Cards";
import { Grid } from "@mantine/core";
import type {
  DeleteMemoryArg,
  LikeMemoryArg,
  Memory,
} from "types";

interface MemoriesProps {
  data: Memory[];
  user: { _id?: string; role?: string };
  like: (arg: LikeMemoryArg) => void;
  edit: (data: Memory) => void;
  _delete: (data: DeleteMemoryArg) => void;
}

const Memories = ({ data, user, like, edit, _delete }: MemoriesProps) => {
  // Hookes
  const { classes } = useStyles();
  // Data
  const memoriesArray = data.map((memory, index) => (
    <Grid.Col
      key={memory._id + String(index)}
      className={classes.GridCol}
      xs={12}
      sm={6}
      md={4}
      lg={3}
    >
      <Cards.Memory
        key={memory._id}
        data={memory}
        user={user}
        like={like}
        edit={edit}
        _delete={_delete}
      />
    </Grid.Col>
  ));

  return <Grid>{memoriesArray}</Grid>;
};

export default Memories;
