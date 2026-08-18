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
    const allPost = await prisma.post.findMany({
        include: {
            author: true,
            comment: true
        }
    })
    return allPost;
}

const getPostById = async (id: string) => {
    const post = await prisma.post.findFirstOrThrow({
        where: {
            id: id
        }
    })

    return post
}

export const postService = {
    createPostIntoDB,
    getAllPostInDB,
    getPostById
}