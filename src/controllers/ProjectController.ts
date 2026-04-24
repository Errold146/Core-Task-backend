import type { Request, Response } from "express";

import Project from "../models/Proyect";
import { handleError } from "../utils/handleError";

export class ProjectController {
    
    static createProject = async (req: Request, res: Response) => {
        try {
            const project = new Project(req.body)
            await project.save()
            res.send('Proyecto Creado Correctamente.')

        } catch (error) {
            handleError(res, 'Error al crear el proyecto', error)
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({})
            res.json(projects)
            
        } catch (error) {
            handleError(res, 'Error al cargar los proyectos', error)
        }
    }
    
    static getProjectById = async (req: Request, res: Response) => {
        try {
            await req.project.populate('tasks')
            res.json(req.project)

        } catch (error) {
            handleError(res, 'Error al cargar el proyecto', error)
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            req.project.clientName = req.body.clientName
            req.project.projectName = req.body.projectName
            req.project.description = req.body.description
            await req.project.save()
            res.send('Proyecto Actualizado Correctamente.')
            
        } catch (error) {
            handleError(res, 'Error al actualizar el proyecto', error)
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        try {
            await req.project.deleteOne()
            res.send('Proyecto Eliminado Correctamente.')

        } catch (error) {
            handleError(res, 'Error al eliminar el proyecto', error)
        }
    }
}