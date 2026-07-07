// Shared domain types for the client.
// Field shapes are inferred from how the client code consumes API data and
// mirrored against the (already typed) backend models in
// /workspace/server/models/{user,memory,comment}.ts.

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
  avatarURL: string;
  isActive: boolean;
  activationCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryAuthor {
  _id: string;
  username: string;
  avatar: string;
  avatarURL: string;
}

export interface Memory {
  _id: string;
  title: string;
  description: string;
  body: string;
  cover: string;
  coverURL?: string;
  tags: string[];
  likes: string[];
  author: MemoryAuthor;
  numberOfComments: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  body: string;
  likes: string[];
  memoryId: string;
  author: MemoryAuthor;
  createdAt: string;
  updatedAt: string;
}

// The shape returned in an axios error `response.data`.
export interface ApiError {
  statusCode?: number;
  message?: string;
  code?: string;
  accessToken?: unknown;
  refreshToken?: unknown;
}

// Generic wrapper used by the backend for successful responses: `{ data: ... }`.
export interface AccessTokenResponse {
  data: {
    accessToken: string;
  };
}

export interface MemoryResponse {
  data: {
    memory: Memory;
  };
}

export interface MemoriesResponse {
  data: {
    memories: Memory[];
    numberOfPages: number;
  };
}

export interface CommentResponse {
  data: {
    comment: Comment;
  };
}

export interface CommentsResponse {
  data: {
    comments: Comment[];
  };
}

export interface RecommendationsResponse {
  data: {
    recommendations: Memory[];
  };
}

export interface TitlesResponse {
  data: {
    titles: string[];
  };
}

export interface TagsResponse {
  data: {
    tags: string[];
  };
}

export interface ProfileResponse {
  data: {
    avatarURL: string;
    createdAt: string;
    numberOfLikes: number;
    numberOfMemories: number;
    numberOfComments: number;
  };
}

export interface MessageResponse {
  message: string;
}

// Mutation responses embed a refreshed access token alongside the payload.
export interface MemoryMutationResponse {
  accessToken: AccessTokenResponse;
  memory: MemoryResponse;
}

export interface CommentMutationResponse {
  accessToken: AccessTokenResponse;
  comment: CommentResponse;
}

export interface CommentLikeResponse {
  comment: CommentResponse;
}

// Request/argument shapes.
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  avatar?: string;
}

export interface GetMemoriesArg {
  page: string | number | null;
  username?: string;
  type?: string | false;
}

export interface GetSingleMemoryArg {
  _id?: string;
}

export interface LikeMemoryArg {
  _id: string;
  userId?: string;
  type: string;
}

export interface DeleteMemoryArg {
  _id: string;
  public_id: string;
}

export interface SearchArg {
  page: string | number | null;
  query: string;
  tags: string;
}

export interface GetCommentsArg {
  _id?: string;
  userId?: string;
}

export interface CreateCommentArg {
  body: string;
  author?: string;
  memoryId?: string;
}

export interface LikeCommentArg {
  _id: string;
  userId?: string;
}

export interface DeleteCommentArg {
  _id: string;
}

// react-hook-form field-value shapes.
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar?: string;
  cover?: string;
}
