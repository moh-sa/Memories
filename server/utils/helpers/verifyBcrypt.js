import bcrypt from "bcrypt";

export default function verifyBcrypt(password, hashedPassword) {
  const isMatch = bcrypt.compare(password, hashedPassword);
  return isMatch;
}
