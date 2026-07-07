import getCookie from "./getCookie";
import decodeJWT from "./decodeJWT";

export default async function cookieExtractor(name: string) {
  const cookieContent = await getCookie(name);

  const decodedToken = await decodeJWT(cookieContent);

  return decodedToken;
}
