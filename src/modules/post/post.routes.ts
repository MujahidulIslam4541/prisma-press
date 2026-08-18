import { Router } from "express";
import { postController } from "./post.controller";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/", authMiddlewares(Role.ADMIN, Role.USER, Role.AUTHOR), postController.createPost)
router.get('/', postController.getAllPost)

export const postRouter = router