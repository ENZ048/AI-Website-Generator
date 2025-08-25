import "dotenv/config";
import express from "express";
import cors from "cors";
import analyzeRouter from "./routes/analyze.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/api/analyze", analyzeRouter);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log("analyzer-api running on", PORT));
