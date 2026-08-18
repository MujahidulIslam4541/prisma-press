import { prisma } from "../../lib/prisma"
import type { postInterface } from "./post.types"

const createPostIntoDB = async (payload: postInterface, userId: string) => {
    const createPost = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })

    return createPost
}

const getAllPostInDB = async () => {
    const allPost = await prisma.post.findMany()
    return allPost;
}


export const postService = {
    createPostIntoDB,
    getAllPostInDB
}