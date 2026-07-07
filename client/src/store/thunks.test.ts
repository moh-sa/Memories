import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("components", () => ({
  Common: {
    Notifications: {
      ID: { Pending: vi.fn(), Failure: vi.fn(), Success: vi.fn() },
      noID: { Success: vi.fn(), Failure: vi.fn() },
    },
  },
}));

vi.mock("services", () => ({
  auth: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    verifyToken: vi.fn(),
    verifyCode: vi.fn(),
  },
  memory: {
    getSingle: vi.fn(),
    getAll: vi.fn(),
    getTags: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    like: vi.fn(),
    _delete: vi.fn(),
  },
  comments: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    like: vi.fn(),
    _delete: vi.fn(),
  },
  search: { search: vi.fn(), getTitles: vi.fn() },
  recommendations: { get: vi.fn() },
  user: { getProfile: vi.fn() },
}));

vi.mock("helpers", () => ({
  cookieExtractor: vi.fn(() => mockUser),
  cookieDestroyer: vi.fn(),
}));

import { makeStore } from "test/renderWithProviders";
import { mockUser, mockMemory, mockComment } from "test/mockData";
import { auth, memory, comments, search } from "services";
import { cookieDestroyer } from "helpers";
import * as authThunk from "./auth/auth.thunk";
import * as memoryThunk from "./memory/memory.thunk";
import * as memoriesThunk from "./memories/memories.thunk";
import * as commentsThunk from "./comments/comments.thunk";

const axiosError = (data: unknown) => ({
  isAxiosError: true,
  response: { data },
});

const accessTokenBundle = { data: { accessToken: "token" } };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("auth thunks", () => {
  it("login.fulfilled returns the decoded user", async () => {
    vi.mocked(auth.login).mockResolvedValue({
      data: { data: { accessToken: "token" } },
    } as never);

    const store = makeStore();
    const result = await store.dispatch(
      authThunk.login({ email: "a@b.c", password: "x" }),
    );
    expect(result.type).toBe("auth/login/fulfilled");
    expect(result.payload).toEqual(mockUser);
    expect(store.getState().auth.user).toEqual(mockUser);
  });

  it("login.rejected returns the api error", async () => {
    vi.mocked(auth.login).mockRejectedValue(
      axiosError({ statusCode: 401, message: "bad" }),
    );

    const store = makeStore();
    const result = await store.dispatch(
      authThunk.login({ email: "a@b.c", password: "x" }),
    );
    expect(result.type).toBe("auth/login/rejected");
    expect(result.payload).toEqual({ statusCode: 401, message: "bad" });
  });

  it("register.fulfilled returns the message", async () => {
    vi.mocked(auth.register).mockResolvedValue({
      data: { message: "check your email" },
    } as never);

    const store = makeStore();
    const result = await store.dispatch(
      authThunk.register({ username: "u", email: "a@b.c", password: "x" }),
    );
    expect(result.type).toBe("auth/register/fulfilled");
    expect(result.payload).toEqual({ message: "check your email" });
  });

  it("register.rejected handles non-axios errors", async () => {
    vi.mocked(auth.register).mockRejectedValue(new Error("boom"));

    const store = makeStore();
    const result = await store.dispatch(
      authThunk.register({ username: "u", email: "a@b.c", password: "x" }),
    );
    expect(result.type).toBe("auth/register/rejected");
  });

  it("logout.fulfilled clears the user and destroys the cookie", async () => {
    vi.mocked(auth.logout).mockResolvedValue({
      data: { message: "bye" },
    } as never);

    const store = makeStore({ auth: { user: mockUser } });
    const result = await store.dispatch(authThunk.logout());
    expect(result.type).toBe("auth/logout/fulfilled");
    expect(cookieDestroyer).toHaveBeenCalled();
    expect(store.getState().auth.user).toBeNull();
  });

  it("verifyToken.fulfilled sets the user", async () => {
    vi.mocked(auth.verifyToken).mockResolvedValue({
      data: { data: { accessToken: "token" } },
    } as never);

    const store = makeStore();
    const result = await store.dispatch(authThunk.verifyToken());
    expect(result.type).toBe("auth/verifyToken/fulfilled");
    expect(store.getState().auth.user).toEqual(mockUser);
  });
});

describe("memory thunks", () => {
  it("getSingle.fulfilled returns the memory response", async () => {
    vi.mocked(memory.getSingle).mockResolvedValue({
      data: { data: { memory: mockMemory } },
    } as never);

    const store = makeStore();
    const result = await store.dispatch(memoryThunk.getSingle({ _id: "1" }));
    expect(result.type).toBe("memory/getSingle/fulfilled");
    expect(store.getState().memory.memory).toEqual(mockMemory);
  });

  it("like.fulfilled adds the refreshed user and returns data", async () => {
    vi.mocked(memory.like).mockResolvedValue({
      data: {
        accessToken: accessTokenBundle,
        memory: { data: { memory: mockMemory } },
      },
    } as never);

    const store = makeStore();
    const result = await store.dispatch(
      memoryThunk.like({ _id: "1", type: "card" }),
    );
    expect(result.type).toBe("memory/like/fulfilled");
    expect(store.getState().auth.user).toEqual(mockUser);
  });

  it("like.rejected on token error removes the user", async () => {
    vi.mocked(memory.like).mockRejectedValue(
      axiosError({ accessToken: "expired" }),
    );

    const store = makeStore({ auth: { user: mockUser } });
    const result = await store.dispatch(
      memoryThunk.like({ _id: "1", type: "card" }),
    );
    expect(result.type).toBe("memory/like/rejected");
    expect(cookieDestroyer).toHaveBeenCalled();
    expect(store.getState().auth.user).toBeNull();
  });
});

describe("memories thunks", () => {
  it("getAll.fulfilled stores memories", async () => {
    vi.mocked(memory.getAll).mockResolvedValue({
      data: { data: { memories: [mockMemory], numberOfPages: 2 } },
    } as never);

    const store = makeStore();
    const result = await store.dispatch(memoriesThunk.getAll({ page: 1 }));
    expect(result.type).toBe("memories/getAll/fulfilled");
    expect(store.getState().memories.numberOfPages).toBe(2);
  });

  it("getAll.rejected returns the api error", async () => {
    vi.mocked(memory.getAll).mockRejectedValue(
      axiosError({ statusCode: 404, message: "none" }),
    );

    const store = makeStore();
    const result = await store.dispatch(memoriesThunk.getAll({ page: 1 }));
    expect(result.type).toBe("memories/getAll/rejected");
    expect(result.payload).toEqual({ statusCode: 404, message: "none" });
  });

  it("create.fulfilled refreshes the user", async () => {
    vi.mocked(memory.create).mockResolvedValue({
      data: {
        accessToken: accessTokenBundle,
        memory: { data: { memory: mockMemory } },
      },
    } as never);

    const store = makeStore();
    const result = await store.dispatch(memoriesThunk.create({ title: "t" }));
    expect(result.type).toBe("memories/create/fulfilled");
    expect(store.getState().auth.user).toEqual(mockUser);
  });

  it("update.fulfilled refreshes the user", async () => {
    vi.mocked(memory.update).mockResolvedValue({
      data: {
        accessToken: accessTokenBundle,
        memory: { data: { memory: mockMemory } },
      },
    } as never);

    const store = makeStore();
    const result = await store.dispatch(memoriesThunk.update({ title: "t" }));
    expect(result.type).toBe("memories/update/fulfilled");
  });

  it("_delete.fulfilled returns merged args", async () => {
    vi.mocked(memory._delete).mockResolvedValue({
      data: { accessToken: accessTokenBundle },
    } as never);

    const store = makeStore({
      memories: { memories: [mockMemory], numberOfPages: 1 },
    });
    const result = await store.dispatch(
      memoriesThunk._delete({ _id: "memory-1", public_id: "cover-public-id" }),
    );
    expect(result.type).toBe("memories/delete/fulfilled");
    expect(store.getState().memories.memories).toEqual([]);
  });

  it("like.fulfilled updates the store", async () => {
    vi.mocked(memory.like).mockResolvedValue({
      data: {
        accessToken: accessTokenBundle,
        memory: { data: { memory: { ...mockMemory, likes: [] } } },
      },
    } as never);

    const store = makeStore({
      memories: { memories: [mockMemory], numberOfPages: 1 },
    });
    const result = await store.dispatch(
      memoriesThunk.like({ _id: "memory-1", type: "card" }),
    );
    expect(result.type).toBe("memories/like/fulfilled");
    expect(store.getState().memories.memories?.[0].likes).toEqual([]);
  });

  it("searchReq.fulfilled stores search results", async () => {
    vi.mocked(search.search).mockResolvedValue({
      data: { data: { memories: [mockMemory], numberOfPages: 1 } },
    } as never);

    const store = makeStore();
    const result = await store.dispatch(
      memoriesThunk.searchReq({ page: 1, query: "q", tags: "none" }),
    );
    expect(result.type).toBe("memories/search/fulfilled");
    expect(store.getState().memories.memories).toHaveLength(1);
  });
});

describe("comments thunks", () => {
  it("getAll.fulfilled stores comments", async () => {
    vi.mocked(comments.getAll).mockResolvedValue({
      data: { data: { comments: [mockComment] } },
    } as never);

    const store = makeStore();
    const result = await store.dispatch(commentsThunk.getAll({ _id: "1" }));
    expect(result.type).toBe("comments/getAll/fulfilled");
    expect(store.getState().comments.comments).toHaveLength(1);
  });

  it("getAll.rejected on token error removes the user", async () => {
    vi.mocked(comments.getAll).mockRejectedValue(
      axiosError({ refreshToken: "expired" }),
    );

    const store = makeStore({ auth: { user: mockUser } });
    const result = await store.dispatch(commentsThunk.getAll({ _id: "1" }));
    expect(result.type).toBe("comments/getAll/rejected");
    expect(store.getState().auth.user).toBeNull();
  });

  it("create.fulfilled prepends the comment", async () => {
    vi.mocked(comments.create).mockResolvedValue({
      data: {
        accessToken: accessTokenBundle,
        comment: { data: { comment: mockComment } },
      },
    } as never);

    const store = makeStore({ comments: { comments: [] } });
    const result = await store.dispatch(
      commentsThunk.create({ body: "hi", memoryId: "1" }),
    );
    expect(result.type).toBe("comments/create/fulfilled");
    expect(store.getState().comments.comments).toHaveLength(1);
  });

  it("update.fulfilled replaces the comment", async () => {
    vi.mocked(comments.update).mockResolvedValue({
      data: {
        accessToken: accessTokenBundle,
        comment: { data: { comment: { ...mockComment, body: "edited" } } },
      },
    } as never);

    const store = makeStore({ comments: { comments: [mockComment] } });
    const result = await store.dispatch(
      commentsThunk.update({ ...mockComment, body: "edited" }),
    );
    expect(result.type).toBe("comments/update/fulfilled");
    expect(store.getState().comments.comments?.[0].body).toBe("edited");
  });

  it("_delete.fulfilled removes the comment", async () => {
    vi.mocked(comments._delete).mockResolvedValue({
      data: { accessToken: accessTokenBundle },
    } as never);

    const store = makeStore({ comments: { comments: [mockComment] } });
    const result = await store.dispatch(
      commentsThunk._delete({ _id: "comment-1" }),
    );
    expect(result.type).toBe("comments/delete/fulfilled");
    expect(store.getState().comments.comments).toEqual([]);
  });

  it("like.fulfilled updates the comment", async () => {
    vi.mocked(comments.like).mockResolvedValue({
      data: { comment: { data: { comment: { ...mockComment, likes: [] } } } },
    } as never);

    const store = makeStore({ comments: { comments: [mockComment] } });
    const result = await store.dispatch(
      commentsThunk.like({ _id: "comment-1" }),
    );
    expect(result.type).toBe("comments/like/fulfilled");
    expect(store.getState().comments.comments?.[0].likes).toEqual([]);
  });
});
