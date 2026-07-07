import type { Request, Response } from "express";
import { memoryModel } from "../../models/index.js";

export default async function getTitles(_req: Request, res: Response) {
  try {
    const titles = (await memoryModel.find().select("title")).map(
      title => title.title,
    );

    res.status(200).json({
      statusCode: 200,
      from: "conttrollers/search/getTitles 1",
      data: {
        titles,
      },
    });
  }
  catch (error) {
    console.log(error);
    res.status(503).json({
      statusCode: 503,
      from: "conttrollers/search/getTitles 2",
      message: "Something went wrong. Please try again later.",
    });
  }
}
