import mongoose, { type InferSchemaType } from "mongoose";

const memorySchema = new mongoose.Schema(
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

export type Memory = InferSchemaType<typeof memorySchema>;

const memoryModel = mongoose.model("Memory", memorySchema);

export default memoryModel;
