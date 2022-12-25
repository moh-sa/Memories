import { v4 as uuidv4 } from "uuid";
import { userModel } from "../../models/index.js";
import { email } from "../../services/index.js";
import { cloudinary } from "../../services/index.js";

export default async function (req, res) {
  const data = req.body;

  const userData = {
    ...data,
    activationCode: uuidv4(),
  };

  console.log(userData.avatar.substring(0, 30));

  try {
    userData.avatar = await cloudinary.upload(userData.avatar);
  } catch (error) {
    return res.status(503).json({
      accessToken: response,
      memory: {
        statusCode: 503,
        from: "controllers/auth/register 1",
        message: "Something went wrong! Please try again.",
      },
    });
  }

  console.log(userData.avatar);

  try {
    const newUser = await userModel.create(userData);

    await newUser.save();

    await email.activationCode(
      newUser.username,
      newUser.email,
      userData.activationCode
    );

    res.status(201).json({
      statusCode: 201,
      from: "controllers/auth/register 2",
      message:
        "You have been successfully registered. Please check your email to activate the account.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(503).json({
      statusCode: 503,
      from: "controllers/auth/register 3",
      message: "Something went wrong. Please try again.",
    });
  }
}
