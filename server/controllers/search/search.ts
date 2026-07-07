import type { Request, Response } from "express";
import { memoryModel, commentModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";
import { imgConfig } from "../../configs/index.js";

interface LeanMemory {
  _id: string;
  cover: string;
  coverURL?: string;
  numberOfComments?: number;
  author: { avatar: string; avatarURL?: string };
}

export default async function search(req: Request, res: Response) {
  const query = req.query.query as string;
  const tags = req.query.tags as string;
  const page = req.query.page as string;
  const title = new RegExp(query, "i");
  const updatedTags = tags.toLowerCase().split(",");

  const LIMIT = 8;
  const startIndex = (parseInt(page) - 1) * LIMIT;

  try {
    const numberOfMemories = await memoryModel.countDocuments({
      $or: [{ title }, { tags: { $in: updatedTags } }],
    });

    const memories = await memoryModel
      .find({ $or: [{ title }, { tags: { $in: updatedTags } }] })
      .sort({ _id: -1 })
      .skip(startIndex)
      .limit(LIMIT)
      .populate("author", "username avatar")
      .lean<LeanMemory[]>();

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
      from: "controllers/search/search 1",
      data: {
        memories,
        numberOfPages: Math.ceil(numberOfMemories / LIMIT),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      statusCode: 503,
      from: "controllers/search/search 2",
      message: "Something went wrong. Please try again.",
    });
  }
}
