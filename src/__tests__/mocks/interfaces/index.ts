type TUser = {
    id: number
    name: string
    email: string
    admin: boolean
}

type TUserCreate = Omit<TUser, 'id'> & {
    password: string
}

type TUserWrongCreate = {
    name: number
    email: string
}

type TUserLogin = Omit<TUserCreate, 'admin' | 'name'>

type TCourse = {
    id: number
    name: string
    description: string
}

type TCourseCreate = Omit<TCourse, 'id'>

export {
    TUserCreate,
    TUserWrongCreate,
    TUserLogin,
    TUser,
    TCourseCreate,
    TCourse,
}
