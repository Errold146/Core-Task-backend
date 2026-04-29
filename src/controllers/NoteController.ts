import { Types } from "mongoose";
import type { Request, Response } from "express";

import Note, { type INote } from "../models/Note";
import { handleError } from "../utils/handleError";

interface NoteParams {
    noteId: Types.ObjectId
}

export class NoteController {

    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        try {
            const { content } = req.body
            
            const note = new Note()
            note.content = content
            note.createdBy = req.user._id
            note.task = req.task._id

            req.task.notes.push(note._id)

            await Promise.allSettled([req.task.save(), note.save()])
            res.send('Nota Creada Correctamente.')
            
        } catch (error) {
            handleError(res, 'No se pudo crear la nota.', error)
        }
    }

    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({task: req.task._id})
            res.json(notes)

        } catch (error) {
            handleError(res, 'Error al obtener las Notas de la tarea.', error)
        }
    }

    static deleteNote = async (req: Request<NoteParams>, res: Response) => {
        try {
            const { noteId } = req.params
            
            const note = await Note.findById(noteId)
            if ( !note ) {
                const err = new Error('Nota No Encontrada.')
                return res.status(404).json({error: err.message})
            }
            if ( note.createdBy.toString() !== req.user._id.toString() ) {
                const err = new Error('Acceso Denegado.')
                return res.status(409).json({error: err.message})
            }

            req.task.notes = req.task.notes.filter(n => n.toString() !== noteId.toString())

            await Promise.allSettled([ note.deleteOne(), req.task.save() ])
            res.send('Nota Eliminada Correctamente.')

        } catch (error) {
            handleError(res, 'Error al eliminar la nota.', error)
        }
    }
}