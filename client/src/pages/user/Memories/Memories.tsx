// Hooks
import { useEffect } from "react";
import { useStyles } from "./styles";
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
import type { RootState } from "store/store";
import { useAppDispatch, useAppSelector } from "store/hooks";
import type {
  DeleteMemoryArg,
  LikeMemoryArg,
  Memory,
} from "types";

const Memories = () => {
  // Hookes
  const { classes } = useStyles();
  const dispatch = useAppDispatch();
  const { set } = useLocalStorage();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setTitle } = useTitle();
  // Selectors
  const data = useAppSelector((state: RootState) => state.memories);
  const { user } = useAppSelector((state: RootState) => state.auth);
  // Variables
  const currentPage = searchParams.get("page") ? searchParams.get("page") : 1;
  const memories = data.memories;
  // Checkers
  const isReady = memories !== null;
  const isExists = Boolean(memories?.length);
  const isMemory
    = pathname.includes("Memories") || pathname.includes("memories");
  const isLike = pathname.includes("Likes") || pathname.includes("likes");
  // Variables
  const type = isMemory ? "memories" : isLike && "likes";
  // setTitle
  setTitle(`${username} type`);

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
      const result = await dispatch(getAll({ page: currentPage, username, type }));
      if (getAll.rejected.match(result) && result.payload?.statusCode === 404) {
        navigate(`/${result.payload.statusCode}`, {
          state: { code: result.payload.statusCode, msg: result.payload.message },
        });
      }
    })();
  }, [currentPage, dispatch, navigate, type, username]);

  return (
    <section className={classes.section}>
      <Container size="xl">
        {!isReady && <Common.LoadingOverlay />}
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

export default Memories;
