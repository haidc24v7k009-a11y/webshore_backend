import express from "express";
import homeController from "../controllers/homeController";
import authController from "../controllers/authh.controller.js";
import adminController from "../controllers/admin.controller.js";
import shipAddressController from "../controllers/shippingAdress.controller.js";
import { protectedRoute } from "../middleware/authMiddleware";
import { upload } from "../middleware/upload.middleware.js";
let router = express.Router();

let initAuthRoutes = (app) => {
  router.get("/loginform", authController.loginForm);
  router.get("/getregister", authController.getRegisterForm);

  router.post("/register", authController.registerUser);


  router.post("/login", authController.login);
  router.post("/refresh-token", authController.refreshToken);
  router.post("/logout", authController.logout);

  router.get("/getdatausers", protectedRoute, authController.getDataUsers);
  router.get("/user/profile", protectedRoute, authController.getUserInfo);


  router.put(
    "/user/avatar",
    protectedRoute,
    upload.single("avatar"),
    authController.updateAvatar
  );

  router.post("/edit/:id", authController.editUser);

  router.get("/importreceipt", protectedRoute, adminController.initImportReceipt);

  //--------SHIPPING ADDRESS
  router.get("/shipping-address", protectedRoute, shipAddressController.getAllAddress);
  // 
  router.post(
    "/shipping-address",
    protectedRoute,
    shipAddressController.createAddress
  );

  router.put(
    "/shipping-address/:id",
    protectedRoute,
    shipAddressController.updateAddress
  );

  router.delete(
    "/shipping-address/:id",
    protectedRoute,
    shipAddressController.deleteAddress
  );

  router.put(
    "/shipping-address/:id/default",
    protectedRoute,
    shipAddressController.setDefaultAddress
  );

  router.get(
    "/location/provinces",
    shipAddressController.getProvinces
  );

  router.post(
    "/location/districts",
    shipAddressController.getDistricts
  );

  router.post(
    "/location/wards",
    shipAddressController.getWards
  );



  return app.use("/api", router);
};

export { initAuthRoutes };
