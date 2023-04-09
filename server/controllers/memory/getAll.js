import { memoryModel, commentModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";
import { imgConfig } from "../../configs/index.js";

export default async function (req, res) {
  
  console.log(req.protocol);
  console.log(req.originalUrl);
  console.log(req.get("host"));
  
  const { page, type } = req.query;
  const { userId } = res.locals;
  const isMemory = type === "memories" && { author: userId };
  const isLike = type === "likes" && { likes: userId };

  let query = {};
  if (userId) {
    query = isMemory ? isMemory : isLike;
  }

  const LIMIT = 8;
  const startIndex = (parseInt(page) - 1) * LIMIT;
  let memories = [];
  let numberOfMemories = 1;

  try {
    numberOfMemories = await memoryModel.countDocuments(query);
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      statusCode: 503,
      from: "controllers/memory/getAll 1",
      message: "Something went wrong. Please try again.",
    });
  }

  try {
    memories = await memoryModel
      .find(query)
      .sort({ _id: -1 })
      .skip(startIndex)
      .limit(LIMIT)
      .populate("author", "username avatar")
      .lean();

    //Get Number of Comments for each Memory
    await Promise.all(
      memories.map(
        async (memory) =>
          (memory.numberOfComments = await commentModel.countDocuments({
            memoryId: memory._id,
          }))
      )
    );

    //Generate Cover URL
    memories.map(
      (memory) =>
        (memory.coverURL = helpers.genImageURL(
          memory.cover,
          imgConfig.cover.small
        ))
    );

    //Generate Avatar URL
    memories.map(
      (memory) =>
        (memory.author.avatarURL = helpers.genImageURL(
          memory.author.avatar,
          imgConfig.avatar
        ))
    );

    return res.status(200).json({
      statusCode: 200,
      from: "controllers/memory/getAll 2",
      data: {
        memories,
        numberOfPages: Math.ceil(numberOfMemories / LIMIT),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      statusCode: 503,
      from: "controllers/memory/getAll 3",
      message: "Something went wrong. Please try again.",
    });
  }
}
