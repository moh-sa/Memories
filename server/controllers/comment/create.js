import { commentModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";
import { imgConfig } from "../../configs/index.js";

export default async function create(req, res) {
  const data = req.body;

  const response = helpers.tokenResponse(
    res.locals.accessToken,
    "controllers/comment/create 0"
  );

  try {
    const comment = new commentModel(data);
    await comment
      .save()
      .then((res) => res.populate("author", "username avatar"));

    const newComment = await JSON.parse(JSON.stringify(comment));
    newComment.author.avatarURL = helpers.genImageURL(
      comment.author.avatar,
      imgConfig.avatar
    );

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
  } catch (error) {
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
