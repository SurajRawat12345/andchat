import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getCurrentUser, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);

export default router;