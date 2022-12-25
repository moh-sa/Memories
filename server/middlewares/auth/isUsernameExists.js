import { isUserDataExists } from "../../services/index.js";

export default async function isUsernameExists(req, res, next) {
  const username = req.body.username;

  const isExists = await isUserDataExists({ username });

  if (isExists) {
    return res.status(409).json({
      statusCode: 409,
      from: "middlewares/isUsernameExists",
      message: "An account with that username already exists.",
    });
  }

  next();
}
