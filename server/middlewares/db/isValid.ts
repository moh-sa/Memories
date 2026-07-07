import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { getQueryString } from "../../utils/queryParams.js";
import { getIdBody } from "../../utils/requestBody.js";

export default function isValid(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { _id: bodyID } = getIdBody(req.body);
  const paramsID = req.params._id;
  const queryID = getQueryString(req.query, "_id");
  const _id = bodyID || paramsID || queryID;

  if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({
      statusCode: 404,
      from: "middlewares/mongoDB/isValid 1",
      message: "Nothing with that ID was found. Please check and try again.",
    });
  }

  next();
}
