import { SubscriptionStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/CatchAsync";
import { type NextFunction, type Request, type Response } from "express"


export const checkIsPremium = () => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {


        const userId = req.user?.id;

        const subscription = await prisma.subscription.findUniqueOrThrow({
            where: {
                userId
            }
        })

        if (subscription.status !== SubscriptionStatus.ACTIVE) {
            throw new Error("your subscription is not valid please subscription again ")
        }

        next()

    })
}