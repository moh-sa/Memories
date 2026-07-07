import { API } from "./options";
import type {
  AccessTokenResponse,
  DeleteMemoryArg,
  GetMemoriesArg,
  GetSingleMemoryArg,
  LikeMemoryArg,
  MemoriesResponse,
  MemoryMutationResponse,
  MemoryResponse,
  TagsResponse,
} from "types";

//GET
const getAll = (data: GetMemoriesArg) =>
  API.get<MemoriesResponse>(
    `/memory/getAll?${
      data.username
        ? `page=${data.page}&username=${data.username}&type=${data.type}`
        : `page=${data.page}`
    }`
  );
const getSingle = (data: GetSingleMemoryArg) =>
  API.get<MemoryResponse>(`/memory/getSingle/${data._id}`);
const getTags = () => API.get<TagsResponse>("/memory/getTags");

//POST
const create = (data: unknown) =>
  API.post<MemoryMutationResponse>("/memory/create", data);

//PATCH
const update = (data: unknown) =>
  API.patch<MemoryMutationResponse>("/memory/update", data);
const like = (data: LikeMemoryArg) =>
  API.patch<MemoryMutationResponse>("/memory/like", data);

//DELETE
const _delete = (data: DeleteMemoryArg) =>
  API.delete<{ accessToken: AccessTokenResponse }>("/memory/delete", { data });

export default {
  create,
  getAll,
  getSingle,
  getTags,
  update,
  like,
  _delete,
};
