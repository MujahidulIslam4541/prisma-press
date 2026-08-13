import { prisma } from "../../lib/prisma";
import type { AuthInterface } from "./auth.types";
import bcrypt from "bcrypt"

const signInUserIntoDB = async (payload: AuthInterface) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    const matchPassword = await bcrypt.compare(password, user.password)

    if (!matchPassword) {
        throw new Error("credential not match please provide valid credential")
    }

    return user

}

export const authService = { signInUserIntoDB }