import { decodeToken } from "react-jwt";
import type { User } from "types";

type DecodedToken = User & { iat?: number; exp?: number };

export default async function decodeJWT(
  token: string | undefined
): Promise<User> {
  const decodedValue = decodeToken<DecodedToken>(token as string) as DecodedToken;
  delete decodedValue.iat;
  delete decodedValue.exp;
  return decodedValue;
}
