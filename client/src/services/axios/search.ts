import { API } from "./options";
import type { MemoriesResponse, SearchArg, TitlesResponse } from "types";

//GET
const getTitles = () => API.get<TitlesResponse>(`/search/getTitles`);
const search = ({ page, query, tags }: SearchArg) =>
  API.get<MemoriesResponse>(`/search?page=${page}&query=${query}&tags=${tags}`);

export default {
  search,
  getTitles,
};
