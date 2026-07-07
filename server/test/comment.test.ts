import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import { commentModel } from "../models/index.js";
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

describe("POST /comment/create", () => {
  it("creates a comment with a populated author avatar URL", async () => {
    const author = await createUser();
    const memory = await createMemory({ author: author._id });

    const res = await request(app)
      .post("/comment/create")
      .set("Cookie", authCookies({ _id: author._id.toString() }))
      .send({
        body: "nice memory!",
        memoryId: memory._id.toString(),
        author: author._id.toString(),
      });

    expect(res.status).toBe(200);
    expect(res.body.comment.from).toBe("controllers/comment/create 1");
    expect(res.body.comment.data.comment.body).toBe("nice memory!");
    expect(res.body.comment.data.comment.author.avatarURL).toContain(
      "res.cloudinary.com",
    );

    const saved = await commentModel.findOne({ body: "nice memory!" }).lean();
    expect(saved).not.toBeNull();
  });
});

describe("PATCH /comment/like", () => {
  it("toggles a like on a comment", async () => {
    const author = await createUser();
    const memory = await createMemory({ author: author._id });
    const comment = await createComment({
      memoryId: memory._id,
      author: author._id,
    });
    const userId = author._id.toString();
    const cookies = authCookies({ _id: userId });

    const likeRes = await request(app)
      .patch("/comment/like")
      .set("Cookie", cookies)
      .send({ _id: comment._id.toString(), userId });

    expect(likeRes.status).toBe(200);
    expect(likeRes.body.comment.statusCode).toBe(200);

    const afterLike = await commentModel.findById(comment._id).lean();
    expect(afterLike?.likes).toContain(userId);

    const unlikeRes = await request(app)
      .patch("/comment/like")
      .set("Cookie", cookies)
      .send({ _id: comment._id.toString(), userId });

    expect(unlikeRes.status).toBe(200);
    const afterUnlike = await commentModel.findById(comment._id).lean();
    expect(afterUnlike?.likes).not.toContain(userId);
  });
});

describe("PATCH /comment/update", () => {
  it("updates a comment body", async () => {
    const author = await createUser();
    const memory = await createMemory({ author: author._id });
    const comment = await createComment({
      memoryId: memory._id,
      author: author._id,
      body: "before",
    });

    const res = await request(app)
      .patch("/comment/update")
      .set("Cookie", authCookies({ _id: author._id.toString() }))
      .send({ _id: comment._id.toString(), body: "after" });

    expect(res.status).toBe(200);
    expect(res.body.comment.from).toBe("controllers/comment/update 1");

    const updated = await commentModel.findById(comment._id).lean();
    expect(updated?.body).toBe("after");
  });
});

describe("DELETE /comment/delete", () => {
  it("removes a comment", async () => {
    const author = await createUser();
    const memory = await createMemory({ author: author._id });
    const comment = await createComment({
      memoryId: memory._id,
      author: author._id,
    });

    const res = await request(app)
      .delete("/comment/delete")
      .set("Cookie", authCookies({ _id: author._id.toString() }))
      .send({ _id: comment._id.toString() });

    expect(res.status).toBe(200);
    expect(res.body.comment.from).toBe("controllers/comment/delete 1");

    const gone = await commentModel.findById(comment._id).lean();
    expect(gone).toBeNull();
  });
});

describe("GET /comment/getALl", () => {
  it("returns comments for a memory with author avatar URLs", async () => {
    const author = await createUser();
    const memory = await createMemory({ author: author._id });
    await createComment({ memoryId: memory._id, author: author._id });
    await createComment({ memoryId: memory._id, author: author._id });

    const res = await request(app)
      .get("/comment/getALl")
      .query({ _id: memory._id.toString() });

    expect(res.status).toBe(200);
    expect(res.body.from).toBe("controllers/comment/getAll 1");
    expect(res.body.data.comments).toHaveLength(2);
    expect(res.body.data.comments[0].author.avatarURL).toContain(
      "res.cloudinary.com",
    );
  });

  it("returns 404 for an invalid memory id", async () => {
    const res = await request(app)
      .get("/comment/getALl")
      .query({ _id: "not-valid" });

    expect(res.status).toBe(404);
    expect(res.body.from).toBe("middlewares/mongoDB/isValid 1");
  });
});
