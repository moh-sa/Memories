import { API } from "./options";

//GET
const getTitles = () => API.get(`/search/getTitles`);
const search = ({ page, query, tags }) =>
  API.get(`/search?page=${page}&query=${query}&tags=${tags}`);

export default {
  search,
  getTitles,
};
