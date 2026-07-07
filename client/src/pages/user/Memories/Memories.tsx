// Hooks
import { useState, useEffect } from "react";
import { useStyles } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useParams, useLocation, Link } from "react-router-dom";
import { useTitle, useLocalStorage } from "Hooks";
// Actions
import { getAll, like, _delete } from "store/memories/memories.thunk";
// UI Components
import { Common, MainPage } from "components";
import { Container, Title, Text, Button } from "@mantine/core";
// Icons
import { MdArrowBackIosNew } from "react-icons/md";
// Types
import type { AppDispatch, RootState } from "store/store";
import type {
  ApiError,
  DeleteMemoryArg,
  GetMemoriesArg,
  LikeMemoryArg,
  Memory,
} from "types";

const Memories = () => {
  // Hookes
  const { classes } = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const { set } = useLocalStorage();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setTitle } = useTitle();
  // states
  const [isLoading, setIsLoading] = useState(true);
  // Selectors
  const data = useSelector((state: RootState) => state.memories);
  const { user } = useSelector((state: RootState) => state.auth);
  // Variables
  const currentPage = searchParams.get("page") ? searchParams.get("page") : 1;
  // Checkers
  const isReady = data.memories !== null;
  const isExists = (data.memories?.length as number) > 0;
  const isMemory
    = pathname.includes("Memories") || pathname.includes("memories");
  const isLike = pathname.includes("Likes") || pathname.includes("likes");
  // Variables
  const type = isMemory ? "memories" : isLike && "likes";
  // setTitle
  setTitle(`${username} type`);

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

    const { payload } = await dispatch(getAll({ page, username, type }));
    const errorPayload = payload as ApiError | undefined;
    if (errorPayload?.statusCode === 404) {
      navigate(`/${errorPayload.statusCode}`, {
        state: { code: errorPayload.statusCode, msg: errorPayload.message },
      });
    }

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
        <Text transform="capitalize" component={Link} to={`/user/${username}`}>
          <MdArrowBackIosNew />
          {" "}
          back to profile
        </Text>
        <Title order={3} my="md">
          {username}
          &apos;s
          {type}
        </Title>
        {isReady && !isExists && (
          <div className={classes.notFound}>
            <Title order={2}>Uh Oh!</Title>
            <Text>
              {username}
              {" "}
              have no memories
            </Text>
            <Button onClick={() => { navigate(-1); }} mt="md">
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

export default Memories;
