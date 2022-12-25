import { userModel } from "../models/index.js";

export default async function (data) {
  const isExists = await userModel.exists(data);
  if (isExists) {
    return true;
  } else {
    return false;
  }
}
