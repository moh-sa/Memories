import type { Request, Response } from "express";
import { memoryModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";
import { imgConfig } from "../../configs/index.js";

interface RecMemory {
  _id: string;
  cover: string;
}

export default async function getRecommendations(req: Request, res: Response) {
  const { _id } = req.params;

  try {
    const memory = await memoryModel.findById(_id).lean<{ tags: string[] }>();

    const data = await memoryModel
      .aggregate<RecMemory>([
        { $match: { tags: { $in: memory.tags } } },
        { $sample: { size: 5 } },
      ])
      .then((res) => {
        //removing the requested memory from the array
        const memoryData = res.filter(
          (memory) => memory._id.toString() !== _id
        );

        //replacing the coverID with coverURL
        memoryData.map(
          (memory) =>
            (memory.cover = helpers.genImageURL(
              memory.cover,
              imgConfig.recommendations
            ))
        );

        return memoryData;
      });

    await memoryModel.populate(data, { path: "author", select: "username" });

    return res.status(200).json({
      statusCode: 200,
      from: "conrollers/memory/recommendations 1",
      data: {
        recommendations: data,
      },
    });
  } catch (error) {
    console.log(error);
    const message = error instanceof Error ? error.message : String(error);
    return res.status(503).json({
      statusCode: 503,
      from: "controllers/memory/recommendations 2",
      message: message,
    });
  }
}
