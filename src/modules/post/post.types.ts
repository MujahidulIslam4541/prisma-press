import type { PostStatus } from "../../../generated/prisma/enums"
import type { PostWhereInput } from "../../../generated/prisma/models"

export interface postInterface {
    title: string,
    content: string,
    thumbnail?: string,
    isFeatured: boolean,
    status: PostStatus
    tag: string[]
}

export interface postUpdateInterface {
    title?: string,
    content?: string,
    thumbnail?: string,
    status?: PostStatus
    tag: string[]
}

export interface postQuery extends PostWhereInput {
    search?:string,
    page?: string,
    limit?: string,
    sortBy?: string,
    orderBy?: string
}

