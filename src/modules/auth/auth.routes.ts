import { Router } from "express";
import { authController } from "./auth.controller";

const router=Router()

router.post("/signIn",authController.signInUser)
router.post("/refresh-token",authController.refreshToken)

export const  authRoutes=router