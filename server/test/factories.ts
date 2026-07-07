import type { Types } from "mongoose";
import { userModel, memoryModel, commentModel } from "../models/index.js";

let counter = 0;
function uniq(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString()}_${counter.toString()}`;
}

export interface CreateUserOptions {
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  isActive?: boolean;
  activationCode?: string;
  role?: string;
}

export function createUser(opts: CreateUserOptions = {}) {
  return userModel.create({
    username: opts.username ?? uniq("user"),
    email: opts.email ?? `${uniq("mail")}@example.com`,
    password: opts.password ?? "password123",
    avatar: opts.avatar ?? "avatar_public_id",
    isActive: opts.isActive ?? true,
    activationCode: opts.activationCode ?? uniq("code"),
    role: opts.role ?? "user",
  });
}

export interface CreateMemoryOptions {
  title?: string;
  description?: string;
  body?: string;
  cover?: string;
  tags?: string[];
  likes?: string[];
  author?: Types.ObjectId;
}

export function createMemory(opts: CreateMemoryOptions = {}) {
  return memoryModel.create({
    title: opts.title ?? uniq("title"),
    description: opts.description ?? "a description",
    body: opts.body ?? "some body",
    cover: opts.cover ?? "cover_public_id",
    tags: opts.tags ?? ["travel", "food"],
    likes: opts.likes ?? [],
    author: opts.author,
  });
}

export interface CreateCommentOptions {
  body?: string;
  memoryId?: Types.ObjectId;
  author?: Types.ObjectId;
  likes?: string[];
}

export function createComment(opts: CreateCommentOptions = {}) {
  return commentModel.create({
    body: opts.body ?? "a comment body",
    memoryId: opts.memoryId,
    author: opts.author,
    likes: opts.likes ?? [],
  });
}
