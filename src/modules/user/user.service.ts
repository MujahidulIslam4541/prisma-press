import config from "../../config"
import { prisma } from "../../lib/prisma"
import bcrypt from "bcrypt"
import type { RegisterUserPayload } from "./user.types";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
    const { name, email, password, profilePhoto } = payload;
    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })

    if (isUserExist) {
        throw new Error("user already exist please signIn Now")
    }

    const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword
        }
    })

    await prisma.profile.create({
        data: {
            userId: createdUser.id,
            profilePhoto
        }
    })

    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
        },
        omit: { password: true },
        include: {
            profile: true
        }
    })

    return user;
}

export const userService = {
    registerUserIntoDB
}