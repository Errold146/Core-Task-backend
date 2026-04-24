import colors from "colors";
import mongoose from "mongoose";
import { exit } from 'node:process';

export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${connection.host}:${connection.port}`
        console.log(colors.blue.bold(`MongoDB conectado en ${url}`))

    } catch (error) {
        console.log(colors.red.bold(`Error al conectar a la Base de Datos: ${error}`))
        exit(1)
    }
}