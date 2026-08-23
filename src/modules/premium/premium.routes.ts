import Router from "express"
import { premiumController } from "./premium.controller";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.get("/",authMiddlewares(Role.USER), premiumController.getPremiumContent)

export const premiumRoutes = router;