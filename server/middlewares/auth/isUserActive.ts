import type { Request, Response, NextFunction } from "express";

export default async function isUserActive(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // note: localData is declared as AuthUser which omits `isActive`; cast to the
  // shape actually stored at runtime (a full user document) to read it.
  const { isActive } = req.localData as unknown as { isActive: boolean };

  if (!isActive) {
    return res.status(401).json({
      statusCode: 401,
      message: "You have to activate your account. Please check your email.",
    });
  }

  next();
}
