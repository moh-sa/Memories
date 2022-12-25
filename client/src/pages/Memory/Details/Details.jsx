//Hooks
import { useStyles } from "./styles";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTitle } from "Hooks";
//Actions
import { recommendations } from "services";
import { getSingle, like } from "store/memory/memory.thunk";
import { getAll } from "store/comments/comments.thunk";
//UI Components
import { Container, Grid, Divider } from "@mantine/core";
import { Memory, Comments, Recommendations } from "layouts/MemoryDetails";
import { Common } from "components";

const Details = () => {
  //Basic
  const { classes } = useStyles();
  const { _id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setTitle } = useTitle();
  //useStates
  const [recosData, setRecosData] = useState(null);
  //useSelectors
  const { user } = useSelector((state) => state.auth);
  const { memory: memoryData } = useSelector((state) => state.memory);
  const { comments: commentsData } = useSelector((state) => state.comments);
  //Checkers
  const isMemoryReady = memoryData !== null;
  const isCommentsReady = commentsData !== null;
  const isRecosReady = recosData !== null;

  isMemoryReady && setTitle(memoryData.title);

  const hanldeLike = async (data) => {
    await dispatch(like(data));
  };

  const getMemorys = async () => {
    const { payload } = await dispatch(getSingle({ _id }));

    if (payload?.statusCode === 404) {
      navigate(`/${payload.statusCode}`, {
        state: { code: payload.statusCode, msg: payload.message },
      });
    }
  };

  const getComments = async () => {
    await dispatch(getAll({ _id }));
  };

  const getRecommendations = async () => {
    const { data } = await recommendations.get({ _id });
    setRecosData(data.data.recommendations);
  };

  useEffect(() => {
    getMemorys();
    getComments();
    getRecommendations();
  }, [_id]);

  return (
    <Container className={classes.section}>
      {/* MEMORY DETAILS SECTION */}
      {!isMemoryReady && <Common.LoadingOverlay />}
      {isMemoryReady && (
        <Memory data={memoryData} like={hanldeLike} user={user} />
      )}
      <Grid>
        <Grid.Col xs={12} sm={8}>
          {/* COMMENTS SECTION */}
          <div>
            <Divider
              label="Comments"
              labelPosition="center"
              variant="dashed"
              my="xl"
              size="sm"
            />
            {!isCommentsReady && <Common.LoadingOverlay />}
            {isCommentsReady && (
              <Comments memoryId={_id} data={commentsData} user={user} />
            )}
          </div>
        </Grid.Col>

        <Grid.Col xs={12} sm={4}>
          {/* RECOMMENDATION SECTION */}
          <div>
            <Divider
              label="You may also like"
              labelPosition="center"
              variant="dashed"
              my="xl"
              size="sm"
            />
            {!isRecosReady && <Common.LoadingOverlay />}
            {isRecosReady && <Recommendations recos={recosData} />}
          </div>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default Details;
