import type { Request, Response } from "express";
import { commentModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";
import { imgConfig } from "../../configs/index.js";
import { getQueryString } from "../../utils/queryParams.js";

interface LeanPopulatedComment {
  author: { avatar: string; avatarURL?: string };
}

export default async function getAll(req: Request, res: Response) {
  const _id = getQueryString(req.query, "_id");
  const userId = getQueryString(req.query, "userId");
  const query = _id ? { memoryId: _id } : { author: userId };

  try {
    const comments = await commentModel
      .find(query)
      .populate("author", "username avatar")
      .sort({ _id: -1 })
      .lean<LeanPopulatedComment[]>();

    comments.map(
      comment =>
        (comment.author.avatarURL = helpers.genImageURL(
          comment.author.avatar,
          imgConfig.avatar,
        )),
    );

    res.status(200).json({
      statusCode: 200,
      from: "controllers/comment/getAll 1",
      data: {
        comments,
      },
    });
  }
  catch (error) {
    console.log(error);
    res.status(503).json({
      statusCode: 503,
      from: "controllers/comment/getAll 2",
      message: "Something went wrong. Please try again.",
    });
  }
}
