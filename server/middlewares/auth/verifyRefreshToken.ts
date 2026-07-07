import type { Request, Response, NextFunction } from "express";
import { cookiesConfig, jwtConfig } from "../../configs/index.js";
import { helpers } from "../../utils/index.js";
import { getCookie } from "../../utils/getCookie.js";

function isTokenPayload(value: unknown): value is { _id: string } {
  return (
    typeof value === "object"
    && value !== null
    && typeof (value as { _id?: unknown })._id === "string"
  );
}

export default function verifyRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const refreshToken = getCookie(req, cookiesConfig.refresh.name);

  if (!refreshToken) {
    return res.status(404).json({
      refreshToken: {
        statusCode: 404,
        from: "middlewares/auth/verifyRefreshToken 1",
        message: "Please Login.",
      },
    });
  }

  const verifyToken = helpers.verifyJWT(
    refreshToken,
    jwtConfig.REFRESH_SECRET,
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
  }
  else if (verifyToken.isSecretNotValid) {
    res.clearCookie(cookiesConfig.refresh.name);

    return res.status(406).json({
      refreshToken: {
        statusCode: 406,
        from: "middlewares/auth/verifyRefreshToken 3",
        message: "Your credentials are invalid. Please try login.",
      },
    });
  }

  if (!isTokenPayload(verifyToken.data)) {
    return res.status(406).json({
      refreshToken: {
        statusCode: 406,
        from: "middlewares/auth/verifyRefreshToken 4",
        message: "Your credentials are invalid. Please try login.",
      },
    });
  }

  res.locals.data = verifyToken.data;
  next();
}
