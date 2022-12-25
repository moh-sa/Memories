import { memoryModel, userModel, commentModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";
import { imgConfig } from "../../configs/index.js";

export default async function getTitles(req, res) {
  try {
    const titles = (await memoryModel.find().select("title")).map(
      (title) => title.title
    );

    res.status(200).json({
      statusCode: 200,
      from: "conttrollers/search/getTitles 1",
      data: {
        titles,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(503).json({
      statusCode: 503,
      from: "conttrollers/search/getTitles 2",
      message: "Something went wrong. Please try again later.",
    });
  }
}
