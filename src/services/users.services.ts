import { hash } from "bcryptjs";
import format from "pg-format";
import { client } from "../database";
import {
  UserCreate,
  UserFoundedCoursesList,
  UserFoundedCoursesResult,
  UserRead,
  UserResult,
  UserReturn,
} from "../interfaces";
import { userReadSchema, userReturnSchema } from "../schemas";

const create = async (payload: UserCreate): Promise<UserReturn> => {
  payload.password = await hash(payload.password, 10);

  const queryFormat: string = format(
    `INSERT INTO "users" (%I) VALUES (%L) RETURNING *;`,
    Object.keys(payload),
    Object.values(payload)
  );

  const query: UserResult = await client.query(queryFormat);
  return userReturnSchema.parse(query.rows[0]);
};

const read = async (): Promise<UserRead> => {
  const query: UserResult = await client.query('SELECT * FROM "users";');
  return userReadSchema.parse(query.rows);
};

const readUserCourses = async (id: string): Promise<UserFoundedCoursesList> => {
  const query: UserFoundedCoursesResult = await client.query(
    `
      SELECT
        "uc"."courseId" AS "courseId",
        "c"."name" AS "courseName",
        "c"."description" AS "courseDescription",
        "uc"."active" AS "userActiveInCourse",
        "u"."id" AS "userId",
        "u"."name" AS "userName"
      FROM "userCourses" AS "uc"
      JOIN "courses" AS "c" ON "uc"."courseId" = "c"."id"
      JOIN "users" AS "u" ON "uc"."userId" = "u"."id"
      WHERE "u"."id" = $1;
    `,
    [id]
  );

  return query.rows;
};

export default { create, read, readUserCourses };
