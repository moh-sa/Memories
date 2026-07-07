//UI Components
import type { ComponentProps } from "react";
import { Common } from "components";
import { Title, Center, ScrollArea } from "@mantine/core";
import type { Comment, User } from "types";

interface ListProps {
  data: Comment[];
  user: User | null;
}

const List = ({ data, user }: ListProps) => {
  //Checkers
  const isLoggedIn = !!user;
  //Data Array
  const comments = data.map((comment) => (
    <Common.Cards.Comment key={comment._id} data={comment} user={user} />
  ));
  return (
    <div>
      {(!data.length as unknown as number) > 0 && (
        <Center>
          <Title order={4}>Be the first to comment!</Title>
        </Center>
      )}
      {data.length > 0 && (
        <ScrollArea.Autosize
          {...({
            maxHeight: isLoggedIn ? "108vh" : "122vh",
          } as unknown as ComponentProps<typeof ScrollArea.Autosize>)}
        >
          {comments}
        </ScrollArea.Autosize>
      )}
    </div>
  );
};

export default List;
