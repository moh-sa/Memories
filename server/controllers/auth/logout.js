import { cookiesConfig } from "../../configs/index.js";

export default function logout(req, res) {
  res.cookie(
    cookiesConfig.access.name,
    "(☞ﾟヮﾟ)☞☜(ﾟヮﾟ☜)",
    cookiesConfig.access.delete
  );

  res.cookie(
    cookiesConfig.refresh.name,
    "(☞ﾟヮﾟ)☞☜(ﾟヮﾟ☜)",
    cookiesConfig.refresh.delete
  );

  res.status(200).json({
    statusCode: 200,
    isAuth: false,
    from: "controllers/auth/logout",
    message: "You have been logged out.",
  });
}
