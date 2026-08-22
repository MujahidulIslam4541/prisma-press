import Router from "express"
import { subscriptionController } from "./subscription.controller"
import { authMiddlewares } from "../../middlewares/authMiddlewares"
import { Role } from "../../../generated/prisma/enums"

const router = Router()

router.post("/checkout", authMiddlewares(Role.USER), subscriptionController.createCheckOutSection)

router.get("/getSubscriptionStatus", authMiddlewares(Role.USER), subscriptionController.getSubscriptionStatus)

router.post("/webhook", subscriptionController.createWebhook)



export const subscriptionRoutes = router