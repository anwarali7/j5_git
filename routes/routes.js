import express from "express";
const router = express.Router();

import HomeController from "../controllers/home.js";
import HomeFormController from "../controllers/homeForm.js";
import LoginController from "../controllers/login.js";
import LoginFormController from "../controllers/loginForm.js";
import DashboardController from "../controllers/dashboard.js";
import authMiddleware from "../middlewares/auth.js";

router.get("/", HomeController);
router.post("/", HomeFormController);

router.get("/login", LoginController);
router.post("/login", LoginFormController);

router.get("/dashboard", authMiddleware, DashboardController);

export default router;
