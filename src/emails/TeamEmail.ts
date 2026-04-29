import { transporter } from "../config/nodemailer";

interface IAddedToTeamEmail {
    memberEmail: string
    memberName: string
    projectName: string
    managerName: string
}

interface IMemberLeftEmail {
    managerEmail: string
    managerName: string
    memberName: string
    projectName: string
}

export class TeamEmail {

    static sendAddedToTeamEmail = async ({ memberEmail, memberName, projectName, managerName }: IAddedToTeamEmail) => {
        const projectsUrl = `${process.env.FRONTEND_URL}/` || "#"

        await transporter.sendMail({
            from: "CoreTask <cuentas@core-task.acesorarte.com>",
            to: memberEmail,
            subject: `CoreTask | Te han añadido al proyecto "${projectName}"`,
            text: `Hola ${memberName},\n\n${managerName} te ha añadido como miembro del proyecto "${projectName}" en CoreTask.\n\nYa puedes acceder al proyecto desde tu panel: ${projectsUrl}\n\nSi no esperabas esta invitación, puedes ignorar este mensaje.`,
            html: `
                <!doctype html>
                <html lang="es">
                    <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <title>Has sido añadido a un proyecto - CoreTask</title>
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #f3f6fb; font-family: Arial, Helvetica, sans-serif; color: #1a1f36;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f6fb; padding: 24px 12px;">
                            <tr>
                                <td align="center">
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(26, 31, 54, 0.08);">
                                        <tr>
                                            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 28px 30px; text-align: center;">
                                                <h1 style="margin: 0; color: #ffffff; font-size: 26px; line-height: 1.2;">CoreTask</h1>
                                                <p style="margin: 8px 0 0; color: #e0f2fe; font-size: 14px;">Nueva invitación a proyecto</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 30px;">
                                                <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.6;">Hola, <strong>${memberName}</strong>.</p>
                                                <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.7; color: #3b4256;">
                                                    <strong>${managerName}</strong> te ha añadido como miembro del proyecto <strong>"${projectName}"</strong> en CoreTask.
                                                    Ya tienes acceso para ver tareas, colaborar con el equipo y más.
                                                </p>

                                                <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
                                                    <tr>
                                                        <td>
                                                            <a href="${projectsUrl}" style="display: inline-block; padding: 12px 22px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px;">
                                                                Ver mis proyectos
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <p style="margin: 0; font-size: 13px; color: #6b7280;">Si no esperabas esta invitación, puedes ignorar este mensaje.</p>
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

    static sendMemberLeftEmail = async ({ managerEmail, managerName, memberName, projectName }: IMemberLeftEmail) => {
        const projectsUrl = `${process.env.FRONTEND_URL}/` || "#"

        await transporter.sendMail({
            from: "CoreTask <cuentas@core-task.acesorarte.com>",
            to: managerEmail,
            subject: `CoreTask | ${memberName} ha abandonado el proyecto "${projectName}"`,
            text: `Hola ${managerName},\n\nTe informamos que ${memberName} ha abandonado el proyecto "${projectName}".\n\nPuedes gestionar el equipo del proyecto desde tu panel: ${projectsUrl}\n\nEste mensaje es automático, no es necesario responder.`,
            html: `
                <!doctype html>
                <html lang="es">
                    <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <title>Un miembro abandonó tu proyecto - CoreTask</title>
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #f3f6fb; font-family: Arial, Helvetica, sans-serif; color: #1a1f36;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f6fb; padding: 24px 12px;">
                            <tr>
                                <td align="center">
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(26, 31, 54, 0.08);">
                                        <tr>
                                            <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 28px 30px; text-align: center;">
                                                <h1 style="margin: 0; color: #ffffff; font-size: 26px; line-height: 1.2;">CoreTask</h1>
                                                <p style="margin: 8px 0 0; color: #fef3c7; font-size: 14px;">Notificación de equipo</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 30px;">
                                                <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.6;">Hola, <strong>${managerName}</strong>.</p>
                                                <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.7; color: #3b4256;">
                                                    Te informamos que <strong>${memberName}</strong> ha abandonado el proyecto <strong>"${projectName}"</strong>.
                                                    Si necesitas cubrir ese rol, puedes añadir un nuevo miembro desde el panel de gestión de equipo.
                                                </p>

                                                <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
                                                    <tr>
                                                        <td>
                                                            <a href="${projectsUrl}" style="display: inline-block; padding: 12px 22px; background-color: #d97706; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px;">
                                                                Gestionar proyectos
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <p style="margin: 0; font-size: 13px; color: #6b7280;">Este mensaje es automático, no es necesario responder.</p>
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
}
