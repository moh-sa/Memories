import { API } from "./options";
import type {
  AccessTokenResponse,
  CommentLikeResponse,
  CommentMutationResponse,
  CommentsResponse,
  CreateCommentArg,
  DeleteCommentArg,
  GetCommentsArg,
  LikeCommentArg,
} from "types";

// GET

const getAll = (data: GetCommentsArg) =>
  API.get<CommentsResponse>(
    `/comment/getAll?${
      data.userId ? `userId=${data.userId}` : `_id=${data._id}`
    }`,
  );

// POST
const create = (data: CreateCommentArg) =>
  API.post<CommentMutationResponse>("/comment/create", data);

// PATCH
const update = (data: unknown) =>
  API.patch<CommentMutationResponse>("/comment/update", data);
const like = (data: LikeCommentArg) =>
  API.patch<CommentLikeResponse>("/comment/like", data);

// DELETE
const _delete = (data: DeleteCommentArg) =>
  API.delete<{ accessToken: AccessTokenResponse }>("/comment/delete", { data });

export default {
  create,
  getAll,
  update,
  like,
  _delete,
};
