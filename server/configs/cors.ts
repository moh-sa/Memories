const origins = process.env.CORS_ORIGINS?.split(",")
  .map(s => s.trim())
  .filter(Boolean);

export default {
  credentials: true,
  origin: origins,
};
