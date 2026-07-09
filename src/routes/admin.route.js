import express from "express";
import homeController from "../controllers/homeController";
import authController from "../controllers/authh.controller.js";
import { protectedRoute } from "../middleware/authMiddleware";