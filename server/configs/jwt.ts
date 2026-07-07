import type { SignOptions } from "jsonwebtoken";

const jwtConfig = {
  ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  ACCESS_EXP: process.env.ACCESS_EXP as SignOptions["expiresIn"],
  REFRESH_EXP: process.env.REFRESH_EXP as SignOptions["expiresIn"],
};

export default jwtConfig;
