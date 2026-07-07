//UI Components
import { Comments as CommentsComp } from "components";
import type { Comment, User } from "types";

interface CommentsProps {
  data: Comment[];
  user: User | null;
  memoryId: string | undefined;
}

const Comments = ({ data, user, memoryId }: CommentsProps) => {
  return (
    <div>
      {user && <CommentsComp.Form memoryId={memoryId} user={user} />}
      <CommentsComp.List data={data} user={user} />
    </div>
  );
};

export default Comments;
