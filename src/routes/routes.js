import express from "express";
import { login } from "../controllers/auth.controller.js";
import requireAuth from "../middlewares/auth.middleware.js"
import { showHome, showlogin } from "../controllers/view.controller.js";
import { createProducts, getProducts } from "../controllers/product.controller.js";
import { health } from "../controllers/health.controller.js";

const router = express.Router();

router.post("/login", login);

router.get("/", requireAuth, showHome);
router.get("/login", showlogin);

router.get("/api/products", requireAuth, getProducts);
router.post("/api/products", requireAuth, createProducts);

router.get("/health", health);

export default router;