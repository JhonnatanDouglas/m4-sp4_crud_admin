import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";
import { client } from "../database";
import { UserResult } from "../interfaces";

const validateUserEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.body.email) return next();

  const query: UserResult = await client.query(
    'SELECT * FROM "users" WHERE "email" = $1',
    [req.body.email]
  );

  if (query.rowCount !== 0) {
    throw new AppError("Email already registered", 409);
  }

  return next();
};

export { validateUserEmailExists };
