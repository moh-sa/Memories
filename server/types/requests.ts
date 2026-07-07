export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface MemoryCreateBody {
  cover: string;
  title: string;
  description: string;
  body: string;
  tags: string[];
  author: string;
}

export interface MemoryUpdateBody {
  _id: string;
  title?: string;
  description?: string;
  body?: string;
  tags: string[];
  cover?: string;
}

export interface MemoryLikeBody {
  _id: string;
  userId: string;
  type: string;
}

export interface MemoryDeleteBody {
  _id: string;
  public_id: string;
}

export interface CommentCreateBody {
  body: string;
  memoryId: string;
  author: string;
}

export interface CommentUpdateBody {
  _id: string;
  body?: string;
}

export interface CommentDeleteBody {
  _id: string;
}

export interface CommentLikeBody {
  _id: string;
  userId: string;
}

export interface IdBody {
  _id?: string;
}

export interface UsernameBody {
  username: string;
}

export interface EmailBody {
  email: string;
}
