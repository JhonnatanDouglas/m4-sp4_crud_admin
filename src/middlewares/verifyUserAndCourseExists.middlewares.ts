import { NextFunction, Request, Response } from "express";
import { client } from "../database";
import { QueryResult } from "pg";
import { AppError } from "../errors";

const verifyUserAndCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.params.userId;
  const courseId = req.params.courseId;

  const userExistsResult: QueryResult = await client.query(
    `
      SELECT "id"
        FROM "users"
      WHERE "id" = $1;
    `,
    [userId]
  );

  const courseExistsResult: QueryResult = await client.query(
    `
      SELECT "id"
        FROM "courses"
      WHERE "id" = $1;
    `,
    [courseId]
  );

  const userExists = userExistsResult.rowCount;
  const courseExists = courseExistsResult.rowCount;

  if (!userExists || !courseExists) {
    throw new AppError("User/course not found", 404);
  }

  return next();
};

export { verifyUserAndCourses };
