import Router, { type NextFunction, type Request, type Response } from "express"
import { premiumController } from "./premium.controller";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { Role } from "../../../generated/prisma/enums";
import { checkIsPremium } from "../../middlewares/checkIsPremium";

const router = Router()

router.get("/", authMiddlewares(Role.USER), checkIsPremium(), premiumController.getPremiumContent)

export const premiumRoutes = router;