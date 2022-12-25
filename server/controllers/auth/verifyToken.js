import { helpers } from "../../utils/index.js";

export default async function verifyToken(req, res) {
  const response = helpers.tokenResponse(
    res.locals.accessToken,
    "controllers/auth/verifyToken 0"
  );

  return res.status(200).json({
    ...response,
  });
}
