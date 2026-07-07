import { describe, it, expect } from "vitest";

import authReducer, { addUser, removeUser } from "./auth/auth.slice";
import memoryReducer from "./memory/memory.slice";
import memoriesReducer from "./memories/memories.slice";
import commentsReducer from "./comments/comments.slice";
import * as authThunk from "./auth/auth.thunk";
import * as memoryThunk from "./memory/memory.thunk";
import * as memoriesThunk from "./memories/memories.thunk";
import * as commentsThunk from "./comments/comments.thunk";
import {
  mockUser,
  mockMemory,
  mockMemory2,
  mockComment,
  mockComment2,
} from "test/mockData";

const req = "req-id";

describe("auth slice", () => {
  it("returns the initial state", () => {
    expect(authReducer(undefined, { type: "@@INIT" })).toEqual({ user: null });
  });

  it("addUser sets the user", () => {
    const state = authReducer({ user: null }, addUser(mockUser));
    expect(state.user).toEqual(mockUser);
  });

  it("removeUser clears the user", () => {
    const state = authReducer({ user: mockUser }, removeUser());
    expect(state.user).toBeNull();
  });

  it("login.fulfilled sets the user", () => {
    const state = authReducer(
      { user: null },
      authThunk.login.fulfilled(mockUser, req, {
        email: "a@b.c",
        password: "x",
      }),
    );
    expect(state.user).toEqual(mockUser);
  });

  it("verifyToken.fulfilled sets the user and rejected clears it", () => {
    const fulfilled = authReducer(
      { user: null },
      authThunk.verifyToken.fulfilled(mockUser, req, undefined),
    );
    expect(fulfilled.user).toEqual(mockUser);

    const rejected = authReducer(
      { user: mockUser },
      authThunk.verifyToken.rejected(null, req, undefined),
    );
    expect(rejected.user).toBeNull();
  });

  it("logout.fulfilled and logout.rejected clear the user", () => {
    const fulfilled = authReducer(
      { user: mockUser },
      authThunk.logout.fulfilled({ message: "bye" }, req, undefined),
    );
    expect(fulfilled.user).toBeNull();

    const rejected = authReducer(
      { user: mockUser },
      authThunk.logout.rejected(null, req, undefined),
    );
    expect(rejected.user).toBeNull();
  });
});

describe("memory slice", () => {
  it("returns the initial state", () => {
    expect(memoryReducer(undefined, { type: "@@INIT" })).toEqual({
      memory: null,
    });
  });

  it("getSingle.fulfilled stores the memory", () => {
    const state = memoryReducer(
      { memory: null },
      memoryThunk.getSingle.fulfilled({ data: { memory: mockMemory } }, req, {}),
    );
    expect(state.memory).toEqual(mockMemory);
  });

  it("like.pending and like.rejected keep memory but fire notifications", () => {
    const pending = memoryReducer(
      { memory: null },
      memoryThunk.like.pending(req, { _id: "1", type: "card" }),
    );
    expect(pending.memory).toBeNull();

    const rejected = memoryReducer(
      { memory: null },
      memoryThunk.like.rejected(null, req, { _id: "1", type: "card" }),
    );
    expect(rejected.memory).toBeNull();
  });

  it("like.fulfilled updates the memory", () => {
    const payload = {
      accessToken: { data: { accessToken: "t" } },
      memory: { data: { memory: mockMemory2 } },
    };
    const state = memoryReducer(
      { memory: mockMemory },
      memoryThunk.like.fulfilled(payload, req, { _id: "1", type: "card" }),
    );
    expect(state.memory).toEqual(mockMemory2);
  });
});

describe("memories slice", () => {
  it("returns the initial state", () => {
    expect(memoriesReducer(undefined, { type: "@@INIT" })).toEqual({
      memories: null,
      numberOfPages: null,
    });
  });

  it("getAll.fulfilled stores memories and page count", () => {
    const state = memoriesReducer(
      { memories: null, numberOfPages: null },
      memoriesThunk.getAll.fulfilled(
        { data: { memories: [mockMemory, mockMemory2], numberOfPages: 5 } },
        req,
        { page: 1 },
      ),
    );
    expect(state.memories).toHaveLength(2);
    expect(state.numberOfPages).toBe(5);
  });

  it("searchReq.fulfilled stores memories and page count", () => {
    const state = memoriesReducer(
      { memories: null, numberOfPages: null },
      memoriesThunk.searchReq.fulfilled(
        { data: { memories: [mockMemory], numberOfPages: 1 } },
        req,
        { page: 1, query: "q", tags: "none" },
      ),
    );
    expect(state.memories).toHaveLength(1);
    expect(state.numberOfPages).toBe(1);
  });

  it("create/update pending/rejected/fulfilled do not change memories", () => {
    const base = { memories: [mockMemory], numberOfPages: 1 };
    const created = memoriesReducer(
      base,
      memoriesThunk.create.fulfilled(
        {
          accessToken: { data: { accessToken: "t" } },
          memory: { data: { memory: mockMemory } },
        },
        req,
        {},
      ),
    );
    expect(created.memories).toHaveLength(1);

    expect(() =>
      memoriesReducer(base, memoriesThunk.create.pending(req, {})),
    ).not.toThrow();
    expect(() =>
      memoriesReducer(base, memoriesThunk.update.rejected(null, req, {})),
    ).not.toThrow();
  });

  it("_delete.fulfilled removes the deleted memory", () => {
    const state = memoriesReducer(
      { memories: [mockMemory, mockMemory2], numberOfPages: 1 },
      memoriesThunk._delete.fulfilled(
        {
          _id: "memory-1",
          public_id: "cover-public-id",
          accessToken: { data: { accessToken: "t" } },
        },
        req,
        { _id: "memory-1", public_id: "cover-public-id" },
      ),
    );
    expect(state.memories).toEqual([mockMemory2]);
  });

  it("like.fulfilled replaces the liked memory", () => {
    const updated = { ...mockMemory, likes: [] };
    const payload = {
      accessToken: { data: { accessToken: "t" } },
      memory: { data: { memory: updated } },
    };
    const state = memoriesReducer(
      { memories: [mockMemory, mockMemory2], numberOfPages: 1 },
      memoriesThunk.like.fulfilled(payload, req, { _id: "memory-1", type: "card" }),
    );
    expect(state.memories?.[0].likes).toEqual([]);
  });
});

describe("comments slice", () => {
  it("returns the initial state", () => {
    expect(commentsReducer(undefined, { type: "@@INIT" })).toEqual({
      comments: null,
    });
  });

  it("getAll.fulfilled stores comments", () => {
    const state = commentsReducer(
      { comments: null },
      commentsThunk.getAll.fulfilled(
        { data: { comments: [mockComment, mockComment2] } },
        req,
        {},
      ),
    );
    expect(state.comments).toHaveLength(2);
  });

  it("create.fulfilled prepends the new comment", () => {
    const payload = {
      accessToken: { data: { accessToken: "t" } },
      comment: { data: { comment: mockComment2 } },
    };
    const state = commentsReducer(
      { comments: [mockComment] },
      commentsThunk.create.fulfilled(payload, req, {
        body: "hi",
      }),
    );
    expect(state.comments?.[0]).toEqual(mockComment2);
    expect(state.comments).toHaveLength(2);
  });

  it("update.fulfilled replaces the edited comment", () => {
    const edited = { ...mockComment, body: "edited" };
    const payload = {
      accessToken: { data: { accessToken: "t" } },
      comment: { data: { comment: edited } },
    };
    const state = commentsReducer(
      { comments: [mockComment, mockComment2] },
      commentsThunk.update.fulfilled(payload, req, {}),
    );
    expect(state.comments?.[0].body).toBe("edited");
  });

  it("_delete.fulfilled removes the comment", () => {
    const state = commentsReducer(
      { comments: [mockComment, mockComment2] },
      commentsThunk._delete.fulfilled({ _id: "comment-1" }, req, {
        _id: "comment-1",
      }),
    );
    expect(state.comments).toEqual([mockComment2]);
  });

  it("like.fulfilled replaces the liked comment", () => {
    const liked = { ...mockComment, likes: [] };
    const payload = { comment: { data: { comment: liked } } };
    const state = commentsReducer(
      { comments: [mockComment, mockComment2] },
      commentsThunk.like.fulfilled(payload, req, { _id: "comment-1" }),
    );
    expect(state.comments?.[0].likes).toEqual([]);
  });
});
