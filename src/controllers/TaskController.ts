import type { Request, Response } from "express";

import Task from "../models/Task";
import { handleError } from "../utils/handleError";

export class TaskController {

    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project._id
            req.project.tasks.push(task._id)
            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Tarea Creada Correctamente.')

        } catch (error) {
            handleError(res, 'Error al crear la tarea', error)
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({project: req.project._id}).populate('project')
            if ( tasks.length === 0 ) {
                return res.json({msg: 'Este Proyecto no cuenta con tareas aún.'})
            }

            res.json(tasks)

        } catch (error) {
            handleError(res, 'Error al obtener la tarea', error)
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            res.json(req.task)

        } catch (error) {
            handleError(res, 'Error al obtener la tarea', error)
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()
            res.send('Tarea Actualizada Correctamente.')
            
        } catch (error) {
            handleError(res, 'Error al actualizar la tarea', error)
        }
    }
    
    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter( t => t._id.toString() !== req.task._id.toString()) 
            await Promise.allSettled([req.task.deleteOne(), req.project.save()])
            res.send('Tarea Eliminada Correctamente.')

        } catch (error) {
            handleError(res, 'Error al eliminar la tarea', error)
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body
            req.task.status = status
            await req.task.save()
            res.send('Estado Actualizado Correctamente.')

        } catch (error) {
            handleError(res, 'Error al actualizar el estado', error)
        }
    }
}