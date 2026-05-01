import type { Request, Response } from "express";
import { handleError } from "../utils/handleError";
import User from "../models/User";
import Project from "../models/Proyect";
import { TeamEmail } from "../emails/TeamEmail";

export class TeamController {

    static findMemberById = async ( req: Request, res: Response ) => {
        
        try {
            // Buscar usuario
            const { email } = req.body
            const user = await User.findOne({email}).select('name email _id')
            if ( !user ) {
                const err = new Error('Usuario Inválido')
                return res.status(404).json({error: err.message})
            }
            res.json(user)

        } catch (error) {
            handleError(res, 'Error al buscar al miembro del equipo', error)
        }
    }

    static addMemberById = async ( req: Request, res: Response ) => {
        try {
            const { _id } = req.body
            const user = await User.findById({_id}).select('_id name email')
            if ( !user ) {
                const err = new Error('Usuario Inválido')
                return res.status(404).json({error: err.message})
            }

            if (req.project.team.some(t => t.toString() === user._id.toString())) {
                const err = new Error("Ese usuario ya es parte del equipo de trabajo.")
                return res.status(409).json({error: err.message})
            }

            req.project.team.push(user._id)
            await req.project.save()

            // Obtener datos del manager para el email
            const manager = await User.findById(req.project.manager).select('name')

            await TeamEmail.sendAddedToTeamEmail({
                memberEmail: user.email,
                memberName: user.name,
                projectName: req.project.projectName,
                managerName: manager?.name ?? 'El manager'
            })

            res.send('Miembro Agregado al Equipo.')

        } catch (error) {
            handleError(res, 'Error al añadir un miembro al equipo', error)
        }
    }

    static deleteMemberById = async ( req: Request, res: Response ) => {
        try {
            const { userId } = req.params

            if (!req.project.team.some(t => t.toString() === userId.toString())) {
                const err = new Error("Ese usuario no existe en el proyecto.")
                return res.status(409).json({error: err.message})
            }

            req.project.team = req.project.team.filter(t => t.toString() !== userId.toString())
            await req.project.save()

            res.send("Miembro Eliminado Correctamente.")

        } catch (error) {
            handleError(res, 'Error al eliminar el miembro del equipo', error)
        }
    }

    static getAllMembers = async ( req: Request, res: Response ) => {
        try {
            const project = await Project.findById(req.project._id).populate({ 
                path: 'team',
                select: '_id name email'
            })
            res.json(project.team)

        } catch (error) {
            handleError(res, 'Error al obtener los miembros del equipo', error)
        }
    }

    static leaveProject = async ( req: Request, res: Response ) => {
        try {
            const userId = req.user._id

            if (req.project.manager.toString() === userId.toString()) {
                const err = new Error('El manager no puede abandonar su propio proyecto.')
                return res.status(400).json({error: err.message})
            }

            if (!req.project.team.some(t => t.toString() === userId.toString())) {
                const err = new Error('No eres parte de este proyecto.')
                return res.status(409).json({error: err.message})
            }

            req.project.team = req.project.team.filter(t => t.toString() !== userId.toString())
            await req.project.save()

            // Notificar al manager
            const manager = await User.findById(req.project.manager).select('name email')

            if (manager) {
                await TeamEmail.sendMemberLeftEmail({
                    managerEmail: manager.email,
                    managerName: manager.name,
                    memberName: req.user.name,
                    projectName: req.project.projectName
                })
            }

            res.send('Has abandonado el proyecto correctamente.')

        } catch (error) {
            handleError(res, 'Error al abandonar el proyecto', error)
        }
    }
}