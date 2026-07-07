import { vi } from "vitest";

// Env vars MUST be set before any config/app module is imported.
// vi.mock calls below are hoisted, but their factories run lazily on first
// import, so these assignments run before the app graph reads process.env.
process.env.JWT_ACCESS_SECRET = "test_access_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";
// ms-value strings: jsonwebtoken-v9 valid (parsed by `ms` as milliseconds) and,
// unlike "15m"/"7d", they are numeric so express/cookie can serialize the
// cookie `maxAge` (which this app sets from these env values) without throwing.
process.env.ACCESS_EXP = "900000";
process.env.REFRESH_EXP = "604800000";
process.env.COOKIE_ACCESS_NAME = "accessToken";
process.env.COOKIE_REFRESH_NAME = "refreshToken";
process.env.COOKIE_DOMAIN = "localhost";
process.env.COOKIE_SECURE = "false";
process.env.CLOUDIANRY_NAME = "test_cloud";
process.env.CLOUDIANRY_KEY = "test_key";
process.env.CLOUDIANRY_SECRET = "test_secret";
process.env.EMAIL_HOST = "smtp.example.com";
process.env.EMAIL_PORT = "465";
process.env.EMAIL = "test@example.com";
process.env.EMAIL_PASSWORD = "test_password";
process.env.FRONT_URL = "http://localhost:3000";
process.env.CORS_ORIGINS = "http://localhost:3000";

// Mock the cloudinary uploader (network side-effect) while keeping
// upload.ts / destory.ts real for coverage.
vi.mock("../services/cloudinary/options.js", () => ({
  default: {
    upload: vi.fn(() => Promise.resolve({ public_id: "fake_public_id" })),
    destroy: vi.fn((_publicId: string, cb?: (result: unknown) => void) => {
      if (cb) cb({ result: "ok" });
      return Promise.resolve({ result: "ok" });
    }),
  },
}));

// Mock the nodemailer transport (SMTP side-effect) while keeping
// sendActivationCode.ts real for coverage.
vi.mock("../services/nodemailler/options.js", () => ({
  default: {
    sendMail: vi.fn(() => Promise.resolve({ messageId: "test-message-id" })),
  },
}));
