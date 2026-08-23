import { prisma } from "../../lib/prisma"

const getPremiumContentIntoDB = async () => {
    const posts = await prisma.post.findMany({
        where: {
            isPremium: true
        }
    })
    return posts;

}

export const premiumService = {
    getPremiumContentIntoDB
}