import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
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
  }
);

const commentModel = mongoose.model("Comment", commentSchema);

export default commentModel;
