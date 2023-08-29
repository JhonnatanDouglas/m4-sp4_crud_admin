import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";
import { UserResult } from "../interfaces";
import { client } from "../database";

const verifyUserEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const query: UserResult = await client.query(
    'SELECT * FROM "users" WHERE "email" = $1',
    [req.body.email]
  );

  if (query.rowCount === 0) {
    throw new AppError("Wrong email/password", 401);
  }

  return next();
};

export { verifyUserEmail };
