import express from "express";
import homeController from "../controllers/homeController";
import { protectedRoute } from "../middleware/authMiddleware";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/loginform", homeController.loginForm);
  router.get("/", homeController.getHomePage);
  router.get("/crud", homeController.getCurd);

  router.post("/login", homeController.login);

  router.post("/register", homeController.registerUser);
  router.get("/get-crud", protectedRoute, homeController.getDataCRUD);
  router.get("/product", protectedRoute, homeController.getProductData);
  router.get("/user/:id", homeController.getUserInfo);
  router.post("/edit/:id", homeController.editUser);
  router.post("/logout", homeController.logout);

  router.get("/productvariant/:id", homeController.getProductVar);

  return app.use("/", router);
};

let inntAuth = (app) => {};

export { initWebRoutes };
