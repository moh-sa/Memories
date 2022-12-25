import { userModel } from "../../models/index.js";
import jwt from "jsonwebtoken";
import { cookiesConfig, jwtConfig, imgConfig } from "../../configs/index.js";
import { helpers } from "../../utils/index.js";

export default async function verifyAccessToken(req, res, next) {
  const accessToken = req.cookies[cookiesConfig.access.name];

  const verifyToken = await helpers.verifyJWT(
    accessToken,
    jwtConfig.ACCESS_SECRET
  );

  if (verifyToken.isExpired) {
    const userId = res.locals.data._id;
    const userData = await userModel
      .findById(userId)
      .select("_id username avatar role")
      .lean();

    userData.avatarURL = helpers.genImageURL(userData.avatar, imgConfig.avatar);

    const encryptedData = await jwt.sign(userData, jwtConfig.ACCESS_SECRET, {
      expiresIn: jwtConfig.ACCESS_EXP,
    });

    res.cookie(cookiesConfig.access.name, encryptedData, {
      ...cookiesConfig.access.options,
      overwrite: true,
    });

    res.locals.accessToken = {
      statusCode: 201,
      isAuth: true,
      from: "middlewares/auth/verifyAccessToken 2",
      message: "created new accessToken",
      data: {
        accessToken: cookiesConfig.access.name,
      },
    };
  } else if (verifyToken.isSecretNotValid) {
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
