import type { Request, Response } from "express";
import { memoryModel } from "../../models/index.js";
import { cloudinary } from "../../services/index.js";
import { helpers } from "../../utils/index.js";

export default async function _delete(req: Request, res: Response) {
  const { _id, public_id } = req.body as { _id: string; public_id: string };

  const response = helpers.tokenResponse(
    res.locals.accessToken,
    "controllers/comment/delete 0",
  );

  try {
    await cloudinary.destory(public_id);
    await memoryModel.findByIdAndRemove(_id);

    return res.status(200).json({
      accessToken: response,
      memory: {
        statusCode: 200,
        from: "controllers/memory/delete 1",
        message: "Your memory has been successfully deleted.",
      },
    });
  }
  catch (error) {
    console.log(error);
    return res.status(503).json({
      accessToken: response,
      memory: {
        statusCode: 503,
        from: "controllers/memory/delete 2",
        message: "Something went wrong. Please try again.",
      },
    });
  }
}
