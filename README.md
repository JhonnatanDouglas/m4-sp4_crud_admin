# Controle de Usuários e Cursos API

#### Tecnologias utilizadas

![Node.js](https://img.shields.io/badge/Node.js-v14.17.4-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-v4.4.3-blue.svg)
![Express](https://img.shields.io/badge/Express-v4.18.2-lightgrey.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v8.11.3-blue.svg)
![bcryptjs](https://img.shields.io/badge/bcryptjs-v2.4.3-yellow.svg)
![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-v9.0.1-orange.svg)
![zod](https://img.shields.io/badge/zod-v3.22.2-red.svg)

## Índice

- [Introdução](#introdução)
- [Requisitos](#requisitos)
- [Tabelas do banco de dados](#tabelas-do-banco-de-dados)
- [Endpoints](#endpoints)
  - [POST /users](#post-users)
  - [POST /login](#post-login)
  - [GET /users](#get-users)
  - [GET /users/:id/courses](#get-usersidcourses)
  - [POST /courses](#post-courses)
  - [GET /courses](#get-courses)
  - [POST /courses/:courseId/users/:userId](#post-coursescourseidusersuserid)
  - [DELETE /courses/:courseId/users/:userId](#delete-coursescourseidusersuserid)
  - [GET /courses/:id/users](#get-coursesidusers)

## Introdução

Este projeto consiste em uma API que controla usuários e cursos, permitindo que os usuários se matriculem em cursos e tenham diferentes permissões de acesso. Foram implementados endpoints para cadastrar usuários, gerar tokens de autenticação, listar usuários, listar cursos de um usuário, cadastrar cursos, listar todos os cursos, matricular/desmatricular usuários em cursos e listar usuários de um curso.

## Requisitos

- Node.js v14.17.4
- TypeScript v4.4.3
- Express v4.18.2
- PostgreSQL v8.11.3

## Tabelas do banco de dados

### Tabela users

- id: número, incrementação automática e chave primária.
- name: string, tamanho 50 e obrigatório.
- email: string, tamanho 50, obrigatório e único.
- password: string, tamanho 120 e obrigatório.
- admin: booleano, obrigatório e DEFAULT igual a false.

### Tabela courses

- id: número, incrementação automática e chave primária.
- name: string, tamanho 15 e obrigatório.
- description: texto e obrigatório.

### Tabela userCourses

- id: número, incrementação automática e chave primária.
- active: booleano, obrigatório e DEFAULT igual a true.
- userId: inteiro, obrigatório e chave estrangeira.
- courseId: inteiro, obrigatório e chave estrangeira.

###

## Endpoints

### POST `/users`

Cadastra um novo usuário.

**Corpo da Requisição:**

```json
{
  "name": "Nome do Usuário",
  "email": "email@example.com",
  "password": "senha",
  "admin": true
}
```

**Resposta de Sucesso:**

Status: 201 Created

```json
{
  "id": 1,
  "name": "Nome do Usuário",
  "email": "email@example.com",
  "admin": true
}
```

**Resposta de Falha:**

Status: 409 Conflict (Email já cadastrado)

```json
{
  "message": "Email already registered"
}
```

Status: 400 Bad Request (Validação do Zod)

```json
{
  "name": ["Required"],
  "email": ["Invalid email"],
  "password": ["Expected string, received number"]
}
```

### POST `/login`

Cria um token de autenticação para um usuário.

**Corpo da Requisição:**

```json
{
  "email": "email@example.com",
  "password": "senha"
}
```

**Resposta de Sucesso:**

Status: 200 OK

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta de Falha:**

Status: 401 Unauthorized

```json
{
  "message": "Wrong email/password"
}
```

Status: 400 Bad Request (Validação do Zod)

```json
{
  "email": ["Invalid email"],
  "password": ["Expected string, received number"]
}
```

### GET `/users`

Lista todos os usuários da aplicação.

**Resposta de Sucesso:**

Status: 200 OK

```json
[
  {
    "id": 1,
    "name": "Nome do Usuário",
    "email": "email@example.com",
    "admin": true
  },
  {
    "id": 2,
    "name": "Outro Usuário",
    "email": "outro@example.com",
    "admin": false
  }
]
```

**Resposta de Falha:**

Status: 401 Unauthorized (Token não enviado)

```json
{
  "message": "Missing bearer token"
}
```

Status: 401 Unauthorized (Token inválido)

```json
{
  "message": "Invalid token"
}
```

Status: 403 Forbidden (Usuário sem permissão)

```json
{
  "message": "Insufficient permission"
}
```

### GET `/users/:id/courses`

Lista todos os cursos de um usuário.

**Resposta de Sucesso:**

Status: 200 OK

```json
[
  {
    "courseId": 1,
    "courseName": "Curso A",
    "courseDescription": "Descrição do Curso A",
    "userActiveInCourse": true,
    "userId": 1,
    "userName": "Nome do Usuário"
  },
  {
    "courseId": 2,
    "courseName": "Curso B",
    "courseDescription": "Descrição do Curso B",
    "userActiveInCourse": false,
    "userId": 1,
    "userName": "Nome do Usuário"
  }
]
```

**Resposta de Falha:**

Status: 401 Unauthorized (Token não enviado)

```

json
{
    "message": "Missing bearer token"
}
```

Status: 401 Unauthorized (Token inválido)

```json
{
  "message": "Invalid token"
}
```

Status: 403 Forbidden (Usuário sem permissão)

```json
{
  "message": "Insufficient permission"
}
```

### POST `/courses`

Cadastra um novo curso.

**Corpo da Requisição:**

```json
{
  "name": "Nome do Curso",
  "description": "Descrição do Curso"
}
```

**Resposta de Sucesso:**

Status: 201 Created

```json
{
  "id": 1,
  "name": "Nome do Curso",
  "description": "Descrição do Curso"
}
```

**Resposta de Falha:**

Status: 400 Bad Request (Validação do Zod)

```json
{
  "name": ["Required"],
  "description": ["Required"]
}
```

Status: 401 Unauthorized (Token não enviado)

```json
{
  "message": "Missing bearer token"
}
```

Status: 401 Unauthorized (Token inválido)

```json
{
  "message": "Invalid token"
}
```

Status: 403 Forbidden (Usuário sem permissão)

```json
{
  "message": "Insufficient permission"
}
```

### GET `/courses`

Lista todos os cursos da aplicação.

**Resposta de Sucesso:**

Status: 200 OK

```json
[
  {
    "id": 1,
    "name": "Nome do Curso A",
    "description": "Descrição do Curso A"
  },
  {
    "id": 2,
    "name": "Nome do Curso B",
    "description": "Descrição do Curso B"
  }
]
```

**Resposta de Falha:**

Status: 401 Unauthorized (Token não enviado)

```json
{
  "message": "Missing bearer token"
}
```

Status: 401 Unauthorized (Token inválido)

```json
{
  "message": "Invalid token"
}
```

### POST `/courses/:courseId/users/:userId`

Matricula um usuário em um curso.

**Resposta de Sucesso:**

Status: 201 Created

```json
{
  "courseId": 1,
  "userId": 1
}
```

**Resposta de Falha:**

Status: 400 Bad Request (Validação do Zod)

```json
{
  "courseId": ["Expected number, received string"],
  "userId": ["Expected number, received string"]
}
```

Status: 401 Unauthorized (Token não enviado)

```json
{
  "message": "Missing bearer token"
}
```

Status: 401 Unauthorized (Token inválido)

```json
{
  "message": "Invalid token"
}
```

Status: 403 Forbidden (Usuário sem permissão)

```json
{
  "message": "Insufficient permission"
}
```

Status: 404 Not Found (Curso ou usuário não encontrados)

```json
{
  "message": "Course not found"
}
```

### DELETE `/courses/:courseId/users/:userId`

Remove a matrícula de um usuário em um curso.

**Resposta de Sucesso:**

Status: 204 No Content

**Resposta de Falha:**

Status: 400 Bad Request (Validação do Zod)

```json
{
  "courseId": ["Expected number, received string"],
  "userId": ["Expected number, received string"]
}
```

Status: 401 Unauthorized (Token não enviado)

```json
{
  "message": "Missing bearer token"
}
```

Status: 401 Unauthorized (Token inválido)

```json
{
  "message": "Invalid token"
}
```

Status: 403 Forbidden (Usuário sem permissão)

```json
{
  "message": "Insufficient permission"
}
```

Status: 404 Not Found (Curso ou usuário não encontrados)

```json
{
  "message": "Course not found"
}
```

### GET `/courses/:id/users`

Lista todos os usuários de um curso.

**Resposta de Sucesso:**

Status: 200 OK

```json
[
  {
    "userId": 1,
    "userName": "Nome do Usuário",
    "userActiveInCourse": true
  },
  {
    "userId": 2,
    "userName": "Outro Usuário",
    "userActiveInCourse": false
  }
]
```

**Resposta de Falha:**

Status: 401 Unauthorized (Token não enviado)

```json
{
  "message": "Missing bearer token"
}
```

Status: 401 Unauthorized (Token inválido)

```json
{
  "message": "Invalid token"
}
```

Status: 403 Forbidden (Usuário sem permissão)

```json
{
  "message": "Insufficient permission"
}
```

Status: 404 Not Found (Curso não encontrado)

```json
{
  "message": "Course not found"
}
```
