import { userModel } from "../../models/index.js";

export default async function (req, res, next) {
  const email = req.body.email;

  const userData = await userModel.findOne({ email }).lean();

  if (req.url.includes("login")) {
    if (!userData) {
      return res.status(404).json({
        statusCode: 404,
        from: "middlewares/isEmailExists 1",
        message: "Either email or password is incorrect.",
      });
    }
  } else if (req.url.includes("register")) {
    if (userData) {
      return res.status(409).json({
        statusCode: 409,
        from: "middlewares/isEmailExists 2",
        message: "An account with that email already exists.",
      });
    }
  }

  req.localData = userData;

  next();
}
