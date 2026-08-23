import { catchAsync } from "../../utils/CatchAsync";
import type { Request, Response } from "express"
import { sendResponse } from "../../utils/SendResponse";
import Https from "http-status"
import { premiumService } from "./premium.service";

const getPremiumContent = catchAsync(async (req: Request, res: Response) => {
    const result = await premiumService.getPremiumContentIntoDB()
    sendResponse(res, {
        success: true,
        statusCode: Https.OK,
        message: "premium content retrieve successfully",
        data: result
    })
})

export const premiumController = {
    getPremiumContent
}