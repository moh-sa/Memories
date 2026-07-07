import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import { memoryModel } from "../models/index.js";
import { connectDB, disconnectDB, clearDB } from "./db.js";
import { createUser, createMemory, createComment } from "./factories.js";
import { authCookies } from "./authHelper.js";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

beforeEach(async () => {
  await clearDB();
});

describe("POST /memory/create", () => {
  it("uploads the cover (mocked) and creates a memory", async () => {
    const user = await createUser();
    const res = await request(app)
      .post("/memory/create")
      .set("Cookie", authCookies({ _id: user._id.toString() }))
      .send({
        cover: "data:image/png;base64,QUJD",
        title: "My trip",
        description: "desc",
        body: "body text",
        tags: ["travel"],
        author: user._id.toString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.memory).toMatchObject({
      statusCode: 201,
      from: "controllers/memory/create 2",
    });

    const saved = await memoryModel.findOne({ title: "My trip" }).lean();
    expect(saved).not.toBeNull();
    expect(saved?.cover).toBe("fake_public_id");
  });

  it("requires authentication (404 without refresh cookie)", async () => {
    const res = await request(app)
      .post("/memory/create")
      .send({ title: "x" });

    expect(res.status).toBe(404);
  });
});

describe("PATCH /memory/like", () => {
  it("toggles a like on and off", async () => {
    const author = await createUser();
    const liker = await createUser();
    const memory = await createMemory({ author: author._id });

    const likerId = liker._id.toString();
    const cookies = authCookies({ _id: likerId });

    const likeRes = await request(app)
      .patch("/memory/like")
      .set("Cookie", cookies)
      .send({ _id: memory._id.toString(), userId: likerId, type: "card" });

    expect(likeRes.status).toBe(200);
    expect(likeRes.body.memory.statusCode).toBe(200);
    expect(likeRes.body.memory.data.memory.likes).toContain(likerId);
    expect(likeRes.body.memory.data.memory.author.avatarURL).toContain(
      "res.cloudinary.com",
    );

    const afterLike = await memoryModel.findById(memory._id).lean();
    expect(afterLike?.likes).toContain(likerId);

    const unlikeRes = await request(app)
      .patch("/memory/like")
      .set("Cookie", cookies)
      .send({ _id: memory._id.toString(), userId: likerId, type: "full" });

    expect(unlikeRes.status).toBe(200);
    expect(unlikeRes.body.memory.data.memory.likes).not.toContain(likerId);
  });
});

describe("PATCH /memory/update", () => {
  it("updates a memory and normalizes tags", async () => {
    const author = await createUser();
    const memory = await createMemory({ author: author._id });

    const res = await request(app)
      .patch("/memory/update")
      .set("Cookie", authCookies({ _id: author._id.toString() }))
      .send({
        _id: memory._id.toString(),
        title: "Updated title",
        tags: ["New Tag", "Another One"],
      });

    expect(res.status).toBe(200);
    expect(res.body.memory.from).toBe("controllers/memory/update 1");

    const updated = await memoryModel.findById(memory._id).lean();
    expect(updated?.title).toBe("Updated title");
    expect(updated?.tags).toEqual(["new_tag", "another_one"]);
  });
});

describe("DELETE /memory/delete", () => {
  it("destroys the cover (mocked) and removes the memory", async () => {
    const author = await createUser();
    const memory = await createMemory({ author: author._id });

    const res = await request(app)
      .delete("/memory/delete")
      .set("Cookie", authCookies({ _id: author._id.toString() }))
      .send({ _id: memory._id.toString(), public_id: "cover_public_id" });

    expect(res.status).toBe(200);
    expect(res.body.memory.from).toBe("controllers/memory/delete 1");

    const gone = await memoryModel.findById(memory._id).lean();
    expect(gone).toBeNull();
  });
});

describe("GET /memory/getALl", () => {
  it("returns paginated memories with comment counts and URLs", async () => {
    const author = await createUser();
    const memory = await createMemory({ author: author._id });
    await createComment({ memoryId: memory._id, author: author._id });

    const res = await request(app).get("/memory/getALl").query({ page: "1" });

    expect(res.status).toBe(200);
    expect(res.body.from).toBe("controllers/memory/getAll 2");
    expect(res.body.data.numberOfPages).toBe(1);
    expect(res.body.data.memories).toHaveLength(1);
    expect(res.body.data.memories[0].numberOfComments).toBe(1);
    expect(res.body.data.memories[0].coverURL).toContain("res.cloudinary.com");
  });

  it("filters by a user's memories when username + type provided", async () => {
    const author = await createUser({ username: "profileowner" });
    await createMemory({ author: author._id });

    const res = await request(app)
      .get("/memory/getALl")
      .query({ page: "1", username: "profileowner", type: "memories" });

    expect(res.status).toBe(200);
    expect(res.body.data.memories).toHaveLength(1);
  });

  it("returns 404 for an unknown username", async () => {
    const res = await request(app)
      .get("/memory/getALl")
      .query({ page: "1", username: "ghost", type: "memories" });

    expect(res.status).toBe(404);
    expect(res.body.from).toBe("middlewares/db/isUsernameExist");
  });
});

describe("GET /memory/getSingle/:_id", () => {
  it("returns a single memory with URLs", async () => {
    const author = await createUser();
    const memory = await createMemory({ author: author._id });

    const res = await request(app).get(`/memory/getSingle/${memory._id.toString()}`);

    expect(res.status).toBe(200);
    expect(res.body.data.memory.coverURL).toContain("res.cloudinary.com");
    expect(res.body.data.memory.author.avatarURL).toContain("res.cloudinary.com");
  });

  it("returns 404 for an invalid id", async () => {
    const res = await request(app).get("/memory/getSingle/not-an-id");
    expect(res.status).toBe(404);
    expect(res.body.from).toBe("middlewares/mongoDB/isValid 1");
  });

  it("returns 404 when the memory does not exist", async () => {
    const res = await request(app).get(
      "/memory/getSingle/507f1f77bcf86cd799439011",
    );
    expect(res.status).toBe(404);
    expect(res.body.from).toBe("middlewares/db/isMemoryExist");
  });
});

describe("GET /memory/getTags", () => {
  it("returns the unique set of tags", async () => {
    const author = await createUser();
    await createMemory({ author: author._id, tags: ["a", "b"] });
    await createMemory({ author: author._id, tags: ["b", "c"] });

    const res = await request(app).get("/memory/getTags");

    expect(res.status).toBe(200);
    expect([...res.body.data.tags].sort()).toEqual(["a", "b", "c"]);
  });
});

describe("GET /recommendations/:_id", () => {
  it("returns recommendations sharing tags (excluding the source)", async () => {
    const author = await createUser();
    const source = await createMemory({ author: author._id, tags: ["shared"] });
    await createMemory({ author: author._id, tags: ["shared"] });

    const res = await request(app).get(
      `/recommendations/${source._id.toString()}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.from).toBe("conrollers/memory/recommendations 1");
    expect(Array.isArray(res.body.data.recommendations)).toBe(true);
    const ids = (res.body.data.recommendations as { _id: string }[]).map(m => m._id);
    expect(ids).not.toContain(source._id.toString());
  });

  it("returns 404 for an invalid id", async () => {
    const res = await request(app).get("/recommendations/bad-id");
    expect(res.status).toBe(404);
  });
});
