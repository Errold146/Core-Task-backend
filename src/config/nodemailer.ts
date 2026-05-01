import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config()

console.log('[SMTP] host:', process.env.SMTP_HOST, '| port:', process.env.SMTP_PORT, '| user:', process.env.SMTP_USER)

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});