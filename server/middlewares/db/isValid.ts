import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export default async function isValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { _id: bodyID } = req.body as { _id?: string };
  const { _id: paramsID } = req.params;
  const queryID = req.query._id as string | undefined;
  const _id = bodyID ? bodyID : paramsID ? paramsID : queryID;

  if (!mongoose.Types.ObjectId.isValid(_id as string)) {
    return res.status(404).json({
      statusCode: 404,
      from: "middlewares/mongoDB/isValid 1",
      message: "Nothing with that ID was found. Please check and try again.",
    });
  }

  next();
}
