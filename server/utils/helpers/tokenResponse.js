import { cookiesConfig } from "../../configs/index.js";

export default function tokenResponse(accessToken, path) {
  const localsAccessToken = accessToken;
  const backupResponse = {
    statusCode: 200,
    isAuth: true,
    from: path,
    message: "all good.",
    data: {
      accessToken: cookiesConfig.access.name,
    },
  };
  return localsAccessToken ? localsAccessToken : backupResponse;
}
