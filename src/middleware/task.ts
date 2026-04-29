import type { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";
import { handleError } from "../utils/handleError";

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
        handleError(res, 'Lo sentimos ocurrio un error inesperado', error)
    }
}

export function taskBelongsProject(req: Request, res: Response, next: NextFunction) {
    if (req.task.project.toString() !== req.project._id.toString()) {
        const error = new Error('Acceso Denegado.')
        return res.status(400).json({error: error.message})
    }
    next()
}

export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
    if (req.user._id.toString() !== req.project.manager.toString()) {
        const error = new Error('Acceso Denegado.')
        return res.status(400).json({error: error.message})
    }
    next()
}