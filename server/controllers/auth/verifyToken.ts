import type { Request, Response } from "express";
import { helpers } from "../../utils/index.js";

export default function verifyToken(_req: Request, res: Response) {
  const response = helpers.tokenResponse(
    res.locals.accessToken,
    "controllers/auth/verifyToken 0",
  );

  return res.status(200).json({
    ...response,
  });
}
