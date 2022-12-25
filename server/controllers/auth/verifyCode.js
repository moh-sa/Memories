import { userModel } from "../../models/index.js";

export default async function verifyCode(req, res) {
  const { code } = req.query;

  const user = await userModel
    .findOne({ activationCode: code })
    .select("isActive")
    .lean();

  if (!user) {
    return res.status(404).json({
      statusCode: 404,
      from: "controllers/auth/verifyCode 1",
      message:
        "We couldn't verify this activation code in the database.\nPlease Check your email and try again.",
    });
  }

  if (user.isActive) {
    return res.status(409).json({
      statusCode: 409,
      from: "controllers/auth/verifyCode 2",
      message:
        "This activation code has already been used before.\n Please check your email and try again.",
    });
  }

  await userModel.updateOne({ activationCode: code }, { isActive: true });

  return res.status(200).json({
    statusCode: 200,
    from: "controllers/auth/verifyCode 3",
    message:
      "Your account has been successfully activated.\n We will redirect you to the Login page after 5 seconds.",
  });
}
