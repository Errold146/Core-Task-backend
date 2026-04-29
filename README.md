# Core Task API (Backend)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-22B573?style=for-the-badge&logo=gmail&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-8DD6F9?style=for-the-badge&logo=dotenv&logoColor=black)

API REST para gestionar proyectos, tareas, notas y equipos con autenticacion completa por JWT.

## Tabla de contenido

- [Resumen](#resumen)
- [Stack tecnico](#stack-tecnico)
- [Requisitos](#requisitos)
- [Instalacion](#instalacion)
- [Variables de entorno](#variables-de-entorno)
- [Scripts](#scripts)
- [Estructura](#estructura)
- [API](#api)
  - [Autenticacion y perfil](#autenticacion-y-perfil)
  - [Proyectos](#proyectos)
  - [Tareas](#tareas)
  - [Notas](#notas)
  - [Equipo](#equipo)
- [Autenticacion y seguridad](#autenticacion-y-seguridad)
- [Emails transaccionales](#emails-transaccionales)
- [Eliminacion en cascada](#eliminacion-en-cascada)
- [Validaciones y errores](#validaciones-y-errores)
- [Estados de tarea](#estados-de-tarea)
- [Despliegue](#despliegue)

## Resumen

Este backend expone endpoints para:

- Registro, confirmacion de cuenta, login y recuperacion de password con JWT.
- Reenvio de codigos de confirmacion y validacion de tokens de un solo uso.
- Actualizacion de perfil y cambio de password con verificacion de credenciales.
- CRUD de proyectos (protegido por autenticacion) con eliminacion en cascada.
- CRUD de tareas por proyecto con cambio de estado y eliminacion en cascada.
- CRUD de notas por tarea, con control de autorizacion (solo el autor puede eliminar).
- Gestion de miembros del equipo por proyecto (agregar y eliminar colaboradores).
- Busqueda de usuarios por email para invitar al equipo.
- Validacion de payloads con express-validator.
- Envio de emails transaccionales con Nodemailer (confirmacion, recuperacion e invitacion a equipo).
- Control de CORS por dominio de frontend.

Base paths de la API:

- `/api/auth`
- `/api/projects`

## Stack tecnico

- Node.js + TypeScript
- Express 5
- MongoDB + Mongoose
- express-validator
- jsonwebtoken (JWT)
- bcrypt
- Nodemailer
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
JWT_SECRET=tu_secreto_jwt_seguro
SMTP_HOST=smtp.tuproveedor.com
SMTP_PORT=587
SMTP_USER=tu_usuario_smtp
SMTP_PASS=tu_password_smtp
```

Descripcion:

- `PORT`: puerto HTTP del backend (si no se define usa `4000`).
- `DATABASE_URL`: cadena de conexion de MongoDB.
- `FRONTEND_URL`: origen permitido por CORS y URL base para links en emails.
- `JWT_SECRET`: clave secreta para firmar y verificar JWT.
- `SMTP_HOST`: host del servidor SMTP para envio de emails.
- `SMTP_PORT`: puerto SMTP (generalmente `587` para TLS).
- `SMTP_USER`: usuario / cuenta SMTP.
- `SMTP_PASS`: password de la cuenta SMTP.

## Scripts

- `npm run dev`: ejecuta la API con nodemon + ts-node.

## Estructura

```text
src/
  config/
    cors.ts
    db.ts
    nodemailer.ts        <- transporte de email
  controllers/
    AuthController.ts   <- auth + perfil + check-password
    NoteController.ts   <- CRUD de notas por tarea
    ProjectController.ts
    TaskController.ts
    TeamController.ts   <- gestion de miembros del equipo
  emails/
    AuthEmail.ts        <- emails de confirmacion y recuperacion
    TeamEmail.ts        <- email de invitacion a proyecto
  middleware/
    auth.ts             <- middleware JWT authenticate
    project.ts
    task.ts
    validation.ts
  models/
    Note.ts             <- modelo de notas (autor + tarea)
    Proyect.ts
    Task.ts
    Token.ts            <- tokens de un solo uso
    User.ts
  routes/
    authRoutes.ts       <- auth + perfil
    projectRoutes.ts    <- proyectos, tareas, notas, equipo
  utils/
    auth.ts             <- hashPassword / checkPassword
    handleError.ts
    jwt.ts              <- generateJWT
    token.ts            <- generateToken de 6 digitos
  index.ts
  server.ts
```

## API

### Autenticacion y perfil

Todas las rutas tienen el prefijo `/api/auth`.

| Metodo | Endpoint | Auth | Descripcion |
|---|---|---|---|
| POST | `/api/auth/create-account` | No | Registrar nuevo usuario |
| POST | `/api/auth/confirm-account` | No | Confirmar cuenta con codigo de email |
| POST | `/api/auth/login` | No | Iniciar sesion, devuelve JWT |
| POST | `/api/auth/request-code` | No | Reenviar codigo de confirmacion |
| POST | `/api/auth/forgot-password` | No | Solicitar codigo de recuperacion de password |
| POST | `/api/auth/validate-token` | No | Validar token de recuperacion |
| POST | `/api/auth/update-password/:token` | No | Actualizar password con token valido |
| GET | `/api/auth/user` | **Si** | Obtener datos del usuario autenticado |
| PUT | `/api/auth/profile` | **Si** | Actualizar nombre y email del perfil |
| POST | `/api/auth/update-password` | **Si** | Cambiar password (requiere password actual) |
| POST | `/api/auth/check-password` | **Si** | Verificar password actual (para acciones sensibles) |

Payload para registrar usuario:

```json
{
  "name": "Juan Perez",
  "email": "juan@example.com",
  "password": "minimo8chars",
  "password_confirmation": "minimo8chars"
}
```

Payload para confirmar cuenta / validar token:

```json
{
  "token": "123456"
}
```

Payload para login:

```json
{
  "email": "juan@example.com",
  "password": "minimo8chars"
}
```

Payload para actualizar password:

```json
{
  "password": "nuevaPass123",
  "password_confirmation": "nuevaPass123"
}
```

Respuesta de login exitoso (string JWT):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

El token JWT debe enviarse en los endpoints protegidos como header:

```
Authorization: Bearer <token>
```

### Proyectos

Todas las rutas de proyectos requieren el header `Authorization: Bearer <token>`.

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

Todas las rutas de tareas requieren el header `Authorization: Bearer <token>`.

| Metodo | Endpoint | Descripcion |
|---|---|---|
| POST | `/api/projects/:projectId/tasks` | Crear tarea para un proyecto |
| GET | `/api/projects/:projectId/tasks` | Listar tareas de un proyecto |
| GET | `/api/projects/:projectId/tasks/:taskId` | Obtener tarea por id |
| PUT | `/api/projects/:projectId/tasks/:taskId` | Actualizar tarea |
| DELETE | `/api/projects/:projectId/tasks/:taskId` | Eliminar tarea (elimina sus notas en cascada) |
| POST | `/api/projects/:projectId/tasks/:taskId/status` | Actualizar estado |

Payload para crear/actualizar tarea:

```json
{
  "name": "Disenar pantalla de login",
  "description": "Formulario con validaciones de email y password"
}
```

Payload para actualizar estado:

```json
{
  "status": "inProgress"
}
```

### Notas

Todas las rutas de notas requieren el header `Authorization: Bearer <token>`.

| Metodo | Endpoint | Descripcion |
|---|---|---|
| GET | `/api/projects/:projectId/tasks/:taskId/notes` | Listar notas de una tarea |
| POST | `/api/projects/:projectId/tasks/:taskId/notes` | Crear nota en una tarea |
| DELETE | `/api/projects/:projectId/tasks/:taskId/notes/:noteId` | Eliminar nota (solo el autor) |

Payload para crear nota:

```json
{
  "content": "Revisar el diseno con el cliente antes de implementar."
}
```

### Equipo

Todas las rutas de equipo requieren el header `Authorization: Bearer <token>` y solo el manager del proyecto puede gestionarlas.

| Metodo | Endpoint | Descripcion |
|---|---|---|
| POST | `/api/projects/:projectId/team/find` | Buscar usuario por email |
| POST | `/api/projects/:projectId/team` | Agregar miembro al proyecto |
| DELETE | `/api/projects/:projectId/team/:userId` | Eliminar miembro del proyecto |
| GET | `/api/projects/:projectId/team` | Listar miembros del equipo |

Payload para buscar y agregar miembro:

```json
{
  "email": "colaborador@example.com"
}
```

## Autenticacion y seguridad

- Las passwords se almacenan hasheadas con `bcrypt`.
- Los JWT se firman con `jsonwebtoken` usando `JWT_SECRET` y expiran en `90d`.
- El middleware `authenticate` valida el token en cada peticion protegida e inyecta `req.user`.
- Los codigos de confirmacion/recuperacion son numeros de 6 digitos de un solo uso almacenados en el modelo `Token` con TTL de 10 minutos.
- El endpoint `POST /api/auth/check-password` permite verificar la password actual antes de operaciones sensibles (por ejemplo eliminar un proyecto).
- CORS restringido al dominio definido en `FRONTEND_URL`.

## Emails transaccionales

El sistema envia emails mediante Nodemailer en tres situaciones:

1. **Confirmacion de cuenta**: al registrarse un usuario se envia un codigo de 6 digitos para activar la cuenta. Si intenta hacer login sin confirmar, se reenvía automaticamente.
2. **Recuperacion de password**: al solicitar recuperacion se envia un codigo que debe validarse antes de permitir el cambio de password.
3. **Invitacion al equipo**: cuando el manager agrega un colaborador al proyecto, se le notifica por email.

## Eliminacion en cascada

- Al eliminar un **proyecto** se eliminan automaticamente todas sus tareas y todas las notas de esas tareas.
- Al eliminar una **tarea** se eliminan automaticamente todas sus notas.

## Validaciones y errores

- Validaciones con `express-validator`.
- IDs invalidos retornan `400`.
- Recursos no encontrados retornan `404`.
- Acceso no autorizado retorna `401`.
- Acceso prohibido retorna `403`.
- Conflicto de datos (email duplicado) retorna `409`.
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

1. Elige un proveedor de hosting para Node.js (Railway, Render, Fly.io, etc.).
2. Configura las variables de entorno en el panel del proveedor (no subas `.env` al repositorio).
3. Define `FRONTEND_URL` con la URL publica del frontend (necesario para CORS y links de email).
4. Define `DATABASE_URL` apuntando a tu cluster de MongoDB Atlas de produccion.
5. Define `JWT_SECRET` con un valor largo y aleatorio seguro.
6. Configura las variables `SMTP_*` con las credenciales de tu proveedor de email (SendGrid, Resend, etc.).
7. El proveedor suele inyectar `PORT` automaticamente; si no, definelo en las variables de entorno.
8. Despues del deploy, actualiza el frontend con `VITE_API_URL` apuntando a la URL publica de este backend.

## ✉️ Contacto

[![GitHub](https://img.shields.io/badge/GitHub-Errold146-181717?logo=github&style=flat-square)](https://github.com/Errold146)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ErroldNúñezS-0A66C2?logo=linkedin&style=flat-square)](https://linkedin.com/in/errold-núñez-sánchez)
[![Email](https://img.shields.io/badge/Email-errold222@gmail.com-D14836?logo=gmail&style=flat-square)](mailto:errold222@gmail.com)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-+506_7802_7211-25D366?logo=whatsapp&logoColor=white&style=flat-square)](https://wa.me/50678027211)