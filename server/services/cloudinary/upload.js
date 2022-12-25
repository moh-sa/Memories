import base from "./options.js";

export default async function upload(payload) {
  const { public_id } = await base.upload(payload, {
    format: "webp",
    moderation: "aws_rek",
  });

  return public_id;
}
