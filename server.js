import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";   // 👈 import cors
import { connectDB } from "./src/database/config.js";
import router from "./src/router/patient.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config({ path: ".env.development" });

app.use(cors());


app.use(bodyParser.json());

app.use(express.json());

app.get("/", (req, res) => res.send("Hello from Home Page."));

app.use("/api", router);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect", err);
  });
