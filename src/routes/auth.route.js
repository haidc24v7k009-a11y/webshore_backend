import express from "express";
import homeController from "../controllers/homeController";
import authController from "../controllers/authh.controller.js";
import adminController from "../controllers/admin.controller.js";
import { protectedRoute } from "../middleware/authMiddleware";

let router = express.Router();

let initAuthRoutes = (app) => {
  router.get("/loginform", authController.loginForm);
  router.get("/getregister", authController.getRegisterForm);

  router.post("/register", authController.registerUser);


  router.post("/login", authController.login);
  router.post("/refresh-token", authController.refreshToken);
  router.post("/logout", authController.logout);

  router.get("/getdatausers", protectedRoute, authController.getDataUsers);
  router.get("/user/:id", authController.getUserInfo);
  router.post("/edit/:id", authController.editUser);

  router.get("/importreceipt", protectedRoute, adminController.initImportReceipt);

  return app.use("/", router);
};

export { initAuthRoutes };
