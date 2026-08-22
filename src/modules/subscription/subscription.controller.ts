
import type { Request, Response } from "express"
import { catchAsync } from "../../utils/CatchAsync"
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/SendResponse";
import HttpStatus from "http-status"


const createCheckOutSection = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await subscriptionService.createCheckOutSectionIntoDB(userId as string)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "created checkout url",
        data: result
    })
})

const createWebhook = catchAsync(async (req: Request, res: Response) => {
    const event = req.body;
    const signature = req.headers['stripe-signature'];
    await subscriptionService.createWebhookInDB(event, signature as string)
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "webhook trigger successfully"
    })

})

const getSubscriptionStatus = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const result = await subscriptionService.getSubscriptionStatus(userId as string)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "your subscription status retrieve successful",
        data: result
    })
})

export const subscriptionController = { createCheckOutSection, createWebhook, getSubscriptionStatus }