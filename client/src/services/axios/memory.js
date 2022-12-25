import { API } from "./options";

//GET
const getAll = (data) =>
  API.get(
    `/memory/getAll?${
      data.username
        ? `page=${data.page}&username=${data.username}&type=${data.type}`
        : `page=${data.page}`
    }`
  );
const getSingle = (data) => API.get(`/memory/getSingle/${data._id}`);
const getTags = () => API.get("/memory/getTags");

//POST
const create = (data) => API.post("/memory/create", data);

//PATCH
const update = (data) => API.patch("/memory/update", data);
const like = (data) => API.patch("/memory/like", data);

//DELETE
const _delete = (data) => API.delete("/memory/delete", { data });

export default {
  create,
  getAll,
  getSingle,
  getTags,
  update,
  like,
  _delete,
};
