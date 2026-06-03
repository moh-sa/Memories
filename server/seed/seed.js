import "dotenv/config";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { dbConfig } from "../configs/index.js";
import { userModel, memoryModel, commentModel } from "../models/index.js";

const seedPath = join(dirname(fileURLToPath(import.meta.url)), "seed.json");
const { users, memories, comments } = JSON.parse(readFileSync(seedPath, "utf8"));

const oid = (id) => new mongoose.Types.ObjectId(id);

function normalizeAvatar(value) {
  if (!value?.startsWith("http")) return value?.replace(/\.webp$/i, "") ?? "v1656544491/no-picture_twx6wj";
  const match = value.match(/\/upload\/(?:v\d+\/)?(.+?)\.webp$/i);
  return match?.[1] ?? "v1656544491/no-picture_twx6wj";
}

await mongoose.connect(dbConfig.URL, dbConfig.OPTIONS);

await commentModel.deleteMany({});
await memoryModel.deleteMany({});
await userModel.deleteMany({});

for (const user of users) {
  await userModel.create({
    _id: oid(user._id),
    username: user.username,
    email: user.email,
    password: user.password,
    role: user.role ?? "user",
    avatar: normalizeAvatar(user.avatar),
    isActive: user.isActive ?? true,
    activationCode: user.activationCode,
  });
}

await memoryModel.insertMany(
  memories.map((m) => ({
    _id: oid(m._id),
    title: m.title,
    description: m.description,
    body: m.body,
    cover: m.cover,
    tags: m.tags ?? [],
    likes: m.likes ?? [],
    author: oid(m.author),
  }))
);

await commentModel.insertMany(
  comments.map((c) => ({
    _id: oid(c._id),
    body: c.body,
    likes: c.likes ?? [],
    memoryId: oid(c.memoryId),
    author: oid(c.author),
  }))
);

console.log(`Seeded ${users.length} users, ${memories.length} memories, ${comments.length} comments`);

await mongoose.disconnect();
