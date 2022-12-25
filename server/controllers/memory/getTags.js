import { memoryModel } from "../../models/index.js";

export default async function getTags(req, res) {
  try {
    const tagsObj = await memoryModel.find().select("tags").lean();
    const tagsArray = tagsObj.map((memory) => memory.tags).flat();
    const uniqueTags = tagsArray.filter(
      (value, index, array) => array.indexOf(value) === index
    );
    res.status(200).json({
      statusCode: 200,
      from: "controllers/memory/getTags 1",
      data: {
        tags: uniqueTags,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      statusCode: 503,
      from: "controllers/memory/getTags 2",
      message: error.message,
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
