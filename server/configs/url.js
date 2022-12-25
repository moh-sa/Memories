export default {
  FRONT:
    process.env.NODE_ENV === "development"
      ? process.env.FRONT_DEV_URL
      : process.env.FRONT_URL,
  BACK:
    process.env.NODE_ENV === "development"
      ? process.env.BACK_DEV_URL
      : process.env.BACK_URL,
  MONGODB_URL: process.env.MONGODB_URL,
};
