import express from "express";
import homeController from "../controllers/homeController";
import authController from "../controllers/authh.controller.js";
import adminController from "../controllers/admin.controller.js";
import { protectedRoute } from "../middleware/authMiddleware";
import { upload } from "../middleware/upload.middleware";
let router = express.Router();

let initAdminRoutes = (app) => {

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

    router.get(
        "/import-receipt",
        protectedRoute,
        adminController.initImportReceipt
    );
    router.post(
        "/import-receipt/create",
        protectedRoute,
        adminController.createImportReceipt
    );

    router.put(
        "/import-receipt/:id/confirm",
        protectedRoute,
        adminController.confirmImportReceipt
    );

    return app.use("/api", router);
};

export { initAdminRoutes };