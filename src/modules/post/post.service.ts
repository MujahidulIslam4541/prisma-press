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
            author: {
                omit: {
                    password: true
                }
            },
            comment: true
        }
    })
    return allPost;
}

const getPostById = async (id: string) => {
    await prisma.post.findFirstOrThrow({
        where: {
            id: id
        }
    })

    const updatedPost = await prisma.post.update({
        where: {
            id: id
        },
        data: {
            view: {
                increment: 1
            }
        },
        include: {
            comment: true,
            author: {
                omit: {
                    password: true
                }
            }
        },
    })

    return updatedPost
}

const getMyAllPostIntoBD = async (authorId: string) => {
    const result = await prisma.post.findMany({
        where: {
            authorId: authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comment: true,

            _count: {
                select: {
                    comment: true
                }
            }
        }
    })

    return result;

}

export const postService = {
    createPostIntoDB,
    getAllPostInDB,
    getPostById,
    getMyAllPostIntoBD
}