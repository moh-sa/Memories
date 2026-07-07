import type { Request, Response, NextFunction } from "express";
import { helpers } from "../../utils/index.js";

export default async function (req: Request, res: Response, next: NextFunction) {
  // note: localData is declared as AuthUser which omits `password`; cast to the
  // shape actually stored at runtime (a full user document) to read it.
  const userData = req.localData as unknown as { password: string };
  const { password } = req.body as { password: string };

  const isCorrect = await helpers.verifyBcrypt(password, userData.password);

  if (!isCorrect) {
    return res.status(409).json({
      statusCode: 409,
      from: "middlewares/auth/isPasswordsCorrect",
      message: "Either email or password is incorrect.",
    });
  }

  next();
}
