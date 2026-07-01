import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import { initWebRoutes } from "./routes/web.js";
import connectDB from "./config/connectDB";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middleware/authMiddleware";

require("dotenv").config();

let app = express();

app.use(cookieParser());

//config app

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});
viewEngine(app);
initWebRoutes(app);

connectDB();
let port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
