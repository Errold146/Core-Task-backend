import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";
import projectRoutes from "./routes/projectRoutes";

dotenv.config()
connectDB()

const app = express()
app.use(cors(corsConfig))

// Logging
app.use(morgan('dev'))

// Leer datos del formulario
app.use(express.json())

// Routes
app.use('/api/projects', projectRoutes)

export default app