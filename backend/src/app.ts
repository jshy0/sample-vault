import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import samplesRoutes from "./modules/samples/samples.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/samples", samplesRoutes);
app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

app.use(errorHandler);

export default app;
