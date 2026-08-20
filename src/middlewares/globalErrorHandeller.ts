import type { Request, Response, NextFunction } from "express"
import HttpsStatus from "http-status"

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(HttpsStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: HttpsStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        error: error.stack
    })
}