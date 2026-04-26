import { Router } from "express";
import { body, param } from "express-validator";

import { handleInputErrors } from "../middleware/validation";
import { AuthController } from "../controllers/AuthController";
import { authenticate } from "../middleware/auth";

const router = Router()

router.post('/create-account', 
    body('name').notEmpty().withMessage('El Nombre es Requerido.'),
    body('password').isLength({min: 8}).withMessage('La Contraseña es Requerida ó es muy Corta.'),
    body('password_confirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Los Passwords son Diferentes.')
        }
        return true
    }),
    body('email').isEmail().withMessage('Email Inválido.'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account', 
    body('token').notEmpty().withMessage('El código de seguridad es requerido.'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login', 
    body('email').isEmail().withMessage('Email Inválido.'),
    body('password').notEmpty().withMessage('La Contraseña es Requerida.'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code', 
    body('email').isEmail().withMessage('Email Inválido.'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password', 
    body('email').isEmail().withMessage('Email Inválido.'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token', 
    body('token').notEmpty().withMessage('El código de seguridad es requerido.'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token').isNumeric().withMessage('Código Inválido'),
    body('password').isLength({min: 8}).withMessage('La Contraseña es Requerida ó es muy Corta.'),
    body('password_confirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Los Passwords son Diferentes.')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePassWithToken
)

router.get('/user', 
    authenticate,
    AuthController.user
)

export default router