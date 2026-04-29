import type { Request, Response } from "express";

import Note from "../models/Note";
import Task from "../models/Task";
import Project from "../models/Proyect";
import { handleError } from "../utils/handleError";

export class ProjectController {
    
    static createProject = async (req: Request, res: Response) => {
        try {
            const project = new Project(req.body)
            project.manager = req.user._id
            await project.save()
            res.send('Proyecto Creado Correctamente.')

        } catch (error) {
            handleError(res, 'Error al crear el proyecto', error)
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
        const projects = await Project.find({
                $or: [
                    { manager: req.user._id },
                    { team: req.user._id }
                ]
            })
            res.json(projects)
            
        } catch (error) {
            handleError(res, 'Error al cargar los proyectos', error)
        }
    }
    
    static getProjectById = async (req: Request, res: Response) => {
        try {
            const { projectId } = req.params
            const project = await Project.findById(projectId).populate('tasks')
            if ( !project ) {
                const err = new Error('Proyecto Inválido')
                return res.status(404).json({error: err.message})
            }
            if ( project.manager.toString() !== req.user._id.toString() && !project.team.includes(req.user._id) ) {
                const err = new Error('Acceso Denegado.')
                return res.status(403).json({error: err.message})
            }
            
            res.json(project)

        } catch (error) {
            handleError(res, 'Error al cargar el proyecto', error)
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            const { projectId } = req.params
            const project = await Project.findById(projectId)
            if ( !project ) {
                const err = new Error('Proyecto Inválido')
                return res.status(404).json({error: err.message})
            }
            if ( project.manager.toString() !== req.user._id.toString() ) {
                const err = new Error('Acceso Denegado.')
                return res.status(403).json({error: err.message})
            }

            project.clientName = req.body.clientName
            project.projectName = req.body.projectName
            project.description = req.body.description

            await project.save()
            res.send('Proyecto Actualizado Correctamente.')
            
        } catch (error) {
            handleError(res, 'Error al actualizar el proyecto', error)
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        try {
            if ( req.project.manager.toString() !== req.user._id.toString() ) {
                const err = new Error('Acceso Denegado.')
                return res.status(403).json({error: err.message})
            }
            // Cascade: delete all notes belonging to this project's tasks, then tasks
            const taskIds = req.project.tasks.map(t => (t as any)._id ?? t)
            await Note.deleteMany({ task: { $in: taskIds } })
            await Task.deleteMany({ project: req.project._id })
            await req.project.deleteOne()
            res.send('Proyecto Eliminado Correctamente.')

        } catch (error) {
            handleError(res, 'Error al eliminar el proyecto', error)
        }
    }
}