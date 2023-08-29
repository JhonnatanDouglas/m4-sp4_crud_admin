import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";
import { client } from "../database";
import { UserResult } from "../interfaces";
import { QueryResult } from "pg";

const validateUserRegisterCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.params.id; // Altere conforme necessário

  const userCoursesResult: QueryResult = await client.query(
    `
    SELECT COUNT(*) AS "courseCount"
    FROM "userCourses"
    WHERE "userId" = $1;
    `,
    [userId]
  );

  const courseCount = parseInt(userCoursesResult.rows[0].courseCount, 10);

  if (courseCount === 0) {
    throw new AppError("No course found", 404);
  }

  return next();
};

export { validateUserRegisterCourse };
