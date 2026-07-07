import mongoose, { type InferSchemaType } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    body: String,
    likes: {
      type: [String],
      default: [],
    },
    memoryId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export type Comment = InferSchemaType<typeof commentSchema>;

const commentModel = mongoose.model("Comment", commentSchema);

export default commentModel;
