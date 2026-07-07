import { API } from "./options";
import type { GetSingleMemoryArg, RecommendationsResponse } from "types";

// GET
const get = (data: GetSingleMemoryArg) =>
  API.get<RecommendationsResponse>(`/recommendations/${data._id}`);

export default {
  get,
};
