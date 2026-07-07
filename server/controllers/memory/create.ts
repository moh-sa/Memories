import type { Request, Response } from "express";
import { memoryModel } from "../../models/index.js";
import { cloudinary } from "../../services/index.js";
import { helpers } from "../../utils/index.js";

export default async function (req: Request, res: Response) {
  const memory = req.body as {
    cover: string;
    title: string;
    description: string;
    body: string;
    tags: string[];
    author: string;
  };

  const response = helpers.tokenResponse(
    res.locals.accessToken,
    "controllers/comment/create 0",
  );

  try {
    memory.cover = await cloudinary.upload(memory.cover);
  }
  catch {
    return res.status(503).json({
      accessToken: response,
      memory: {
        statusCode: 503,
        from: "controllers/memory/create 1",
        message: "Something went wrong! Please try again.",
      },
    });
  }

  try {
    const newMemory = await memoryModel.create(memory);
    await newMemory.save();

    return res.status(201).json({
      accessToken: response,
      memory: {
        statusCode: 201,
        from: "controllers/memory/create 2",
        message: "Done! Thanks for sharing your memory.",
      },
    });
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(503).json({
      accessToken: response,
      memory: {
        statusCode: 503,
        from: "controllers/memory/create 3",
        message: message,
      },
    });
  }
}
