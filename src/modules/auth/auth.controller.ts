import { catchAsync } from "../../utils/CatchAsync";
import type { Response, Request } from "express"
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/SendResponse";
import HttpStatus from "http-status";

const signInUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body
    const { accessToken, refreshToken } = await authService.signInUserIntoDB(payload)

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: false,
        maxAge: 1 * 24 * 60 * 60 * 1000
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    sendResponse(res, ({
        success: true,
        statusCode: HttpStatus.OK,
        message: "User created Success",
        data: { accessToken, refreshToken }
    }))
})

export const authController = { signInUser }