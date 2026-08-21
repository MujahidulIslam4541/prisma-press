import Router from "express"
import { subscriptionController } from "./subscription.controller"

const router = Router()

router.use("/checkout", subscriptionController.createSubscription)



export const subscriptionRoutes = router