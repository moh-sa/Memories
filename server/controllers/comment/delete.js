import { commentModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";

export default async function _delete(req, res) {
  const { _id } = req.body;

  const response = helpers.tokenResponse(
    res.locals.accessToken,
    "controllers/comment/delete 0"
  );

  try {
    await commentModel.findByIdAndRemove(_id);

    return res.status(200).json({
      accessToken: response,
      comment: {
        statusCode: 200,
        from: "controllers/comment/delete 1",
        message: "Your comment has been deleted.",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      accessToken: response,
      comment: {
        statusCode: 503,
        from: "controllers/comment/delete 2",
        message: "Something went wrong. Please try again.",
      },
    });
  }
}
