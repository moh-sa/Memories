import { describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import verifyJWT from "../utils/helpers/verifyJWT.js";
import genBcrypt from "../utils/helpers/genBcrypt.js";
import verifyBcrypt from "../utils/helpers/verifyBcrypt.js";
import genImageURL from "../utils/helpers/genImageURL.js";
import tokenResponse from "../utils/helpers/tokenResponse.js";

const SECRET = "unit_secret";

describe("verifyJWT", () => {
  it("returns decoded data for a valid token", () => {
    const token = jwt.sign({ userId: "abc" }, SECRET);
    const result = verifyJWT(token, SECRET);

    expect(result.isExpired).toBe(false);
    expect(result.isSecretNotValid).toBe(false);
    expect(result.data).toMatchObject({ userId: "abc" });
  });

  it("flags an expired token as isExpired", () => {
    const token = jwt.sign({ userId: "abc" }, SECRET, { expiresIn: -10 });
    const result = verifyJWT(token, SECRET);

    expect(result.isExpired).toBe(true);
    expect(result.isSecretNotValid).toBe(false);
  });

  it("flags 'jwt must be provided' (missing token) as isExpired", () => {
    const result = verifyJWT(undefined as unknown as string, SECRET);

    expect(result.isExpired).toBe(true);
    expect(result.isSecretNotValid).toBe(false);
  });

  it("flags an invalid signature as isSecretNotValid", () => {
    const token = jwt.sign({ userId: "abc" }, "another_secret");
    const result = verifyJWT(token, SECRET);

    expect(result.isSecretNotValid).toBe(true);
    expect(result.isExpired).toBe(false);
  });

  it("flags a malformed token as isSecretNotValid", () => {
    const result = verifyJWT("not-a-jwt", SECRET);

    expect(result.isSecretNotValid).toBe(true);
    expect(result.isExpired).toBe(false);
  });
});

describe("genBcrypt + verifyBcrypt", () => {
  it("hashes a password and verifies it", async () => {
    const password = "s3cr3t-password";
    const hashed = await genBcrypt(password);

    expect(hashed).not.toBe(password);
    expect(typeof hashed).toBe("string");

    const isMatch = await verifyBcrypt(password, hashed);
    expect(isMatch).toBe(true);
  });

  it("returns false for a wrong password", async () => {
    const hashed = await genBcrypt("correct-password");
    const isMatch = await verifyBcrypt("wrong-password", hashed);

    expect(isMatch).toBe(false);
  });
});

describe("genImageURL", () => {
  it("builds a cloudinary URL from a public id and options", () => {
    const url = genImageURL("some_id", "c_scale,w_256");

    expect(url).toBe(
      "https://res.cloudinary.com/tno/image/upload/c_scale,w_256/some_id.webp",
    );
  });
});

describe("tokenResponse", () => {
  it("returns the provided accessToken when truthy", () => {
    const provided = { statusCode: 201, custom: true };
    const result = tokenResponse(provided, "some/path");

    expect(result).toBe(provided);
  });

  it("returns the backup response when accessToken is falsy", () => {
    const result = tokenResponse(undefined, "some/path");

    expect(result).toMatchObject({
      statusCode: 200,
      isAuth: true,
      from: "some/path",
      message: "all good.",
      data: { accessToken: "accessToken" },
    });
  });
});
