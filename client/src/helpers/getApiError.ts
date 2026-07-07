import axios from "axios";
import type { ApiError } from "types";

export function isApiError(value: unknown): value is ApiError {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    "message" in candidate
    || "statusCode" in candidate
    || "code" in candidate
    || "accessToken" in candidate
    || "refreshToken" in candidate
  );
}

export function getApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const responseData: unknown = error.response?.data;
    if (isApiError(responseData)) {
      return responseData;
    }
  }

  if (isApiError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "An unexpected error occurred." };
}
