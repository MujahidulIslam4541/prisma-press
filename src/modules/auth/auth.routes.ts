import { Router } from "express";
import { authController } from "./auth.controller";

const router=Router()

router.post("/signIn",authController.signInUser)

export const  authRoutes=router