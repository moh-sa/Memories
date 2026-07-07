import type { Memory } from "types";

export function isMemory(value: unknown): value is Memory {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate._id === "string"
    && typeof candidate.title === "string"
    && typeof candidate.body === "string"
    && Array.isArray(candidate.tags)
  );
}
