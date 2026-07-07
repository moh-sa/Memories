// UI Components
import Cards from "components/common/Cards";
import { Title, Center } from "@mantine/core";
import type { Comment, User } from "types";

interface ListProps {
  data: Comment[];
  user: User | null;
}

const List = ({ data, user }: ListProps) => {
  const comments = data.map(comment => (
    <Cards.Comment key={comment._id} data={comment} user={user} />
  ));

  return (
    <div>
      {data.length === 0 && (
        <Center>
          <Title order={4}>Be the first to comment!</Title>
        </Center>
      )}
      {data.length > 0 && (
        <div
          style={{
            maxHeight: user ? "108vh" : "122vh",
            overflow: "auto",
          }}
        >
          {comments}
        </div>
      )}
    </div>
  );
};

export default List;
