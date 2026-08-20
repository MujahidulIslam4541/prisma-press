
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums"
import type { PostWhereInput } from "../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"
import type { postInterface, postQuery, postUpdateInterface } from "./post.types"

const createPostIntoDB = async (payload: postInterface, userId: string) => {
    const createPost = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })

    return createPost
}

const getAllPostInDB = async (query: postQuery) => {

    const limit = query.limit ? Number(query.limit) : 10
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const orderBy = query.orderBy ? query.orderBy : "desc"



    const allPost = await prisma.post.findMany({

        where: {
            AND: [

                // search 
                query.search ? {
                    OR: [
                        {
                            title: {
                                contains: query.search,
                                mode: "insensitive"
                            },
                        },
                        {
                            content: {
                                contains: query.search,
                                mode: "insensitive"
                            },
                        }
                    ]
                } : {},

                // filter
                query.title ? { title: query.title } : {},
                query.content ? { content: query.content } : {},


            ]

        },

        take: limit,
        skip: skip,
        orderBy: {
            [sortBy]: orderBy
        },

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
    const transactionResult = await prisma.$transaction(
        async (tx) => {
            await tx.post.update({
                where: {
                    id: id
                },
                data: {
                    view: {
                        increment: 1
                    }
                }
            })
            const post = await tx.post.findUniqueOrThrow({
                where: {
                    id: id
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

            return post
        }

    )

    return transactionResult
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
            comment: {
                where: {
                    status: CommentStatus.APPROVED
                }
            },
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


const allStats = async () => {
    const transactionResult = await prisma.$transaction(
        async (tx) => {
            const [totalPost, PublishPost, DraftPost, archivePost] = await Promise.all([
                await tx.post.count(),

                await tx.post.count({
                    where: {
                        status: PostStatus.PUBLISHED
                    }
                }),
                await tx.post.count({
                    where: {
                        status: PostStatus.DRAFT
                    }
                }),
                await tx.post.count({
                    where: {
                        status: PostStatus.ARCHIVE
                    }
                }),
            ])

            return {
                totalPost, PublishPost, DraftPost, archivePost
            }
        }
    )

    return transactionResult;
}

export const postService = {
    createPostIntoDB,
    getAllPostInDB,
    getPostById,
    getMyAllPostIntoBD,
    updatedPostIntoDB,
    deletePostIntoDB,
    allStats
}