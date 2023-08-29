import { Client, QueryResult } from 'pg'
import { createUserAdmin, createUserNotAdmin } from '../mocks/users/users.mocks'
import { hash } from 'bcryptjs'
import format from 'pg-format'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import {
    createHTMLCourse,
    createNodeCourse,
} from '../mocks/courses/couses.mockes'

const createUsersData = async (client: Client) => {
    createUserNotAdmin.password = await hash(createUserNotAdmin.password, 10)

    const queryResultNotAdmin: QueryResult = await client.query(
        format(
            `
                INSERT INTO
                    "users"(%I)
                values
                    (%L)
                RETURNING *;
            `,
            Object.keys(createUserNotAdmin),
            Object.values(createUserNotAdmin)
        )
    )

    createUserAdmin.password = await hash(createUserNotAdmin.password, 10)

    const queryResultAdmin: QueryResult = await client.query(
        format(
            `
                INSERT INTO
                    "users"(%I)
                values
                    (%L)
                RETURNING *;
            `,
            Object.keys(createUserAdmin),
            Object.values(createUserAdmin)
        )
    )

    return {
        admin: queryResultAdmin.rows[0],
        notAdmin: queryResultNotAdmin.rows[0],
    }
}

const createCoursesData = async (client: Client) => {
    const queryResultHTML: QueryResult = await client.query(
        format(
            `
                INSERT INTO
                    "courses"(%I)
                values
                    (%L)
                RETURNING *;
            `,
            Object.keys(createHTMLCourse),
            Object.values(createHTMLCourse)
        )
    )

    const queryResultNode: QueryResult = await client.query(
        format(
            `
                INSERT INTO
                    "courses"(%I)
                values
                    (%L)
                RETURNING *;
            `,
            Object.keys(createNodeCourse),
            Object.values(createNodeCourse)
        )
    )

    await client.query(
        `
        INSERT INTO
            "userCourses"("active", "userId", "courseId")
        VALUES
            (true, (SELECT id FROM "users" WHERE email = 'ugo@kenzie.com.br'), $1),
            (true, (SELECT id FROM "users" WHERE email = 'ugo@kenzie.com.br'), $2);
        `,
        [queryResultHTML.rows[0].id, queryResultNode.rows[0].id]
    )

    return {
        HTMLCourse: queryResultHTML.rows[0],
        nodeCourse: queryResultNode.rows[0],
    }
}

const createOnlyCoursesData = async (client: Client) => {
    const queryResultHTML: QueryResult = await client.query(
        format(
            `
                INSERT INTO
                    "courses"(%I)
                values
                    (%L)
                RETURNING *;
            `,
            Object.keys(createHTMLCourse),
            Object.values(createHTMLCourse)
        )
    )

    const queryResultNode: QueryResult = await client.query(
        format(
            `
                INSERT INTO
                    "courses"(%I)
                values
                    (%L)
                RETURNING *;
            `,
            Object.keys(createNodeCourse),
            Object.values(createNodeCourse)
        )
    )

    return {
        HTMLCourse: queryResultHTML.rows[0],
        nodeCourse: queryResultNode.rows[0],
    }
}

const createTokenData = async (client: Client) => {
    const userAdminData: QueryResult = await client.query(
        `
        SELECT
            *
        FROM
            users
        WHERE
            email = $1;
    `,
        [createUserAdmin.email]
    )

    const tokenAdmin = jwt.sign(
        {
            email: createUserAdmin.email,
            admin: createUserAdmin.admin,
        },
        process.env.SECRET_KEY!,
        {
            subject: String(userAdminData.rows[0].id),
        }
    )

    const userNotAdminData: QueryResult = await client.query(
        `
        SELECT
            *
        FROM
            users
        WHERE
            email = $1;
    `,
        [createUserNotAdmin.email]
    )

    const tokenNotAdmin = jwt.sign(
        {
            email: createUserNotAdmin.email,
            admin: createUserNotAdmin.admin,
        },
        process.env.SECRET_KEY!,
        {
            subject: String(userNotAdminData.rows[0].id),
        }
    )

    return {
        tokenAdmin,
        tokenNotAdmin,
    }
}

export {
    createUsersData,
    createTokenData,
    createCoursesData,
    createOnlyCoursesData,
}
