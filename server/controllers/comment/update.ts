import type { Request, Response } from "express";
import { commentModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";

interface LeanPopulatedComment {
  author: { avatar: string; avatarURL?: string };
}

export default async function update(req: Request, res: Response) {
  const data = req.body as { _id: string };

  const response = helpers.tokenResponse(
    res.locals.accessToken,
    "controllers/comment/update 0"
  );

  try {
    const updatedComment = await commentModel
      .findByIdAndUpdate(data._id, data, { new: true })
      .populate("author", "username avatar")
      .lean<LeanPopulatedComment>();

    res.status(200).json({
      accessToken: response,
      comment: {
        statusCode: 200,
        from: "controllers/comment/update 1",
        message: "comment has been updated.",
        data: {
          comment: updatedComment,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      accessToken: response,
      comment: {
        statusCode: 503,
        from: "controllers/comment/update 2",
        message: "Something went wrong. Please try again.",
      },
    });
  }
}
