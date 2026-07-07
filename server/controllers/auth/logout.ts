import type { Request, Response } from "express";
import { cookiesConfig } from "../../configs/index.js";

export default function logout(_req: Request, res: Response) {
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
