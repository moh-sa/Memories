//UI Components
import { Comments as CommentsComp } from "components";

const Comments = ({ data, user, memoryId }) => {
  return (
    <div>
      {user && <CommentsComp.Form memoryId={memoryId} user={user} />}
      <CommentsComp.List data={data} user={user} />
    </div>
  );
};

export default Comments;
