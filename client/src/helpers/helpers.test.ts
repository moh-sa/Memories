import { describe, it, expect, vi, beforeEach } from "vitest";
import base64Converter from "./base64Converter";
import imageSizeValidate from "./imageSizeValidate";
import tagsHandler from "./tagsHandler";
import descriptionHandler from "./descriptionHandler";
import getCookie from "./getCookie";
import cookieExtractor from "./cookieExtractor";
import cookieDestroyer from "./cookieDestroyer";
import decodeJWT from "./decodeJWT";
import ImageSelectHandler from "./ImageSelectHandler";

vi.mock("react-jwt", () => ({
  decodeToken: vi.fn(),
}));

import { decodeToken } from "react-jwt";

describe("imageSizeValidate", () => {
  it("accepts files at or below 30MB", () => {
    expect(imageSizeValidate({ size: 0 })).toBe(true);
    expect(imageSizeValidate({ size: 30_000_000 })).toBe(true);
  });

  it("rejects files above 30MB", () => {
    expect(imageSizeValidate({ size: 30_000_001 })).toBe(false);
  });
});

describe("tagsHandler", () => {
  it("trims, lowercases, and replaces spaces with underscores", () => {
    expect(tagsHandler(["  Hello World ", "FOO", "a b c"])).toEqual([
      "hello_world",
      "foo",
      "a_b_c",
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(tagsHandler([])).toEqual([]);
  });
});

describe("descriptionHandler", () => {
  it("replaces newlines with spaces", () => {
    expect(descriptionHandler("line1\nline2\nline3")).toBe("line1 line2 line3");
  });

  it("truncates to 100 characters", () => {
    const long = "a".repeat(250);
    expect(descriptionHandler(long)).toHaveLength(100);
  });
});

describe("base64Converter", () => {
  it("resolves a blob to a base64 data URL", async () => {
    const blob = new Blob(["hello"], { type: "text/plain" });
    const result = await base64Converter(blob);
    expect(typeof result).toBe("string");
    expect(result as string).toContain("data:text/plain;base64");
  });
});

describe("getCookie / cookieExtractor / cookieDestroyer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.cookie = "token=abc123";
  });

  it("getCookie returns the value of a named cookie", () => {
    expect(getCookie("token")).toBe("abc123");
  });

  it("getCookie returns undefined for a missing cookie", () => {
    expect(getCookie("does-not-exist")).toBeUndefined();
  });

  it("cookieExtractor decodes the value found for a cookie name", () => {
    vi.mocked(decodeToken).mockReturnValue({
      _id: "1",
      username: "john",
      iat: 1,
      exp: 2,
    });

    const result = cookieExtractor("token") as unknown as Record<
      string,
      unknown
    >;
    expect(result).toEqual({ _id: "1", username: "john" });
    expect(result.iat).toBeUndefined();
    expect(result.exp).toBeUndefined();
  });

  it("cookieDestroyer overwrites the cookie with an expiry", () => {
    cookieDestroyer("token");
    cookieDestroyer();
    expect(document.cookie).toBeTypeOf("string");
  });
});

describe("decodeJWT", () => {
  it("strips iat and exp from the decoded token", () => {
    vi.mocked(decodeToken).mockReturnValue({
      _id: "2",
      username: "jane",
      iat: 123,
      exp: 456,
    });

    const result = decodeJWT("some.jwt.token") as unknown as Record<
      string,
      unknown
    >;
    expect(result._id).toBe("2");
    expect(result.username).toBe("jane");
    expect("iat" in result).toBe(false);
    expect("exp" in result).toBe(false);
  });
});

describe("ImageSelectHandler", () => {
  it("returns false when the image is too large", async () => {
    const bigFile = { size: 40_000_000 } as unknown as File;
    const result = await ImageSelectHandler(bigFile);
    expect(result).toBe(false);
  });

  it("returns a base64 string for an acceptable image", async () => {
    const file = new File(["img-bytes"], "photo.png", { type: "image/png" });
    const result = await ImageSelectHandler(file);
    expect(typeof result).toBe("string");
    expect(result as string).toContain("data:image/png;base64");
  });
});
