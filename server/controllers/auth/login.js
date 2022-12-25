import jwt from "jsonwebtoken";
import { jwtConfig, cookiesConfig, imgConfig } from "../../configs/index.js";
import { helpers } from "../../utils/index.js";

export default async function (req, res) {
  const { _id, username, role, avatar } = req.localData;
  const userId = _id.toString();
  let userData = { _id, username, role, avatar };

  userData.avatarURL = helpers.genImageURL(avatar, imgConfig.avatar);

  const accessToken = jwt.sign(
    {
      ...userData,
    },
    jwtConfig.ACCESS_SECRET,
    {
      expiresIn: jwtConfig.ACCESS_EXP,
    }
  );

  const refreshToken = jwt.sign(
    {
      _id: userId,
    },
    jwtConfig.REFRESH_SECRET,
    {
      expiresIn: jwtConfig.REFRESH_EXP,
    }
  );

  res.cookie(
    cookiesConfig.access.name,
    accessToken,
    cookiesConfig.access.options
  );

  res.cookie(
    cookiesConfig.refresh.name,
    refreshToken,
    cookiesConfig.refresh.options
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
