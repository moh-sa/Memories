import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "./routes/index.js";
import { corsConfig } from "./configs/index.js";

//Enable Express
const app = express();
//Enable CORS
app.use(cors(corsConfig));
//Enable proxy
app.enable("trust proxy");
//Express Options
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
//Enable CookieParser
app.use(cookieParser());

//Main Routes
app.use("/auth", route.auth);
app.use("/user", route.user);
app.use("/memory", route.memory);
app.use("/comment", route.comment);
app.use("/search", route.search);
app.use("/recommendations", route.recommendations);

export default app;
