import type { Request, Response, NextFunction } from "express"
import HttpsStatus from "http-status"
import { Prisma } from "../../generated/prisma/client";

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode: number = HttpsStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = error.message;

    if (error instanceof Prisma.PrismaClientValidationError) {
        statusCode = HttpsStatus.BAD_REQUEST;
        errorMessage = "You have provided an incorrect field type or missing field";

    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P2002": {
                statusCode = HttpsStatus.CONFLICT;
                errorMessage = `Duplicate value for field`;
                break;
            }

            case "P2003": {
                const field = error.meta?.field_name;
                statusCode = HttpsStatus.BAD_REQUEST;
                errorMessage = `Foreign key constraint failed on field: ${field || "unknown"}`;
                break;
            }

            case "P2025": {
                statusCode = HttpsStatus.NOT_FOUND;
                errorMessage = (error.meta?.cause as string) || "Requested record not found";
                break;
            }

            case "P2014": {
                statusCode = HttpsStatus.BAD_REQUEST;
                errorMessage = "Invalid relation, the change would violate a required relation";
                break;
            }

            case "P2000": {
                statusCode = HttpsStatus.BAD_REQUEST;
                errorMessage = "The provided value is too long for the column";
                break;
            }

            default: {
                statusCode = HttpsStatus.BAD_REQUEST;
                errorMessage = `Database error (code: ${error.code})`;
            }
        }

    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = HttpsStatus.INTERNAL_SERVER_ERROR;
        errorMessage = "An unknown database error occurred";

    } else if (error instanceof Prisma.PrismaClientInitializationError) {
        statusCode = HttpsStatus.INTERNAL_SERVER_ERROR;
        errorMessage = "Failed to initialize database connection";

    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = HttpsStatus.INTERNAL_SERVER_ERROR;
        errorMessage = "A critical database engine error occurred";
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message: errorMessage,
        // error: error.stack
    })
}