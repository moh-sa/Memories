import { API } from "./options";

//GET

const getAll = (data) =>
  API.get(
    `/comment/getAll?${
      data.userId ? `userId=${data.userId}` : `_id=${data._id}`
    }`
  );

//POST
const create = (data) => API.post("/comment/create", data);

//PATCH
const update = (data) => API.patch("/comment/update", data);
const like = (data) => API.patch("/comment/like", data);

//DELETE
const _delete = (data) => API.delete("/comment/delete", { data });

export default {
  create,
  getAll,
  update,
  like,
  _delete,
};
