import type { Request, Response } from "express";
import { handleError } from "../utils/handleError";

import User from "../models/User";
import Token from "../models/Token";
import { generateJWT } from "../utils/jwt";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { checkPassword, hashPassword } from '../utils/auth';

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body

            // Prevenir duplicados
            const userExist = await User.findOne({ email })
            if ( userExist ) {
                const err = new Error('Email Registrado Anteriormente.')
                return res.status(409).json({error: err.message})
            }

            // Crea un usuario
            const user = new User(req.body)

            // Hash Password
            user.password = await hashPassword(password)

            // Generar el Token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            // Enviar el Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Cuenta Creada Correctamente, Revisa tu Email.')

        } catch (error) {
            handleError(res, 'Error al Crear la Cuenta.', error)
        }

    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExist = await Token.findOne({token})
            if ( !tokenExist ) {
                const err = new Error('Código Inválido.')
                return res.status(404).json({error: err.message})
            }

            const user = await User.findById(tokenExist.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])
            res.send('Cuenta Confirmada Correctamente.')

        } catch (error) {
            handleError(res, 'Error al confirmar la cuenta', error)
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body

            // Revisa si el usuario existe
            const user = await User.findOne({email})
            if ( !user ) {
                const err = new Error('Usuario Inválido.')
                return res.status(404).json({error: err.message})
            }

            // Revisa si la cuenta está confirmada y/o envia un nuevo token
            if ( !user.confirmed ) {

                const token = new Token()
                token.user = user._id
                token.token = generateToken()
                token.save()

                // Enviar el Email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const err = new Error('La cuenta no ha sido confirmada, enviamos otro email con el código de seguridad para confirmar tu cuenta.')
                return res.status(401).json({error: err.message})
            }

            // Revisar Password
            const isPassCorrect = await checkPassword(password, user.password)
            if ( !isPassCorrect ) {
                const err = new Error('Contraseña Inválida.')
                return res.status(401).json({error: err.message})
            }

            const token = generateJWT({id: user._id})

            res.send(token)

        } catch (error) {
            handleError(res, 'Error al iniciar sesión', error)
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // Confirmar que el usuario existe
            const user = await User.findOne({ email })
            if ( !user ) {
                const err = new Error('El Usuario NO Existe.')
                return res.status(404).json({error: err.message})
            }
            
            if ( user.confirmed ) {
                const err = new Error('La cuenta ya está confirmada.')
                return res.status(403).json({error: err.message})
            }

            // Generar el Token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            // Enviar el Email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Se envió un nuevo código, Revisa tu Email.')

        } catch (error) {
            handleError(res, 'Error al enviar el token.', error)
        }

    }
    
    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // Confirmar que el usuario existe
            const user = await User.findOne({ email })
            if ( !user ) {
                const err = new Error('El Usuario NO Existe.')
                return res.status(404).json({error: err.message})
            }

            // Generar el Token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id
            await token.save()

            // Enviar el Email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Se envió un nuevo código, Revisa tu Email.')

        } catch (error) {
            handleError(res, 'Error al enviar el token.', error)
        }

    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExist = await Token.findOne({token})
            if ( !tokenExist ) {
                const err = new Error('Código Inválido.')
                return res.status(404).json({error: err.message})
            }

            res.send('Código correcto, define tu nuevo password.')

        } catch (error) {
            handleError(res, 'Error al confirmar el token', error)
        }
    }
    
    static updatePassWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const { password } = req.body

            const tokenExist = await Token.findOne({token})
            if ( !tokenExist ) {
                const err = new Error('Código Inválido.')
                return res.status(404).json({error: err.message})
            }

            const user = await User.findById(tokenExist.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])
            res.send('Contraseña Actualizada Correctamente.')

        } catch (error) {
            handleError(res, 'Error al confirmar el token', error)
        }
    }
    
    static user = async (req: Request, res: Response) => {
        return res.json(req.user)
    }
}