import type { Request } from "express";

export function getQueryString(
  query: Request["query"],
  key: string,
): string | undefined {
  const value = query[key];

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }

  return undefined;
}
