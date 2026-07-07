import type { Request, Response, NextFunction } from "express";
import { commentModel } from "../../models/index.js";

export default async function isCommentsExist(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.params;

  if (_id) {
    const isExist = await commentModel.exists({ memoryId: _id });
    if (isExist) {
      res.locals.userId = isExist._id.toString();
    }
    else {
      return res.status(404).json({
        statusCode: 404,
        from: "middlewares/db/isCommentExist",
        message:
          "We didn't find comments for the requested Memory.\nPlease check and try again.",
      });
    }
  }

  next();
}
