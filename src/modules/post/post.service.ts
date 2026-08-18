import { prisma } from "../../lib/prisma"
import type { postInterface, postUpdateInterface } from "./post.types"

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

const updatedPostIntoDB = async (postId: string, authorId: string, isAdmin: boolean, payload: postUpdateInterface) => {

    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("you are not update this post ")
    }

    const updatedPost = await prisma.post.update({
        where: {
            id: postId
        },
        data: payload,
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comment: true,
        }

    })

    return updatedPost
}

const deletePostIntoDB = async (postId: string, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: { id: postId }
    })

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("your are not actual author or admin this post so you can't delete this post sorry bro")
    }

    const result = await prisma.post.delete({
        where: {
            id: postId
        }
    })
    return result
}

export const postService = {
    createPostIntoDB,
    getAllPostInDB,
    getPostById,
    getMyAllPostIntoBD,
    updatedPostIntoDB,
    deletePostIntoDB
}