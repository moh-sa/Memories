import express from "express";
import { searchCons as search } from "../controllers/index.js";

const router = express.Router();

//GET
router.get("/", search.search);
router.get("/getTitles", search.getTitles);

export default router;
