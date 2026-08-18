import type { PostStatus } from "../../../generated/prisma/enums"

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

