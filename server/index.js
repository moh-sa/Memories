import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import { dbConfig } from "./configs/index.js";

const PORT = process.env.PORT || 5000;

//restart railway ¯\_(ツ)_/¯ #1

mongoose
  .connect(dbConfig.URL, dbConfig.OPTIONS)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Connection error", error);
    process.exit();
  });
