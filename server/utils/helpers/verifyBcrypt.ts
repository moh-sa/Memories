import bcrypt from "bcrypt";

export default function verifyBcrypt(password: string, hashedPassword: string) {
  const isMatch = bcrypt.compare(password, hashedPassword);
  return isMatch;
}
