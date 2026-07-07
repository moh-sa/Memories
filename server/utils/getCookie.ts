import type { Request } from "express";

export function getCookie(req: Request, name: string): string | undefined {
  const value: unknown = req.cookies[name];
  return typeof value === "string" ? value : undefined;
}
