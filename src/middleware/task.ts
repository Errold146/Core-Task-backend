import type { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function taskExist(req: Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        if ( !task ) {
            const error = new Error('Tarea Inválido.')
            return res.status(404).json({error: error.message})
        }
        req.task = task

        next()

    } catch (error) {
        res.status(500).json({error: 'Lo sentimos, ocurrio un error inesperado.'})
    }
}

export function taskBelongsProject(req: Request, res: Response, next: NextFunction) {
    if (req.task.project.toString() !== req.project._id.toString()) {
        const error = new Error('Acceso Denegado.')
        return res.status(401).json({error: error.message})
    }
    next()
}