// src/routes/analyze.route.js
import express from "express";
import { analyzeCode } from "../controller/analyze.controller.js";

const router = express.Router();

router.post("/analyze", analyzeCode);

export default router;