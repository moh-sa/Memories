import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import { userModel } from "../models/index.js";
import { connectDB, disconnectDB, clearDB } from "./db.js";
import { createUser } from "./factories.js";
import { authCookies, refreshCookie, signRefreshToken } from "./authHelper.js";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

beforeEach(async () => {
  await clearDB();
});

const registerPayload = {
  username: "newuser",
  password: "password123",
  email: "newuser@example.com",
  avatar: "data:image/png;base64,QUJD",
};

describe("POST /auth/register", () => {
  it("creates an inactive user, uploads avatar (mocked) and returns 201", async () => {
    const res = await request(app).post("/auth/register").send(registerPayload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      statusCode: 201,
      from: "controllers/auth/register 2",
    });

    const user = await userModel.findOne({ username: "newuser" }).lean();
    expect(user).not.toBeNull();
    expect(user?.isActive).toBe(false);
    // avatar replaced by the mocked cloudinary public id
    expect(user?.avatar).toBe("fake_public_id");
    expect(user?.activationCode).toBeTruthy();
  });

  it("rejects a duplicate username with 409", async () => {
    await createUser({ username: "newuser", email: "other@example.com" });

    const res = await request(app).post("/auth/register").send(registerPayload);

    expect(res.status).toBe(409);
    expect(res.body).toMatchObject({
      statusCode: 409,
      from: "middlewares/isUsernameExists",
    });
  });

  it("rejects a duplicate email with 409", async () => {
    await createUser({ username: "someoneelse", email: "newuser@example.com" });

    const res = await request(app).post("/auth/register").send(registerPayload);

    expect(res.status).toBe(409);
    expect(res.body).toMatchObject({
      statusCode: 409,
      from: "middlewares/isEmailExists 2",
    });
  });
});

describe("GET /auth/verifyCode", () => {
  it("activates a user for a valid code", async () => {
    await createUser({ activationCode: "code-123", isActive: false });

    const res = await request(app)
      .get("/auth/verifyCode")
      .query({ code: "code-123" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ statusCode: 200, from: "controllers/auth/verifyCode 3" });

    const user = await userModel.findOne({ activationCode: "code-123" }).lean();
    expect(user?.isActive).toBe(true);
  });

  it("returns 404 for an unknown code", async () => {
    const res = await request(app)
      .get("/auth/verifyCode")
      .query({ code: "does-not-exist" });

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ statusCode: 404, from: "controllers/auth/verifyCode 1" });
  });

  it("returns 409 when the code was already used (active user)", async () => {
    await createUser({ activationCode: "used-code", isActive: true });

    const res = await request(app)
      .get("/auth/verifyCode")
      .query({ code: "used-code" });

    expect(res.status).toBe(409);
    expect(res.body).toMatchObject({ statusCode: 409, from: "controllers/auth/verifyCode 2" });
  });
});

describe("POST /auth/login", () => {
  it("logs in an active user, setting access & refresh cookies", async () => {
    await createUser({
      email: "login@example.com",
      password: "password123",
      isActive: true,
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "login@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      statusCode: 200,
      isAuth: true,
      from: "controllers/auth/login",
      message: "Login successfully",
      data: { accessToken: "accessToken" },
    });

    const cookies = res.headers["set-cookie"] as unknown as string[];
    expect(cookies.some(c => c.startsWith("accessToken="))).toBe(true);
    expect(cookies.some(c => c.startsWith("refreshToken="))).toBe(true);
  });

  it("returns 404 when the email does not exist", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "nobody@example.com", password: "password123" });

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ statusCode: 404, from: "middlewares/isEmailExists 1" });
  });

  it("returns 409 when the password is incorrect", async () => {
    await createUser({ email: "wrongpw@example.com", password: "password123", isActive: true });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "wrongpw@example.com", password: "not-the-password" });

    expect(res.status).toBe(409);
    expect(res.body).toMatchObject({
      statusCode: 409,
      from: "middlewares/auth/isPasswordsCorrect",
    });
  });

  it("returns 401 when the account is not active", async () => {
    await createUser({ email: "inactive@example.com", password: "password123", isActive: false });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "inactive@example.com", password: "password123" });

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ statusCode: 401 });
  });
});

describe("GET /auth/logout", () => {
  it("clears cookies and returns the logout response", async () => {
    const res = await request(app).get("/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      statusCode: 200,
      isAuth: false,
      from: "controllers/auth/logout",
    });
    const cookies = res.headers["set-cookie"] as unknown as string[];
    expect(cookies).toHaveLength(2);
  });
});

describe("GET /auth/verifyToken", () => {
  it("returns the backup token response when access token is valid", async () => {
    const user = await createUser();
    const res = await request(app)
      .get("/auth/verifyToken")
      .set("Cookie", authCookies({ _id: user._id.toString() }));

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      statusCode: 200,
      isAuth: true,
      data: { accessToken: "accessToken" },
    });
  });

  it("returns 404 when no refresh token is present", async () => {
    const res = await request(app).get("/auth/verifyToken");

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({
      refreshToken: { statusCode: 404, from: "middlewares/auth/verifyRefreshToken 1" },
    });
  });

  it("silently refreshes the access token when it is missing but refresh is valid", async () => {
    const user = await createUser();
    // Only a refresh cookie (no access cookie) -> verifyJWT treats a missing
    // access token as expired and the middleware issues a new access cookie.
    const res = await request(app)
      .get("/auth/verifyToken")
      .set("Cookie", [refreshCookie(signRefreshToken(user._id.toString()))]);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      statusCode: 201,
      isAuth: true,
      from: "middlewares/auth/verifyAccessToken 2",
      data: { accessToken: "accessToken" },
    });

    const cookies = res.headers["set-cookie"] as unknown as string[];
    expect(cookies.some(c => c.startsWith("accessToken="))).toBe(true);
  });
});
