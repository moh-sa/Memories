import type { CookieOptions } from "express";

const domain = process.env.COOKIE_DOMAIN;
const secure = process.env.COOKIE_SECURE === "true";

const access = {
  name: process.env.COOKIE_ACCESS_NAME as string,
  // note: cast preserves latent type mismatch — maxAge is a string (env value)
  // and sameSite widens to string, but res.cookie expects CookieOptions.
  options: {
    sameSite: "lax",
    domain,
    httpOnly: false,
    secure,
    maxAge: process.env.ACCESS_EXP,
  } as CookieOptions,
  // note: new Date(0) is the Unix epoch, identical runtime value to new Date(null).
  // Latent bug: maxAge is a Date (express expects a number of ms); double cast
  // preserves the original runtime value without altering behavior.
  delete: {
    sameSite: "lax",
    domain,
    httpOnly: false,
    secure,
    maxAge: new Date(0),
  } as unknown as CookieOptions,
};

const refresh = {
  name: process.env.COOKIE_REFRESH_NAME as string,
  // note: cast preserves latent type mismatch — maxAge is a string (env value)
  // and sameSite widens to string, but res.cookie expects CookieOptions.
  options: {
    sameSite: "lax",
    domain,
    httpOnly: true,
    secure,
    maxAge: process.env.REFRESH_EXP,
  } as CookieOptions,
  // note: new Date(0) is the Unix epoch, identical runtime value to new Date(null).
  // Latent bug: maxAge is a Date (express expects a number of ms); double cast
  // preserves the original runtime value without altering behavior.
  delete: {
    sameSite: "lax",
    domain,
    httpOnly: true,
    secure,
    maxAge: new Date(0),
  } as unknown as CookieOptions,
};

export default {
  access,
  refresh,
};
