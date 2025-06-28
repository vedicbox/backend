import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/connectdb.js";
import DefaultFactory from "./config/defaultFactory.js";
import routelist from "./src/routes/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Default to 3000 if PORT is not set
const DATABASE_URL = process.env.DATABASE_URL;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB(DATABASE_URL).then(() => {
  DefaultFactory.init();
});

routelist.forEach(({ path, route }) => app.use(path, route));

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
