import { helpers } from "../../utils/index.js";

export default async function (req, res, next) {
  const userData = req.localData;
  const { password } = req.body;

  const isCorrect = await helpers.verifyBcrypt(password, userData.password);

  if (!isCorrect) {
    return res.status(409).json({
      statusCode: 409,
      from: "middlewares/auth/isPasswordsCorrect",
      message: "Either email or password is incorrect.",
    });
  }

  next();
}
