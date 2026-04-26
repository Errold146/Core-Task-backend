import { transporter } from "../config/nodemailer";

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async ({ email, name, token }: IEmail) => {
        const confirmationUrl = `${process.env.FRONTEND_URL}/auth/confirm-account` || "#"

        await transporter.sendMail({
            from: "CoreTask <cuentas@core-task.acesorarte.com>",
            to: email,
            subject: "CoreTask | Confirma tu cuenta",
            text: `Hola ${name},\n\n¡Bienvenido a CoreTask!\n\nConfirma tu cuenta desde este enlace: ${confirmationUrl}\n\nTambién puedes ingresar este código de confirmación: ${token}\n\nEste código expira en 1 hora.\n\nSi no creaste esta cuenta, puedes ignorar este mensaje.`,
            html: `
                <!doctype html>
                <html lang="es">
                    <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <title>Confirma tu cuenta - CoreTask</title>
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #f3f6fb; font-family: Arial, Helvetica, sans-serif; color: #1a1f36;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f6fb; padding: 24px 12px;">
                            <tr>
                                <td align="center">
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(26, 31, 54, 0.08);">
                                        <tr>
                                            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 28px 30px; text-align: center;">
                                                <h1 style="margin: 0; color: #ffffff; font-size: 26px; line-height: 1.2;">CoreTask</h1>
                                                <p style="margin: 8px 0 0; color: #e0f2fe; font-size: 14px;">Activa tu cuenta en menos de 1 minuto</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 30px;">
                                                <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.6;">Hola, <strong>${name}</strong>.</p>
                                                <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.7; color: #3b4256;">
                                                    Gracias por crear tu cuenta en CoreTask. Para comenzar, confirma tu correo haciendo clic en el siguiente botón.
                                                </p>

                                                <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
                                                    <tr>
                                                        <td>
                                                            <a href="${confirmationUrl}" style="display: inline-block; padding: 12px 22px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px;">
                                                                Confirmar cuenta
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <p style="margin: 0 0 10px; font-size: 14px; color: #4b5565;">Copia e ingresa este código para confirmar:</p>
                                                <p style="margin: 0 0 24px; font-size: 28px; letter-spacing: 6px; font-weight: 800; color: #0f172a; text-align: center; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 16px 10px;">
                                                    ${token}
                                                </p>

                                                <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">Este código expira en <strong>10 minutos</strong>.</p>
                                                <p style="margin: 0; font-size: 13px; color: #6b7280;">Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 18px 30px 26px; border-top: 1px solid #eef2f7; text-align: center;">
                                                <p style="margin: 0; font-size: 12px; color: #8a93a5;">CoreTask · Organiza tus proyectos y tareas</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                </html>
            `,
        });
    };

    static sendPasswordResetToken = async ({ email, name, token }: IEmail) => {
        const resetUrl = `${process.env.FRONTEND_URL}/auth/new-password` || "#"

        await transporter.sendMail({
            from: "CoreTask <cuentas@core-task.acesorarte.com>",
            to: email,
            subject: "CoreTask | Restablece tu contraseña",
            text: `Hola ${name},\n\nRecibimos una solicitud para restablecer la contraseña de tu cuenta.\n\nIngresa este código para continuar: ${token}\n\nO accede desde este enlace: ${resetUrl}\n\nEste código expira en 10 minutos.\n\nSi no solicitaste esto, puedes ignorar este mensaje.`,
            html: `
                <!doctype html>
                <html lang="es">
                    <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <title>Restablece tu contraseña - CoreTask</title>
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #f3f6fb; font-family: Arial, Helvetica, sans-serif; color: #1a1f36;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f6fb; padding: 24px 12px;">
                            <tr>
                                <td align="center">
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(26, 31, 54, 0.08);">
                                        <tr>
                                            <td style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 28px 30px; text-align: center;">
                                                <h1 style="margin: 0; color: #ffffff; font-size: 26px; line-height: 1.2;">CoreTask</h1>
                                                <p style="margin: 8px 0 0; color: #fef9c3; font-size: 14px;">Solicitud de restablecimiento de contraseña</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 30px;">
                                                <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.6;">Hola, <strong>${name}</strong>.</p>
                                                <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.7; color: #3b4256;">
                                                    Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón o usa el código de abajo para crear una nueva contraseña.
                                                </p>

                                                <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
                                                    <tr>
                                                        <td>
                                                            <a href="${resetUrl}" style="display: inline-block; padding: 12px 22px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px;">
                                                                Restablecer contraseña
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <p style="margin: 0 0 10px; font-size: 14px; color: #4b5565;">Copia e ingresa este código para continuar:</p>
                                                <p style="margin: 0 0 24px; font-size: 28px; letter-spacing: 6px; font-weight: 800; color: #0f172a; text-align: center; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 16px 10px;">
                                                    ${token}
                                                </p>

                                                <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">Este código expira en <strong>10 minutos</strong>.</p>
                                                <p style="margin: 0; font-size: 13px; color: #6b7280;">Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje. Tu cuenta sigue segura.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 18px 30px 26px; border-top: 1px solid #eef2f7; text-align: center;">
                                                <p style="margin: 0; font-size: 12px; color: #8a93a5;">CoreTask · Organiza tus proyectos y tareas</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                </html>
            `,
        });
    }
}
