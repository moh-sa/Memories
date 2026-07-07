import type { Request, Response } from "express";
import { commentModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";
import { imgConfig } from "../../configs/index.js";

interface LeanComment {
  likes: string[];
}

interface LeanPopulatedComment {
  author: { avatar: string; avatarURL?: string };
}

export default async function like(req: Request, res: Response) {
  let comment: LeanComment = {} as LeanComment;
  const { _id, userId } = req.body as { _id: string; userId: string };

  const response = helpers.tokenResponse(
    res.locals.accessToken,
    "controllers/comment/like 0"
  );

  try {
    comment = await commentModel.findById(_id).lean<LeanComment>();

    const index = await comment.likes.findIndex(
      (id: string) => id.toString() === userId
    );
    if (index === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes = comment.likes.filter(
        (id: string) => id.toString() !== userId
      );
    }
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      accessToken: response,
      comment: {
        statusCode: 503,
        from: "controllers/comment/like 1",
        message: "Something went wrong. Please try again.",
      },
    });
  }

  try {
    const updatedComment = await commentModel
      .findByIdAndUpdate(_id, comment, { new: true })
      .populate("author", "username avatar")
      .lean<LeanPopulatedComment>();

    updatedComment.author.avatarURL = helpers.genImageURL(
      updatedComment.author.avatar,
      imgConfig.avatar
    );

    return res.status(200).json({
      accessToken: response,
      comment: {
        statusCode: 200,
        from: "controllers/comment/like 2",
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
        from: "controllers/comment/like 3",
        message: "Something went wrong. Please try again.",
      },
    });
  }
}
