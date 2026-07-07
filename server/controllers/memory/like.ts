import type { Request, Response } from "express";
import { memoryModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";
import { imgConfig } from "../../configs/index.js";

interface LeanMemoryLikes {
  likes: string[];
}

interface LeanPopulatedMemory {
  cover: string;
  coverURL?: string;
  author: { avatar: string; avatarURL?: string };
}

export default async function like(req: Request, res: Response) {
  const { _id, userId, type } = req.body as {
    _id: string;
    userId: string;
    type: string;
  };
  const isCard = type === "card";
  let memory: LeanMemoryLikes = {} as LeanMemoryLikes;

  const response = helpers.tokenResponse(
    res.locals.accessToken,
    "controllers/comment/like 0"
  );

  try {
    memory = await memoryModel.findById(_id).lean<LeanMemoryLikes>();

    const index = await memory.likes.findIndex(
      (id: string) => id.toString() === userId
    );
    if (index === -1) {
      memory.likes.push(userId);
    } else {
      memory.likes = memory.likes.filter(
        (id: string) => id.toString() !== userId
      );
    }
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      accessToken: response,
      memory: {
        statusCode: 503,
        from: "controllers/memory/like 1",
        message: "Something went wrong! Please try again.",
      },
    });
  }

  try {
    const updatedMemory = await memoryModel
      .findByIdAndUpdate(_id, memory, { new: true })
      .populate("author", "username avatar")
      .lean<LeanPopulatedMemory>();

    updatedMemory.coverURL = helpers.genImageURL(
      updatedMemory.cover,
      isCard ? imgConfig.cover.small : imgConfig.cover.big
    );

    updatedMemory.author.avatarURL = helpers.genImageURL(
      updatedMemory.author.avatar,
      imgConfig.avatar
    );

    return res.status(200).json({
      accessToken: response,
      memory: {
        statusCode: 200,
        from: "controllers/memory/likeMemory",
        data: {
          memory: updatedMemory,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      accessToken: response,
      memory: {
        statusCode: 503,
        from: "controllers/memory/like 3",
        message: "Something went wrong! Please try again.",
      },
    });
  }
}
