import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";

// Routes
import runRoutes from "./routes/runRoutes.js";
import submitRoutes from "./routes/submitRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

// Middleware
import errorHandler from "./middleware/errorMiddleware.js";


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.get("/", (req, res) => {
  res.send("CodeDojo API is running...");
});

app.use("/api/run", runRoutes);
app.use("/api/submit", submitRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/progress", progressRoutes);

// Error handler
app.use(errorHandler);

// Server 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});