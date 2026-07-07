// Hooks
import { useEffect } from "react";
import { useStyles } from "./styles";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTitle, useLocalStorage } from "Hooks";
// Actions
import { searchReq, like, _delete } from "store/memories/memories.thunk";
// UI Components
import { Common, MainPage } from "components";
import { Container, Title, Text, Button } from "@mantine/core";
// Types
import type { RootState } from "store/store";
import { useAppDispatch, useAppSelector } from "store/hooks";
import type {
  DeleteMemoryArg,
  LikeMemoryArg,
  Memory,
} from "types";

const Search = () => {
  // Hookes
  const { classes } = useStyles();
  const dispatch = useAppDispatch();
  const { set } = useLocalStorage();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setTitle } = useTitle();
  // Selectors
  const data = useAppSelector((state: RootState) => state.memories);
  const { user } = useAppSelector((state: RootState) => state.auth);
  // Variables
  const getQuery = searchParams.get("query");
  const getTags = searchParams.get("tags");
  const getPage = searchParams.get("page");
  const currentPage = getPage ? getPage : 1;
  const memories = data.memories;
  // Checkers
  const isReady = memories !== null;
  const isExists = Boolean(memories?.length);
  // setTitle
  if (getQuery) {
    setTitle(`${getQuery} search results`);
  }
  if (getTags) {
    setTitle(`${getTags} search results`);
  }

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
    void (async () => {
      if (!search || (!getTags && !getQuery)) {
        navigate("/");
        return;
      }

      const query = getQuery ? getQuery : "none";
      const tags = getTags ? getTags : "none";
      const result = await dispatch(searchReq({ page: currentPage, query, tags }));

      if (searchReq.rejected.match(result) && result.payload?.statusCode === 404) {
        navigate(`/${result.payload.statusCode}`, {
          state: { code: result.payload.statusCode, msg: result.payload.message },
        });
      }
    })();
  }, [currentPage, search, getQuery, getTags, navigate, dispatch]);

  return (
    <section className={classes.section}>
      <Container size="xl">
        <Title order={3} my="md">
          {getQuery}
          {" "}
          {getTags}
          {" "}
          Search Results
        </Title>
        {!isReady && <Common.LoadingOverlay />}
        {isReady && !isExists && (
          <div className={classes.notFound}>
            <Title order={2}>Uh Oh!</Title>
            <Text>
              The requested search cannot be found. Please try something else.
            </Text>
            <Button onClick={() => { navigate(-1); }} mt="md">
              Go Back
            </Button>
          </div>
        )}
        {isReady && isExists && (
          <>
            <MainPage.Memories
              data={memories}
              user={{ _id: user?._id, role: user?.role }}
              like={likeMemory}
              edit={editMemory}
              _delete={deleteMemory}
            />

            <MainPage.Pagination
              currentPage={currentPage}
              numberOfPages={data.numberOfPages}
              onPageChange={handleOnPageChange}
            />
          </>
        )}
      </Container>
    </section>
  );
};

export default Search;
