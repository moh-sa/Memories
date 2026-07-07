import type { Types } from "mongoose";

export interface AuthUser {
  _id: Types.ObjectId | string;
  username: string;
  role: string;
  avatar: string;
  avatarURL?: string;
}

declare global {
  namespace Express {
    interface Request {
      localData?: AuthUser;
    }
    interface Locals {
      data?: { _id: string;[k: string]: unknown };
      accessToken?: unknown;
    }
  }
}
