
import express from "express";
import {connectDB} from "./config/database.js";
import routes from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();
app.use(express.json());


app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use(errorMiddleware);

export default app;