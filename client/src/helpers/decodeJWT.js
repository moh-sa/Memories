import { decodeToken } from "react-jwt";

export default async function decodeJWT(token) {
  const decodedValue = await decodeToken(token);
  delete decodedValue.iat;
  delete decodedValue.exp;
  return decodedValue;
}
