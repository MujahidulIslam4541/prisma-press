import HttpStatus from "http-status";
import type { NextFunction, Request, RequestHandler, Response } from "express"
import { userService } from "./user.service";
import { catchAsync } from "../../utils/CatchAsync";


const createUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const user = await userService.registerUserIntoDB(payload)

    res.status(HttpStatus.CREATED).json({
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "user registration successful",
        data: { user }
    })


})

export const userController = {
    createUser
}