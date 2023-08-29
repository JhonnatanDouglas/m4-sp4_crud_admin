import { TUserLogin } from '../interfaces'

const userAdminLogin: TUserLogin = {
    email: 'ugo@kenzie.com.br',
    password: '1234',
}

const userNotAdminLogin: TUserLogin = {
    email: 'lucas@kenzie.com.br',
    password: '1234',
}

const userWrongPasswordLogin: TUserLogin = {
    email: 'lucas@kenzie.com.br',
    password: 'senhaerrada',
}

const userWrongEmailLogin: TUserLogin = {
    email: 'emailerrado@email.com',
    password: '1234',
}

const userWrongKeysLogin: Partial<TUserLogin> = {
    email: 'emailerrado',
}

export {
    userAdminLogin,
    userNotAdminLogin,
    userWrongKeysLogin,
    userWrongEmailLogin,
    userWrongPasswordLogin,
}
