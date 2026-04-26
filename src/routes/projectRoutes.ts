import { Router } from "express";
import { body, param } from "express-validator";

import { projectExist } from "../middleware/project";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { taskBelongsProject, taskExist } from "../middleware/task";
import { ProjectController } from "../controllers/ProjectController";
import { authenticate } from "../middleware/auth";

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

export default router