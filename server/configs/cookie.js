const access = {
  name: process.env.COOKIE_ACCESS_NAME,
  options: {
    sameSite: "lax",
    domain: process.env.NODE_ENV === "development" ? "localhost" : ".tno.dev",
    httpOnly: false,
    secure: process.env.NODE_ENV === "development" ? false : true,
    maxAge: process.env.ACCESS_EXP,
  },
  delete: {
    sameSite: "lax",
    domain: process.env.NODE_ENV === "development" ? "localhost" : ".tno.dev",
    httpOnly: false,
    secure: process.env.NODE_ENV === "development" ? false : true,
    maxAge: new Date(null),
  },
};

const refresh = {
  name: process.env.COOKIE_REFRESH_NAME,
  options: {
    sameSite: "lax",
    domain: process.env.NODE_ENV === "development" ? "localhost" : ".tno.dev",
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    maxAge: process.env.REFRESH_EXP,
  },
  delete: {
    sameSite: "lax",
    domain: process.env.NODE_ENV === "development" ? "localhost" : ".tno.dev",
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    maxAge: new Date(null),
  },
};

export default {
  access,
  refresh,
};
