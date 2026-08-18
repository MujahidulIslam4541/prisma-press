import Router from "express"
import { commentController } from "./comment.controller"

const router =Router()

router.post("/comment",commentController.createComment)

export const commentsRouter=router