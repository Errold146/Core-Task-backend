import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
        const whiteList = [
            process.env.FRONTEND_URL,
            'https://coretask.acesorarte.com',
            'https://frontend-three-dun-68.vercel.app'
        ]

        if (!origin || whiteList.includes(origin)) {
            callback(null, true)
        } else {
            console.log('[CORS] Origen bloqueado:', origin)
            callback(new Error('Acceso Denegado.'))
        }
    }
}