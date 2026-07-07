import type { ConnectOptions } from "mongoose";

export default {
  URL: process.env.MONGODB_URL as string,
  // note: useNewUrlParser/useUnifiedTopology are no-ops removed from mongoose's
  // ConnectOptions; cast preserves the dead config without changing runtime.
  OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions,
};
