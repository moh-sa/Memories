//Hooks
import { useStyles } from "./styles";
//UI Components
import { Common } from "components";
import { Grid } from "@mantine/core";

const Memories = ({ data, user, like, edit, _delete }) => {
  //Hookes
  const { classes } = useStyles();
  //Data
  const memoriesArray = data.map((memory, index) => (
    <Grid.Col
      key={memory._id + index}
      className={classes.GridCol}
      xs={12}
      sm={6}
      md={4}
      lg={3}
    >
      <Common.Cards.Memory
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
