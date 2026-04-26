import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

import User, { IUser } from "../models/User";
import { handleError } from "../utils/handleError";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    
    const bearer = req.headers.authorization
    if ( !bearer ) {
        const err = new Error('Acceso Denegado.')
        return res.status(401).json({error: err.message})
    }

    const token = bearer.split(' ')[1]
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if ( typeof decoded === 'object' && decoded.id ) {
            const user = await User.findById(decoded.id).select('_id name email')
            if ( user ) {
                req.user = user
                next()
            } else {
                res.status(500).json({error: 'Lo sentimos, ocurrio un error inesperado.'})
            }
        }

    } catch (error) {
        handleError(res, "Token Inválido", error)
    }
}