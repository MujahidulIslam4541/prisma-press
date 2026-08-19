import { Router } from "express";
import { postController } from "./post.controller";
import { authMiddlewares } from "../../middlewares/authMiddlewares";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/", authMiddlewares(Role.ADMIN, Role.USER, Role.AUTHOR), postController.createPost)
router.get('/my-profile', authMiddlewares(Role.USER), postController.getMyAllPost)
router.put('/:id', authMiddlewares(Role.USER, Role.ADMIN), postController.updatedPost)
router.delete('/:id', authMiddlewares(Role.USER, Role.ADMIN), postController.deletePost)
router.get("/allStats", authMiddlewares(Role.ADMIN), postController.allStats)
router.get('/', postController.getAllPost)
router.get('/:id', postController.getPostById)

export const postRouter = router