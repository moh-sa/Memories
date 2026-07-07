// Hooks
import { useEffect } from "react";
import { useStyles } from "./styles";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTitle, useLocalStorage } from "Hooks";
// Actions
import { getAll, like, _delete } from "store/memories/memories.thunk";
// UI Components
import { Common, MainPage } from "components";
import { Container } from "@mantine/core";
// Types
import type { RootState } from "store/store";
import { useAppDispatch, useAppSelector } from "store/hooks";
import type {
  DeleteMemoryArg,
  LikeMemoryArg,
  Memory,
} from "types";

const Home = () => {
  // Hookes
  const { classes } = useStyles();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { set } = useLocalStorage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setTitle } = useTitle();
  // Selectors
  const data = useAppSelector((state: RootState) => state.memories);
  const { user } = useAppSelector((state: RootState) => state.auth);
  // Checkers
  const memories = data.memories;
  const isReady = memories !== null;
  // Variables
  const currentPage = searchParams.get("page") ? searchParams.get("page") : 1;
  // setTitle
  setTitle("Share memories with the world!");

  const handleOnPageChange = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  const likeMemory = async (data: LikeMemoryArg) => {
    await dispatch(like(data));
  };

  const editMemory = (data: Memory) => {
    set("editMemory", data);
    navigate("/memory/edit");
  };

  const deleteMemory = async (data: DeleteMemoryArg) => {
    await dispatch(_delete(data));
  };

  useEffect(() => {
    void dispatch(getAll({ page: currentPage }));
  }, [currentPage, dispatch]);

  return (
    <section className={classes.section}>
      <Container size="xl">
        {!isReady && <Common.LoadingOverlay />}
        {isReady && (
          <MainPage.Memories
            data={memories}
            user={{ _id: user?._id, role: user?.role }}
            like={likeMemory}
            edit={editMemory}
            _delete={deleteMemory}
          />
        )}
        <MainPage.Pagination
          currentPage={currentPage}
          numberOfPages={data.numberOfPages}
          onPageChange={handleOnPageChange}
        />
      </Container>
    </section>
  );
};

export default Home;
