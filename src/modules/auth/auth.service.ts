import config from "../../config";
import { prisma } from "../../lib/prisma";
import type { AuthInterface } from "./auth.types";
import bcrypt from "bcrypt"
import jwt, { type SignOptions } from "jsonwebtoken"

const signInUserIntoDB = async (payload: AuthInterface) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    if (user.activeStatus === "BLOCKED") {
        throw new Error("your account has been blocked please contact support ")
    }

    const matchPassword = await bcrypt.compare(password, user.password)

    if (!matchPassword) {
        throw new Error("credential not match please provide valid credential")
    }

    const accessToken = jwt.sign(({ id: user.id, email: user.email, role: user.role }), config.jwt_access_token!, {
        expiresIn: config.jwt_access_token_aspiredIn || "1d"
    } as SignOptions)

    const refreshToken = jwt.sign(({ id: user.id, email: user.email, role: user.role }), config.jwt_refresh_token!, {
        expiresIn: config.jwt_refresh_token_aspiredIn || "7d"
    } as SignOptions)

    return {
        accessToken,
        refreshToken
    }

}

export const authService = { signInUserIntoDB }