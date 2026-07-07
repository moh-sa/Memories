import nodemailer, { type TransportOptions } from "nodemailer";

// note: cast preserves latent type mismatch — EMAIL_PORT is a string (env value)
// while nodemailer expects a numeric port; runtime value is unchanged.
const client = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
} as TransportOptions);

export default client;
