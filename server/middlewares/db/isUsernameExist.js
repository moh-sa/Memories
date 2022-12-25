import { userModel } from "../../models/index.js";

export default async function isUsernameExist(req, res, next) {
  const { username: nameQuery } = req.query;
  const { username: nameParam } = req.params;
  const username = nameQuery ? nameQuery : nameParam;

  if (username) {
    const usernameReg = new RegExp(username, "i");
    const isExist = await userModel.exists({ username: usernameReg });

    if (isExist) {
      res.locals.userId = isExist._id.toString();
    } else {
      return res.status(404).json({
        statusCode: 404,
        from: "middlewares/db/isUsernameExist",
        message:
          "We didn't find the requested username.\nPlease check and try again.",
      });
    }
  }

  next();
}
