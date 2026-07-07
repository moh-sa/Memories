import type { FilterQuery } from "mongoose";
import { userModel } from "../models/index.js";
import type { User } from "../models/user.js";

export default async function (data: FilterQuery<User>) {
  const isExists = await userModel.exists(data);
  if (isExists) {
    return true;
  } else {
    return false;
  }
}
