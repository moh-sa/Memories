import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import { connectDB, disconnectDB, clearDB } from "./db.js";
import { createUser } from "./factories.js";
import {
  accessCookie,
  refreshCookie,
  signAccessToken,
  signRefreshToken,
} from "./authHelper.js";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

beforeEach(async () => {
  await clearDB();
});

describe("verifyRefreshToken middleware", () => {
  it("returns 404 when the refresh cookie is missing", async () => {
    const res = await request(app).get("/auth/verifyToken");

    expect(res.status).toBe(404);
    expect(res.body.refreshToken.from).toBe("middlewares/auth/verifyRefreshToken 1");
  });

  it("returns 401 when the refresh token is expired", async () => {
    const user = await createUser();
    const expired = signRefreshToken(user._id.toString(), { expiresIn: -10 });

    const res = await request(app)
      .get("/auth/verifyToken")
      .set("Cookie", [refreshCookie(expired)]);

    expect(res.status).toBe(401);
    expect(res.body.refreshToken.from).toBe("middlewares/auth/verifyRefreshToken 2");
  });

  it("returns 406 when the refresh token has an invalid signature", async () => {
    const bad = signRefreshToken("507f1f77bcf86cd799439011");
    // tamper the signature
    const tampered = bad.slice(0, -3) + "xyz";

    const res = await request(app)
      .get("/auth/verifyToken")
      .set("Cookie", [refreshCookie(tampered)]);

    expect(res.status).toBe(406);
    expect(res.body.refreshToken.from).toBe("middlewares/auth/verifyRefreshToken 3");
  });
});

describe("verifyAccessToken middleware", () => {
  it("returns 406 when the access token has an invalid signature", async () => {
    const user = await createUser();
    const goodRefresh = signRefreshToken(user._id.toString());
    const badAccess = signAccessToken({ _id: user._id.toString() });
    const tamperedAccess = badAccess.slice(0, -3) + "xyz";

    const res = await request(app)
      .get("/auth/verifyToken")
      .set("Cookie", [accessCookie(tamperedAccess), refreshCookie(goodRefresh)]);

    expect(res.status).toBe(406);
    expect(res.body.from).toBe("middlewares/auth/verifyAccessToken 3");
  });

  it("silently refreshes when the access token is expired and the user exists", async () => {
    const user = await createUser();
    const expiredAccess = signAccessToken(
      { _id: user._id.toString() },
      { expiresIn: -10 },
    );
    const goodRefresh = signRefreshToken(user._id.toString());

    const res = await request(app)
      .get("/auth/verifyToken")
      .set("Cookie", [accessCookie(expiredAccess), refreshCookie(goodRefresh)]);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      statusCode: 201,
      from: "middlewares/auth/verifyAccessToken 2",
    });

    const cookies = res.headers["set-cookie"] as unknown as string[];
    expect(cookies.some(c => c.startsWith("accessToken="))).toBe(true);
  });

  it("passes through when both tokens are valid", async () => {
    const user = await createUser();
    const res = await request(app)
      .get("/auth/verifyToken")
      .set("Cookie", [
        accessCookie(signAccessToken({ _id: user._id.toString() })),
        refreshCookie(signRefreshToken(user._id.toString())),
      ]);

    expect(res.status).toBe(200);
    expect(res.body.statusCode).toBe(200);
    expect(res.body.isAuth).toBe(true);
  });
});
