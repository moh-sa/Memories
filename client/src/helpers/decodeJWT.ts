import { decodeToken } from "react-jwt";
import type { User } from "types";

type DecodedToken = User & { iat?: number; exp?: number };

export default function decodeJWT(token: string | undefined): User {
  const decodedValue = decodeToken<DecodedToken>(token as string) as DecodedToken;
  delete decodedValue.iat;
  delete decodedValue.exp;
  return decodedValue;
}
