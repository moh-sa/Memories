import type { Request, Response } from "express";
import { commentModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";
import { imgConfig } from "../../configs/index.js";
import {
  isCommentCreateBody,
  isPopulatedAuthor,
} from "../../utils/requestBody.js";

export default async function create(req: Request, res: Response) {
  if (!isCommentCreateBody(req.body)) {
    return res.status(400).json({
      statusCode: 400,
      from: "controllers/comment/create 0",
      message: "Invalid comment payload.",
    });
  }

  const data = req.body;

  const response = helpers.tokenResponse(
    res.locals.accessToken,
    "controllers/comment/create 0",
  );

  try {
    const comment = new commentModel(data);
    await comment.save();

    const populatedComment = await commentModel
      .findById(comment._id)
      .populate("author", "username avatar");

    if (!populatedComment) {
      throw new Error("Failed to load created comment.");
    }

    const newComment = populatedComment.toObject();
    const { author } = newComment;

    if (isPopulatedAuthor(author)) {
      author.avatarURL = helpers.genImageURL(author.avatar, imgConfig.avatar);
    }

    res.status(200).json({
      accessToken: response,
      comment: {
        statusCode: 200,
        from: "controllers/comment/create 1",
        data: {
          comment: newComment,
        },
      },
    });
  }
  catch (error) {
    console.log(error);
    res.status(503).json({
      accessToken: response,
      comment: {
        statusCode: 503,
        from: "controllers/comment/create 2",
        message: "Something went wrong! Please try again.",
      },
    });
  }
}
