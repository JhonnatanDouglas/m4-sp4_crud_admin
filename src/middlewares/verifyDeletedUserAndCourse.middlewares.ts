import { NextFunction, Request, Response } from "express";
import { client } from "../database";
import { QueryResult } from "pg";
import { AppError } from "../errors";

const verifyDeletedUserAndCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.params.userId;
  const courseId = req.params.courseId;

  const userCourseResult: QueryResult = await client.query(
    `
      SELECT "uc"."id"
        FROM "userCourses" AS "uc"
      WHERE "uc"."userId" = $1 
        AND "uc"."courseId" = $2 
        AND "uc"."active" = false;
    `,
    [userId, courseId]
  );

  if (userCourseResult.rowCount === 0) {
    throw new AppError("User/course not found", 404);
  }

  return next();
};

export { verifyDeletedUserAndCourse };
