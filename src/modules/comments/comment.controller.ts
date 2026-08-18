import  { catchAsync } from "../../utils/CatchAsync";
import type {Request,Response} from "express"


const createComment=catchAsync(async(req:Request,res:Response)=>{

})

export const commentController={createComment}