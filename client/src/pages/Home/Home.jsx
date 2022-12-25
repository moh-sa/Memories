//Hooks
import { useState, useEffect } from "react";
import { useStyles } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTitle, useLocalStorage } from "Hooks";
//Actions
import { getAll, like, _delete } from "store/memories/memories.thunk";
//UI Components
import { Common, MainPage } from "components";
import { Container } from "@mantine/core";

const Home = () => {
  //Hookes
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { set } = useLocalStorage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setTitle } = useTitle();
  //states
  const [isLoading, setIsLoading] = useState(true);
  //Selectors
  const data = useSelector((state) => state.memories);
  const { user } = useSelector((state) => state.auth);
  //Checkers
  const isReady = data.memories !== null;
  //Variables
  const currentPage = searchParams.get("page") ? searchParams.get("page") : 1;
  //setTitle
  setTitle("Share memories with the world!");

  const handleOnPageChange = async (data) => {
    setSearchParams({ page: data });
  };

  const likeMemory = async (data) => {
    await dispatch(like(data));
  };

  const editMemory = (data) => {
    set("editMemory", data);
    navigate("/memory/edit");
  };

  const deleteMemory = async (data) => {
    await dispatch(_delete(data));
  };

  const getAllMemories = async (page = 1) => {
    setIsLoading(true);
    await dispatch(getAll({ page }));
    setIsLoading(false);
  };

  useEffect(() => {
    getAllMemories(currentPage);
  }, [currentPage]);

  return (
    <section className={classes.section}>
      <Container size="xl">
        {isLoading && <Common.LoadingOverlay />}
        {isReady && (
          <MainPage.Memories
            data={data.memories}
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
