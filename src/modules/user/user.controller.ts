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

    const user = await userService.getUserProfileInDB(req.user?.id as string)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "User profile get successfully",
        data: user
    })
})

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id
    const payload = req.body

    const updatedUser = await userService.updateMyProfileInDB(userId as string, payload)

    sendResponse(res, ({
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "user profile updated successfully",
        data: {updatedUser}
    }))
})

export const userController = {
    createUser,
    getUserProfile,
    updateMyProfile
}