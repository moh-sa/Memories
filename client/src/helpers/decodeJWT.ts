import { decodeToken } from "react-jwt";
import type { User } from "types";

type DecodedToken = User & { iat?: number; exp?: number };

export default function decodeJWT(token: string | undefined): User {
  if (!token) {
    throw new Error("JWT token is required.");
  }

  const decodedValue = decodeToken<DecodedToken>(token);
  if (!decodedValue) {
    throw new Error("Invalid JWT token.");
  }

  delete decodedValue.iat;
  delete decodedValue.exp;
  return decodedValue;
}
