import { catchAsync } from "../../utils/CatchAsync";
import type { Request, Response } from "express"
import { postService } from "./post.service";
import { sendResponse } from "../../utils/SendResponse";
import HttpStatus from "http-status";

const createPost = catchAsync(async (req: Request, res: Response) => {
    const id = req.user?.id;
    const payload = req.body;

    const post = await postService.createPostIntoDB(payload, id as string)
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "post created success",
        data: post
    })

})

const getAllPost = catchAsync(async (req: Request, res: Response) => {
    const post = await postService.getAllPostInDB()

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "All post here",
        data: post
    })
})


export const postController = { createPost, getAllPost }