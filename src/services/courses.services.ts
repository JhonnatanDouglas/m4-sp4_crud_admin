import format from "pg-format";
import {
  Course,
  CourseCreate,
  CourseInUserList,
  CourseInUserResult,
  CourseRead,
  CourseResult,
} from "../interfaces";
import { client } from "../database";

const create = async (payload: CourseCreate): Promise<Course> => {
  const queryFormat: string = format(
    'INSERT INTO "courses" (%I) VALUES (%L) RETURNING *;',
    Object.keys(payload),
    Object.values(payload)
  );

  const query: CourseResult = await client.query(queryFormat);
  return query.rows[0];
};

const read = async (): Promise<CourseRead> => {
  const query: CourseResult = await client.query('SELECT * FROM "courses";');
  return query.rows;
};

const registerCourseUser = async (
  userId: string,
  courseId: string
): Promise<string> => {
  await client.query(
    `
    INSERT INTO "userCourses" ("active", "userId", "courseId")
        VALUES (true, $1, $2);
    `,
    [userId, courseId]
  );
  return "User successfully vinculed to course";
};

const readAllUsersInThisCourse = async (
  id: string
): Promise<CourseInUserList> => {
  const query: CourseInUserResult = await client.query(
    `
        SELECT
          "u"."id" AS "userId",
          "u"."name" AS "userName",
          "c"."id" AS "courseId",
          "c"."name" AS "courseName",
          "c"."description" AS "courseDescription",
          "uc"."active" AS "userActiveInCourse"
        FROM "userCourses" AS "uc"
        JOIN "users" AS "u" ON "uc"."userId" = "u"."id"
        JOIN "courses" AS "c" ON "uc"."courseId" = "c"."id"
        WHERE "c"."id" = $1;
      `,
    [id]
  );

  return query.rows;
};

const disableCourse = async (userId: string, courseId: string) => {
  await client.query(
    `
    UPDATE "userCourses"
        SET "active" = false
        WHERE "userId" = $1 AND "courseId" = $2;
    `,
    [userId, courseId]
  );
};

export default {
  create,
  read,
  readAllUsersInThisCourse,
  registerCourseUser,
  disableCourse,
};
