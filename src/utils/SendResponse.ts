import type { Response } from "express"

type MetaData = {
    page: number,
    limit: number,
    totalPage: number
}

type TResponseData<T> = {
    success: boolean,
    statusCode: number,
    message: string,
    data?: T,
    metaData?: MetaData
}

export const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
    res.status(data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        data: data.data,
        meta: data.metaData
    })
}
