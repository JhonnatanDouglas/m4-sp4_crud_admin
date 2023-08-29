import { TUserCreate, TUserWrongCreate } from '../interfaces'

const createUserAdmin: TUserCreate = {
    name: 'Ugo',
    email: 'ugo@kenzie.com.br',
    password: '1234',
    admin: true,
}

const createUserNotAdmin: TUserCreate = {
    name: 'Lucas',
    email: 'lucas@kenzie.com.br',
    password: '1234',
    admin: false,
}

const createUserWrongKeys: TUserWrongCreate = {
    name: 1234,
    email: 'joaoerrado',
}

export { createUserAdmin, createUserNotAdmin, createUserWrongKeys }
