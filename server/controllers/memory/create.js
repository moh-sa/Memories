import { memoryModel } from "../../models/index.js";
import { cloudinary } from "../../services/index.js";
import { helpers } from "../../utils/index.js";

export default async function (req, res) {
  const memory = req.body;

  const response = helpers.tokenResponse(
    res.locals.accessToken,
    "controllers/comment/create 0"
  );

  try {
    memory.cover = await cloudinary.upload(memory.cover);
  } catch (error) {
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
  } catch (error) {
    return res.status(503).json({
      accessToken: response,
      memory: {
        statusCode: 503,
        from: "controllers/memory/create 3",
        message: error.message,
      },
    });
  }
}
