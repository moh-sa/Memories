import mongoose, {
  type InferSchemaType,
  type HydratedDocument,
  type CallbackWithoutResultAndOptionalError,
} from "mongoose";
import { helpers } from "../utils/index.js";

const userSchema = new mongoose.Schema(
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
    // note: `enum: [false, true]` on a Boolean field is not expressible via
    // mongoose 6's SchemaTypeOptions typings (enum expects string/number values),
    // so cast to preserve this latent, runtime-identical schema quirk.
    isActive: {
      type: Boolean,
      default: false,
      enum: [false, true],
    } as unknown as mongoose.SchemaTypeOptions<boolean>,
    activationCode: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export type User = InferSchemaType<typeof userSchema>;

userSchema.pre(
  "save",
  async function (
    this: HydratedDocument<User>,
    next: CallbackWithoutResultAndOptionalError
  ) {
    const user = this;

    if (user.isModified("password")) {
      user.password = await helpers.genBcrypt(user.password);
    }

    next();
  }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
