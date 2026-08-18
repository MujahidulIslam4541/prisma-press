import { catchAsync } from "../../utils/CatchAsync";
import type { Request, Response } from "express"

const createPost = catchAsync(async (req: Request, res: Response) => {

})


export const postController = { createPost }