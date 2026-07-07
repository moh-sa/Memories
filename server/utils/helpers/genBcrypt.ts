import bcrypt from "bcrypt";

export default async function (data: string) {
  const hashedPassword = await bcrypt.hash(data, 12);
  return hashedPassword;
}
