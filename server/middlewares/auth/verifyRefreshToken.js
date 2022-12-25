import { cookiesConfig, jwtConfig } from "../../configs/index.js";
import { helpers } from "../../utils/index.js";

export default async function verifyRefreshToken(req, res, next) {
  const refreshToken = req.cookies[cookiesConfig.refresh.name];

  if (!refreshToken) {
    return res.status(404).json({
      refreshToken: {
        statusCode: 404,
        from: "middlewares/auth/verifyRefreshToken 1",
        message: "Please Login.",
      },
    });
  }

  const verifyToken = await helpers.verifyJWT(
    refreshToken,
    jwtConfig.REFRESH_SECRET
  );

  if (verifyToken.isExpired) {
    res.clearCookie(cookiesConfig.refresh.name);

    return res.status(401).json({
      refreshToken: {
        statusCode: 401,
        from: "middlewares/auth/verifyRefreshToken 2",
        message: "Your Session has been expired. Please Login again.",
      },
    });
  } else if (verifyToken.isSecretNotValid) {
    res.clearCookie(cookiesConfig.refresh.name);

    return res.status(406).json({
      refreshToken: {
        statusCode: 406,
        from: "middlewares/auth/verifyRefreshToken 3",
        message: "Your credentials are invalid. Please try login.",
      },
    });
  }

  res.locals.data = verifyToken.data;
  next();
}
