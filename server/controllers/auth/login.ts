import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig, cookiesConfig, imgConfig } from "../../configs/index.js";
import { helpers } from "../../utils/index.js";
import type { AuthUser } from "../../types/express.js";

export default function (req: Request, res: Response) {
  const authUser = req.localData;

  if (!authUser || !("_id" in authUser)) {
    return res.status(500).json({
      statusCode: 500,
      from: "controllers/auth/login",
      message: "Authenticated user data is missing.",
    });
  }

  const { _id, username, role, avatar } = authUser;
  const userId = _id.toString();
  const userData: AuthUser = { _id, username, role, avatar };

  userData.avatarURL = helpers.genImageURL(avatar, imgConfig.avatar);

  const accessToken = jwt.sign(
    {
      ...userData,
    },
    jwtConfig.ACCESS_SECRET,
    {
      expiresIn: jwtConfig.ACCESS_EXP,
    },
  );

  const refreshToken = jwt.sign(
    {
      _id: userId,
    },
    jwtConfig.REFRESH_SECRET,
    {
      expiresIn: jwtConfig.REFRESH_EXP,
    },
  );

  res.cookie(
    cookiesConfig.access.name,
    accessToken,
    cookiesConfig.access.options,
  );

  res.cookie(
    cookiesConfig.refresh.name,
    refreshToken,
    cookiesConfig.refresh.options,
  );

  res.status(200).json({
    statusCode: 200,
    isAuth: true,
    from: "controllers/auth/login",
    message: "Login successfully",
    data: {
      accessToken: cookiesConfig.access.name,
    },
  });
}
