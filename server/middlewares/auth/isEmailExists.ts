import type { Request, Response, NextFunction } from "express";
import { userModel } from "../../models/index.js";
import type { AuthUser } from "../../types/express.js";

export default async function (req: Request, res: Response, next: NextFunction) {
  const { email } = req.body as { email: string };

  const userData = await userModel.findOne({ email }).lean<AuthUser | null>();

  if (req.url.includes("login")) {
    if (!userData) {
      return res.status(404).json({
        statusCode: 404,
        from: "middlewares/isEmailExists 1",
        message: "Either email or password is incorrect.",
      });
    }
  }
  else if (req.url.includes("register")) {
    if (userData) {
      return res.status(409).json({
        statusCode: 409,
        from: "middlewares/isEmailExists 2",
        message: "An account with that email already exists.",
      });
    }
  }

  // note: in the register branch userData is null here; assigning it preserves
  // the original behavior. Cast satisfies the declared AuthUser slot.
  req.localData = userData as AuthUser;

  next();
}
