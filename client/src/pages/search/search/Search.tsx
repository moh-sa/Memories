//Hooks
import { useState, useEffect } from "react";
import { useStyles } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTitle, useLocalStorage } from "Hooks";
//Actions
import { searchReq, like, _delete } from "store/memories/memories.thunk";
//UI Components
import { Common, MainPage } from "components";
import { Container, Title, Text, Button } from "@mantine/core";
//Types
import type { AppDispatch, RootState } from "store/store";
import type {
  ApiError,
  DeleteMemoryArg,
  LikeMemoryArg,
  Memory,
  SearchArg,
} from "types";

const Search = () => {
  //Hookes
  const { classes } = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const { set } = useLocalStorage();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setTitle } = useTitle();
  //states
  const [isLoading, setIsLoading] = useState(true);
  //Selectors
  const data = useSelector((state: RootState) => state.memories);
  const { user } = useSelector((state: RootState) => state.auth);
  //Variables
  const getQuery = searchParams.get("query");
  const getTags = searchParams.get("tags");
  const getPage = searchParams.get("page");
  const currentPage = getPage ? getPage : 1;
  //Checkers
  const isReady = data?.memories !== null;
  const isExists = (data?.memories?.length as number) > 0;
  //setTitle
  getQuery && setTitle(`${getQuery} search results`);
  getTags && setTitle(`${getTags} search results`);

  const handleOnPageChange = async (data: number) => {
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

  const getSearchResults = async (page: SearchArg["page"] = 1) => {
    setIsLoading(true);
    const query = getQuery ? getQuery : "none";
    const tags = getTags ? getTags : "none";

    const { payload } = await dispatch(searchReq({ page, query, tags }));
    const errorPayload = payload as ApiError | undefined;
    if (errorPayload?.statusCode === 404) {
      navigate(`/${errorPayload?.statusCode}`, {
        state: { code: errorPayload.statusCode, msg: errorPayload.message },
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!search || (!getTags && !getQuery)) {
      navigate("/");
    } else {
      getSearchResults(currentPage);
    }
  }, [currentPage, search]);

  return (
    <section className={classes.section}>
      <Container size="xl">
        <Title order={3} my="md">
          {getQuery} {getTags} Search Results
        </Title>
        {isLoading && <Common.LoadingOverlay />}
        {isReady && !isExists && (
          <div className={classes.notFound}>
            <Title order={2}>Uh Oh!</Title>
            <Text>
              The requested search cannot be found. Please try something else.
            </Text>
            <Button onClick={() => navigate(-1)} mt="md">
              Go Back
            </Button>
          </div>
        )}
        {isReady && isExists && (
          <>
            <MainPage.Memories
              data={data.memories as Memory[]}
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
