import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import samplesRoutes from "./modules/samples/samples.routes";
import { errorHandler } from "./middleware/errorHandler";
import { startCreditTopUpJob } from "./jobs/creditTopUp";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json({ limit: "10kb" }));

startCreditTopUpJob();

app.use("/api/auth", authRoutes);
app.use("/api/samples", samplesRoutes);
app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

app.use(errorHandler);

export default app;
