import express from "express";
import homeController from "../controllers/homeController";

import { protectedRoute } from "../middleware/authMiddleware";
import { upload } from "../middleware/upload.middleware";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/shoes", homeController.getProductData);
  router.get("/shoes/:id", homeController.getProductVar);

  router.get(
    "/product/create",
    protectedRoute,
    homeController.createProductForm,
  );

  router.post(
    "/product/create",
    upload.array("images", 10),
    homeController.createProduct,
  );

  //----------------CART ROUTE----------------//
  router.post("/shoes/cart", protectedRoute, homeController.addToCart);

  router.get("/cart", protectedRoute, homeController.getCart);

  router.put(
    "/cart/:id",
    protectedRoute,
    homeController.updateCartItem,
  );

  router.delete(
    "/cart/:id",
    protectedRoute,
    homeController.deleteCartItem,
  );
  //----------------------------------------
  router.get("/product/:id/color/:colorId/sizes", homeController.getSizes);


  router.post(
    "/shoes/order",
    protectedRoute,
    homeController.createOrder
  );

  router.get(
    "/order",
    protectedRoute,
    (req, res, next) => {

      console.log("===== ROUTER ORDER =====");


      next();
    },
    homeController.getOrder
  );
  router.get(
    "/order/:id",
    protectedRoute,
    homeController.getOrderDetail
  );

  router.put(
    "/order/:id/cancel",
    protectedRoute,
    homeController.cancelOrder
  );

  router.get(
    "/payment-methods",
    protectedRoute,
    homeController.getPaymentMethods
  );



  return app.use("/api", router);
};

export { initWebRoutes };
