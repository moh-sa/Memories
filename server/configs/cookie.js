const domain = process.env.COOKIE_DOMAIN;
const secure = process.env.COOKIE_SECURE === "true";

const access = {
  name: process.env.COOKIE_ACCESS_NAME,
  options: {
    sameSite: "lax",
    domain,
    httpOnly: false,
    secure,
    maxAge: process.env.ACCESS_EXP,
  },
  delete: {
    sameSite: "lax",
    domain,
    httpOnly: false,
    secure,
    maxAge: new Date(null),
  },
};

const refresh = {
  name: process.env.COOKIE_REFRESH_NAME,
  options: {
    sameSite: "lax",
    domain,
    httpOnly: true,
    secure,
    maxAge: process.env.REFRESH_EXP,
  },
  delete: {
    sameSite: "lax",
    domain,
    httpOnly: true,
    secure,
    maxAge: new Date(null),
  },
};

export default {
  access,
  refresh,
};
