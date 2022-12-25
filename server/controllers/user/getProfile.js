import { memoryModel, userModel, commentModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";
import { imgConfig } from "../../configs/index.js";

export default async function getProfile(req, res) {
  const { userId } = res.locals;

  try {
    const userPromise = userModel
      .findById(userId)
      .select("username avatar createdAt")
      .lean();
    const numberOfLikesPromise = memoryModel.countDocuments({ likes: userId });
    const memoriesCountPromise = memoryModel.countDocuments({ author: userId });
    const commentsCountPromise = commentModel.countDocuments({
      author: userId,
    });

    const [userData, numberOfMemories, numberOfComments, numberOfLikes] =
      await Promise.all([
        userPromise,
        memoriesCountPromise,
        commentsCountPromise,
        numberOfLikesPromise,
      ]);

    userData.avatarURL = helpers.genImageURL(userData.avatar, imgConfig.avatar);

    res.status(200).json({
      statusCode: 200,
      from: "controllers/user/getProfile 1",
      data: {
        ...userData,
        numberOfLikes,
        numberOfMemories,
        numberOfComments,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(503).json({
      statusCode: 503,
      from: "controllers/user/getProfile 2",
      message: "Something went wrong. Please try again later.",
    });
  }
}
