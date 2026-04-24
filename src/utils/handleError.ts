import colors from "colors";
import type { Response } from "express";

export function handleError(res: Response, logMessage: string, error: unknown) {
    console.log(colors.red.bold(`${logMessage}: ${error}`))
    res.status(500).json({ error: 'Lo sentimos, ocurrio un error inesperado.' })
}
