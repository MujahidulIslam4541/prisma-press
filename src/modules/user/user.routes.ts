import { Router } from "express";
import { userController } from "./user.controller";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { Role } from "../../../generated/prisma/enums";





const router = Router()

router.post("/register", userController.createUser)
router.get("/me", authMiddlewares(), userController.getUserProfile)
router.put("/my-profile",authMiddlewares(Role.ADMIN,Role.AUTHOR,Role.USER),userController.updateMyProfile)

export const userRoutes = router;