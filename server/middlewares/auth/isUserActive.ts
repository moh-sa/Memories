import type { Request, Response, NextFunction } from "express";

export default function isUserActive(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userData = req.localData;

  if (!userData || !("isActive" in userData) || !userData.isActive) {
    return res.status(401).json({
      statusCode: 401,
      message: "You have to activate your account. Please check your email.",
    });
  }

  next();
}
