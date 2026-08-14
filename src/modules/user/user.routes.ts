import { Router } from "express";
import { userController } from "./user.controller";
import type { NextFunction, Response, Request } from "express";
import { verifiedToken } from "../../utils/JwtToken";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import { sendResponse } from "../../utils/SendResponse";
import HttpStatus from "http-status";


declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string,
                id: string,
                role: Role
            }
        }
    }
}


const router = Router()

router.post("/register", userController.createUser)
router.get("/me", (req: Request, res: Response, next: NextFunction) => {

    const { accessToken } = req.cookies

    const verifyToken = verifiedToken(accessToken, config.jwt_access_token)

    if (typeof verifyToken === "string") {
        throw new Error(verifyToken)
    }

    const { email, id, role } = verifyToken;

    const requiredRole = [Role.ADMIN, Role.AUTHOR, Role.USER]

    if (!requiredRole.includes(role)) {
        sendResponse(res, {
            success: false,
            message: "Forbidden you don't have permission to access this resource",
            statusCode: HttpStatus.FORBIDDEN
        })
        return
    }

    req.user = {
        email,
        id,
        role
    }

    next()
}, userController.getUserProfile)

export const userRoutes = router;