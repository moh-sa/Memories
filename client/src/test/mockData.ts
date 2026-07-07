import type { Comment, Memory, User } from "types";

export const mockUser: User = {
  _id: "user-1",
  username: "john",
  email: "john@example.com",
  role: "user",
  avatar: "avatar-public-id",
  avatarURL: "https://example.com/avatar.png",
  isActive: true,
  activationCode: "code",
  createdAt: "2020-01-01T00:00:00.000Z",
  updatedAt: "2020-01-02T00:00:00.000Z",
};

export const mockAdmin: User = {
  ...mockUser,
  _id: "admin-1",
  username: "admin",
  role: "admin",
};

export const mockMemory: Memory = {
  _id: "memory-1",
  title: "a great memory",
  description: "a short description",
  body: "<p>the body</p>",
  cover: "cover-public-id",
  coverURL: "https://example.com/cover.png",
  tags: ["travel", "fun"],
  likes: ["user-1"],
  author: {
    _id: "user-1",
    username: "john",
    avatar: "avatar-public-id",
    avatarURL: "https://example.com/avatar.png",
  },
  numberOfComments: 3,
  createdAt: "2020-01-01T00:00:00.000Z",
  updatedAt: "2020-01-02T00:00:00.000Z",
};

export const mockMemory2: Memory = {
  ...mockMemory,
  _id: "memory-2",
  title: "another memory",
  likes: [],
  author: {
    _id: "user-2",
    username: "jane",
    avatar: "avatar-2",
    avatarURL: "https://example.com/avatar2.png",
  },
};

export const mockComment: Comment = {
  _id: "comment-1",
  body: "a nice comment",
  likes: ["user-1"],
  memoryId: "memory-1",
  author: {
    _id: "user-1",
    username: "john",
    avatar: "avatar-public-id",
    avatarURL: "https://example.com/avatar.png",
  },
  createdAt: "2020-01-01T00:00:00.000Z",
  updatedAt: "2020-01-02T00:00:00.000Z",
};

export const mockComment2: Comment = {
  ...mockComment,
  _id: "comment-2",
  body: "another comment",
  likes: [],
  author: {
    _id: "user-2",
    username: "jane",
    avatar: "avatar-2",
    avatarURL: "https://example.com/avatar2.png",
  },
};
