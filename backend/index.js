import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import auth from "./routes/auth.js";
import stores from "./routes/stores.js";
import ratings from "./routes/ratings.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://store-rating-app-beryl.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/auth", auth);
app.use("/stores", stores);
app.use("/ratings", ratings);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
