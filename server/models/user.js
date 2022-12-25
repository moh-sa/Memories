import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { helpers } from "../utils/index.js";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/tno/image/upload/v1656544491/no-picture_twx6wj.webp",
    },
    isActive: {
      type: Boolean,
      default: false,
      enum: [false, true],
    },
    activationCode: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await helpers.genBcrypt(user.password);
  }

  next();
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
