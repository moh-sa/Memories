const access = {
  name: process.env.COOKIE_ACCESS_NAME,
  options: {
    sameSite: "none",
    domain:
      process.env.NODE_ENV === "development" ? "localhost" : ".tno-msa.com",
    httpOnly: false,
    secure: process.env.NODE_ENV === "development" ? false : true,
    maxAge: process.env.ACCESS_EXP,
  },
  delete: {
    sameSite: "none",
    domain:
      process.env.NODE_ENV === "development" ? "localhost" : ".tno-msa.com",
    httpOnly: false,
    secure: process.env.NODE_ENV === "development" ? false : true,
    maxAge: new Date(null),
  },
};

const refresh = {
  name: process.env.COOKIE_REFRESH_NAME,
  options: {
    sameSite: "none",
    domain:
      process.env.NODE_ENV === "development" ? "localhost" : ".tno-msa.com",
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    maxAge: process.env.REFRESH_EXP,
  },
  delete: {
    sameSite: "none",
    domain:
      process.env.NODE_ENV === "development" ? "localhost" : ".tno-msa.com",
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    maxAge: new Date(null),
  },
};

export default {
  access,
  refresh,
};
