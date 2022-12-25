import { commentModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";

export default async function update(req, res) {
  const data = req.body;

  const response = helpers.tokenResponse(
    res.locals.accessToken,
    "controllers/comment/update 0"
  );

  try {
    const updatedComment = await commentModel
      .findByIdAndUpdate(data._id, data, { new: true })
      .populate("author", "username avatar")
      .lean();

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
