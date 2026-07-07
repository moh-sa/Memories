import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import { connectDB, disconnectDB, clearDB } from "./db.js";
import { createUser, createMemory, createComment } from "./factories.js";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

beforeEach(async () => {
  await clearDB();
});

describe("GET /search", () => {
  it("finds memories by title query", async () => {
    const author = await createUser();
    await createMemory({ author: author._id, title: "Sunset over Paris", tags: ["city"] });
    await createMemory({ author: author._id, title: "Mountains", tags: ["nature"] });

    const res = await request(app)
      .get("/search")
      .query({ query: "paris", tags: "", page: "1" });

    expect(res.status).toBe(200);
    expect(res.body.from).toBe("controllers/search/search 1");
    expect(res.body.data.memories).toHaveLength(1);
    expect(res.body.data.memories[0].title).toBe("Sunset over Paris");
    expect(res.body.data.memories[0].coverURL).toContain("res.cloudinary.com");
  });

  it("finds memories by tags", async () => {
    const author = await createUser();
    await createMemory({ author: author._id, title: "A", tags: ["beach"] });
    await createMemory({ author: author._id, title: "B", tags: ["forest"] });

    const res = await request(app)
      .get("/search")
      .query({ query: "zzzzz-no-match", tags: "beach", page: "1" });

    expect(res.status).toBe(200);
    expect(res.body.data.memories).toHaveLength(1);
    expect(res.body.data.memories[0].title).toBe("A");
  });
});

describe("GET /search/getTitles", () => {
  it("returns all memory titles", async () => {
    const author = await createUser();
    await createMemory({ author: author._id, title: "First" });
    await createMemory({ author: author._id, title: "Second" });

    const res = await request(app).get("/search/getTitles");

    expect(res.status).toBe(200);
    expect(res.body.from).toBe("conttrollers/search/getTitles 1");
    expect([...res.body.data.titles].sort()).toEqual(["First", "Second"]);
  });
});

describe("GET /user/getProfile/:username", () => {
  it("returns a user's profile with aggregate counts", async () => {
    const user = await createUser({ username: "profileguy" });
    const other = await createUser();
    await createMemory({ author: user._id, likes: [] });
    await createMemory({ author: user._id, likes: [user._id.toString()] });
    await createComment({ author: user._id });
    // a memory liked by the user (counts toward numberOfLikes)
    await createMemory({ author: other._id, likes: [user._id.toString()] });

    const res = await request(app).get("/user/getProfile/profileguy");

    expect(res.status).toBe(200);
    expect(res.body.from).toBe("controllers/user/getProfile 1");
    expect(res.body.data.username).toBe("profileguy");
    expect(res.body.data.avatarURL).toContain("res.cloudinary.com");
    expect(res.body.data.numberOfMemories).toBe(2);
    expect(res.body.data.numberOfComments).toBe(1);
    expect(res.body.data.numberOfLikes).toBe(2);
  });

  it("returns 404 for an unknown username", async () => {
    const res = await request(app).get("/user/getProfile/nobody-here");

    expect(res.status).toBe(404);
    expect(res.body.from).toBe("middlewares/db/isUsernameExist");
  });
});
