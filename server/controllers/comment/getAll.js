import { commentModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";
import { imgConfig } from "../../configs/index.js";

export default async function getAll(req, res) {
  const { _id, userId } = req.query;
  const query = _id ? { memoryId: _id } : { author: userId };

  try {
    const comments = await commentModel
      .find(query)
      .populate("author", "username avatar")
      .sort({ _id: -1 })
      .lean();

    comments.map(
      (comment) =>
        (comment.author.avatarURL = helpers.genImageURL(
          comment.author.avatar,
          imgConfig.avatar
        ))
    );

    res.status(200).json({
      statusCode: 200,
      from: "controllers/comment/getAll 1",
      data: {
        comments,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(503).json({
      statusCode: 503,
      from: "controllers/comment/getAll 2",
      message: "Something went wrong. Please try again.",
    });
  }
}
