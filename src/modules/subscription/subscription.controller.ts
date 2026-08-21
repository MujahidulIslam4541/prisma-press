
import type { Request, Response } from "express"
import { catchAsync } from "../../utils/CatchAsync"


const createSubscription = catchAsync(async (req: Request, res: Response) => {

})

export const subscriptionController = { createSubscription }