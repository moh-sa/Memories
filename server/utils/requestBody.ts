import type {
  CommentCreateBody,
  EmailBody,
  IdBody,
  LoginBody,
} from "../types/requests.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isLoginBody(body: unknown): body is LoginBody {
  return (
    isRecord(body)
    && typeof body.email === "string"
    && typeof body.password === "string"
  );
}

export function isEmailBody(body: unknown): body is EmailBody {
  return isRecord(body) && typeof body.email === "string";
}

export function isCommentCreateBody(body: unknown): body is CommentCreateBody {
  return (
    isRecord(body)
    && typeof body.body === "string"
    && typeof body.memoryId === "string"
    && typeof body.author === "string"
  );
}

export function getIdBody(body: unknown): IdBody {
  if (isRecord(body) && typeof body._id === "string") {
    return { _id: body._id };
  }

  return {};
}

export function isPopulatedAuthor(
  author: unknown,
): author is { avatar: string; username: string; avatarURL?: string } {
  return (
    isRecord(author)
    && typeof author.avatar === "string"
    && typeof author.username === "string"
  );
}
