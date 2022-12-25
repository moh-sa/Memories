import { API } from "./options";

//GET
const get = (data) => API.get(`/recommendations/${data._id}`);

export default {
  get,
};
