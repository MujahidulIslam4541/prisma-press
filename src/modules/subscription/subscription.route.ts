import Router from "express"
import { subscriptionController } from "./subscription.controller"
import { authMiddlewares } from "../../middlewares/authMiddlewares"
import { Role } from "../../../generated/prisma/enums"

const router = Router()

router.use("/checkout",authMiddlewares(Role.USER) ,subscriptionController.createCheckOutSection)



export const subscriptionRoutes = router