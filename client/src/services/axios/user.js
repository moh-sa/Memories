import { API } from "./options";

//GET
const getProfile = (data) => API.get(`/user/getProfile/${data.username}`);

export default {
  getProfile,
};
