import type { Request, Response } from "express";
import { memoryModel } from "../../models/index.js";

export default async function getTags(_req: Request, res: Response) {
  try {
    const tagsObj = await memoryModel
      .find()
      .select("tags")
      .lean<{ tags: string[] }[]>();
    const tagsArray = tagsObj.map(memory => memory.tags).flat();
    const uniqueTags = tagsArray.filter(
      (value, index, array) => array.indexOf(value) === index,
    );
    res.status(200).json({
      statusCode: 200,
      from: "controllers/memory/getTags 1",
      data: {
        tags: uniqueTags,
      },
    });
  }
  catch (error) {
    console.log(error);
    const message = error instanceof Error ? error.message : String(error);
    return res.status(503).json({
      statusCode: 503,
      from: "controllers/memory/getTags 2",
      message: message,
    });
  }
}

// try {
//     const tagsArr = await memoryModel.find().select("tags").lean();
//     const tagsList = tagsArr.map((tag) => tag.tags);
//     const tags = tagsList.flat();
//     const uniqueTags = tags.filter(
//       (value, index, array) => array.indexOf(value) === index
//     );
//     res.status(200).json(uniqueTags);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
