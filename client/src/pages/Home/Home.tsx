// Hooks
import { useState, useEffect } from "react";
import { useStyles } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTitle, useLocalStorage } from "Hooks";
// Actions
import { getAll, like, _delete } from "store/memories/memories.thunk";
// UI Components
import { Common, MainPage } from "components";
import { Container } from "@mantine/core";
// Types
import type { AppDispatch, RootState } from "store/store";
import type {
  DeleteMemoryArg,
  GetMemoriesArg,
  LikeMemoryArg,
  Memory,
} from "types";

const Home = () => {
  // Hookes
  const { classes } = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { set } = useLocalStorage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setTitle } = useTitle();
  // states
  const [isLoading, setIsLoading] = useState(true);
  // Selectors
  const data = useSelector((state: RootState) => state.memories);
  const { user } = useSelector((state: RootState) => state.auth);
  // Checkers
  const isReady = data.memories !== null;
  // Variables
  const currentPage = searchParams.get("page") ? searchParams.get("page") : 1;
  // setTitle
  setTitle("Share memories with the world!");

  const handleOnPageChange = (data: number) => {
    setSearchParams({ page: data as unknown as string });
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

  const getAllMemories = async (page: GetMemoriesArg["page"] = 1) => {
    setIsLoading(true);
    await dispatch(getAll({ page }));
    setIsLoading(false);
  };

  useEffect(() => {
    void (async () => {
      await getAllMemories(currentPage);
    })();
  }, [currentPage]);

  return (
    <section className={classes.section}>
      <Container size="xl">
        {isLoading && <Common.LoadingOverlay />}
        {isReady && (
          <MainPage.Memories
            data={data.memories as Memory[]}
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
