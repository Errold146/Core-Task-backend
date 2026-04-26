import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface Props {
    id: Types.ObjectId
}

export const generateJWT = (payload: Props) => {
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })

    return token
}