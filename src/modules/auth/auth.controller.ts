import { catchAsync } from "../../utils/CatchAsync";
import type { Response, Request } from "express"
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/SendResponse";
import HttpStatus from "http-status";

const signInUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body
    const user = await authService.signInUserIntoDB(payload)

    sendResponse(res, ({
        success: true,
        statusCode: HttpStatus.OK,
        message: "User created Success",
        data: { user }
    }))
})

export const authController = { signInUser }