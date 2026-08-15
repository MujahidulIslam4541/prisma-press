import type { NextFunction, Request, Response } from "express";
import { verifiedToken } from "../utils/JwtToken";
import config from "../config";
import { Role } from "../../generated/prisma/enums";
import { sendResponse } from "../utils/SendResponse";
import HttpStatus from "http-status";
import { prisma } from "../lib/prisma";
import type { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../utils/CatchAsync";

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                id: string;
                role: Role;
            };
        }
    }
}

export const authMiddlewares = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const accessToken = req.cookies.accessToken
            ? req.cookies.accessToken
            : req.headers.authorization?.startsWith("Bearer")
                ? req.headers.authorization.split(" ")[1]
                : req.headers.authorization;

        if (!accessToken) {
            throw new Error("You are not logged in. Please log in to access this resource.");
        }

        const verifyToken = verifiedToken(accessToken, config.jwt_access_token);

        if (!verifyToken.success) {
            throw new Error(verifyToken.error);
        }

        const { email, id, role } = verifyToken.data as JwtPayload;

        if (requiredRoles.length && !requiredRoles.includes(role)) {
            return sendResponse(res, {
                success: false,
                message: "Forbidden you don't have permission to access this resource",
                statusCode: HttpStatus.FORBIDDEN
            });
        }

        const user = await prisma.user.findUniqueOrThrow({
            where: { id }
        });

        if (user.activeStatus === "BLOCKED") {
            throw new Error("Your account has been blocked. Please contact support.");
        }

        req.user = {
            email,
            id,
            role
        };

        next();
    });
};