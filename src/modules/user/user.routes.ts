import { Router } from "express";
import { userController } from "./user.controller";
import { authMiddlewares } from "../../middlewares/authMiddlewares";





const router = Router()

router.post("/register", userController.createUser)
router.get("/me", authMiddlewares(), userController.getUserProfile)

export const userRoutes = router;