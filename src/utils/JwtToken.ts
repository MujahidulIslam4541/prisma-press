import jwt from "jsonwebtoken"


export const verifiedToken = (token: string, secret: string) => {
    try {
        const verifiedToken = jwt.verify(token, secret)
        return verifiedToken;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error))
    }
}
