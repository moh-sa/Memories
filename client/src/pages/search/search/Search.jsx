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

const Search = () => {
  //Hookes
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const { set } = useLocalStorage();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setTitle } = useTitle();
  //states
  const [isLoading, setIsLoading] = useState(true);
  //Selectors
  const data = useSelector((state) => state.memories);
  const { user } = useSelector((state) => state.auth);
  //Variables
  const getQuery = searchParams.get("query");
  const getTags = searchParams.get("tags");
  const getPage = searchParams.get("page");
  const currentPage = getPage ? getPage : 1;
  //Checkers
  const isReady = data?.memories !== null;
  const isExists = data?.memories?.length > 0;
  //setTitle
  getQuery && setTitle(`${getQuery} search results`);
  getTags && setTitle(`${getTags} search results`);

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

  const getSearchResults = async (page = 1) => {
    setIsLoading(true);
    const query = getQuery ? getQuery : "none";
    const tags = getTags ? getTags : "none";

    const { payload } = await dispatch(searchReq({ page, query, tags }));
    if (payload?.statusCode === 404) {
      navigate(`/${payload?.statusCode}`, {
        state: { code: payload.statusCode, msg: payload.message },
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
              data={data.memories}
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
