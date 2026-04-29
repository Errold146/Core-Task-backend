import { Router } from "express";
import { body, param } from "express-validator";

import { authenticate } from "../middleware/auth";
import { projectExist } from "../middleware/project";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { TeamController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";
import { ProjectController } from "../controllers/ProjectController";
import { hasAuthorization, taskBelongsProject, taskExist } from "../middleware/task";

const router = Router()

router.param('projectId', projectExist)
router.use(authenticate)

/** Routes for Projects */
router.post('/', 
    body('projectName').notEmpty().withMessage('El nombre del proyecto es requerido.'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es requerido.'),
    body('description').notEmpty().withMessage('La descripción del proyecto es requerida.'),
    handleInputErrors,
    ProjectController.createProject
)

router.get('/', 
    ProjectController.getAllProjects
)

router.get('/:projectId', 
    param('projectId').isMongoId().withMessage('Id Inválido'),
    handleInputErrors,
    ProjectController.getProjectById
)

router.put('/:projectId', 
    param('projectId').isMongoId().withMessage('Id Inválido'),
    body('projectName').notEmpty().withMessage('El nombre del proyecto es requerido.'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es requerido.'),
    body('description').notEmpty().withMessage('La descripción del proyecto es requerida.'),
    handleInputErrors,
    ProjectController.updateProject
)

router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('Id Inválido'),
    handleInputErrors,
    ProjectController.deleteProject
)

/** Routes for Tasks */
router.post('/:projectId/tasks',
    body('name').notEmpty().withMessage('El nombre de la Tarea es requerido.'),
    body('description').notEmpty().withMessage('La descripción de la Tarea es requerida.'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)

router.param('taskId', taskExist)
router.param('taskId', taskBelongsProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Id Inválido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Id Inválido'),
    body('name').notEmpty().withMessage('El nombre de la Tarea es requerido.'),
    body('description').notEmpty().withMessage('La descripción de la Tarea es requerida.'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Id Inválido'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Id Inválido'),
    body('status').notEmpty().withMessage('El Estado es requerido.'),
    handleInputErrors,
    TaskController.updateStatus
)

/** Routes for Teams */
router.post('/:projectId/team/find', 
    body('email').isEmail().toLowerCase().trim().withMessage('Email Inválido.'),
    handleInputErrors,
    TeamController.findMemberById
)

router.get('/:projectId/team',
    TeamController.getAllMembers
)

router.post('/:projectId/team',
    body('_id').isMongoId().withMessage('Id Inválido'),
    handleInputErrors,
    TeamController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId').isMongoId().withMessage('Id Inválido'),
    handleInputErrors,
    TeamController.deleteMemberById
)

router.post('/:projectId/team/leave',
    TeamController.leaveProject
)

/** Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes', 
    body('content').notEmpty().withMessage('El contenido de la nota es requerido.'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes', 
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Id de la nota inválido.'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router