import mongoose from "mongoose";

const memorySchema = mongoose.Schema(
  {
    title: String,
    description: String,
    body: String,
    cover: String,
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const memoryModel = mongoose.model("Memory", memorySchema);

export default memoryModel;
