import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import { initAuthRoutes } from "./routes/auth.route.js";
import { initWebRoutes } from "./routes/webclient.route.js";
import { initAdminRoutes } from "./routes/admin.route.js";
import connectDB from "./config/connectDB";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middleware/authMiddleware";

require("dotenv").config();

let app = express();

app.use(cookieParser());

//config app

app.use(
  "/uploads",
  express.static("src/public/uploads")
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});


viewEngine(app);

//init web routes
initAuthRoutes(app);
initWebRoutes(app);
initAdminRoutes(app);

connectDB();
let port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
