
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

export const subscriptionController = { createCheckOutSection }