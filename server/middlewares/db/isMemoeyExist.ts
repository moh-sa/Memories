import type { Request, Response, NextFunction } from "express";
import { memoryModel } from "../../models/index.js";

export default async function isMemoryExist(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.params;

  if (_id) {
    const isExist = await memoryModel.exists({ _id });
    if (isExist) {
      res.locals.userId = isExist._id.toString();
    }
    else {
      return res.status(404).json({
        statusCode: 404,
        from: "middlewares/db/isMemoryExist",
        message:
          "We didn't find the requested Memory.\nPlease check and try again.",
      });
    }
  }

  next();
}
