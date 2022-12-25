import jwt from "jsonwebtoken";

export default async function verifyJWT(token, secret) {
  const response = {
    data: {},
    isSecretNotValid: false,
    isExpired: false,
  };

  try {
    const data = await jwt.verify(token, secret);
    response.data = data;
  } catch (error) {
    if (
      error.message === "jwt expired" ||
      error.message === "jwt must be provided"
    ) {
      response.isExpired = true;
    } else if (
      error.message === "invalid signature" ||
      error.message === "jwt malformed"
    ) {
      response.isSecretNotValid = true;
    } else {
      console.log("verifyJWT 1: ", error.message);
    }
  }

  return response;
}
