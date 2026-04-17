import express from "express";
import { login } from "../controllers/auth.controller.js";
import requireAuth from "../middlewares/auth.middleware.js"
import { showHome, showlogin } from "../controllers/view.controller.js";
import { createProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/login", login);

router.get("/", requireAuth, showHome);
router.get("/login", showlogin);

router.post("/api/products", requireAuth, createProducts);

export default router;