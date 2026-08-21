import { prisma } from "../../lib/prisma"

const createCheckOutSectionIntoDB = async (userId: string) => {
    const transactionResult = await prisma.$transaction(async (tx) => {

        const user = await tx.user.findUniqueOrThrow({
            where: {
                id: userId
            }
        })

        
    })

}

export const subscriptionService = { createCheckOutSectionIntoDB }