import env from "./env.js";

const jwtConfig = {
  ACCESS_SECRET: env.jwtAccessSecret,
  REFRESH_SECRET: env.jwtRefreshSecret,
  ACCESS_EXP: env.accessExp,
  REFRESH_EXP: env.refreshExp,
};

export default jwtConfig;
