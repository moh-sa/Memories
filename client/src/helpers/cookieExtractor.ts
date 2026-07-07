import getCookie from "./getCookie";
import decodeJWT from "./decodeJWT";

export default function cookieExtractor(name: string) {
  const cookieContent = getCookie(name);

  const decodedToken = decodeJWT(cookieContent);

  return decodedToken;
}
