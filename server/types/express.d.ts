import type { Types } from "mongoose";

export interface AuthUser {
  _id: Types.ObjectId | string;
  username: string;
  role: string;
  avatar: string;
  avatarURL?: string;
}

export interface AuthUserDocument extends AuthUser {
  password: string;
  isActive: boolean;
}

export interface TokenResponse {
  statusCode: number;
  isAuth?: boolean;
  from: string;
  message: string;
  data?: {
    accessToken: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      localData?: AuthUser | AuthUserDocument;
    }
    interface Locals {
      data?: { _id: string };
      accessToken?: TokenResponse;
      userId?: string;
    }
  }
}

export {};
