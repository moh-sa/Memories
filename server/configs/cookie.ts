import type { CookieOptions } from "express";
import env from "./env.js";

const domain = env.cookieDomain;
const secure = env.cookieSecure;

const access = {
  name: env.cookieAccessName,
  options: {
    sameSite: "lax" as const,
    domain,
    httpOnly: false,
    secure,
    maxAge: env.accessCookieMaxAge,
  } satisfies CookieOptions,
  delete: {
    sameSite: "lax" as const,
    domain,
    httpOnly: false,
    secure,
    maxAge: 0,
  } satisfies CookieOptions,
};

const refresh = {
  name: env.cookieRefreshName,
  options: {
    sameSite: "lax" as const,
    domain,
    httpOnly: true,
    secure,
    maxAge: env.refreshCookieMaxAge,
  } satisfies CookieOptions,
  delete: {
    sameSite: "lax" as const,
    domain,
    httpOnly: true,
    secure,
    maxAge: 0,
  } satisfies CookieOptions,
};

export default {
  access,
  refresh,
};
