import { API } from "./options";
import type { ProfileResponse } from "types";

//GET
const getProfile = (data: { username?: string }) =>
  API.get<ProfileResponse>(`/user/getProfile/${data.username}`);

export default {
  getProfile,
};
