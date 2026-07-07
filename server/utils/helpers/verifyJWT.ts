import jwt from "jsonwebtoken";

export default async function verifyJWT(token: string, secret: string) {
  const response = {
    data: {},
    isSecretNotValid: false,
    isExpired: false,
  };

  try {
    const data = await jwt.verify(token, secret);
    response.data = data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (
      message === "jwt expired" ||
      message === "jwt must be provided"
    ) {
      response.isExpired = true;
    } else if (
      message === "invalid signature" ||
      message === "jwt malformed"
    ) {
      response.isSecretNotValid = true;
    } else {
      console.log("verifyJWT 1: ", message);
    }
  }

  return response;
}
