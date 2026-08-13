import HttpStatus from "http-status";
import type { NextFunction, Request, RequestHandler, Response } from "express"
import { userService } from "./user.service";
import { catchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/SendResponse";
import config from "../../config";
import { verifiedToken } from "../../utils/JwtToken";


const createUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const user = await userService.registerUserIntoDB(payload)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "user registration successful",
        data: { user }
    })

})

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const { accessToken } = req.cookies

    const verifyToken = verifiedToken(accessToken, config.jwt_access_token)

    if (typeof verifyToken === "string") {
        throw new Error(verifyToken)
    }

    const user = await userService.getUserProfileInDB(verifyToken.id)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "User profile get successfully",
        data: user
    })
})

export const userController = {
    createUser,
    getUserProfile
}