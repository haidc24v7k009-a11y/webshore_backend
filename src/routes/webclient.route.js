import express from "express";
import homeController from "../controllers/homeController";
import { protectedRoute } from "../middleware/authMiddleware";
import { upload } from "../middleware/upload.middleware";

let router = express.Router();

let initWebRoutes = (app) => {

  router.get("/", homeController.getHomePage);
  router.get("/shoes", homeController.getProductData);
  router.get("/shoes/:id", homeController.getProductVar);

  router.get("/product/create", protectedRoute, homeController.createProductForm);

  router.post(
    "/product/create",
    upload.array("images", 10),
    homeController.createProduct
  );
  router.post("/product/findVariant", protectedRoute, homeController.findProductVariant);
  router.get(
    "/product/:id/color/:colorId/sizes",
    homeController.getSizes
  );




  return app.use("/api", router);
};

export { initWebRoutes };
