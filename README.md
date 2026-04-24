# Core Task API (Backend)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-8DD6F9?style=for-the-badge&logo=dotenv&logoColor=black)

API REST para gestionar proyectos y tareas.

## Tabla de contenido

- [Resumen](#resumen)
- [Stack tecnico](#stack-tecnico)
- [Requisitos](#requisitos)
- [Instalacion](#instalacion)
- [Variables de entorno](#variables-de-entorno)
- [Scripts](#scripts)
- [Estructura](#estructura)
- [API](#api)
- [Validaciones y errores](#validaciones-y-errores)
- [Estados de tarea](#estados-de-tarea)
- [Despliegue](#despliegue)

## Resumen

Este backend expone endpoints para:

- CRUD de proyectos.
- CRUD de tareas por proyecto.
- Cambio de estado de tareas.
- Validacion de payloads con express-validator.
- Control de CORS por dominio de frontend.

Base path de la API:

- `/api/projects`

## Stack tecnico

- Node.js + TypeScript
- Express 5
- MongoDB + Mongoose
- express-validator
- CORS + dotenv
- Morgan para logs HTTP

## Requisitos

- Node.js 18+
- npm 9+
- Una instancia MongoDB (local o cloud)

## Instalacion

1. Instalar dependencias:

```bash
npm install
```

2. Crear archivo `.env` en la raiz de backend (ver variables abajo).

3. Levantar en desarrollo:

```bash
npm run dev
```

Servidor por defecto:

- `http://localhost:4000`

## Variables de entorno

Crear `.env` en backend con:

```env
PORT=4000
DATABASE_URL=mongodb+srv://usuario:password@cluster.mongodb.net/core_task
FRONTEND_URL=http://localhost:5173
```

Descripcion:

- `PORT`: puerto HTTP del backend (si no se define usa `4000`).
- `DATABASE_URL`: cadena de conexion de MongoDB.
- `FRONTEND_URL`: origen permitido por CORS.

## Scripts

- `npm run dev`: ejecuta la API con nodemon + ts-node.

## Estructura

```text
src/
  config/
    cors.ts
    db.ts
  controllers/
    ProjectController.ts
    TaskController.ts
  middleware/
    project.ts
    task.ts
    validation.ts
  models/
    Proyect.ts
    Task.ts
  routes/
    projectRoutes.ts
  utils/
    handleError.ts
  index.ts
  server.ts
```

## API

### Proyectos

| Metodo | Endpoint | Descripcion |
|---|---|---|
| POST | `/api/projects` | Crear proyecto |
| GET | `/api/projects` | Listar proyectos |
| GET | `/api/projects/:projectId` | Obtener proyecto por id |
| PUT | `/api/projects/:projectId` | Actualizar proyecto |
| DELETE | `/api/projects/:projectId` | Eliminar proyecto |

Payload para crear/actualizar proyecto:

```json
{
  "projectName": "Sistema de ventas",
  "clientName": "Acme",
  "description": "Implementacion del modulo comercial"
}
```

### Tareas

| Metodo | Endpoint | Descripcion |
|---|---|---|
| POST | `/api/projects/:projectId/tasks` | Crear tarea para un proyecto |
| GET | `/api/projects/:projectId/tasks` | Listar tareas de un proyecto |
| GET | `/api/projects/:projectId/tasks/:taskId` | Obtener tarea por id |
| PUT | `/api/projects/:projectId/tasks/:taskId` | Actualizar tarea |
| DELETE | `/api/projects/:projectId/tasks/:taskId` | Eliminar tarea |
| POST | `/api/projects/:projectId/tasks/:taskId/status` | Actualizar estado |

Payload para crear/actualizar tarea:

```json
{
  "name": "Configurar autenticacion",
  "description": "Agregar login con JWT"
}
```

Payload para actualizar estado:

```json
{
  "status": "inProgress"
}
```

## Validaciones y errores

- Validaciones con `express-validator`.
- IDs invalidos retornan `400`.
- Recursos no encontrados retornan `404`.
- Acceso de tarea fuera de su proyecto retorna `401`.
- Errores inesperados retornan `500` con:

```json
{
  "error": "Lo sentimos, ocurrio un error inesperado."
}
```

Cuando fallan validaciones, retorna `400` con arreglo de errores:

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "El nombre del proyecto es requerido.",
      "path": "projectName",
      "location": "body"
    }
  ]
}
```

## Estados de tarea

Valores permitidos en `status`:

- `pending`
- `onHold`
- `inProgress`
- `underReview`
- `completed`

Estado por defecto al crear una tarea:

- `pending`

## Despliegue

Si vas a desplegar backend y frontend en servicios distintos:

1. Define `FRONTEND_URL` con la URL publica del frontend.
2. Define `DATABASE_URL` de produccion.
3. Define `PORT` segun el proveedor (o deja que el proveedor lo inyecte).
4. Verifica que el frontend apunte a este backend por medio de `VITE_API_URL`.

## ✉️ Contacto

[![GitHub](https://img.shields.io/badge/GitHub-Errold146-181717?logo=github&style=flat-square)](https://github.com/Errold146)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ErroldNúñezS-0A66C2?logo=linkedin&style=flat-square)](https://linkedin.com/in/errold-núñez-sánchez)
[![Email](https://img.shields.io/badge/Email-errold222@gmail.com-D14836?logo=gmail&style=flat-square)](mailto:errold222@gmail.com)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-+506_7802_7211-25D366?logo=whatsapp&logoColor=white&style=flat-square)](https://wa.me/50678027211)