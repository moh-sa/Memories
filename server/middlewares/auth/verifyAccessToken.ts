import type { Request, Response, NextFunction, CookieOptions } from "express";
import { userModel } from "../../models/index.js";
import jwt from "jsonwebtoken";
import { cookiesConfig, jwtConfig, imgConfig } from "../../configs/index.js";
import { helpers } from "../../utils/index.js";

interface AccessTokenUser {
  _id: unknown;
  username: string;
  avatar: string;
  role: string;
  avatarURL?: string;
}

export default async function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const accessToken = (req.cookies as Record<string, string>)[
    cookiesConfig.access.name
  ];

  const verifyToken = helpers.verifyJWT(
    accessToken,
    jwtConfig.ACCESS_SECRET,
  );

  if (verifyToken.isExpired) {
    const userId = (res.locals.data as { _id: string })._id;
    const userData = await userModel
      .findById(userId)
      .select("_id username avatar role")
      .lean<AccessTokenUser>();

    userData.avatarURL = helpers.genImageURL(userData.avatar, imgConfig.avatar);

    const encryptedData = jwt.sign(userData, jwtConfig.ACCESS_SECRET, {
      expiresIn: jwtConfig.ACCESS_EXP,
    });

    // note: `overwrite` is not part of express's CookieOptions; cast preserves
    // this extra property being passed at runtime without altering behavior.
    res.cookie(cookiesConfig.access.name, encryptedData, {
      ...cookiesConfig.access.options,
      overwrite: true,
    } as CookieOptions);

    res.locals.accessToken = {
      statusCode: 201,
      isAuth: true,
      from: "middlewares/auth/verifyAccessToken 2",
      message: "created new accessToken",
      data: {
        accessToken: cookiesConfig.access.name,
      },
    };
  }
  else if (verifyToken.isSecretNotValid) {
    res.clearCookie(cookiesConfig.access.name);

    return res.status(406).json({
      statusCode: 406,
      isAuth: false,
      from: "middlewares/auth/verifyAccessToken 3",
      message: "Your credentials are invalid. Please try login again.",
    });
  }

  next();
}
